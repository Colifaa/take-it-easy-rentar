"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../authTest";
import CardWrapper from "../ui/dashboard/cards";
import "../ui/global.css";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { session },

       
        
      } = await supabase.auth.getSession();

      if (!session?.user) {
        // Redirigir al login si no hay sesión
        router.push("/");
        return;
      }

      console.log(session,"data");

      // Consulta la tabla user_roles para verificar el rol
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role_id")
        .eq("user_id", session.user.id)
        .single();

      if (error || !roleData) {
        console.error("Error fetching role:", error);
        router.push("/");
        return;
      }

      // Verifica el rol del usuario
      if (roleData.role_id === 1) {
        console.log("Admin access granted");
        // Admin tiene acceso al dashboard
      } else {
        console.log("Access denied");
        // No es admin, redirigir a la página principal
        router.push("/");
      }
    };

    checkRole();
  }, [router]);

  return (
    <div>
      <CardWrapper />
      <h1>Dashboard</h1>
      {/* Otros componentes del dashboard */}
    </div>
  );
}
