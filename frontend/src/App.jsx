import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Transactions from "./pages/Transactions";
import Holdings from "./pages/Holdings";
import Watchlist from "./pages/Watchlist";

function App() {
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1F2937', // dark-gray-800
            color: '#F9FAFB', // gray-50
            border: '1px solid #374151', // gray-700
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#10B981', // emerald-500
              secondary: '#1F2937',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444', // red-500
              secondary: '#1F2937',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        <Route path="/holdings" element={
            <ProtectedRoute>
              <Holdings />
            </ProtectedRoute>
        } />
        
        <Route path="/transactions" element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />

        <Route 
          path="/watchlist" 
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          } 
        />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;