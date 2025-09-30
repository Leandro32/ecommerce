import type { Metadata } from 'next';
import { AdminProviders } from './providers';
import '../globals.css';
import '../../src/admin/index.css';
import I18nProvider from '../../src/components/I18nProvider';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Ecommerce Admin Panel',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <AdminProviders>
            {children}
          </AdminProviders>
        </I18nProvider>
      </body>
    </html>
  );
}