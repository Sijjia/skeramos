#!/bin/bash
# Build script for static export to PHP hosting

echo "🏗️  Building Skeramos for PHP hosting..."

# Run Next.js build
echo "📦 Running Next.js build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Copy PHP API
echo "📁 Copying PHP API..."
cp -r api out/

# Copy data
echo "📁 Copying data..."
cp -r data out/

# Copy .htaccess
echo "📁 Copying .htaccess..."
cp .htaccess out/

# Copy messages for translations API
echo "📁 Copying translations..."
mkdir -p out/src
cp -r src/messages out/src/

# Ensure uploads directory exists
mkdir -p out/uploads

echo ""
echo "✨ Build complete!"
echo ""
echo "📂 Output folder: out/"
echo ""
echo "To deploy, upload contents of 'out' folder to your PHP hosting."
echo ""
echo "Don't forget to:"
echo "  1. Change ADMIN_PASSWORD in api/config.php"
echo "  2. Change SESSION_SECRET in api/config.php"
echo "  3. Set proper permissions on data/ and uploads/ folders (775)"
