import Link from "next/link"
import { type Language, getTranslation } from "@/lib/translations"
import Image from "next/image"

interface FooterProps {
  currentLanguage: Language
}

export function Footer({ currentLanguage }: FooterProps) {
  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Simplified Brand Section */}
          <div className="space-y-4">
            <div className="relative w-32 h-32">
              <Image src="/images/tyl-logo.png" alt="TYL Logo" width={128} height={128} className="object-contain" />
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">{t("services")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  <span className="inline-block w-5 text-teal-500">•</span> {t("restaurantTipping")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  <span className="inline-block w-5 text-teal-500">•</span> {t("cafeTipping")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  <span className="inline-block w-5 text-teal-500">•</span> {t("barTipping")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  <span className="inline-block w-5 text-teal-500">•</span> {t("tipCalculator")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  <span className="inline-block w-5 text-teal-500">•</span> {t("businessDashboard")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  <span className="inline-block w-5 text-teal-500">•</span> {t("staffManagement")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">{t("company")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("careers")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("press")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("partnerships")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">{t("resources")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("helpCenter")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("tippingGuides")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("businessResources")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("apiDocumentation")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("developerTools")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  {t("appDownload")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <select
                className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1 text-sm"
                defaultValue={currentLanguage}
              >
                <option value="en">🇺🇸 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <Link href="#" className="hover:text-teal-500 dark:hover:text-teal-400">
                {t("privacyPolicy")}
              </Link>
              <Link href="#" className="hover:text-teal-500 dark:hover:text-teal-400">
                {t("termsOfService")}
              </Link>
              <Link href="#" className="hover:text-teal-500 dark:hover:text-teal-400">
                {t("cookiesPolicy")}
              </Link>
              <Link href="#" className="hover:text-teal-500 dark:hover:text-teal-400">
                {t("accessibility")}
              </Link>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              © {currentYear} TipYouLater Inc. {t("allRightsReserved")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
