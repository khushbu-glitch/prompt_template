/**
 * Razorpay Script Loader
 * Dynamically loads Razorpay checkout script
 */

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

let scriptLoaded = false;
let scriptLoading = false;
const loadPromises: Array<(value: boolean) => void> = [];

/**
 * Loads the Razorpay checkout script
 * @returns Promise that resolves when script is loaded
 */
export function loadRazorpayScript(): Promise<boolean> {
  // If already loaded, return immediately
  if (scriptLoaded) {
    return Promise.resolve(true);
  }

  // If currently loading, return a promise that will resolve when loading completes
  if (scriptLoading) {
    return new Promise((resolve) => {
      loadPromises.push(resolve);
    });
  }

  // Start loading the script
  scriptLoading = true;

  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;

      script.onload = () => {
        scriptLoaded = true;
        scriptLoading = false;
        
        // Resolve all waiting promises
        loadPromises.forEach((promiseResolve) => promiseResolve(true));
        loadPromises.length = 0;
        
        resolve(true);
      };

      script.onerror = () => {
        scriptLoading = false;
        
        // Reject all waiting promises
        loadPromises.forEach((promiseResolve) => promiseResolve(false));
        loadPromises.length = 0;
        
        reject(new Error('Failed to load Razorpay script'));
      };

      document.body.appendChild(script);
    } catch (error) {
      scriptLoading = false;
      reject(error);
    }
  });
}

/**
 * Checks if Razorpay script is loaded
 */
export function isRazorpayLoaded(): boolean {
  return scriptLoaded && typeof window.Razorpay !== 'undefined';
}

