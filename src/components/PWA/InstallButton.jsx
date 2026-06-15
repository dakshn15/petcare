import React, { useState, useEffect } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install button
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Hide if already running in standalone mode (PWA window)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User choice outcome: ${outcome}`);
    
    // Reset prompt and hide button
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-6 start-6 z-50 flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-full shadow-2xl hover:bg-dark transition-all duration-300 transform hover:scale-105 border border-white/10 cursor-pointer"
      aria-label="Install Petcare App"
    >
      <i className="fas fa-download text-sm"></i>
      <span>Install App</span>
    </button>
  );
}
