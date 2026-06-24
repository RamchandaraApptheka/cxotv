const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { glob } = require('glob');
const { v4: uuidv4 } = require('uuid');

// Configuration
const CONFIG = {
  // Source directories to search for images
  sourceDirs: [
    'public/images',
    'public/uploads'
  ],
  
  // Output directory for optimized images
  outputDir: 'public/optimized',
  
  // Image formats to process
  formats: ['jpg', 'jpeg', 'png', 'webp'],
  
  // Quality settings
  quality: 80,
  
  // Sizes to generate (width in pixels)
  sizes: [320, 480, 768, 1024, 1366, 1600, 1920],
  
  // Maximum width for responsive images
  maxWidth: 1920,
};

// Ensure output directory exists
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

// Process a single image file
async function processImage(filePath) {
  try {
    const fileExt = path.extname(filePath).toLowerCase().substring(1);
    const fileName = path.basename(filePath, `.${fileExt}`);
    const relativePath = path.relative(process.cwd(), path.dirname(filePath));
    const outputBasePath = path.join(process.cwd(), CONFIG.outputDir, relativePath);
    
    await ensureDir(outputBasePath);
    
    // Read the image
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Skip if not a supported format
    if (!CONFIG.formats.includes(fileExt)) {
      console.log(`Skipping unsupported format: ${filePath}`);
      return null;
    }
    
    // Skip if already in optimized directory
    if (relativePath.startsWith(CONFIG.outputDir)) {
      console.log(`Skipping already optimized: ${filePath}`);
      return null;
    }
    
    const results = {
      original: {
        path: filePath,
        size: (await fs.stat(filePath)).size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      },
      optimized: {},
    };
    
    // Generate responsive sizes
    for (const width of CONFIG.sizes) {
      // Skip if the original is smaller than the target size
      if (metadata.width < width) continue;
      
      const outputFileName = `${fileName}-${width}w.${fileExt}`;
      const outputPath = path.join(outputBasePath, outputFileName);
      
      // Resize and optimize the image
      await image
        .resize(width, Math.round((metadata.height / metadata.width) * width), {
          fit: 'cover',
          position: 'center',
          withoutEnlargement: true,
        })
        .jpeg({ quality: CONFIG.quality, progressive: true })
        .png({ quality: CONFIG.quality, progressive: true })
        .webp({ quality: CONFIG.quality })
        .toFile(outputPath);
      
      const stats = await fs.stat(outputPath);
      
      results.optimized[width] = {
        path: outputPath,
        size: stats.size,
        width,
        height: Math.round((metadata.height / metadata.width) * width),
        format: fileExt,
        url: `/${path.relative(path.join(process.cwd(), 'public'), outputPath)}`,
      };
    }
    
    // Generate WebP versions
    for (const width of CONFIG.sizes) {
      if (metadata.width < width) continue;
      
      const outputFileName = `${fileName}-${width}w.webp`;
      const outputPath = path.join(outputBasePath, outputFileName);
      
      await image
        .resize(width, Math.round((metadata.height / metadata.width) * width), {
          fit: 'cover',
          position: 'center',
          withoutEnlargement: true,
        })
        .webp({ quality: CONFIG.quality })
        .toFile(outputPath);
      
      const stats = await fs.stat(outputPath);
      
      results.optimized[`${width}-webp`] = {
        path: outputPath,
        size: stats.size,
        width,
        height: Math.round((metadata.height / metadata.width) * width),
        format: 'webp',
        url: `/${path.relative(path.join(process.cwd(), 'public'), outputPath)}`,
      };
    }
    
    return results;
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting image optimization...');
    
    // Find all image files in source directories
    const files = [];
    for (const dir of CONFIG.sourceDirs) {
      const pattern = path.join(dir, '**/*.{jpg,jpeg,png,webp}');
      const matches = await glob(pattern, { nodir: true });
      files.push(...matches);
    }
    
    console.log(`Found ${files.length} images to process`);
    
    // Process each image
    const results = [];
    for (const file of files) {
      console.log(`Processing: ${file}`);
      const result = await processImage(file);
      if (result) {
        results.push(result);
      }
    }
    
    // Generate a manifest file
    const manifest = {
      generatedAt: new Date().toISOString(),
      optimizedCount: results.length,
      images: results.map(r => ({
        original: r.original,
        optimized: Object.values(r.optimized).map(o => ({
          url: o.url,
          width: o.width,
          height: o.height,
          format: o.format,
          size: o.size,
        })),
      })),
    };
    
    await fs.writeFile(
      path.join(process.cwd(), CONFIG.outputDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('Image optimization complete!');
    console.log(`Optimized ${results.length} images`);
    
  } catch (error) {
    console.error('Error in image optimization:', error);
    process.exit(1);
  }
}

// Run the script
main();
