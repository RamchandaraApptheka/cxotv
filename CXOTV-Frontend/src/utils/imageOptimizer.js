const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

/**
 * Optimizes an image file with various formats and qualities
 * @param {Buffer} buffer - Image buffer
 * @param {Object} options - Optimization options
 * @returns {Promise<Object>} - Optimized image formats
 */
async function optimizeImage(buffer, options = {}) {
  const {
    width,
    height,
    quality = 80,
    formats = ['webp', 'avif', 'jpeg', 'png'],
    outputDir = 'public/optimized-images'
  } = options;

  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    const image = sharp(buffer);
    const metadata = await image.metadata();
    const optimizedImages = {};
    const baseName = `img-${uuidv4()}`;

    // Process each requested format
    for (const format of formats) {
      try {
        let pipeline = image.clone();
        
        // Resize if dimensions are provided
        if (width || height) {
          pipeline = pipeline.resize({
            width,
            height,
            fit: 'cover',
            position: 'center',
            withoutEnlargement: true
          });
        }

        // Apply format-specific optimizations
        switch (format) {
          case 'webp':
            pipeline = pipeline.webp({ quality, lossless: false, alphaQuality: 100 });
            break;
          case 'avif':
            pipeline = pipeline.avif({ quality, lossless: false });
            break;
          case 'jpeg':
          case 'jpg':
            pipeline = pipeline.jpeg({ quality, progressive: true, mozjpeg: true });
            break;
          case 'png':
            pipeline = pipeline.png({ quality, progressive: true, compressionLevel: 9 });
            break;
        }

        // Generate output path
        const fileName = `${baseName}.${format}`;
        const outputPath = path.join(outputDir, fileName);
        
        // Save optimized image
        await pipeline.toFile(outputPath);
        
        // Get file stats for size
        const stats = await fs.stat(outputPath);
        
        optimizedImages[format] = {
          path: outputPath.replace('public', ''), // Make path relative to public
          size: stats.size,
          width: width || metadata.width,
          height: height || metadata.height,
          format,
          url: `/optimized-images/${fileName}`
        };
      } catch (error) {
        console.error(`Error processing ${format} format:`, error);
        // Continue with other formats even if one fails
      }
    }

    return {
      originalSize: buffer.length,
      optimized: optimizedImages,
      metadata: {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        space: metadata.space,
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha,
        hasProfile: metadata.hasProfile,
        isProgressive: metadata.isProgressive
      }
    };
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
}

/**
 * Generates responsive image srcset string
 * @param {Object} imageData - Image data object from optimizeImage
 * @returns {String} - srcset string
 */
function generateSrcSet(imageData) {
  if (!imageData || !imageData.optimized) return '';
  
  return Object.values(imageData.optimized)
    .map(img => `${img.url} ${img.width}w`)
    .join(', ');
}

/**
 * Gets the best image format based on browser support
 * @param {Object} imageData - Image data object from optimizeImage
 * @returns {String} - Best format URL
 */
function getBestFormat(imageData) {
  if (!imageData || !imageData.optimized) return '';
  
  // Order of preference
  const preferredFormats = ['avif', 'webp', 'jpeg', 'jpg', 'png'];
  
  for (const format of preferredFormats) {
    if (imageData.optimized[format]) {
      return imageData.optimized[format].url;
    }
  }
  
  return '';
}

module.exports = {
  optimizeImage,
  generateSrcSet,
  getBestFormat
};
