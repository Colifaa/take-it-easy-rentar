"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/supabase/authTest";
import MusicManager from "@/components/admin/MusicManager";

export default function MusicPage() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/");
        return;
      }

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

      if (roleData.role_id !== 1) {
        console.log("Access denied");
        router.push("/");
      }
    };

    checkRole();
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-[#49243E]">Gestión de Música</h1>
      </div>

      <MusicManager />
    </div>
  );
} 