#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up mobile development environment...\n');

// Check if Capacitor is initialized
if (!fs.existsSync(path.join(__dirname, '../capacitor.config.ts'))) {
  console.log('⚡ Initializing Capacitor...');
  execSync('npx cap init WorkerConnect com.workerconnect.app', { stdio: 'inherit' });
}

// Add platforms if they don't exist
if (!fs.existsSync(path.join(__dirname, '../android'))) {
  console.log('🤖 Adding Android platform...');
  execSync('npx cap add android', { stdio: 'inherit' });
}

if (!fs.existsSync(path.join(__dirname, '../ios'))) {
  console.log('🍎 Adding iOS platform...');
  execSync('npx cap add ios', { stdio: 'inherit' });
}

// Install additional Capacitor plugins
console.log('📦 Installing Capacitor plugins...');
const plugins = [
  '@capacitor/geolocation',
  '@capacitor/camera',
  '@capacitor/filesystem',
  '@capacitor/device',
  '@capacitor/network',
  '@capacitor/push-notifications',
  '@capacitor/local-notifications',
  '@capacitor/haptics',
  '@capacitor/status-bar',
  '@capacitor/keyboard'
];

try {
  execSync(`npm install ${plugins.join(' ')}`, { stdio: 'inherit' });
  console.log('✅ Capacitor plugins installed\n');
} catch (error) {
  console.error('❌ Plugin installation failed:', error.message);
}

// Sync the project
console.log('🔄 Syncing project...');
try {
  execSync('npx cap sync', { stdio: 'inherit' });
  console.log('✅ Project synced successfully\n');
} catch (error) {
  console.error('❌ Sync failed:', error.message);
}

console.log('🎉 Mobile setup completed!');
console.log('\n📋 Available commands:');
console.log('   npm run build:mobile  - Build web app and sync');
console.log('   npm run build:android - Build Android APK');
console.log('   npm run build:ios     - Build iOS IPA');
console.log('   npm run open:android  - Open Android Studio');
console.log('   npm run open:ios      - Open Xcode');
console.log('   npm run run:android   - Run on Android device');
console.log('   npm run run:ios       - Run on iOS device');