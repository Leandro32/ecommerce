# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets as a database for your ecommerce React application.

## Overview

This setup integrates Google Sheets directly with your React frontend using the Google Sheets API. This approach is:
- **Simple**: No backend server required
- **Secure**: Uses API keys instead of service account files
- **Fast**: Includes caching to minimize API calls
- **Flexible**: Easy to modify and extend

## Step 1: Create Google Cloud Project and Enable API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
   - Click "Select a project" → "New Project"
   - Enter project name: `ecommerce-sheets-integration`
   - Click "Create"

3. Enable the Google Sheets API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. **IMPORTANT**: Restrict the API key for security:
   - Click on the API key you just created
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Sheets API"
   - Under "Website restrictions", add your domain(s):
     - `localhost:8000` (for development)
     - Your production domain
   - Click "Save"

## Step 3: Create Your Google Sheet

1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com)
2. Set up your product data with headers in the first row:

### Recommended Column Structure:

| Column | Header | Description | Example |
|--------|--------|-------------|---------|
| A | Name | Product name (required) | iPhone 15 Pro |
| B | Description | Product description | Latest iPhone with titanium design |
| C | Price | Current selling price | 999.99 |
| D | Sale Price | Discounted price (optional) | 899.99 |
| E | Original Price | Original price before discount | 1099.99 |
| F | Images | Comma-separated image URLs | https://example.com/img1.jpg,https://example.com/img2.jpg |
| G | In Stock | TRUE/FALSE or 1/0 | TRUE |
| H | Featured | TRUE/FALSE or 1/0 | TRUE |
| I | Categories | Comma-separated categories | Electronics,Smartphones |
| J | Tags | Comma-separated tags | apple,5g,premium |
| K | SKU | Stock keeping unit | IP15P-128-TIT |

### Sample Data:

```
Name                | Description                      | Price | Sale Price | Images                                    | In Stock | Featured | Categories        | Tags                    | SKU
iPhone 15 Pro       | Latest iPhone with titanium      | 999   | 899        | https://example.com/iphone15.jpg         | TRUE     | TRUE     | Electronics       | smartphone,apple,5g     | IP15P-001
MacBook Pro 16"     | Professional laptop for creators | 2499  |            | https://example.com/macbook.jpg          | TRUE     | FALSE    | Electronics       | laptop,apple,pro        | MBP16-001
AirPods Pro 2       | Noise-canceling wireless earbuds| 249   | 199        | https://example.com/airpods.jpg          | TRUE     | TRUE     | Electronics,Audio | headphones,wireless     | APP2-001
```

3. **Make the sheet public** (required for API access):
   - Click "Share" button
   - Click "Change to anyone with the link"
   - Set permission to "Viewer"
   - Click "Copy link" (you'll need the sheet ID from this)

## Step 4: Get Your Sheet ID

From the shareable link, extract the sheet ID:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdB_SHEET_ID_HERE_jgmUUqptlbs74OgvE2upms/edit
```
The part between `/d/` and `/edit` is your sheet ID.

## Step 5: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`):

```env
# Google Sheets Configuration
VITE_GOOGLE_SHEETS_API_KEY=your_actual_api_key_here
VITE_GOOGLE_SHEETS_ID=your_actual_sheet_id_here
VITE_GOOGLE_SHEETS_RANGE=Sheet1!A:Z

# Application Configuration
VITE_APP_NAME=Your Store Name
VITE_APP_VERSION=1.0.0
```

2. **IMPORTANT**: Add `.env` to your `.gitignore` file to keep your API key secure:

```gitignore
# Environment variables
.env
.env.local
.env.development
.env.production
```

## Step 6: Test the Integration

1. Start your development server:
```bash
yarn dev
```

2. The application will automatically fetch products from your Google Sheet.

## Step 7: Usage in Components

### Basic Product List

```tsx
import { useProducts } from '../hooks/useProducts';

function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Single Product

```tsx
import { useProduct } from '../hooks/useProducts';

function ProductDetail({ productId }: { productId: string }) {
  const { product, loading, error } = useProduct(productId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      {product.salePrice && <p>Sale: ${product.salePrice}</p>}
    </div>
  );
}
```

### Featured Products

```tsx
import { useFeaturedProducts } from '../hooks/useProducts';

function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts();

  if (loading) return <div>Loading featured products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Featured Products</h2>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Search Products

```tsx
import { useState } from 'react';
import { useProductSearch } from '../hooks/useProducts';

function ProductSearch() {
  const [query, setQuery] = useState('');
  const { products, loading, error, searchProducts, clearSearch } = useProductSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchProducts(query);
    } else {
      clearSearch();
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
        />
        <button type="submit">Search</button>
      </form>

      {loading && <div>Searching...</div>}
      {error && <div>Error: {error}</div>}
      
      <div>
        {products.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </div>
  );
}
```

## Available Hooks

- `useProducts()` - Get all products
- `useProduct(id)` - Get single product by ID
- `useFeaturedProducts()` - Get featured products only
- `useProductsByCategory(category)` - Get products by category
- `useProductSearch()` - Search functionality with loading states
- `useProductCache()` - Cache management utilities

## Caching

The service includes automatic caching to minimize API calls:
- **Cache Duration**: 5 minutes
- **Fallback**: Returns cached data if API fails
- **Manual Control**: Use `clearCache()` to force refresh

## Security Best Practices

1. **API Key Restrictions**: Always restrict your API key to specific APIs and domains
2. **Environment Variables**: Never commit `.env` files to version control
3. **Sheet Permissions**: Use "Viewer" permissions only for the public sheet
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: The service includes built-in caching to respect API limits

## Troubleshooting

### Common Issues:

1. **"API key not valid"**
   - Check if your API key is correct in `.env`
   - Ensure the Google Sheets API is enabled
   - Verify API key restrictions aren't too strict

2. **"Sheet not found"**
   - Verify the sheet ID in your `.env` file
   - Ensure the sheet is public (shared with "anyone with the link")

3. **"No data found"**
   - Check that your sheet has data in the specified range
   - Verify the range format (e.g., 'Sheet1!A:Z')
   - Make sure the first row contains headers

4. **CORS errors**
   - Add your domain to the API key restrictions
   - Ensure you're using the correct API endpoint

### Performance Tips:

1. **Optimize Images**: Use optimized images and consider CDN hosting
2. **Lazy Loading**: Implement lazy loading for product images
3. **Pagination**: For large product catalogs, implement client-side pagination
4. **Search Debouncing**: Add debouncing to search inputs

## Production Deployment

1. **Environment Variables**: Set production environment variables in your hosting platform
2. **API Key**: Create separate API keys for development and production
3. **Domain Restrictions**: Update API key restrictions with your production domain
4. **Monitoring**: Monitor Google Sheets API usage in the Cloud Console

## API Rate Limits

Google Sheets API has the following limits:
- **100 requests per 100 seconds per user**
- **300 requests per 60 seconds**

The built-in caching helps stay within these limits.

## Next Steps

1. Set up your Google Sheet with product data
2. Configure your API key and environment variables
3. Test the integration locally
4. Customize the product data structure as needed
5. Build your ecommerce UI components
6. Deploy to production with proper environment configuration

This setup gives you a fully functional product database using Google Sheets with a clean, type-safe React interface.