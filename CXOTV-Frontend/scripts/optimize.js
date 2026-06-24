#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const chalk = require('chalk');
const { performance } = require('perf_hooks');

// Import optimization modules
const { optimizeImages } = require('./optimize-images');
const { analyzeBundle, findUnusedCSS, optimizeAssets } = require('./optimize-build');

// Configuration
const CONFIG = {
  // Output directory for reports
  outputDir: '.next/analyze',
  
  // Features to enable/disable
  features: {
    analyzeBundle: true,
    findUnusedCSS: true,
    optimizeImages: true,
    optimizeAssets: true,
    updatePackageJson: true,
  },
};

// Track execution time
const startTime = performance.now();

// Helper functions
const log = {
  info: (message) => console.log(chalk.blue(`[INFO] ${message}`)),
  success: (message) => console.log(chalk.green(`[SUCCESS] ${message}`)),
  warning: (message) => console.log(chalk.yellow(`[WARNING] ${message}`)),
  error: (message) => console.log(chalk.red(`[ERROR] ${message}`)),
  section: (message) => {
    console.log('\n' + '='.repeat(80));
    console.log(chalk.bold.blue(message));
    console.log('='.repeat(80));
  },
};

// Check if a package is installed
function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}

// Install required dependencies
async function installDependencies() {
  log.section('🔧 Installing Required Dependencies');
  
  const requiredDeps = [
    'sharp',
    'webpack-bundle-analyzer',
    'inspectpack',
    'compression-webpack-plugin',
    'css-minimizer-webpack-plugin',
    'purgecss',
    'imagemin',
    'imagemin-mozjpeg',
    'imagemin-pngquant',
    'imagemin-svgo',
    'imagemin-webp',
    'globby',
    'chalk',
  ];
  
  const missingDeps = requiredDeps.filter(dep => !isPackageInstalled(dep));
  
  if (missingDeps.length === 0) {
    log.success('All required dependencies are already installed');
    return;
  }
  
  log.info(`Installing missing dependencies: ${missingDeps.join(', ')}`);
  
  try {
    execSync(`npm install --save-dev ${missingDeps.join(' ')}`, { stdio: 'inherit' });
    log.success('Dependencies installed successfully');
  } catch (error) {
    log.error('Failed to install dependencies');
    throw error;
  }
}

// Update package.json with optimization scripts
async function updatePackageJson() {
  if (!CONFIG.features.updatePackageJson) return;
  
  log.section('📝 Updating package.json');
  
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    
    // Add or update scripts
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts = {
      ...packageJson.scripts,
      'optimize': 'node scripts/optimize',
      'optimize:images': 'node scripts/optimize-images',
      'analyze': 'ANALYZE=true next build',
      'analyze:build': 'node scripts/analyze-bundle',
      'analyze:css': 'node scripts/analyze-css',
      'build:optimized': 'npm run optimize && next build',
    };
    
    // Add browserlist if not exists
    if (!packageJson.browserslist) {
      packageJson.browserslist = {
        production: [
          '>0.2%',
          'not dead',
          'not op_mini all'
        ],
        development: [
          'last 1 chrome version',
          'last 1 firefox version',
          'last 1 safari version'
        ]
      };
    }
    
    // Write back to package.json
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf8'
    );
    
    log.success('package.json updated with optimization scripts');
  } catch (error) {
    log.error('Failed to update package.json:', error.message);
    throw error;
  }
}

// Main optimization function
async function optimize() {
  try {
    log.section('🚀 Starting Optimization Process');
    
    // Install required dependencies
    await installDependencies();
    
    // Update package.json with optimization scripts
    await updatePackageJson();
    
    // Run optimizations
    if (CONFIG.features.optimizeImages) {
      log.section('🖼️  Optimizing Images');
      await optimizeImages();
    }
    
    if (CONFIG.features.analyzeBundle) {
      log.section('📦 Analyzing Bundle');
      await analyzeBundle();
    }
    
    if (CONFIG.features.findUnusedCSS) {
      log.section('🎨 Finding Unused CSS');
      await findUnusedCSS();
    }
    
    if (CONFIG.features.optimizeAssets) {
      log.section('⚙️  Optimizing Static Assets');
      await optimizeAssets();
    }
    
    // Calculate and log total execution time
    const endTime = performance.now();
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    
    log.section('✨ Optimization Complete!');
    log.success(`Total execution time: ${executionTime} seconds`);
    log.success('Optimized files are ready for production');
    
    console.log('\nNext steps:');
    console.log('1. Run ' + chalk.cyan('npm run build:optimized') + ' to create an optimized production build');
    console.log('2. Check the ' + chalk.cyan('.next/analyze') + ' directory for optimization reports');
    console.log('3. Deploy your optimized application');
    
  } catch (error) {
    log.error('Optimization failed:', error.message);
    process.exit(1);
  }
}

// Run the optimization
if (require.main === module) {
  optimize();
}

module.exports = {
  optimize,
  installDependencies,
  updatePackageJson,
};
