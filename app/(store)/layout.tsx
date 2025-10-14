import type { Metadata } from "next";
import "../globals.css";
import I18nProvider from "../../src/components/I18nProvider";
import Header from "../../src/components/header";
import Footer from "../../src/components/footer";
import { AppProvider } from "../../src/context/AppProvider";
import NotificationToast from "@/components/notifications";

export const metadata: Metadata = {
  title: "Aura Perfumes",
  description: "",
};

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <AppProvider>
        <NotificationToast />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </I18nProvider>
  );
}
