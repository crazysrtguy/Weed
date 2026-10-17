# High Stakes — Art Batch 01

Six individual source PNG candidates: empty garage, soil-filled fabric pot, and four Garage OG foliage stages. Generated with built-in imagegen. Prompts and correction prompts are included in prompts.json.

## Status

These are generated art candidates, not final game-ready exports. Keep the master checklist entries unchecked until integration approval. No live-site files were replaced.

## Known issues to resolve

- Room was returned at 1536×1024 rather than the proposed 3072×2048 source standard; do not call it a native 3K master.
- Plant images were returned at differing canvas sizes; actual dimensions are in manifest.json.
- Pot and smaller stages retain visible soft colored haze despite a targeted cleanup pass. They need another alpha-edge cleanup pass before use.
- Requested exact root/pot anchors and foliage sizes were not consistently followed. Register them explicitly before growth swapping; do not assume identical image-box alignment.
- Developed and ready silhouettes are large; allow margins and validate against the chosen pot and room camera.
- Room is a single opaque base candidate. Foreground masks, editable source layers, light overlays and socket metadata are still outstanding.

## Intended compositing

Render room first. Place pot separately using its floor pivot. Place foliage at the soil anchor with a per-stage offset; keep pot fixed. Validate perspective and mobile readability before approving. Add UI as code; no screenshot UI is baked in here.

Next production tasks: resolve alpha and anchors, generate matching starter rack/lamp/workbench/shelving, then integrate and review the first room.
