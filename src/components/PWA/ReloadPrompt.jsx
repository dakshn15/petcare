import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col p-4 bg-white border border-gray-100 rounded-2xl shadow-2xl max-w-sm">
      <div className="mb-3 text-sm">
        {offlineReady ? (
          <p className="text-secondary font-medium">
            <i className="fas fa-check-circle text-green-500 me-2"></i>
            App is ready to work offline!
          </p>
        ) : (
          <p className="text-secondary font-medium">
            <i className="fas fa-info-circle text-primary me-2"></i>
            New updates available. Please reload.
          </p>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        {needRefresh && (
          <button
            onClick={() => updateServiceWorker(true)}
            className="px-4 py-2 text-sm bg-primary text-white font-semibold rounded-full hover:bg-dark transition-all duration-300"
          >
            Reload
          </button>
        )}
        <button
          onClick={close}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
