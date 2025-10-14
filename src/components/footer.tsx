'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Icon } from '@iconify/react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  id: string;
  column: string;
  title: string;
  links: FooterLink[];
}

const fetchFooterContent = async (): Promise<FooterColumn[]> => {
  return apiClient.get('/footer');
};

const Footer: React.FC = () => {
  const { data: footerContent, isLoading } = useQuery<FooterColumn[], Error>({
    queryKey: ['footerContent'],
    queryFn: fetchFooterContent,
  });

  const columns = footerContent?.reduce((acc, col) => {
    if (!acc[col.column]) {
      acc[col.column] = [];
    }
    acc[col.column].push(col);
    return acc;
  }, {} as Record<string, FooterColumn[]>);

  if (isLoading) {
    return <footer className="bg-default-100 py-12"></footer>;
  }

  return (
    <footer className="bg-default-100 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {columns && Object.keys(columns).map(colKey => (
            <div key={colKey}>
              {columns[colKey].map(colData => (
                <div key={colData.id} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">{colData.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {colData.links.map(link => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-base text-gray-500 hover:text-gray-900">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 flex items-center justify-between">
          <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} Aura Perfumes. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Icon icon="lucide:facebook" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Icon icon="lucide:instagram" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Icon icon="lucide:twitter" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;