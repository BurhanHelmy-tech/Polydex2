"""
Polydex — Background Removal Script
Removes backgrounds from all 8 Pokemon polygon images using rembg.
Outputs clean PNG files with transparent backgrounds.
"""

import os
from pathlib import Path
from rembg import remove
from PIL import Image
import io

# Paths
IMAGES_DIR = Path(__file__).parent / "images"
OUTPUT_DIR = IMAGES_DIR  # Overwrite originals with clean versions

# All 8 polygon Pokemon images
IMAGE_FILES = [
    "triangle.png",
    "square.png",
    "pentagon.png",
    "hexagon.png",
    "heptagon.png",
    "octagon.png",
    "nonagon.png",
    "decagon.png",
]

def remove_background(input_path: Path, output_path: Path) -> None:
    """Remove background from a single image and save as transparent PNG."""
    print(f"  Processing: {input_path.name}...", end=" ", flush=True)
    
    with open(input_path, "rb") as f:
        input_data = f.read()
    
    # Remove background using rembg (u2net model)
    output_data = remove(input_data)
    
    # Open the result, ensure RGBA, and save
    img = Image.open(io.BytesIO(output_data)).convert("RGBA")
    
    # Optional: trim transparent border to center the character
    bbox = img.getbbox()
    if bbox:
        img_cropped = img.crop(bbox)
        # Add some padding back (5% on each side)
        pad_x = int(img_cropped.width * 0.05)
        pad_y = int(img_cropped.height * 0.05)
        final = Image.new("RGBA", 
                          (img_cropped.width + 2 * pad_x, img_cropped.height + 2 * pad_y), 
                          (0, 0, 0, 0))
        final.paste(img_cropped, (pad_x, pad_y))
    else:
        final = img
    
    final.save(output_path, "PNG")
    print(f"Done! ({final.width}x{final.height})")


def main():
    print("=" * 50)
    print("  POLYDEX — Background Removal")
    print("=" * 50)
    print(f"  Images directory: {IMAGES_DIR}")
    print(f"  Files to process: {len(IMAGE_FILES)}")
    print()
    
    success_count = 0
    fail_count = 0
    
    for filename in IMAGE_FILES:
        input_path = IMAGES_DIR / filename
        output_path = OUTPUT_DIR / filename
        
        if not input_path.exists():
            print(f"  SKIP: {filename} — file not found")
            fail_count += 1
            continue
        
        try:
            remove_background(input_path, output_path)
            success_count += 1
        except Exception as e:
            print(f"  ERROR: {filename} — {e}")
            fail_count += 1
    
    print()
    print(f"  Complete! {success_count} success, {fail_count} failed.")
    print("=" * 50)


if __name__ == "__main__":
    main()
