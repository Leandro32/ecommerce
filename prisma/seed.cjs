const { PrismaClient, Sex } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const perfumes = [
  {
    name: 'Chanel No. 5',
    brand: 'Chanel',
    sex: Sex.WOMAN,
    description: 'The timeless, iconic fragrance in a bottle with a minimalist design. A powdery floral bouquet that is the very essence of femininity.',
    price: 120.00,
    discountPrice: 90.00,
    isDiscounted: true,
    stock: 50,
    bottleSize: 100,
    bottleType: 'Standard',
    packaging: 'Boxed',
    averageRating: 4.7,
    shippingWeight: 0.5,
    seoTitle: 'Chanel No. 5 Eau de Parfum 100ml - Luxury Perfume',
    seoDescription: 'Discover Chanel No. 5, the timeless luxury fragrance in a 100ml bottle.',
    imageUrls: [
      '/placeholder-product.svg',
    ],
    fragranceNotes: {
      topNotes: 'Aldehydes, Ylang-Ylang, Neroli, Bergamot, Lemon',
      middleNotes: 'Iris, Jasmine, Rose, Orris Root, Lily-of-the-Valley',
      baseNotes: 'Civet, Amber, Sandalwood, Musk, Vetiver, Oakmoss, Patchouli',
    },
    reviews: [
      {
        rating: 5,
        reviewText: 'A timeless fragrance that lasts all day. Worth every penny!',
        customerName: 'Jane Doe',
      },
      {
        rating: 4,
        reviewText: 'It\'s a classic for a reason, but a bit strong for my taste.',
        customerName: 'John Smith',
      },
    ],
  },
  {
    name: 'Dior Sauvage',
    brand: 'Dior',
    sex: Sex.MAN,
    description: 'A radically fresh composition, dictated by a name that has the ring of a manifesto. A raw and noble fragrance all at once.',
    price: 99.00,
    isDiscounted: false,
    stock: 120,
    bottleSize: 100,
    bottleType: 'Standard',
    packaging: 'Boxed',
    averageRating: 4.9,
    shippingWeight: 0.45,
    seoTitle: 'Dior Sauvage Eau de Toilette 100ml - Men\'s Fragrance',
    seoDescription: 'Experience the fresh and powerful scent of Dior Sauvage, a signature men\'s fragrance.',
    imageUrls: [
      '/placeholder-product.svg',
    ],
    fragranceNotes: {
      topNotes: 'Calabrian Bergamot, Pepper',
      middleNotes: 'Sichuan Pepper, Lavender, Pink Pepper, Vetiver, Patchouli, Geranium, Elemi',
      baseNotes: 'Ambroxan, Cedar, Labdanum',
    },
    reviews: [
      {
        rating: 5,
        reviewText: 'My go-to scent. Always get compliments on it.',
        customerName: 'Mike Johnson',
      },
    ],
  },
  {
    name: 'Creed Aventus',
    brand: 'Creed',
    sex: Sex.MAN,
    description: 'A sophisticated blend for individuals who savor a life well-lived. The finest ingredients were hand-selected for this composition.',
    price: 435.00,
    isDiscounted: false,
    stock: 30,
    bottleSize: 100,
    bottleType: 'Standard',
    packaging: 'Boxed',
    averageRating: 4.8,
    shippingWeight: 0.5,
    seoTitle: 'Creed Aventus Eau de Parfum 100ml - Niche Perfume for Men',
    seoDescription: 'Shop Creed Aventus, the legendary niche perfume known for its sophisticated and powerful scent profile.',
    imageUrls: [
      '/placeholder-product.svg',
    ],
    fragranceNotes: {
      topNotes: 'Pineapple, Bergamot, Black Currant, Apple',
      middleNotes: 'Birch, Patchouli, Moroccan Jasmine, Rose',
      baseNotes: 'Musk, Oak moss, Ambergris, Vanille',
    },
    reviews: [],
  },
  {
    name: 'CK One',
    brand: 'Calvin Klein',
    sex: Sex.UNISEX,
    description: 'The iconic fragrance that is audaciously bold yet down-to-earth, clean and universal. One fragrance for all.',
    price: 65.00,
    isDiscounted: true,
    discountPrice: 45.00,
    stock: 200,
    bottleSize: 200,
    bottleType: 'Standard',
    packaging: 'Boxed',
    averageRating: 4.5,
    shippingWeight: 0.6,
    seoTitle: 'CK One Eau de Toilette 200ml - Unisex Fragrance',
    seoDescription: 'The revolutionary first CK fragrance is designed for men and women to share.',
    imageUrls: [
      '/placeholder-product.svg',
    ],
    fragranceNotes: {
      topNotes: 'Lemon, Green Notes, Bergamot, Pineapple, Mandarin Orange, Cardamom, Papaya',
      middleNotes: 'Lily-of-the-Valley, Jasmine, Violet, Nutmeg, Rose, Orris Root, Freesia',
      baseNotes: 'Green Accord, Musk, Cedar, Sandalwood, Oakmoss, Green Tea, Amber',
    },
    reviews: [],
  },
];

async function main() {
  console.log('Starting seed process...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 12);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
    },
  });
  console.log(`Upserted admin user: ${admin.email}`);

  // Clear existing products, notes, and reviews
  await prisma.review.deleteMany({});
  await prisma.fragranceNotes.deleteMany({});
  await prisma.product.deleteMany({});
  console.log('Cleared existing product data.');

  // Create new products
  for (const perfume of perfumes) {
    const { fragranceNotes, reviews, ...productData } = perfume;
    const slug = generateSlug(productData.name);

    const createdProduct = await prisma.product.create({
      data: {
        ...productData,
        slug,
        fragranceNotes: {
          create: fragranceNotes,
        },
        reviews: {
          create: reviews,
        },
      },
    });
    console.log(`Created product: ${createdProduct.name}`);
  }

  console.log('Seed process finished.');
}

main()
  .catch((e) => {
    console.error('An error occurred during the seed process:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });