"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../supabase/authTest";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import Alert1 from "../components/Alerts/alertSingUp";
import AlertSignInError from "../components/Alerts/AlertSignInError";
import { Box } from "@chakra-ui/react";

async function loginUser(
  email: string,
  password: string,
  router: any,
  setShowErrorAlert: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error al iniciar sesión:", error.message);
    setShowErrorAlert(true);
    setTimeout(() => setShowErrorAlert(false), 3000);
    return;
  }

  // Redirigir después del login exitoso
  router.push("/");
}

const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
  if (error) alert("Error al iniciar sesión con Google: " + error.message);
};

const loginWithFacebook = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "facebook" });
  if (error) alert("Error al iniciar sesión con Facebook: " + error.message);
};

const signUpUser = async (
  email: string,
  password: string,
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>,
  router: any
) => {
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("Error al registrar el usuario:", error.message);
    alert("Error al registrar el usuario: " + error.message);
    return;
  }

  setShowAlert(true);
  setTimeout(() => {
    setShowAlert(false);
    router.push("/");
  }, 3000);
};

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"signup" | "login">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Por favor, completa ambos campos.");
      return;
    }
    await loginUser(email, password, router, setShowErrorAlert);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Por favor, completa ambos campos.");
      return;
    }
    await signUpUser(email, password, setShowAlert, router);
  };

  const { language } = useLanguage();
  const t = languages[language];

  return (
    <div className="h-screen w-full flex items-center justify-center ">
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
          >
            <source src="/video3.mp4" type="video/mp4" />
            Tu navegador no soporta videos.
          </Box>
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="text-center py-6 bg-[#B4645D] text-white">
          <h1 className="text-3xl font-bold">{t.auth.welcome}</h1>
          <p className="mt-2">{tab === "signup" ? t.auth.signupMessage : t.auth.loginMessage}</p>
        </div>

        {showAlert && (
          <Alert1 message="Cuenta creada exitosamente. Por favor, verifica tu correo electrónico." />
        )}

        <div className="p-6">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setTab("signup")}
              className={`px-4 py-2 rounded-l-md ${
                tab === "signup" ? "bg-[#B4645D] text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {t.auth.signupButton}
            </button>
            <button
              onClick={() => setTab("login")}
              className={`px-4 py-2 rounded-r-md ${
                tab === "login" ? "bg-[#B4645D] text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {t.auth.loginButton}
            </button>
          </div>

          {tab === "signup" ? (
            <form className="space-y-4">
              <input
                type="email"
                placeholder={t.auth.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
              <input
                type="password"
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
              <button
                type="submit"
                onClick={handleSignUp}
                className="w-full bg-[#B4645D] text-white py-2 rounded-md"
              >
                {t.auth.createAccountButton}
              </button>
            </form>
          ) : (
            <form className="space-y-4">
              {showErrorAlert && <AlertSignInError message="Credenciales inválidas." />}
              <input
                type="email"
                placeholder={t.auth.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
              <input
                type="password"
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
              <button
                type="submit"
                onClick={handleLogin}
                className="w-full bg-[#B4645D] text-white py-2 rounded-md"
              >
                {t.auth.loginButtonSubmit}
              </button>
            </form>
          )}

          <div className="mt-6">
            <p className="text-center text-gray-600 mb-4">{t.auth.continueWith}</p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={loginWithGoogle}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                {t.auth.googleButton}
              </button>
              <button
                type="button"
                onClick={loginWithFacebook}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {t.auth.facebookButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
