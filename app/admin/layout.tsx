import type { Metadata } from 'next';
import { AdminProviders } from './providers';
import '../globals.css';
import '../../src/admin/index.css';
import I18nProvider from '../../src/components/I18nProvider';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Ecommerce Admin Panel',
};

import { AdminLayout } from '../../src/admin/components/layout/admin-layout';

export default function AdminRootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <AdminProviders>
            <AdminLayout>{children}</AdminLayout>
          </AdminProviders>
        </I18nProvider>
      </body>
    </html>
  );
}