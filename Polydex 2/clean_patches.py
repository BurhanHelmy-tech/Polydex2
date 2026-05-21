"""
Polydex — Targeted White Patch Removal
Aggressively removes remaining white patches from triangle tail and nonagon smoke.
Uses vectorized numpy operations for speed.
"""

import numpy as np
from PIL import Image, ImageFilter
from pathlib import Path
from scipy import ndimage

IMAGES_DIR = Path(__file__).parent / "images"


def clean_white_patches(input_path: Path, output_path: Path) -> None:
    """Aggressively remove all white/near-white pixels that aren't
    surrounded by non-white character pixels on all sides."""
    print(f"  Processing: {input_path.name}...", end=" ", flush=True)

    img = Image.open(input_path).convert("RGBA")
    data = np.array(img, dtype=np.float32)
    h, w = data.shape[:2]

    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    brightness = (r + g + b) / 3.0

    # --- Pass 1: Identify the solid character region ---
    # Character = opaque pixels that are NOT white
    is_opaque = a > 200
    is_white = (brightness > 210) & (r > 200) & (g > 200) & (b > 200)
    is_character = is_opaque & (~is_white)

    # Fill holes in the character mask to get a solid region
    character_filled = ndimage.binary_fill_holes(is_character)

    # --- Pass 2: Find white pixels that are OUTSIDE the character body ---
    # These are the halo/fringe/patch artifacts
    outside_character = ~character_filled
    white_outside = is_white & (a > 0) & outside_character

    # Also catch semi-transparent white pixels outside character
    semi_trans_white = (a > 0) & (a < 250) & (brightness > 190) & (r > 180) & (g > 180) & (b > 180) & outside_character

    # Combine
    artifacts = white_outside | semi_trans_white

    # --- Pass 3: For white pixels INSIDE character, check if they're
    # isolated white spots (not eyes/highlights that are fully enclosed) ---
    white_inside = is_white & (a > 0) & character_filled

    # Find white blobs inside character
    labeled_inside, num_inside = ndimage.label(white_inside)

    # Check each blob - if it touches the edge of the character (adjacent to
    # transparent/outside pixels), it's likely an artifact
    character_edge = character_filled & ~ndimage.binary_erosion(character_filled, iterations=3)

    for label_id in range(1, num_inside + 1):
        blob = labeled_inside == label_id
        # If this blob touches the character edge, it might be an artifact
        blob_dilated = ndimage.binary_dilation(blob, iterations=2)
        touches_outside = np.any(blob_dilated & outside_character)
        blob_size = np.sum(blob)

        if touches_outside and blob_size < 3000:
            # This white blob is near the edge - likely a shadow/halo artifact
            artifacts = artifacts | blob

    # --- Pass 4: Apply transparency ---
    # For artifact pixels, fade out based on whiteness
    whiteness = np.clip((brightness - 170) / 80.0, 0, 1)

    # Apply to all artifact pixels at once (vectorized)
    artifact_mask = artifacts & (data[:,:,3] > 0)
    reduction = whiteness[artifact_mask] * 0.97
    data[:,:,3][artifact_mask] = data[:,:,3][artifact_mask] * (1.0 - reduction)

    # Kill very faint remnants
    very_faint = (data[:,:,3] > 0) & (data[:,:,3] < 15)
    data[:,:,3][very_faint] = 0

    # --- Pass 5: Edge cleanup - erode alpha slightly on edges ---
    alpha_channel = data[:,:,3].copy()
    # Find edge pixels (where alpha transitions from >0 to 0)
    has_content = alpha_channel > 10
    edge_pixels = has_content & ~ndimage.binary_erosion(has_content, iterations=1)

    # On edges, if the pixel is white-ish, reduce alpha more
    edge_and_white = edge_pixels & (brightness > 190) & (r > 180) & (g > 180) & (b > 180)
    data[:,:,3][edge_and_white] *= 0.2

    # --- Save ---
    result = Image.fromarray(data.astype(np.uint8), "RGBA")

    # Crop to content
    bbox = result.getbbox()
    if bbox:
        cropped = result.crop(bbox)
        pad = int(max(cropped.width, cropped.height) * 0.02)
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
    print("  POLYDEX — Targeted White Patch Removal")
    print("=" * 50)

    targets = ["triangle.png", "nonagon.png"]

    for filename in targets:
        path = IMAGES_DIR / filename
        if path.exists():
            clean_white_patches(path, path)
        else:
            print(f"  SKIP: {filename}")

    print()
    print("  Done!")
    print("=" * 50)


if __name__ == "__main__":
    main()
