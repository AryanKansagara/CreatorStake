/**
 * Global error handling utilities
 */

// Add global error handling for better debugging
export const setupGlobalErrorHandling = () => {
  if (typeof window !== 'undefined') {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error);
      
      // Don't report module loading errors as they might be handled by try-catch blocks
      if (event.error && event.error.message && 
          (event.error.message.includes('Cannot find module') || 
           event.error.message.includes('Failed to load'))) {
        console.warn('Module loading error - this may be handled by local error handling');
      } else {
        // Send to analytics or logging service in production
        // Example: analyticsService.logError(event.error);
      }
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Send to analytics or logging service in production
      // Example: analyticsService.logError(event.reason);
    });
  }
};

/**
 * Safe require function that won't crash the app if the module is not found
 * @param modulePath Path to the module
 * @returns The module or null if not found
 */
export const safeRequire = <T>(modulePath: string): T | null => {
  try {
    // Use dynamic import for better error handling
    const module = require(modulePath);
    return module as T;
  } catch (error) {
    console.warn(`Module ${modulePath} could not be loaded:`, error);
    return null;
  }
};
