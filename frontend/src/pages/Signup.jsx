import { SignUp } from "@clerk/clerk-react";
import tradingBg from "../assets/bg.jpg";

function Signup() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-12 px-4"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${tradingBg})` 
      }}
    >
      <SignUp 
        routing="path" 
        path="/signup" 
        signInUrl="/login" 
        forceRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorBackground: "transparent",
            colorPrimary: "#3b82f6",
            colorText: "#ffffff",
            colorTextSecondary: "#bfdbfe",
            colorInputBackground: "rgba(255, 255, 255, 0.08)",
            colorInputText: "#ffffff",
          },
          elements: {
            rootBox: "w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden",
            cardBox: "bg-transparent shadow-none border-none",
            card: "bg-transparent shadow-none border-none p-8",
            headerTitle: "text-3xl font-extrabold text-white tracking-tight",
            headerSubtitle: "text-blue-200 text-sm",
            socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all rounded-xl",
            socialButtonsBlockButtonText: "text-white font-medium",
            dividerLine: "bg-white/20",
            dividerText: "text-blue-100 text-xs uppercase tracking-wider",
            formFieldLabel: "text-xs font-semibold text-blue-100 uppercase tracking-wider",
            formFieldInput: "bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all rounded-lg",
            formButtonPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all border-none text-base",
            footer: "bg-transparent border-t border-white/10 mt-6 pt-4 shadow-none",
            footerActionText: "text-blue-100 text-sm font-medium",
            footerActionLink: "text-blue-400 hover:text-blue-300 font-bold transition-colors ml-1",
          }
        }}
      />
    </div>
  );
}

export default Signup;
