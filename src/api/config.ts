import { Capacitor } from '@capacitor/core';

// Log platform for debugging
console.log('🔌 [Config] Platform:', Capacitor.getPlatform());
console.log('📱 [Config] Is Native:', Capacitor.isNativePlatform());

const USE_LOCAL_IP = false;
// const LOCAL_IP_ADDRESS = "192.168.200.162"; // Your local IP
const LOCAL_IP_ADDRESS = "localhost"; // Your local IP


function getBaseUrl(): string {
  if (USE_LOCAL_IP) {
    console.log(`🔗 [Config] Using Local Backend URL: http://${LOCAL_IP_ADDRESS}:3001/api`);
    return `http://${LOCAL_IP_ADDRESS}:3001/api`;
  }

  // ALWAYS use the production URL (User Request)
  console.log('🔗 [Config] Using Production Backend URL');
  return "https://workerconnectbackend.onrender.com/api";
}

// Helper to get correctly routed SAML URL
export function getSamlLoginUrl(role: 'worker' | 'establishment' | 'department'): string {
  // Always use direct backend URL for SAML navigation to avoid Proxy/Redirect issues
  // This works for Local, Netlify, and Mobile.
  return `https://workerconnectbackend.onrender.com/saml/login/${role}`;
}

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 10000,
  // Add backend root URL for non-API links (like SAML)
  BACKEND_ROOT: Capacitor.isNativePlatform()
    ? "https://workerconnectbackend.onrender.com"
    : ""
};

export default API_CONFIG;
