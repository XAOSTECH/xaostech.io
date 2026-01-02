#!/bin/bash
# Build Astro + copy shared components (xaostech.io is static, no env var injection needed)

set -e

echo "[xaostech.io] Building Astro..."
npm run build

echo "[xaostech.io] Cloning shared resources..."
git clone --depth 1 --filter=blob:none --sparse https://github.com/XAOSTECH/XAOSTECH.git ./shared
cd shared
git sparse-checkout set shared
cd ..

echo "[xaostech.io] Copying shared components..."
mkdir -p src/components src/styles
cp shared/shared/components/*.astro src/components/ 2>/dev/null || true
cp shared/shared/src/styles/*.css src/styles/ 2>/dev/null || true

rm -rf shared

echo "✓ Build complete"