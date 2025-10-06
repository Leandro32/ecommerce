import Image from 'next/image';
import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { HeroData } from '../types/hero';

interface HeroBannerProps {
  heroData: HeroData;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ heroData }) => {
  if (!heroData) {
    return null; // Or a loading skeleton
  }

  const { title, paragraph, heroImageUrl, buttonLayout, buttons } = heroData;

  return (
    <div className="relative rounded-lg overflow-hidden mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 z-10" />

      <Image
        src={heroImageUrl || "https://img.heroui.chat/image/fashion?w=1200&h=600&u=1"}
        alt={title || "Hero background image"}
        width={1200}
        height={600}
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
        priority
      />

      <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2 max-w-md">
            {title}
          </h1>
          <p className="text-white/80 text-sm sm:text-base mb-6 max-w-md">
            {paragraph}
          </p>
          <div className="flex flex-wrap gap-3">
            {buttonLayout !== 'none' && buttons?.map((button, index) => {
              if (index === 0 && (buttonLayout === 'oneButton' || buttonLayout === 'twoButtons')) {
                return (
                  <Button
                    key={button.id}
                    as={Link}
                    href={button.buttonLink}
                    target={button.isExternal ? '_blank' : '_self'}
                    rel={button.isExternal ? 'noopener noreferrer' : ''}
                    color={button.variant === 'primary' ? 'primary' : 'default'}
                    size="lg"
                    className="font-medium"
                  >
                    {button.buttonText}
                  </Button>
                );
              }
              if (index === 1 && buttonLayout === 'twoButtons') {
                return (
                  <Button
                    key={button.id}
                    as={Link}
                    href={button.buttonLink}
                    target={button.isExternal ? '_blank' : '_self'}
                    rel={button.isExternal ? 'noopener noreferrer' : ''}
                    variant="flat"
                    color={button.variant === 'primary' ? 'primary' : 'default'}
                    size="lg"
                    className="bg-white/20 text-white font-medium"
                  >
                    {button.buttonText}
                  </Button>
                );
              }
              return null;
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
