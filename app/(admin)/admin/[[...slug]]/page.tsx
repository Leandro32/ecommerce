'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const AdminAppWrapper = dynamic(() => import('../../../../src/admin/AdminAppWrapper'), {
  ssr: false,
});

export default function AdminPage() {
  return <AdminAppWrapper />;
}
