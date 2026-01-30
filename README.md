# WorkerConnect - Mobile-Compatible Application

A comprehensive platform for construction worker registration, establishment management, and departmental oversight. Built with React, TypeScript, and Tailwind CSS, optimized for Web, PWA, and mobile app deployment.

## Features

- **Multi-Platform Support**: Web, PWA, Android APK, iOS IPA
- **Responsive Design**: Mobile-first approach with touch-optimized UI
- **Offline Capability**: Service worker for offline functionality
- **Multi-Language**: English and Telugu support
- **Role-Based Access**: Worker, Establishment, and Department logins
- **Progressive Web App**: Installable on mobile devices
- **Native App Ready**: Capacitor integration for APK/IPA generation

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **PWA**: Vite PWA Plugin, Workbox
- **Mobile**: Capacitor (for native apps)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- For mobile builds: Android Studio (APK) or Xcode (IPA)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd worker-connect-app
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Building for Different Platforms

### Web Build
```bash
npm run build
```

### PWA Build
```bash
npm run build:pwa
```

### Mobile App Setup

1. Install Capacitor CLI
```bash
npm install -g @capacitor/cli
```

2. Initialize Capacitor
```bash
npx cap init
```

3. Add platforms
```bash
npx cap add android
npx cap add ios
```

4. Build and sync
```bash
npm run build
npx cap sync
```

### Android APK

1. Open Android project
```bash
npx cap open android
```

2. Build APK in Android Studio or via command line:
```bash
cd android
./gradlew assembleDebug
```

### iOS IPA

1. Open iOS project
```bash
npx cap open ios
```

2. Build in Xcode or via command line:
```bash
cd ios
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release
```

## PWA Installation

The app can be installed as a PWA on mobile devices:

1. Open the app in a mobile browser
2. Look for the "Install App" prompt
3. On iOS: Tap share button → "Add to Home Screen"
4. On Android: Tap "Install" when prompted

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── worker-registration/ # Worker registration flow
└── main.tsx           # App entry point

public/
├── icons/             # PWA icons
├── manifest.json      # PWA manifest
└── sw.js             # Service worker

scripts/
└── generate-icons.js  # Icon generation script
```

## Mobile Optimization Features

- **Touch-Friendly UI**: 44px minimum touch targets
- **Safe Area Support**: Notch and gesture area handling
- **Network Status**: Offline indicator
- **Install Prompt**: PWA installation guidance
- **Mobile Navigation**: Bottom tab navigation
- **Haptic Feedback**: Touch feedback on supported devices
- **Responsive Images**: Optimized for different screen densities

## Configuration Files

- `vite.config.ts` - Vite and PWA configuration
- `capacitor.config.ts` - Capacitor mobile app configuration
- `manifest.json` - PWA manifest
- `tailwind.config.js` - Tailwind CSS configuration

## Development Guidelines

### Mobile-First Design
- Start with mobile layout, then enhance for desktop
- Use responsive utilities: `mobile-only`, `desktop-only`
- Touch-friendly spacing with `touch-spacing` class

### PWA Best Practices
- Service worker handles offline functionality
- App shell architecture for fast loading
- Proper caching strategies for different resource types

### Performance Optimization
- Code splitting with dynamic imports
- Image optimization and lazy loading
- Minimal bundle size with tree shaking

## Deployment

### Web Deployment
Deploy the `dist` folder to any static hosting service:
- Vercel, Netlify, GitHub Pages
- AWS S3, Google Cloud Storage
- Traditional web servers

### PWA Deployment
Same as web deployment, but ensure HTTPS for PWA features.

### App Store Deployment
1. Build native apps with Capacitor
2. Follow platform-specific guidelines
3. Submit to Google Play Store (Android) or App Store (iOS)

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **PWA Support**: All modern browsers with service worker support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices/browsers
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review mobile-specific guidelines

---

**Note**: This application is designed to work seamlessly across web browsers, as a PWA, and as native mobile apps. The responsive design and mobile optimizations ensure a consistent experience across all platforms.# WorkerConnect
# WorkerConnect
# WorkerConnect
npx cap run android
./gradlew installDebug
npx cap sync android