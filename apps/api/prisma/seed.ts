import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

/**
 * Seed the storefront. The catalogue is focused on Clothing for now.
 * Re-running is safe: we clear products and non-clothing categories first.
 */
async function main() {
  // Keep the catalogue clothing-only: remove everything else. Orders/tickets
  // reference products, so dev/test data referencing the old catalogue must
  // go first.
  await prisma.supportTicket.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({ where: { slug: { not: 'clothing' } } });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: { name: 'Clothing' },
    create: { name: 'Clothing', slug: 'clothing' },
  });

  // Keyword-matched stock photos (locked so each product keeps the same set).
  const img = (keyword: string, lock: number) =>
    `https://loremflickr.com/600/600/${keyword}?lock=${lock}`;
  // Three angles per product, sharing a base lock so they stay consistent
  // across reseeds but differ enough to look like a real gallery.
  const gallery = (keyword: string, base: number) => [
    img(keyword, base),
    img(keyword, base + 100),
    img(keyword, base + 200),
  ];

  const products = [
    {
      name: 'Sleeveless Cotton Kurta',
      slug: 'sleeveless-cotton-kurta',
      description: 'Breezy sleeveless kurta in soft handwoven cotton.',
      priceInPaise: 119900,
      color: '#C0392B', // red
      stock: 40,
      images: gallery('kurta', 11),
    },
    {
      name: 'Hand-block Print Kurta',
      slug: 'hand-block-print-kurta',
      description: 'Full-sleeve kurta with traditional hand-block prints.',
      priceInPaise: 129900,
      color: '#2C3E50', // indigo
      stock: 25,
      images: gallery('kurta', 12),
    },
    {
      name: 'Chikankari Anarkali Dress',
      slug: 'chikankari-anarkali-dress',
      description:
        'Flowing Anarkali with delicate Lucknowi chikankari embroidery.',
      priceInPaise: 289900,
      color: '#F5F0E1', // ivory
      stock: 20,
      images: gallery('dress', 13),
    },
    {
      name: 'Handloom Cotton Saree',
      slug: 'handloom-cotton-saree',
      description: 'Lightweight handloom cotton saree with a contrast border.',
      priceInPaise: 219900,
      color: '#27AE60', // green
      stock: 28,
      images: gallery('saree', 14),
    },
    {
      name: 'Linen Button-down Shirt',
      slug: 'linen-button-down-shirt',
      description: 'Relaxed-fit linen shirt for warm Indian summers.',
      priceInPaise: 169900,
      color: '#5DADE2', // sky blue
      stock: 35,
      images: gallery('linen,shirt', 15),
    },
    {
      name: 'Merino Wool Sweater',
      slug: 'merino-wool-sweater',
      description:
        'Soft, breathable merino wool sweater in a classic crew neck.',
      priceInPaise: 249900,
      color: '#7D6608', // mustard
      stock: 32,
      images: gallery('sweater', 16),
    },
    {
      name: 'Tailored Chino Trousers',
      slug: 'tailored-chino-trousers',
      description: 'Mid-rise tailored chinos in a versatile stone shade.',
      priceInPaise: 189900,
      color: '#BDC3C7', // stone
      stock: 50,
      images: gallery('trousers', 17),
    },
    {
      name: 'Embroidered Nehru Jacket',
      slug: 'embroidered-nehru-jacket',
      description: 'Festive Nehru jacket with subtle thread embroidery.',
      priceInPaise: 264900,
      color: '#6C3483', // plum
      stock: 18,
      images: gallery('jacket', 18),
    },
    {
      name: 'Organic Cotton Tee',
      slug: 'organic-cotton-tee',
      description: 'Everyday essential tee in 100% organic combed cotton.',
      priceInPaise: 79900,
      color: '#1C1C1A', // black
      stock: 80,
      images: gallery('tshirt', 19),
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: { ...p, imageUrl: p.images[0], categoryId: clothing.id },
    });
  }

  // Seed an admin user (idempotent by email).
  const adminEmail = 'admin@arviora.test';
  const adminHash = await argon2.hash('Admin@12345', { type: argon2.argon2id });
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN', passwordHash: adminHash, status: 'ACTIVE' },
    create: {
      email: adminEmail,
      name: 'Arviora Admin',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });

  console.log(
    `Seeded 1 category, ${products.length} clothing products, and admin user (${adminEmail} / Admin@12345).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
