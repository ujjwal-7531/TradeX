import { useState } from "react";
import { createPortal } from "react-dom";

function EditBalanceModal({ isOpen, onClose, onUpdate, currentBalance }) {
  const [newBalance, setNewBalance] = useState(currentBalance || "");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Force conversion to a real number
    const numericValue = Number(newBalance);

    if (isNaN(numericValue)) {
      alert("Please enter a valid numeric amount.");
      return;
    }

    onUpdate(numericValue); // This calls handleUpdateBalance in TopBar
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white tracking-tight">
          Adjust Virtual Balance
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Set your starting capital for learning and paper trading.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
              Amount (₹)
            </label>
            <input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              className="w-full px-4 py-3 text-lg font-mono border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
              placeholder="e.g. 100000"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all hover:shadow-sm active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            >
              Update Balance
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default EditBalanceModal;
