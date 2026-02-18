// API route for exporting deck to standalone HTML file
import { NextRequest, NextResponse } from 'next/server';
import { getDeck } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deck = await getDeck(id);

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      );
    }

    // Build standalone HTML
    const html = buildStandaloneHTML(deck);

    // Return as downloadable file
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${deck.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export deck' },
      { status: 500 }
    );
  }
}

function buildStandaloneHTML(deck: any): string {
  const { title, slides, config } = deck;
  const { theme } = config;

  // Combine all slide HTML
  const slidesHTML = slides
    .map((slide: any, index: number) => {
      // Ensure each slide has the correct data-slide attribute
      let html = slide.html;
      if (!html.includes('data-slide=')) {
        html = html.replace('<section', `<section data-slide="${index}"`);
      }
      return html;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    /* Reset & base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      overflow: hidden;
      font-family: ${theme.fontFamily};
      background: ${theme.backgroundColor};
      color: ${theme.textColor};
    }

    /* Slide container */
    #slides {
      position: relative;
      width: 100vw;
      height: 100vh;
    }

    section.slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }

    section.slide.active {
      display: block;
      opacity: 1;
    }

    /* Navigation controls */
    .nav-controls {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 20px;
      background: rgba(0, 0, 0, 0.7);
      padding: 12px 24px;
      border-radius: 30px;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .nav-controls button {
      background: ${theme.primaryColor};
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 18px;
      font-weight: 600;
      transition: background 0.2s;
    }

    .nav-controls button:hover:not(:disabled) {
      background: ${theme.secondaryColor};
    }

    .nav-controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .nav-controls #counter {
      color: white;
      font-size: 16px;
      min-width: 80px;
      text-align: center;
      font-weight: 500;
    }

    /* Theme variables */
    :root {
      --primary: ${theme.primaryColor};
      --secondary: ${theme.secondaryColor};
      --accent: ${theme.accentColor};
      --background: ${theme.backgroundColor};
      --text: ${theme.textColor};
    }

    /* Hide controls on print */
    @media print {
      .nav-controls {
        display: none;
      }
      section.slide {
        page-break-after: always;
        position: relative;
        display: block !important;
        opacity: 1 !important;
      }
    }
  </style>
</head>
<body>
  <div id="slides">
${slidesHTML}
  </div>

  <div class="nav-controls">
    <button id="prev">← Previous</button>
    <span id="counter">1 / ${slides.length}</span>
    <button id="next">Next →</button>
  </div>

  <script>
    // Slide navigation logic
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    function showSlide(index) {
      // Clamp index
      index = Math.max(0, Math.min(index, totalSlides - 1));

      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
      });

      currentSlide = index;
      document.getElementById('counter').textContent = \`\${index + 1} / \${totalSlides}\`;

      // Update button states
      document.getElementById('prev').disabled = index === 0;
      document.getElementById('next').disabled = index === totalSlides - 1;
    }

    // Button handlers
    document.getElementById('prev').addEventListener('click', () => {
      if (currentSlide > 0) showSlide(currentSlide - 1);
    });

    document.getElementById('next').addEventListener('click', () => {
      if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          if (currentSlide > 0) showSlide(currentSlide - 1);
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
          break;
        case 'Home':
          showSlide(0);
          break;
        case 'End':
          showSlide(totalSlides - 1);
          break;
      }
    });

    // Initialize
    showSlide(0);
  </script>
</body>
</html>`;
}
