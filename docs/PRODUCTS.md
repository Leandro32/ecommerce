# Product Data Model - Perfume Store

## 1. Overview

This document outlines the new, detailed data model for products in our perfume e-commerce platform. The previous generic product model has been replaced with a specialized structure designed to capture the unique attributes of perfumes. This change enables a richer user experience, better filtering, and improved SEO.

**Key Changes:**
-   **Specialized Fields:** Added perfume-specific attributes like `brand`, `sex`, `bottleSize`, and `fragranceNotes`.
-   **Relational Models:** Introduced separate models for `FragranceNotes` and `Review` to create a more organized and scalable structure.
-   **Pricing and SEO:** Enhanced fields for `discountPrice`, `isDiscounted`, and dedicated SEO metadata.

---

## 2. Core Data Models

The new structure is composed of three main models: `Product`, `FragranceNotes`, and `Review`.

### 2.1. `Product` Model

This is the central model containing the core information for each perfume.

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | `String` | Unique identifier (CUID). | `clx...` |
| `name` | `String` | The commercial name of the perfume. | `"Chanel No. 5"` |
| `slug` | `String` | A unique, URL-friendly version of the name. | `"chanel-no-5"` |
| `brand` | `String` | The brand or house that produces the perfume. | `"Chanel"` |
| `sex` | `Enum (WOMAN, MAN, UNISEX)` | The target gender for the fragrance. | `WOMAN` |
| `description` | `String` | A detailed product description. Can contain HTML or Markdown for rich formatting. | `"Classic floral fragrance..."` |
| `price` | `Float` | The standard retail price. | `120.00` |
| `discountPrice` | `Float?` | The promotional or sale price (optional). | `90.00` |
| `isDiscounted` | `Boolean` | A flag to indicate if the perfume is currently on sale. | `true` |
| `stock` | `Int` | The current inventory level. | `50` |
| `bottleSize` | `Int` | The volume of the perfume bottle in milliliters (ml). | `100` |
| `bottleType` | `String` | The type of bottle (e.g., "Standard", "Refillable", "Travel Spray"). | `"Standard"` |
| `packaging` | `String` | The type of packaging (e.g., "Boxed", "Unboxed", "Tester"). | `"Boxed"` |
| `averageRating` | `Float?` | The calculated average rating from customer reviews (optional). | `4.7` |
| `shippingWeight` | `Float?` | The weight of the product in kilograms (kg) for shipping calculations (optional). | `0.5` |
| `seoTitle` | `String?` | A custom title for search engine results pages (optional). | `"Chanel No. 5 Eau de Parfum..."` |
| `seoDescription` | `String?` | A custom description for search engine snippets (optional). | `"Discover Chanel No. 5..."` |
| `imageUrls` | `String[]` | An array of URLs for the product images. | `["url1.jpg", "url2.jpg"]` |
| `createdAt` | `DateTime` | Timestamp of when the product was created. | | |
| `updatedAt` | `DateTime` | Timestamp of the last update. | | |

### 2.2. `FragranceNotes` Model

This model is linked one-to-one with the `Product` model and describes the perfume's scent profile.

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | `String` | Unique identifier (CUID). | | |
| `topNotes` | `String` | The initial scents perceived when the perfume is applied. | `"Aldehydes, Neroli..."` |
| `middleNotes` | `String` | The "heart" of the fragrance, which emerges after the top notes fade. | `"Rose, Jasmine..."` |
| `baseNotes` | `String` | The foundation of the fragrance, which provides depth and longevity. | `"Sandalwood, Vanilla..."` |
| `productId` | `String` | A foreign key linking to the `Product`. | | |

### 2.3. `Review` Model

This model is linked one-to-many with the `Product` model, allowing a product to have multiple customer reviews.

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | `String` | Unique identifier (CUID). | | |
| `rating` | `Int` | The star rating given by the customer (e.g., 1 to 5). | `5` |
| `reviewText` | `String` | The customer's written feedback. | `"A timeless fragrance..."` |
| `customerName` | `String` | The name of the customer who left the review. | `"John Doe"` |
| `productId` | `String` | A foreign key linking to the `Product`. | | |
| `createdAt` | `DateTime` | Timestamp of when the review was submitted. | | |

---

## 3. Prisma Schema Definition

Here is the complete Prisma schema that defines the models and their relationships.

```prisma
// file: prisma/schema.prisma

enum Sex {
  WOMAN
  MAN
  UNISEX
}

model Product {
  id              String      @id @default(cuid())
  name            String
  slug            String      @unique
  brand           String
  sex             Sex
  description     String
  price           Float
  discountPrice   Float?
  isDiscounted    Boolean     @default(false)
  stock           Int
  bottleSize      Int // in ml
  bottleType      String
  packaging       String
  averageRating   Float?
  shippingWeight  Float? // in kg
  seoTitle        String?
  seoDescription  String?
  imageUrls       String[]
  fragranceNotes  FragranceNotes?
  reviews         Review[]
  orderItems      OrderItem[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model FragranceNotes {
  id          String  @id @default(cuid())
  topNotes    String
  middleNotes String
  baseNotes   String
  product     Product @relation(fields: [productId], references: [id])
  productId   String  @unique
}

model Review {
  id            String   @id @default(cuid())
  rating        Int
  reviewText    String
  customerName  String
  product       Product  @relation(fields: [productId], references: [id])
  productId     String
  createdAt     DateTime @default(now())
}

// Note: The Order and OrderItem models remain but are not detailed here.
```

---

## 4. Example JSON Data Structure

Here is a complete example of a single product object, including its related `FragranceNotes` and `reviews`.

```json
{
  "id": "clx123abc",
  "name": "Chanel No. 5",
  "slug": "chanel-no-5",
  "brand": "Chanel",
  "sex": "WOMAN",
  "description": "<p>A timeless and iconic fragrance, Chanel No. 5 is the essence of femininity. A powdery floral bouquet housed in an iconic bottle with a minimalist design.</p>",
  "price": 120.00,
  "discountPrice": 90.00,
  "isDiscounted": true,
  "stock": 50,
  "bottleSize": 100,
  "bottleType": "Standard",
  "packaging": "Boxed",
  "averageRating": 4.7,
  "shippingWeight": 0.5,
  "seoTitle": "Chanel No. 5 Eau de Parfum 100ml - Luxury Perfume",
  "seoDescription": "Discover Chanel No. 5, the timeless luxury fragrance in a 100ml bottle.",
  "imageUrls": [
    "https://example.com/images/chanel-no5-1.jpg",
    "https://example.com/images/chanel-no5-2.jpg"
  ],
  "createdAt": "2025-10-10T10:00:00.000Z",
  "updatedAt": "2025-10-10T10:00:00.000Z",
  "fragranceNotes": {
    "topNotes": "Aldehydes, Ylang-Ylang, Neroli, Bergamot, Lemon",
    "middleNotes": "Iris, Jasmine, Rose, Orris Root, Lily-of-the-Valley",
    "baseNotes": "Civet, Amber, Sandalwood, Musk, Vetiver, Oakmoss, Patchouli"
  },
  "reviews": [
    {
      "id": "rev_abc456",
      "rating": 5,
      "reviewText": "A timeless fragrance that lasts all day. Worth every penny!",
      "customerName": "Jane Doe",
      "createdAt": "2025-09-15T14:30:00.000Z"
    },
    {
      "id": "rev_def789",
      "rating": 4,
      "reviewText": "It's a classic for a reason, but a bit strong for my taste.",
      "customerName": "John Smith",
      "createdAt": "2025-09-20T11:00:00.000Z"
    }
  ]
}
```
