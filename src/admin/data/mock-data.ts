// Mock data for the admin panel

// KPI data for dashboard
export const mockKpiData = [
  {
    id: 1,
    title: "Total Revenue",
    value: "$12,345.67",
    change: "+12.5%",
    trend: "up",
    icon: "lucide:dollar-sign"
  },
  {
    id: 2,
    title: "Orders",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: "lucide:shopping-cart"
  },
  {
    id: 3,
    title: "Customers",
    value: "2,345",
    change: "+5.1%",
    trend: "up",
    icon: "lucide:users"
  },
  {
    id: 4,
    title: "Conversion Rate",
    value: "3.2%",
    change: "-0.4%",
    trend: "down",
    icon: "lucide:percent"
  }
];

// Recent orders for dashboard
export const mockRecentOrders = [
  {
    id: "1001",
    customer: "John Doe",
    date: "2023-06-01",
    status: "Enviado / Cumplido",
    total: 125.99
  },
  {
    id: "1002",
    customer: "Jane Smith",
    date: "2023-06-02",
    status: "Aceptado",
    total: 89.50
  },
  {
    id: "1003",
    customer: "Bob Johnson",
    date: "2023-06-03",
    status: "Solicitud / Nuevo",
    total: 245.75
  },
  {
    id: "1004",
    customer: "Alice Brown",
    date: "2023-06-04",
    status: "Cancelado",
    total: 112.30
  },
  {
    id: "1005",
    customer: "Charlie Wilson",
    date: "2023-06-05",
    status: "Facturado / Pagado",
    total: 78.25
  }
];

// Product categories
export const mockCategories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Toys",
  "Beauty",
  "Automotive"
];

// Products
export const mockProducts = [
  {
    id: "p001",
    name: "Wireless Headphones",
    sku: "ELEC-WH-001",
    category: "Electronics",
    price: 79.99,
    stock: 45,
    description: "High-quality wireless headphones with noise cancellation.",
    isActive: true,
    isFeatured: true
  },
  {
    id: "p002",
    name: "Cotton T-Shirt",
    sku: "CLTH-TS-002",
    category: "Clothing",
    price: 19.99,
    stock: 120,
    description: "Comfortable cotton t-shirt available in multiple colors.",
    isActive: true
  },
  {
    id: "p003",
    name: "Smart Watch",
    sku: "ELEC-SW-003",
    category: "Electronics",
    price: 199.99,
    stock: 18,
    description: "Feature-rich smart watch with health monitoring capabilities.",
    isActive: true,
    isFeatured: true
  },
  {
    id: "p004",
    name: "Yoga Mat",
    sku: "SPRT-YM-004",
    category: "Sports",
    price: 29.99,
    stock: 35,
    description: "Non-slip yoga mat for all types of yoga practices.",
    isActive: true
  },
  {
    id: "p005",
    name: "Coffee Maker",
    sku: "HOME-CM-005",
    category: "Home & Garden",
    price: 89.99,
    stock: 12,
    description: "Programmable coffee maker with thermal carafe.",
    isActive: true
  },
  {
    id: "p006",
    name: "Bluetooth Speaker",
    sku: "ELEC-BS-006",
    category: "Electronics",
    price: 59.99,
    stock: 28,
    description: "Portable Bluetooth speaker with 20-hour battery life.",
    isActive: true
  },
  {
    id: "p007",
    name: "Running Shoes",
    sku: "SPRT-RS-007",
    category: "Sports",
    price: 129.99,
    stock: 15,
    description: "Lightweight running shoes with responsive cushioning.",
    isActive: true,
    isFeatured: true
  },
  {
    id: "p008",
    name: "Desk Lamp",
    sku: "HOME-DL-008",
    category: "Home & Garden",
    price: 39.99,
    stock: 23,
    description: "Adjustable desk lamp with multiple brightness levels.",
    isActive: true
  },
  {
    id: "p009",
    name: "Winter Jacket",
    sku: "CLTH-WJ-009",
    category: "Clothing",
    price: 149.99,
    stock: 8,
    description: "Warm winter jacket with water-resistant exterior.",
    isActive: true
  },
  {
    id: "p010",
    name: "Smartphone",
    sku: "ELEC-SP-010",
    category: "Electronics",
    price: 699.99,
    stock: 5,
    description: "Latest model smartphone with advanced camera system.",
    isActive: true,
    isFeatured: true
  },
  {
    id: "p011",
    name: "Blender",
    sku: "HOME-BL-011",
    category: "Home & Garden",
    price: 49.99,
    stock: 17,
    description: "High-speed blender for smoothies and food preparation.",
    isActive: true
  },
  {
    id: "p012",
    name: "Dumbbell Set",
    sku: "SPRT-DS-012",
    category: "Sports",
    price: 119.99,
    stock: 9,
    description: "Adjustable dumbbell set for home workouts.",
    isActive: true
  }
];

