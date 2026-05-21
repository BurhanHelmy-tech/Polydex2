"""
Polydex — White Fringe Removal Script
Removes residual white halos and fringe artifacts from RGBA images.
Uses flood-fill from edges + white pixel detection near transparent areas.
"""

import numpy as np
from PIL import Image
from pathlib import Path
from scipy import ndimage

IMAGES_DIR = Path(__file__).parent / "images"

# Only process these 4 images
TARGET_FILES = [
    "triangle.png",
    "square.png",
    "pentagon.png",
    "nonagon.png",
]

def remove_white_fringe(input_path: Path, output_path: Path) -> None:
    """Remove white halos and fringe from an RGBA image."""
    print(f"  Processing: {input_path.name}...", end=" ", flush=True)
    
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img, dtype=np.float32)
    
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # --- Step 1: Flood-fill white/near-white regions from image edges ---
    # Create a mask of "white-ish" pixels (high brightness, any alpha)
    brightness = (r + g + b) / 3.0
    is_whitish = (brightness > 230) & (r > 220) & (g > 220) & (b > 220)
    
    # Create a border-seed mask (pixels touching the image border)
    h, w = is_whitish.shape
    border_seed = np.zeros_like(is_whitish)
    border_seed[0, :] = True
    border_seed[-1, :] = True
    border_seed[:, 0] = True
    border_seed[:, -1] = True
    
    # Flood fill: find all white-ish pixels connected to the border
    # Label connected components of white-ish pixels
    labeled, num_features = ndimage.label(is_whitish)
    
    # Find which labels touch the border
    border_labels = set(np.unique(labeled[border_seed]))
    border_labels.discard(0)  # 0 = background (non-white)
    
    # Create mask of border-connected white regions
    border_white_mask = np.isin(labeled, list(border_labels))
    
    # Make these pixels fully transparent
    data[border_white_mask, 3] = 0
    
    # --- Step 2: Remove white fringe halo around the character edges ---
    # Find semi-transparent or edge pixels that are too white
    # These are the "glow" artifacts from the original background
    is_semi_transparent = (a > 0) & (a < 240)
    is_very_white = (brightness > 200) & (r > 190) & (g > 190) & (b > 190)
    
    # Find the character mask (fully opaque, non-white pixels)
    is_character = (a > 200) & (~is_very_white)
    
    # Dilate character mask slightly to find the fringe zone
    character_dilated = ndimage.binary_dilation(is_character, iterations=3)
    
    # Fringe = semi-transparent AND white AND near the character edge
    fringe_mask = is_semi_transparent & is_very_white
    
    # Also catch fully opaque white pixels that are NOT part of the character
    # but are adjacent to transparent areas
    near_transparent = ndimage.binary_dilation(a < 10, iterations=2)
    opaque_white_near_edge = (a > 200) & is_very_white & near_transparent
    
    # Combine fringe masks
    combined_fringe = fringe_mask | opaque_white_near_edge
    
    # For fringe pixels: reduce alpha based on how white they are
    # The whiter the pixel, the more transparent it becomes
    whiteness = np.clip((brightness - 180) / 75.0, 0, 1)  # 0-1 scale
    
    for y in range(h):
        for x in range(w):
            if combined_fringe[y, x]:
                # Scale alpha down based on whiteness
                current_alpha = data[y, x, 3]
                reduction = whiteness[y, x]
                new_alpha = current_alpha * (1.0 - reduction * 0.95)
                data[y, x, 3] = max(0, new_alpha)
    
    # --- Step 3: Clean up any remaining small white islands ---
    # Find small isolated semi-opaque blobs that are white
    remaining_alpha = data[:,:,3]
    remaining_bright = ((data[:,:,0] + data[:,:,1] + data[:,:,2]) / 3.0)
    
    small_white = (remaining_alpha > 0) & (remaining_alpha < 100) & (remaining_bright > 210)
    
    # Label these and remove small ones (< 500 pixels)
    labeled_small, num_small = ndimage.label(small_white)
    for label_id in range(1, num_small + 1):
        component = (labeled_small == label_id)
        if np.sum(component) < 500:
            data[component, 3] = 0
    
    # --- Step 4: Final trim and save ---
    result = Image.fromarray(data.astype(np.uint8), "RGBA")
    
    # Crop to content with padding
    bbox = result.getbbox()
    if bbox:
        cropped = result.crop(bbox)
        pad = int(max(cropped.width, cropped.height) * 0.03)
        final = Image.new("RGBA",
                          (cropped.width + 2 * pad, cropped.height + 2 * pad),
                          (0, 0, 0, 0))
        final.paste(cropped, (pad, pad))
    else:
        final = result
    
    final.save(output_path, "PNG")
    print(f"Done! ({final.width}x{final.height})")


def main():
    print("=" * 50)
    print("  POLYDEX — White Fringe Removal")
    print("=" * 50)
    print(f"  Target images: {len(TARGET_FILES)}")
    print()
    
    for filename in TARGET_FILES:
        path = IMAGES_DIR / filename
        if path.exists():
            remove_white_fringe(path, path)
        else:
            print(f"  SKIP: {filename} — not found")
    
    print()
    print("  All done!")
    print("=" * 50)


if __name__ == "__main__":
    main()
