// Expose build-time env vars (Vite) to the inline script
// so we don't hardcode secrets in the HTML file.
// Render/Local: set VITE_POCKETBASE_URL

// Use an IIFE to avoid leaking module scope
(() => {
  const url = import.meta.env.VITE_POCKETBASE_URL as string | undefined;
  // Attach to window for the inline script usage
  // Fallbacks remain in index.html if these are undefined
  (window as any).POCKETBASE_URL = url;
})();
