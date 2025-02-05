"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../supabase/authTest";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import Alert1 from "../components/Alerts/alertSingUp";

import AlertSignInError from "../components/Alerts/AlertSignInError";


async function loginUser(
  email: string,
  password: string,
  router: any,
  setShowErrorAlert: React.Dispatch<React.SetStateAction<boolean>>, 
 
) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error al iniciar sesión:", error.message);
    setShowErrorAlert(true); // Ahora se activa correctamente la alerta
    setTimeout(() => {
      setShowErrorAlert(false); // Oculta la alerta después de 3 segundos
    }, 3000);
    return;
  }
}

const loginWithGoogle = async (router: any) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    console.error("Error al iniciar sesión con Google:", error.message);
    alert("Error al iniciar sesión con Google: " + error.message);
    return;
  }
};

const loginWithFacebook = async (router: any) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
  });

  

  if (error) {
    console.error("Error al iniciar sesión con Facebook:", error.message);
    alert("Error al iniciar sesión con Facebook: " + error.message);
    return;
  }
};

const logoutUser = async (router: any) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error al cerrar sesión:", error.message);
    alert("Error al cerrar sesión: " + error.message);
    return;
  }

  alert("Sesión cerrada correctamente.");
  router.push("/");
};

const signUpUser = async (
  email: string,
  password: string,
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>,
  router: any
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error al registrar el usuario:", error.message);
    alert("Error al registrar el usuario: " + error.message);
    return;
  }

  setShowAlert(true); // Muestra la alerta
  setTimeout(() => {
    setShowAlert(false); // Oculta la alerta después de 3 segundos
    router.push("/"); // Redirige después de la creación exitosa
  }, 3000);
};


const LoginForm: React.FC = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"signup" | "login">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false); // Estado para la alerta
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el reload automático del navegador
    if (!email || !password) {
      alert("Por favor, completa ambos campos.");
      return;
    }
    await loginUser(email, password, router, setShowErrorAlert);
    
  
  };
  

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el reload
    if (!email || !password) {
      alert("Por favor, completa ambos campos.");
      return;
    }
    await signUpUser(email, password, setShowAlert, router);
  };

  const { language } = useLanguage();
  const t = languages[language];


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <div className="text-center py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          
          <h1 className="text-3xl font-bold">{t.auth.welcome}</h1>
          <p className="mt-2">
            {tab === "signup" ? t.auth.signupMessage : t.auth.loginMessage}
          </p>
        </div>
        {showAlert && (
            <Alert1 message="Cuenta creada exitosamente. Por favor, verifica tu correo electrónico." />
          )}
        <div className="p-8">
      
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setTab("signup")}
              className={`px-4 py-2 rounded-l-md ${
                tab === "signup" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {t.auth.signupButton}
            </button>
            <button
              onClick={() => setTab("login")}
              className={`px-4 py-2 rounded-r-md ${
                tab === "login" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
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
                onClick={handleSignUp}
                className="w-full bg-gradient-to-r from-green-500 to-purple-600 text-white py-2 rounded-md"
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
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-md"
              >
                {t.auth.loginButtonSubmit}
              </button>
            </form>
          )}
  
          <div className="mt-6">
            <p className="text-center text-gray-600 mb-4">{t.auth.continueWith}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => loginWithGoogle(router)}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                {t.auth.googleButton}
              </button>
              <button
                onClick={() => loginWithFacebook(router)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {t.auth.facebookButton}
              </button>
            </div>
          </div>
  
          <div className="mt-6">
            <button
              onClick={() => logoutUser(router)}
              className="w-full bg-red-600 text-white py-2 rounded-md"
            >
              {t.auth.logoutButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
