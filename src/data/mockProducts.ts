import type { Product } from "../types/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    description:
      "Latest iPhone with titanium design and A17 Pro chip for professional photography and gaming performance",
    price: 999,
    salePrice: 899,
    originalPrice: 999,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
      "https://images.unsplash.com/photo-1695048080055-4b8c80d96866?w=400",
    ],
    inStock: true,
    featured: true,
    categories: ["Electronics", "Smartphones"],
    tags: ["apple", "5g", "premium", "new"],
    sku: "IP15P-001",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    brand: "Apple",
    category: "Electronics",
    rating: 4.8,
    reviewCount: 156,
    isNew: true,
    discount: 10,
    stock: 25,
  },
  {
    id: "2",
    name: 'MacBook Pro 16"',
    description:
      "Professional laptop with M3 Pro chip, perfect for creators, developers, and power users",
    price: 2499,
    originalPrice: 2499,
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    ],
    inStock: true,
    featured: true,
    categories: ["Electronics", "Computers"],
    tags: ["apple", "laptop", "pro", "m3"],
    sku: "MBP16-001",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
    brand: "Apple",
    category: "Electronics",
    rating: 4.9,
    reviewCount: 89,
    isNew: false,
    stock: 12,
  },
  {
    id: "3",
    name: "AirPods Pro 2",
    description:
      "Noise-canceling wireless earbuds with spatial audio and adaptive transparency",
    price: 249,
    salePrice: 199,
    originalPrice: 249,
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c7b6d0?w=400",
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400",
    ],
    inStock: true,
    featured: true,
    categories: ["Electronics", "Audio"],
    tags: ["apple", "wireless", "headphones", "noise-canceling"],
    sku: "APP2-001",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c7b6d0?w=400",
    brand: "Apple",
    category: "Electronics",
    rating: 4.7,
    reviewCount: 234,
    isNew: true,
    discount: 20,
    stock: 45,
  },
  {
    id: "4",
    name: "Samsung Galaxy S24 Ultra",
    description:
      "Flagship Android smartphone with AI features, S Pen, and professional camera system",
    price: 1199,
    salePrice: 999,
    originalPrice: 1199,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    ],
    inStock: true,
    featured: false,
    categories: ["Electronics", "Smartphones"],
    tags: ["samsung", "android", "5g", "s-pen"],
    sku: "SGS24U-001",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
    brand: "Samsung",
    category: "Electronics",
    rating: 4.6,
    reviewCount: 178,
    isNew: true,
    discount: 17,
    stock: 33,
  },
  {
    id: "5",
    name: "Sony WH-1000XM5",
    description:
      "Industry-leading noise canceling wireless headphones with 30-hour battery life",
    price: 399,
    originalPrice: 399,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    ],
    inStock: true,
    featured: true,
    categories: ["Electronics", "Audio"],
    tags: ["sony", "wireless", "noise-canceling", "premium"],
    sku: "SONY-WH1000XM5",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    brand: "Sony",
    category: "Electronics",
    rating: 4.8,
    reviewCount: 312,
    isNew: false,
    stock: 18,
  },
  {
    id: "6",
    name: "Nike Air Max 270",
    description:
      "Lifestyle sneakers with Max Air heel unit for all-day comfort and street-ready style",
    price: 150,
    salePrice: 120,
    originalPrice: 150,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400",
    ],
    inStock: true,
    featured: false,
    categories: ["Fashion", "Shoes"],
    tags: ["nike", "sneakers", "casual", "air-max"],
    sku: "NIKE-AM270-001",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    brand: "Nike",
    category: "Fashion",
    rating: 4.5,
    reviewCount: 267,
    isNew: false,
    discount: 20,
    stock: 42,
  },
  {
    id: "7",
    name: "Canon EOS R6 Mark II",
    description:
      "Full-frame mirrorless camera with 24.2MP sensor and advanced autofocus system",
    price: 2499,
    originalPrice: 2499,
    images: [
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    ],
    inStock: true,
    featured: true,
    categories: ["Electronics", "Cameras"],
    tags: ["canon", "camera", "photography", "professional"],
    sku: "CANON-R6M2",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400",
    brand: "Canon",
    category: "Electronics",
    rating: 4.9,
    reviewCount: 95,
    isNew: true,
    stock: 8,
  },
  {
    id: "8",
    name: "iPad Air 5th Gen",
    description:
      "Powerful tablet with M1 chip, perfect for work, creativity, and entertainment",
    price: 599,
    salePrice: 549,
    originalPrice: 599,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
    ],
    inStock: true,
    featured: false,
    categories: ["Electronics", "Tablets"],
    tags: ["apple", "ipad", "tablet", "m1"],
    sku: "IPAD-AIR5-001",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    brand: "Apple",
    category: "Electronics",
    rating: 4.7,
    reviewCount: 145,
    isNew: false,
    discount: 8,
    stock: 28,
  },
  {
    id: "9",
    name: "Adidas Ultraboost 22",
    description:
      "Premium running shoes with Boost midsole technology for maximum energy return",
    price: 190,
    originalPrice: 190,
    images: [
      "https://broken-image-url.com/invalid.jpg",
      "https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=400",
    ],
    inStock: false,
    featured: false,
    categories: ["Fashion", "Shoes", "Sports"],
    tags: ["adidas", "running", "boost", "athletic"],
    sku: "ADIDAS-UB22",
    image: "https://broken-image-url.com/invalid.jpg",
    brand: "Adidas",
    category: "Fashion",
    rating: 4.6,
    reviewCount: 198,
    isNew: false,
    stock: 0,
  },
  {
    id: "10",
    name: "Microsoft Surface Pro 9",
    description:
      "2-in-1 laptop and tablet with Intel 12th Gen processors for ultimate versatility",
    price: 1199,
    salePrice: 999,
    originalPrice: 1199,
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
      "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400",
    ],
    inStock: true,
    featured: true,
    categories: ["Electronics", "Computers"],
    tags: ["microsoft", "surface", "2-in-1", "windows"],
    sku: "MS-SP9-001",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
    brand: "Microsoft",
    category: "Electronics",
    rating: 4.4,
    reviewCount: 87,
    isNew: true,
    discount: 17,
    stock: 15,
  },
  {
    id: "11",
    name: "Levi's 501 Original Jeans",
    description:
      "Classic straight-leg jeans, the original blue jean since 1873",
    price: 98,
    salePrice: 79,
    originalPrice: 98,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
    ],
    inStock: true,
    featured: false,
    categories: ["Fashion", "Clothing"],
    tags: ["levis", "jeans", "denim", "classic"],
    sku: "LEVIS-501-001",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    brand: "Levi's",
    category: "Fashion",
    rating: 4.3,
    reviewCount: 523,
    isNew: false,
    discount: 19,
    stock: 67,
  },
  {
    id: "12",
    name: "Tesla Model Y Accessories Kit",
    description:
      "Premium accessories bundle including floor mats, phone holder, and trunk organizer",
    price: 299,
    originalPrice: 299,
    images: [],
    inStock: true,
    featured: false,
    categories: ["Automotive", "Accessories"],
    tags: ["tesla", "car", "accessories", "electric"],
    sku: "TESLA-MY-ACC",
    image: "",
    brand: "Tesla",
    category: "Automotive",
    rating: 4.7,
    reviewCount: 134,
    isNew: true,
    stock: 23,
  },
  {
    id: "13",
    name: "Wireless Gaming Mouse",
    description:
      "High precision wireless gaming mouse with RGB lighting and programmable buttons",
    price: 79,
    salePrice: 59,
    originalPrice: 79,
    images: [
      "https://invalid-domain-that-does-not-exist.xyz/mouse.jpg",
      "https://another-broken-url.fake/gaming-mouse.png",
    ],
    inStock: true,
    featured: false,
    categories: ["Electronics", "Gaming"],
    tags: ["gaming", "mouse", "wireless", "rgb"],
    sku: "GAME-MOUSE-001",
    image: "https://invalid-domain-that-does-not-exist.xyz/mouse.jpg",
    brand: "TechGear",
    category: "Electronics",
    rating: 4.2,
    reviewCount: 87,
    isNew: true,
    discount: 25,
    stock: 15,
  },
  {
    id: "14",
    name: "Bluetooth Speaker",
    description: "Portable waterproof Bluetooth speaker with 360-degree sound",
    price: 149,
    originalPrice: 149,
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    ],
    inStock: true,
    featured: true,
    categories: ["Electronics", "Audio"],
    tags: ["bluetooth", "speaker", "portable", "waterproof"],
    sku: "BT-SPEAKER-360",
    image: "",
    brand: "AudioTech",
    category: "Electronics",
    rating: 4.5,
    reviewCount: 203,
    isNew: false,
    stock: 28,
  },
];

// Utility functions for mock data
export const getMockProductsByCategory = (category: string): Product[] => {
  return MOCK_PRODUCTS.filter((product) =>
    product.categories.some((cat) =>
      cat.toLowerCase().includes(category.toLowerCase()),
    ),
  );
};

export const getMockFeaturedProducts = (): Product[] => {
  return MOCK_PRODUCTS.filter((product) => product.featured);
};

export const getMockNewArrivals = (): Product[] => {
  return MOCK_PRODUCTS.filter((product) => product.isNew);
};

export const getMockBestSellers = (): Product[] => {
  return MOCK_PRODUCTS.sort((a, b) => (b.rating || 0) - (a.rating || 0));
};

export const getMockProductById = (id: string): Product | null => {
  return MOCK_PRODUCTS.find((product) => product.id === id) || null;
};

export const searchMockProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return MOCK_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.categories.some((cat) =>
        cat.toLowerCase().includes(searchTerm),
      ) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      product.brand?.toLowerCase().includes(searchTerm),
  );
};
