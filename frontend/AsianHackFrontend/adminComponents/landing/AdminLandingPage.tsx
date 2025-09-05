"use client";

import {
  ClipboardList,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  Table2,
  Banknote,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

const features = [
  {
    label: "Manage Orders",
    description: "View, track, and fulfill orders in real-time.",
    icon: <ClipboardList size={28} className="text-blue-500" />,
    href: "/admin?tab=orders",
  },
  {
    label: "Manage Menu",
    description: "Update and organize food items with ease.",
    icon: <ShoppingCart size={28} className="text-green-500" />,
    href: "/admin?tab=menu",
  },
  {
    label: "Manage Tables",
    description: "Assign, book and manage tables efficiently.",
    icon: <Table2 size={28} className="text-orange-500" />,
    href: "/admin?tab=tables",
  },
  {
    label: "Manage Payments",
    description: "Track and manage customer payments securely.",
    icon: <Banknote size={28} className="text-teal-500" />,
    href: "/admin?tab=payments",
  },
  {
    label: "User Roles & Staff",
    description: "Assign roles and manage team access levels.",
    icon: <Users size={28} className="text-violet-500" />,
    href: "/admin?tab=users",
  },
  {
    label: "Reports & Analytics",
    description: "Analyze performance and download reports.",
    icon: <BarChart2 size={28} className="text-red-500" />,
    href: "/admin?tab=reports",
  },
  {
    label: "System Settings",
    description: "Update preferences and system configurations.",
    icon: <Settings size={28} className="text-gray-600" />,
    href: "/admin?tab=settings",
  },
];

const AdminLandingPage = () => {
  const router = useRouter();

  return (
    <div className="p-6 sm:p-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
          Manage every aspect of your canteen system — from orders to analytics
          — all in one place.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[var(--bg-card)] p-5 rounded-xl shadow-md hover:shadow-lg border border-[var(--gray-200)] transition-all cursor-pointer"
            onClick={() => router.push(feature.href)}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-[var(--bg-icon)] p-3 rounded-full shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                {feature.label}
              </h3>
            </div>
            <p className="text-[var(--text-secondary)]">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminLandingPage;
