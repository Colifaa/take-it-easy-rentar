"use client";

import SideNav from "../ui/dashboard/sidenav";
import { motion } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gray-50">
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-full flex-none md:w-64"
      >
        <SideNav />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-grow p-6 md:overflow-y-auto md:p-12"
      >
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
