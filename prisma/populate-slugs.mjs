import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-')         // replace spaces with hyphens
    .replace(/-+/g, '-');          // remove consecutive hyphens
  return slug;
}

async function main() {
  const products = await prisma.product.findMany({
    where: {
      slug: null,
    },
  });

  console.log(`Found ${products.length} products without a slug.`);

  for (const product of products) {
    let slug = generateSlug(product.name);
    let isUnique = false;
    let counter = 1;

    // Check for uniqueness and append a number if needed
    while (!isUnique) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug },
      });
      if (existingProduct) {
        slug = `${generateSlug(product.name)}-${counter}`;
        counter++;
      } else {
        isUnique = true;
      }
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { slug },
    });
    console.log(`Updated product ${product.id} with slug: ${slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
