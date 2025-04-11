"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../supabase/authTest";
import "../ui/global.css";
import CarsAdminPage from "../../components/CarsAdminPage";
import  {CarList } from "../../components/CarList";
import CarAvailabilityManager from "@/components/CarAvailabilityManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="container mx-auto py-8">
      <Tabs defaultValue="cars" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cars">Gestionar Autos</TabsTrigger>
          <TabsTrigger value="availability">Gestionar Disponibilidad</TabsTrigger>
        </TabsList>
        <TabsContent value="cars">
          <CarsAdminPage />
        </TabsContent>
        <TabsContent value="availability">
          <CarAvailabilityManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
