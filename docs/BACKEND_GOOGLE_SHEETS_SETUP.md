# Google Sheets Integration Setup

This guide will help you set up Google Sheets as a database for your ecommerce products.

## Step 1: Create Google Cloud Project and Enable API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `ecommerce-sheets-service`
   - Description: `Service account for reading product data from Google Sheets`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Generate and Download Credentials

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Select "JSON" and click "Create"
5. Save the downloaded JSON file as `google-sheets-credentials.json` in your `ecom-backend/config/` folder

## Step 4: Set up Google Sheet

1. Create a new Google Sheet or use an existing one
2. Set up your product data with headers in the first row. Example structure:

| Name | Description | Price | Sale Price | Original Price | Images | In Stock | Featured | Categories | Tags | SKU |
|------|-------------|-------|------------|----------------|---------|----------|----------|------------|------|-----|
| iPhone 15 | Latest iPhone model | 999 | 899 | 999 | https://example.com/iphone.jpg | TRUE | TRUE | Electronics,Phones | smartphone,apple | IP15-001 |
| MacBook Pro | Professional laptop | 2499 | | 2499 | https://example.com/macbook.jpg,https://example.com/macbook2.jpg | TRUE | FALSE | Electronics,Computers | laptop,apple,pro | MBP-001 |

### Column Guidelines:

- **Name**: Product name (required)
- **Description**: Product description
- **Price**: Current selling price (number)
- **Sale Price**: Discounted price (number, optional)
- **Original Price**: Original price before discount (number)
- **Images**: Comma-separated image URLs
- **In Stock**: TRUE/FALSE or 1/0
- **Featured**: TRUE/FALSE or 1/0 for featured products
- **Categories**: Comma-separated categories
- **Tags**: Comma-separated tags
- **SKU**: Stock Keeping Unit

3. Share the sheet with your service account:
   - Click "Share" button
   - Add the service account email (found in your JSON credentials file)
   - Give "Viewer" permissions

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Update the Google Sheets configuration:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
GOOGLE_SHEETS_RANGE=Sheet1!A:Z
GOOGLE_SHEETS_CREDENTIALS_PATH=./config/google-sheets-credentials.json
```

To find your Google Sheets ID:
- Open your Google Sheet
- Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
- Copy the SHEET_ID part

## Step 6: Install Dependencies

```bash
cd ecom-backend
npm install googleapis
```

## Step 7: Test the Integration

1. Start your Strapi backend:
```bash
npm run develop
```

2. Test the API endpoint:
```bash
curl http://localhost:1337/api/products
```

## API Endpoints

Once set up, you'll have access to these endpoints:

- `GET /api/products` - Get all products from Google Sheets
- `GET /api/products/:id` - Get a specific product by ID

## Frontend Integration

In your React app, you can fetch products like this:

```typescript
// services/productService.ts
const API_BASE_URL = 'http://localhost:1337/api';

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const getProduct = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};
```

## Troubleshooting

### Common Issues:

1. **403 Forbidden Error**: Make sure you've shared the Google Sheet with your service account email
2. **Credentials Not Found**: Ensure the JSON file path is correct in your .env file
3. **Sheet Not Found**: Verify the GOOGLE_SHEETS_ID in your .env file
4. **Range Error**: Check your GOOGLE_SHEETS_RANGE format (e.g., 'Sheet1!A:Z')

### Performance Considerations:

- The service includes optional caching to avoid hitting Google API limits
- Consider implementing webhook updates if your sheet changes frequently
- Monitor your Google Sheets API usage in the Cloud Console

## Security Notes:

- Never commit your `google-sheets-credentials.json` file to version control
- Keep your service account credentials secure
- Only grant necessary permissions to your service account
- Consider using environment variables for sensitive data in production

## Sample Google Sheet Template

You can use this template structure for your products:

```
Name                | Description                      | Price | Sale Price | Images                                    | In Stock | Featured | Categories        | Tags
iPhone 15           | Latest iPhone with advanced AI   | 999   | 899        | https://example.com/iphone15.jpg         | TRUE     | TRUE     | Electronics       | smartphone,apple,5g
MacBook Pro 16"     | Professional laptop for creators | 2499  |            | https://example.com/macbook.jpg          | TRUE     | FALSE    | Electronics       | laptop,apple,pro
AirPods Pro         | Noise-canceling wireless earbuds| 249   | 199        | https://example.com/airpods.jpg          | TRUE     | TRUE     | Electronics,Audio | headphones,wireless
```

## Next Steps

After setting up the Google Sheets integration:

1. Create your product sheet with the structure above
2. Add your service account credentials
3. Update your environment variables
4. Install the googleapis package
5. Test the endpoints
6. Integrate with your React frontend

The system will automatically handle data type conversions and provide a clean REST API interface for your ecommerce application.