"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../authTest";

async function loginUser(email: string, password: string, router: any) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log(authData, "data2");

  if (error) {
    console.error("Error al iniciar sesión:", error.message);
    alert("Error al iniciar sesión: " + error.message);
    return;
  }

  const userId = authData.user?.id;
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role_id")
    .eq("user_id", userId)
    .single();

  if (roleError) {
    console.error("Error al obtener el rol:", roleError.message);
    alert("Error al obtener el rol del usuario.");
    return;
  }

  const roleId = roleData?.role_id;
  if (roleId === 1) {
    router.push("/dashboard");
  } else {
    router.push("/");
  }
}

const loginWithGoogle = async (router: any) => {
  let { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  console.log(data, "data3");

  const { data: sessionData } = await supabase.auth.getSession();

  console.log("Datos de la sesión:", sessionData);
  console.log("Datos del usuario:", sessionData.session?.user);

  if (error) {
    console.error("Error al iniciar sesión con Google:", error.message);
    alert("Error al iniciar sesión con Google: " + error.message);
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

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"signup" | "login">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor, completa ambos campos.");
      return;
    }
    await loginUser(email, password, router);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <div className="text-center py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="mt-2">
            {tab === "signup"
              ? "Join our amazing community"
              : "Login to access the dashboard"}
          </p>
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setTab("signup")}
              className={`px-4 py-2 rounded-l-md focus:outline-none transition-colors duration-300 ${
                tab === "signup"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setTab("login")}
              className={`px-4 py-2 rounded-r-md focus:outline-none transition-colors duration-300 ${
                tab === "login"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Login
            </button>
          </div>

          {tab === "login" && (
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                />
              </div>
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-300 transform hover:scale-105"
              >
                Iniciar Sesión
              </button>
            </form>
          )}

          <div className="mt-6">
            <p className="text-center text-gray-600 mb-4">Or continue with</p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => loginWithGoogle(router)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Google
              </button>
            </div>
          </div>

          {/* Botón para cerrar sesión */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => logoutUser(router)}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-opacity duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
