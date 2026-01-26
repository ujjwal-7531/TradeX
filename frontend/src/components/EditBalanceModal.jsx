import { useState } from "react";

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Adjust Virtual Balance
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Set your starting capital for learning and paper trading.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Amount (₹)
            </label>
            <input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 100000"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Update Balance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBalanceModal;
