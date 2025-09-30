'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="text-8xl font-bold text-primary mb-4">404</div>
      <h1 className="text-2xl font-semibold mb-2">{t('pages.notFound')}</h1>
      <p className="text-default-500 mb-8 max-w-md">
        {t('pages.notFoundMessage')}
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          as={Link}
          href="/"
          color="primary"
          size="lg"
          startContent={<Icon icon="lucide:home" />}
        >
          {t('buttons.goToHomepage')}
        </Button>
        <Button 
          as={Link}
          href="/products"
          variant="flat"
          size="lg"
        >
          {t('buttons.browseProducts')}
        </Button>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
