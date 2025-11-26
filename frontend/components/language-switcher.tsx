"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/src/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    router.replace(pathname, { locale: value });
  };

  return (
    <select 
        value={locale} 
        onChange={handleChange}
        className="bg-background border border-input rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
    >
      <option value="en">🇺🇸 English</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="es">🇪🇸 Español</option>
      <option value="it">🇮🇹 Italiano</option>
    </select>
  );
}
