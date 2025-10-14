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

// 1. Define standalone fragrance notes
const fragranceNotesData = [
  { name: 'Vanilla', color: '#F3E5AB', imageUrl: '/placeholder-note.svg' },
  { name: 'Jasmine', color: '#FFFFFF', imageUrl: '/placeholder-note.svg' },
  { name: 'Sandalwood', color: '#DEB887', imageUrl: '/placeholder-note.svg' },
  { name: 'Amber', color: '#FFBF00', imageUrl: '/placeholder-note.svg' },
  { name: 'Bergamot', color: '#A0C52A', imageUrl: '/placeholder-note.svg' },
  { name: 'Rose', color: '#FF007F', imageUrl: '/placeholder-note.svg' },
  { name: 'Musk', color: '#F4C2C2', imageUrl: '/placeholder-note.svg' },
  { name: 'Patchouli', color: '#50C878', imageUrl: '/placeholder-note.svg' },
];

// 2. Define product data with references to notes by name
const perfumesData = [
  {
    name: 'Chanel No. 5',
    brand: 'Chanel',
    sex: [Sex.WOMAN],
    description: 'The timeless, iconic fragrance...', 
    price: 120.00,
    stock: 50,
    bottleSize: 100,
    bottleType: 'Standard',
    packaging: 'Boxed',
    imageUrls: ['/placeholder-product.svg'],
    reviews: [
      {
        rating: 5,
        reviewText: 'A timeless fragrance that lasts all day. Worth every penny!',
        customerName: 'Jane Doe',
      },
    ],
    notes: [
      { name: 'Jasmine', percentage: 80 },
      { name: 'Rose', percentage: 70 },
      { name: 'Sandalwood', percentage: 50 },
    ],
  },
    {
    name: 'Dior Sauvage',
    brand: 'Dior',
    sex: [Sex.MAN],
    description: 'A radically fresh composition...',
    price: 99.00,
    stock: 120,
    bottleSize: 100,
    bottleType: 'Standard',
    packaging: 'Boxed',
    imageUrls: ['/placeholder-product.svg'],
    reviews: [
       {
        rating: 5,
        reviewText: 'My go-to scent. Always get compliments on it.',
        customerName: 'Mike Johnson',
      },
    ],
    notes: [
      { name: 'Bergamot', percentage: 90 },
      { name: 'Amber', percentage: 60 },
      { name: 'Patchouli', percentage: 40 },
    ],
  },
  {
    name: 'CK One',
    brand: 'Calvin Klein',
    sex: [Sex.MAN, Sex.UNISEX],
    description: 'The iconic fragrance that is audaciously bold...',
    price: 65.00,
    stock: 200,
    bottleSize: 200,
    bottleType: 'Standard',
    packaging: 'Boxed',
    imageUrls: ['/placeholder-product.svg'],
    reviews: [],
    notes: [
      { name: 'Bergamot', percentage: 85 },
      { name: 'Musk', percentage: 70 },
    ],
  },
];

async function main() {
  console.log('Starting seed process...');

  // Upsert admin user
  const hashedPassword = await bcrypt.hash('password123', 12);
  await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
    },
  });
  console.log('Upserted admin user.');

  // Clear existing data in the correct order
  await prisma.productFragranceNote.deleteMany({});
  await prisma.fragranceNote.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  console.log('Cleared existing data.');

  // Create FragranceNote records
  for (const noteData of fragranceNotesData) {
    await prisma.fragranceNote.create({
      data: {
        ...noteData,
        slug: generateSlug(noteData.name),
      },
    });
  }
  console.log('Created fragrance notes.');

  // Retrieve the created notes to get their IDs
  const allNotes = await prisma.fragranceNote.findMany();
  const notesMap = allNotes.reduce((acc, note) => {
    acc[note.name] = note.id;
    return acc;
  }, {});

  // Create Products and link them to FragranceNotes
  for (const perfume of perfumesData) {
    const { reviews, notes, ...productData } = perfume;
    const slug = generateSlug(productData.name);

    await prisma.product.create({
      data: {
        ...productData,
        slug,
        reviews: {
          create: reviews,
        },
        fragranceNotes: {
          create: notes.map(note => ({
            fragranceNoteId: notesMap[note.name],
            percentage: note.percentage,
          })),
        },
      },
    });
    console.log(`Created product: ${perfume.name}`);
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
