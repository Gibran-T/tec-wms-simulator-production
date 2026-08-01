from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
src = (root / "client/src/data/modules.ts").read_text(encoding="utf-8")
counts = (root / "client/src/data/slideCounts.ts").read_text(encoding="utf-8")
i = src.index("const module5")
j = src.index("export const allModules")
block = src[i:j]
ids = re.findall(r"\n    \{\n      id: (\d+),", block)
print("ids", ids)
assert ids == [str(n) for n in range(1, 12)], ids
assert "Opération intégrée de bout en bout" not in block
assert "Quart de clôture" in block
assert "PRÉPARER" in block and "SUPERVISER" in block and "INTERVENIR" in block and "CLÔTURER" in block
assert re.search(r"5:\s*11", counts), counts
imgs = list((root / "client/public/visual-learning/modules/m5").glob("*.png"))
print("public_images", len(imgs))
assert len(imgs) >= 11
print("MIGRATION_OK")
