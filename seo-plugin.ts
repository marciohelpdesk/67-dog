import type { Plugin } from 'vite';
import { MENU_CATEGORIES, ESTABLISHMENT_INFO } from './src/data/menuData.ts';

function formatBRL(price: number): string {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

function generatePrerenderHtml(): string {
  const sectionsHtml = MENU_CATEGORIES.map((category) => {
    const itemsHtml = category.items
      .map(
        (item) => `
        <article style="margin-bottom: 1rem;">
          <h4 style="margin: 0; font-size: 1.05rem;">${item.name} — <strong>${formatBRL(item.price)}</strong></h4>
          <p style="margin: 0.25rem 0 0; color: #555;">${item.description}</p>
        </article>`
      )
      .join('\n');

    return `
      <section style="margin-top: 1.5rem;">
        <h3 style="font-size: 1.25rem; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem;">
          ${category.emoji} ${category.label}
        </h3>
        ${itemsHtml}
      </section>`;
  }).join('\n');

  return `
    <main style="max-width: 600px; margin: 0 auto; padding: 1.5rem; font-family: sans-serif;">
      <header>
        <h1 style="font-size: 1.75rem; margin-bottom: 0.5rem;">${ESTABLISHMENT_INFO.name} — ${ESTABLISHMENT_INFO.subname}</h1>
        <p style="font-size: 1.1rem; color: #333; margin-top: 0;"><strong>${ESTABLISHMENT_INFO.tagline}</strong></p>
        <p style="color: #666;">${ESTABLISHMENT_INFO.bio}</p>
      </header>

      <section style="background: #f7f5f0; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
        <h2 style="font-size: 1.15rem; margin-top: 0;">Informações &amp; Contato</h2>
        <p><strong>📍 Endereço:</strong> ${ESTABLISHMENT_INFO.address}</p>
        <p><strong>🕒 Horário:</strong> Terça a domingo, das 18:00 às 23:00 (Segunda-feira: Fechado)</p>
        <p><strong>💬 WhatsApp:</strong> <a href="https://wa.me/${ESTABLISHMENT_INFO.phone}">${ESTABLISHMENT_INFO.phoneDisplay}</a></p>
        <p><strong>📸 Instagram:</strong> <a href="${ESTABLISHMENT_INFO.instagram}">${ESTABLISHMENT_INFO.instagramDisplay}</a></p>
      </section>

      <section>
        <h2 style="font-size: 1.4rem;">Cardápio Completo</h2>
        ${sectionsHtml}
      </section>
    </main>
  `.trim();
}

function generateSchemaOrgJsonLd(): string {
  const menuSections = MENU_CATEGORIES.map((category) => ({
    '@type': 'MenuSection',
    name: category.label,
    hasMenuItem: category.items.map((item) => ({
      '@type': 'MenuItem',
      name: item.name,
      description: item.description,
      offers: {
        '@type': 'Offer',
        price: item.price.toFixed(2),
        priceCurrency: 'BRL',
      },
    })),
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: ESTABLISHMENT_INFO.name,
    alternateName: `${ESTABLISHMENT_INFO.name} • ${ESTABLISHMENT_INFO.subname}`,
    description:
      'Hot dog com vina e pastel frito na hora no bairro Nações, Fazenda Rio Grande - PR. Veja o cardápio com preços e peça pelo WhatsApp. Terça a domingo, 18h às 23h.',
    url: 'https://67-dog.vercel.app/',
    image: 'https://67-dog.vercel.app/og-image.jpg',
    telephone: `+${ESTABLISHMENT_INFO.phone}`,
    servesCuisine: ['Brasileira', 'Hot Dog', 'Pastel', 'Lanches'],
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Estados Unidos, 389',
      addressLocality: 'Fazenda Rio Grande',
      addressRegion: 'PR',
      postalCode: '83823-114',
      addressCountry: 'BR',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '18:00',
        closes: '23:00',
      },
    ],
    sameAs: [ESTABLISHMENT_INFO.instagram],
    hasMenu: {
      '@type': 'Menu',
      name: 'Cardápio 67 Dog',
      url: 'https://67-dog.vercel.app/',
      hasMenuSection: menuSections,
    },
  };

  return JSON.stringify(schema, null, 2);
}

export function seoPlugin(): Plugin {
  return {
    name: 'seo-plugin',
    transformIndexHtml(html: string) {
      const prerenderHtml = generatePrerenderHtml();
      const schemaJsonLd = generateSchemaOrgJsonLd();
      const scriptTag = `\n    <!-- Schema.org Restaurant Structured Data (JSON-LD) -->\n    <script type="application/ld+json">\n${schemaJsonLd}\n    </script>`;

      // Inject JSON-LD in <head>
      let transformed = html;
      if (transformed.includes('</head>')) {
        transformed = transformed.replace('</head>', `${scriptTag}\n  </head>`);
      }

      // Inject prerendered semantic HTML inside <noscript> within <div id="root">
      // This prevents the visual flash of plain unstyled text on mobile devices
      // while preserving full SEO crawlability for search engines and bots.
      if (transformed.includes('<div id="root"></div>')) {
        transformed = transformed.replace(
          '<div id="root"></div>',
          `<div id="root">\n      <noscript>\n${prerenderHtml}\n      </noscript>\n    </div>`
        );
      }

      return transformed;
    },
  };
}
