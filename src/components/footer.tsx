import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', href: '/products' },
        { name: 'New Arrivals', href: '/products/new-arrivals' },
        { name: 'Best Sellers', href: '/products/best-sellers' },
        { name: 'Sale', href: '/products/sale' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns & Exchanges', href: '/returns' },
        { name: 'Contact Us', href: '/contact' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Press', href: '/press' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Instagram', icon: 'lucide:instagram', href: '#' },
    { name: 'Twitter', icon: 'lucide:twitter', href: '#' },
    { name: 'Facebook', icon: 'lucide:facebook', href: '#' },
    { name: 'YouTube', icon: 'lucide:youtube', href: '#' }
  ];

  return (
    <footer className="bg-content2 py-12 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="lucide:shopping-bag" className="text-primary text-xl" />
              <span className="font-semibold text-lg">NOVA</span>
            </div>
            <p className="text-default-600 text-sm max-w-xs">
              Elevating everyday essentials with thoughtful design and sustainable practices.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  className="text-default-500 hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  <Icon icon={social.icon} className="text-xl" />
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-default-600 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-divider mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-default-500">
            &copy; {currentYear} NOVA. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-default-500 hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-default-500 hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-default-500 hover:text-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;