const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const { glob } = require('glob');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DuplicatesPlugin } = require('inspectpack/plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// Configuration
const CONFIG = {
  // Directories to analyze
  sourceDirs: [
    'src/app',
    'src/components',
    'src/pages',
    'public',
  ],
  
  // Output directory for analysis reports
  outputDir: '.next/analyze',
  
  // Performance budgets (in KB)
  budgets: {
    js: 200,
    css: 100,
    image: 500,
    font: 100,
  },
  
  // Features to enable/disable
  features: {
    analyzeBundle: true,
    findDuplicates: true,
    optimizeImages: true,
    generateSourceMaps: false,
    compressAssets: true,
  },
};

// Ensure output directory exists
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

// Analyze bundle size
async function analyzeBundle() {
  if (!CONFIG.features.analyzeBundle) return;
  
  console.log('\n🔍 Analyzing bundle size...');
  
  try {
    // Run Next.js build with analysis
    process.env.ANALYZE = 'true';
    
    // Create a custom webpack config for analysis
    const nextConfig = {
      webpack: (config, { isServer }) => {
        // Add bundle analyzer plugin
        if (!isServer) {
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              reportFilename: path.join(CONFIG.outputDir, 'bundle-analyzer.html'),
              openAnalyzer: false,
              generateStatsFile: true,
              statsFilename: path.join(CONFIG.outputDir, 'bundle-stats.json'),
            })
          );
        }
        
        // Add duplicates finder
        if (CONFIG.features.findDuplicates) {
          config.plugins.push(
            new DuplicatesPlugin({
              emitErrors: false,
              emitHandler: (report) => {
                const duplicatesFile = path.join(CONFIG.outputDir, 'duplicates.json');
                fs.writeFile(duplicatesFile, JSON.stringify(report, null, 2));
              }
            })
          );
        }
        
        // Add compression for production
        if (process.env.NODE_ENV === 'production' && CONFIG.features.compressAssets) {
          config.plugins.push(
            new CompressionPlugin({
              algorithm: 'gzip',
              test: /\.(js|css|html|svg)$/,
              threshold: 10240,
              minRatio: 0.8,
            })
          );
        }
        
        // Optimize CSS
        if (process.env.NODE_ENV === 'production') {
          config.optimization.minimizer.push(
            new CssMinimizerPlugin({
              minimizerOptions: {
                preset: [
                  'default',
                  {
                    discardComments: { removeAll: true },
                    normalizeWhitespace: true,
                  },
                ],
              },
            })
          );
        }
        
        // Optimize JS
        if (process.env.NODE_ENV === 'production') {
          config.optimization.minimizer.push(
            new TerserPlugin({
              parallel: true,
              terserOptions: {
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                },
                output: {
                  comments: false,
                },
              },
              extractComments: false,
            })
          );
        }
        
        return config;
      },
    };
    
    // Save the config to a temporary file
    const tempConfigPath = path.join(process.cwd(), 'next.analyze.config.js');
    await fs.writeFile(
      tempConfigPath,
      `module.exports = ${JSON.stringify(nextConfig, null, 2)};`
    );
    
    // Run the build with the custom config
    execSync('next build', { stdio: 'inherit' });
    
    // Clean up
    await fs.unlink(tempConfigPath);
    
    console.log('✅ Bundle analysis complete!');
    console.log(`📊 Reports saved to: ${path.join(process.cwd(), CONFIG.outputDir)}`);
    
  } catch (error) {
    console.error('❌ Error during bundle analysis:', error);
    throw error;
  }
}

// Find and remove unused CSS
async function findUnusedCSS() {
  console.log('\n🔍 Finding unused CSS...');
  
  try {
    // Install required tools if not present
    try {
      execSync('purgecss --version', { stdio: 'ignore' });
    } catch {
      console.log('Installing purgecss...');
      execSync('npm install -g purgecss', { stdio: 'inherit' });
    }
    
    // Create a configuration file for purgecss
    const purgecssConfig = {
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './pages/**/*.{js,jsx,ts,tsx}',
      ],
      css: ['./src/**/*.css'],
      output: path.join(process.cwd(), CONFIG.outputDir, 'unused-css'),
      safelist: {
        standard: [
          /^slick-/,
          /^carousel-/,
          /^modal-/,
          /^tooltip-/,
          /^popover-/,
          /^collaps-/,
          /^fade$/,
          /^show$/,
          /^active$/,
          /^selected$/,
          /^open$/,
          /^loading$/,
          /^error$/,
          /^success$/,
          /^warning$/,
          /^info$/,
          /^hidden$/,
          /^visible$/,
          /^invisible$/,
          /^sr-only$/,
        ],
      },
    };
    
    const configPath = path.join(process.cwd(), 'purgecss.config.js');
    await fs.writeFile(
      configPath,
      `module.exports = ${JSON.stringify(purgecssConfig, null, 2)};`
    );
    
    // Run purgecss
    execSync(`purgecss --config ${configPath} --output ${path.join(process.cwd(), CONFIG.outputDir, 'unused-css')}`, {
      stdio: 'inherit',
    });
    
    // Clean up
    await fs.unlink(configPath);
    
    console.log('✅ Unused CSS analysis complete!');
    console.log(`📊 Report saved to: ${path.join(process.cwd(), CONFIG.outputDir, 'unused-css')}`);
    
  } catch (error) {
    console.error('❌ Error finding unused CSS:', error);
  }
}

// Optimize static assets
async function optimizeAssets() {
  console.log('\n⚙️  Optimizing static assets...');
  
  try {
    // Optimize images using the optimize-images script
    if (CONFIG.features.optimizeImages) {
      console.log('Optimizing images...');
      const { optimizeImages } = require('./optimize-images');
      await optimizeImages();
    }
    
    // Generate responsive images
    console.log('Generating responsive images...');
    const imageOptimizer = require('./image-optimizer');
    await imageOptimizer.optimizeAllImages();
    
    // Optimize SVGs
    console.log('Optimizing SVGs...');
    const svgFiles = await glob('public/**/*.svg');
    for (const file of svgFiles) {
      const content = await fs.readFile(file, 'utf8');
      // Simple SVG optimization (remove comments, whitespace, etc.)
      const optimized = content
        .replace(/<!--.*?-->/g, '')
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
      
      await fs.writeFile(file, optimized, 'utf8');
    }
    
    console.log('✅ Static assets optimized!');
    
  } catch (error) {
    console.error('❌ Error optimizing static assets:', error);
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting build optimization...');
    
    // Ensure output directory exists
    await ensureDir(path.join(process.cwd(), CONFIG.outputDir));
    
    // Run optimizations
    await analyzeBundle();
    await findUnusedCSS();
    await optimizeAssets();
    
    console.log('\n✨ Build optimization complete!');
    console.log('📊 Reports and optimized assets are available in the .next/analyze directory');
    
  } catch (error) {
    console.error('❌ Build optimization failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundle,
  findUnusedCSS,
  optimizeAssets,
};
