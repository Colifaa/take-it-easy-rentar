"use client";
import React, { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import supabase from "../supabase/authTest";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import Alert1 from "../components/Alerts/alertSingUp";
import { Box } from "@chakra-ui/react";

// Memoized alert component to prevent unnecessary re-renders
const MemoizedAlert = memo(Alert1);

// Constants for better maintainability
const ALERT_DURATION = {
  ERROR: 3000,
  SUCCESS: 2000,
  SIGNUP: 3000
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loginUser = async (
  email: string,
  password: string,
  router: any,
  setShowErrorAlert: React.Dispatch<React.SetStateAction<boolean>>,
  setShowSuccessAlert: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
      window.location.reload();
      router.push("/");
    }, ALERT_DURATION.SUCCESS);
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error.message);
    setShowErrorAlert(true);
    setTimeout(() => setShowErrorAlert(false), ALERT_DURATION.ERROR);
  }
};

const signUpUser = async (
  email: string,
  password: string,
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>,
  router: any
) => {
  try {
    if (!emailRegex.test(email)) {
      throw new Error("Por favor, ingresa un correo electrónico válido.");
    }

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;

    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      window.location.reload();
      router.push("/");
    }, ALERT_DURATION.SIGNUP);
  } catch (error: any) {
    console.error("Error:", error.message);
    alert(error.message);
  }
};

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"signup" | "login">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  const { language } = useLanguage();
  const t = languages[language];

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Por favor, completa ambos campos.");
      return;
    }
    await loginUser(email, password, router, setShowErrorAlert, setShowSuccessAlert);
  }, [email, password, router]);

  const handleSignUp = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Por favor, completa ambos campos.");
      return;
    }
    await signUpUser(email, password, setShowAlert, router);
  }, [email, password, router]);

  const handleSocialLogin = useCallback(async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (error: any) {
      alert(`Error al iniciar sesión con ${provider}: ${error.message}`);
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <Box 
        as="video"
        autoPlay
        loop
        muted
        playsInline
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        objectFit="cover"
        zIndex={-1}
        className="filter brightness-50"
      >
        <source src="/video3.mp4" type="video/mp4" />
        Tu navegador no soporta videos.
      </Box>

      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
        {showAlert && (
          <MemoizedAlert 
            message="¡Cuenta creada exitosamente! Has iniciado sesión automáticamente." 
            type="success"
          />
        )}

        {showSuccessAlert && (
          <MemoizedAlert 
            message="¡Has iniciado sesión correctamente!" 
            type="success"
          />
        )}

        {showErrorAlert && (
          <MemoizedAlert 
            message="Credenciales inválidas. Por favor, verifica tu correo y contraseña." 
            type="error"
          />
        )}
      </div>

      <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden relative z-10 transform transition-all duration-300 hover:shadow-2xl">
        <div className="text-center py-6 bg-gradient-to-r from-[#B4645D] to-[#D17A74] text-white">
          <h1 className="text-3xl font-bold tracking-tight">{t.auth.welcome}</h1>
          <p className="mt-2 text-white/90">{tab === "signup" ? t.auth.signupMessage : t.auth.loginMessage}</p>
        </div>

        <div className="p-6">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setTab("signup")}
              className={`px-6 py-2 rounded-l-md transition-all duration-200 ${
                tab === "signup" 
                  ? "bg-[#B4645D] text-white shadow-md" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.auth.signupButton}
            </button>
            <button
              onClick={() => setTab("login")}
              className={`px-6 py-2 rounded-r-md transition-all duration-200 ${
                tab === "login" 
                  ? "bg-[#B4645D] text-white shadow-md" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.auth.loginButton}
            </button>
          </div>

          <form className="space-y-4" onSubmit={tab === "signup" ? handleSignUp : handleLogin}>
            <div className="space-y-4">
              <input
                type="email"
                placeholder={t.auth.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4645D] focus:border-transparent transition-all duration-200"
              />
              <input
                type="password"
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4645D] focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#B4645D] text-white py-3 rounded-md hover:bg-[#D17A74] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {tab === "signup" ? t.auth.createAccountButton : t.auth.loginButtonSubmit}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/90 text-gray-500">
                  {t.auth.continueWith}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M1.24 6.65C.47 8.26 0 10.06 0 12s.47 3.74 1.24 5.35l4.026-3.115A7.077 7.077 0 0 1 4.07 12c0-1.61.48-3.11 1.196-4.35L1.24 6.65z"
                  />
                  <path
                    fill="#4285F4"
                    d="M12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115C7.47 6.35 9.63 4.909 12 4.909z"
                  />
                </svg>
                {t.auth.googleButton}
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2 text-[#1877F2]" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                {t.auth.facebookButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginForm);
