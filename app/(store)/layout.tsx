import type { Metadata } from 'next';
import '../globals.css';
import I18nProvider from '../../src/components/I18nProvider';
import { AppProvider } from '../../src/context/AppProvider';
import Header from '../../src/components/header';
import Footer from '../../src/components/footer';
import { getAvailableCategories } from '../../src/utils/productUtils';
import { MOCK_PRODUCTS } from '../../src/data/mockProducts';

export const metadata: Metadata = {
  title: 'Ecommerce 2025',
  description: 'Migrated to Next.js',
};

interface Category { id: string; name: string; slug: string; image?: string; }

export default async function StoreLayout({ children }: { children: React.ReactNode; }) {
  const allProducts = MOCK_PRODUCTS;
  const categoryNames = getAvailableCategories(allProducts);
  const categories: Category[] = categoryNames.map(name => ({ id: name, name: name, slug: name.toLowerCase().replace(/\s+/g, '-'), }));

  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <AppProvider>
            <div className="flex flex-col min-h-screen">
              <Header categories={categories} />
              <main className="flex-grow pt-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
              </main>
              <Footer />
            </div>
          </AppProvider>
        </I18nProvider>
      </body>
    </html>
  );
}