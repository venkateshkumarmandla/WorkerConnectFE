#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting mobile build process...\n');

// Build the web app first
console.log('📦 Building web application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Web build completed\n');
} catch (error) {
  console.error('❌ Web build failed:', error.message);
  process.exit(1);
}

// Sync with Capacitor
console.log('🔄 Syncing with Capacitor...');
try {
  execSync('npx cap copy && npx cap update', { stdio: 'inherit' });
  console.log('✅ Capacitor sync completed\n');
} catch (error) {
  console.error('❌ Capacitor sync failed:', error.message);
  process.exit(1);
}

// Build Android APK
console.log('🤖 Building Android APK...');
try {
  execSync('npx cap build android --prod', { stdio: 'inherit' });
  console.log('✅ Android APK build completed\n');
  
  // Copy APK to dist folder
  const apkSource = path.join(__dirname, '../android/app/build/outputs/apk/debug/app-debug.apk');
  const apkDest = path.join(__dirname, '../dist/WorkerConnect.apk');
  
  if (fs.existsSync(apkSource)) {
    fs.copyFileSync(apkSource, apkDest);
    console.log('📱 APK copied to dist/WorkerConnect.apk');
  }
} catch (error) {
  console.error('❌ Android build failed:', error.message);
  console.log('ℹ️  You may need to open Android Studio and build manually');
}

// Build iOS IPA (requires macOS and Xcode)
if (process.platform === 'darwin') {
  console.log('🍎 Building iOS IPA...');
  try {
    execSync('npx cap build ios --prod', { stdio: 'inherit' });
    console.log('✅ iOS IPA build completed\n');
    console.log('📱 IPA file will be available in Xcode after archive');
  } catch (error) {
    console.error('❌ iOS build failed:', error.message);
    console.log('ℹ️  You may need to open Xcode and build manually');
  }
} else {
  console.log('ℹ️  iOS build skipped (requires macOS)');
}

console.log('\n🎉 Mobile build process completed!');
console.log('\n📋 Next steps:');
console.log('   • Android: Install WorkerConnect.apk from the dist folder');
console.log('   • iOS: Open Xcode project and archive for distribution');
console.log('   • For production: Configure signing certificates and app store deployment');