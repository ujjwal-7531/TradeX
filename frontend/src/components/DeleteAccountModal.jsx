import { createPortal } from "react-dom";
import { useState } from "react";

function DeleteAccountModal({ isOpen, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-500">
          <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Delete Account</h3>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
          Are you entirely sure you want to proceed? 
        </p>
        <p className="text-sm text-gray-800 dark:text-gray-200 mb-8 font-semibold bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/50">
          All your <span className="text-red-600 dark:text-red-400">Transactions</span>, <span className="text-red-600 dark:text-red-400">Portfolios</span>, and <span className="text-red-600 dark:text-red-400">Watchlists</span> will be permanently erased. This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all hover:shadow-sm active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-5 py-2.5 flex justify-center items-center gap-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Permanently Delete"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default DeleteAccountModal;
