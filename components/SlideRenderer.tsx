'use client';

import type { ThemeConfig } from '@/lib/types';

interface SlideRendererProps {
  html: string;
  config: ThemeConfig;
  slideIndex?: number;
  className?: string;
}

export default function SlideRenderer({
  html,
  config,
  slideIndex = 0,
  className = '',
}: SlideRendererProps) {
  const { theme } = config;

  // Inject theme CSS variables and slide container fixes
  const themeStyles = `
    :root {
      --primary-color: ${theme.primaryColor};
      --secondary-color: ${theme.secondaryColor};
      --accent-color: ${theme.accentColor};
      --background-color: ${theme.backgroundColor};
      --text-color: ${theme.textColor};
      --font-family: ${theme.fontFamily};
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: var(--font-family);
      color: var(--text-color);
    }

    /* Force slides to scale to container instead of viewport */
    .slide, section.slide, section[class*="slide"] {
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      position: relative !important;
      overflow: hidden !important;
    }
  `;

  return (
    <div
      className={`slide-container relative w-full bg-white shadow-2xl ${className}`}
      style={{
        aspectRatio: '16 / 9',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <div
        className="w-full h-full overflow-hidden"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