// Orders
export const mockOrders = [
  {
    id: "1001",
    customer: "John Doe",
    date: "2023-06-01",
    status: "Enviado / Cumplido",
    subtotal: 119.99,
    shipping: 5.99,
    tax: 10.00,
    total: 135.98,
    items: [
      {
        id: "p001",
        name: "Wireless Headphones",
        sku: "ELEC-WH-001",
        price: 79.99,
        quantity: 1
      },
      {
        id: "p004",
        name: "Yoga Mat",
        sku: "SPRT-YM-004",
        price: 29.99,
        quantity: 1
      }
    ],
    shipping_address: {
      name: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "United States",
      phone: "(123) 456-7890"
    },
    billing_address: {
      name: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "United States",
      phone: "(123) 456-7890"
    },
    notes: [
      {
        id: 1,
        text: "Customer requested gift wrapping",
        author: "Admin User",
        date: "2023-06-01"
      },
      {
        id: 2,
        text: "Package shipped via express delivery",
        author: "Admin User",
        date: "2023-06-02"
      }
    ]
  },
  {
    id: "1002",
    customer: "Jane Smith",
    date: "2023-06-02",
    status: "Aceptado",
    subtotal: 89.50,
    shipping: 0,
    tax: 7.16,
    total: 96.66,
    items: [
      {
        id: "p002",
        name: "Cotton T-Shirt",
        sku: "CLTH-TS-002",
        price: 19.99,
        quantity: 2
      },
      {
        id: "p008",
        name: "Desk Lamp",
        sku: "HOME-DL-008",
        price: 39.99,
        quantity: 1
      }
    ],
    shipping_address: {
      name: "Jane Smith",
      street: "456 Oak Ave",
      city: "Somewhere",
      state: "NY",
      zip: "67890",
      country: "United States",
      phone: "(234) 567-8901"
    },
    billing_address: {
      name: "Jane Smith",
      street: "456 Oak Ave",
      city: "Somewhere",
      state: "NY",
      zip: "67890",
      country: "United States",
      phone: "(234) 567-8901"
    },
    notes: []
  },
  {
    id: "1003",
    customer: "Bob Johnson",
    date: "2023-06-03",
    status: "Solicitud / Nuevo",
    subtotal: 229.98,
    shipping: 15.99,
    tax: 19.68,
    total: 265.65,
    items: [
      {
        id: "p003",
        name: "Smart Watch",
        sku: "ELEC-SW-003",
        price: 199.99,
        quantity: 1
      },
      {
        id: "p011",
        name: "Blender",
        sku: "HOME-BL-011",
        price: 49.99,
        quantity: 1
      }
    ],
    shipping_address: {
      name: "Bob Johnson",
      street: "789 Pine Rd",
      city: "Elsewhere",
      state: "TX",
      zip: "54321",
      country: "United States",
      phone: "(345) 678-9012"
    },
    billing_address: {
      name: "Bob Johnson",
      street: "789 Pine Rd",
      city: "Elsewhere",
      state: "TX",
      zip: "54321",
      country: "United States",
      phone: "(345) 678-9012"
    },
    notes: [
      {
        id: 1,
        text: "Customer is a first-time buyer",
        author: "Admin User",
        date: "2023-06-03"
      }
    ]
  },
  {
    id: "1004",
    customer: "Alice Brown",
    date: "2023-06-04",
    status: "Cancelado",
    subtotal: 112.30,
    shipping: 7.99,
    tax: 9.62,
    total: 129.91,
    items: [
      {
        id: "p006",
        name: "Bluetooth Speaker",
        sku: "ELEC-BS-006",
        price: 59.99,
        quantity: 1
      },
      {
        id: "p002",
        name: "Cotton T-Shirt",
        sku: "CLTH-TS-002",
        price: 19.99,
        quantity: 1
      }
    ],
    shipping_address: {
      name: "Alice Brown",
      street: "321 Elm Blvd",
      city: "Nowhere",
      state: "FL",
      zip: "13579",
      country: "United States",
      phone: "(456) 789-0123"
    },
    billing_address: {
      name: "Alice Brown",
      street: "321 Elm Blvd",
      city: "Nowhere",
      state: "FL",
      zip: "13579",
      country: "United States",
      phone: "(456) 789-0123"
    },
    notes: [
      {
        id: 1,
        text: "Customer requested cancellation due to long delivery time",
        author: "Admin User",
        date: "2023-06-04"
      }
    ]
  },
  {
    id: "1005",
    customer: "Charlie Wilson",
    date: "2023-06-05",
    status: "Facturado / Pagado",
    subtotal: 78.25,
    shipping: 5.99,
    tax: 6.74,
    total: 90.98,
    items: [
      {
        id: "p004",
        name: "Yoga Mat",
        sku: "SPRT-YM-004",
        price: 29.99,
        quantity: 1
      },
      {
        id: "p008",
        name: "Desk Lamp",
        sku: "HOME-DL-008",
        price: 39.99,
        quantity: 1
      }
    ],
    shipping_address: {
      name: "Charlie Wilson",
      street: "654 Maple St",
      city: "Anyplace",
      state: "WA",
      zip: "24680",
      country: "United States",
      phone: "(567) 890-1234"
    },
    billing_address: {
      name: "Charlie Wilson",
      street: "654 Maple St",
      city: "Anyplace",
      state: "WA",
      zip: "24680",
      country: "United States",
      phone: "(567) 890-1234"
    },
    notes: []
  },
  {
    id: "1006",
    customer: "David Miller",
    date: "2023-06-06",
    status: "Enviado / En Proceso",
    subtotal: 149.99,
    shipping: 0,
    tax: 12.00,
    total: 161.99,
    items: [
      {
        id: "p009",
        name: "Winter Jacket",
        sku: "CLTH-WJ-009",
        price: 149.99,
        quantity: 1
      }
    ],
    shipping_address: {
      name: "David Miller",
      street: "987 Cedar Ln",
      city: "Somewhere Else",
      state: "IL",
      zip: "97531",
      country: "United States",
      phone: "(678) 901-2345"
    },
    billing_address: {
      name: "David Miller",
      street: "987 Cedar Ln",
      city: "Somewhere Else",
      state: "IL",
      zip: "97531",
      country: "United States",
      phone: "(678) 901-2345"
    },
    notes: []
  },
  {
    id: "1007",
    customer: "Eva Garcia",
    date: "2023-06-07",
    status: "Recibido / Conforme",
    subtotal: 119.99,
    shipping: 9.99,
    tax: 10.40,
    total: 140.38,
    items: [
      {
        id: "p012",
        name: "Dumbbell Set",
        sku: "SPRT-DS-012",
        price: 119.99,
        quantity: 1
      }
    ],
    shipping_address: {
      name: "Eva Garcia",
      street: "246 Birch Dr",
      city: "Another City",
      state: "OH",
      zip: "86420",
      country: "United States",
      phone: "(789) 012-3456"
    },
    billing_address: {
      name: "Eva Garcia",
      street: "246 Birch Dr",
      city: "Another City",
      state: "OH",
      zip: "86420",
      country: "United States",
      phone: "(789) 012-3456"
    },
    notes: [
      {
        id: 1,
        text: "Customer confirmed receipt and is satisfied with the product",
        author: "Admin User",
        date: "2023-06-10"
      }
    ]
  },
  {
    id: "1008",
    customer: "Frank Taylor",
    date: "2023-06-08",
    status: "Cerrado",
    subtotal: 699.99,
    shipping: 0,
    tax: 56.00,
    total: 755.99,
    items: [
      {
        id: "p010",
        name: "Smartphone",
        sku: "ELEC-SP-010",
        price: 699.99,
        quantity: 1
      }
    ],
    shipping_address: {
      name: "Frank Taylor",
      street: "135 Walnut Ave",
      city: "Last City",
      state: "MI",
      zip: "75319",
      country: "United States",
      phone: "(890) 123-4567"
    },
    billing_address: {
      name: "Frank Taylor",
      street: "135 Walnut Ave",
      city: "Last City",
      state: "MI",
      zip: "75319",
      country: "United States",
      phone: "(890) 123-4567"
    },
    notes: [
      {
        id: 1,
        text: "Order completed and archived",
        author: "Admin User",
        date: "2023-06-15"
      }
    ]
  }
];
