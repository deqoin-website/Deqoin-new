"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { safeGetLocalStorage } from "@/lib/browser-storage";

const ADMIN_THEME_STORAGE_KEY = "deqoin_admin_theme";

export default function RouteThemeSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const isAdminRoute = pathname.startsWith("/admin");
    const theme = isAdminRoute
      ? ((safeGetLocalStorage(ADMIN_THEME_STORAGE_KEY) as "dark" | "light") || "dark")
      : "dark";

    document.documentElement.setAttribute("data-theme", theme);
  }, [pathname]);

  return null;
}
