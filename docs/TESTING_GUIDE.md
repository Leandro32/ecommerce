# Google Sheets Integration - Testing Guide

## 🚀 Quick Start Testing

Your ecommerce app is now ready to test with both mock data and Google Sheets integration!

### Immediate Testing (Mock Data)

1. **Start the development server**:
   ```bash
   yarn dev
   ```

2. **View the app**: Open http://localhost:8000

3. **Check the status**: Look for the data source indicator in the bottom-right corner

The app will automatically use mock data for testing since `VITE_USE_MOCK_DATA=true` is set in your `.env` file.

## 🔄 Switching Between Mock Data and Google Sheets

### Option 1: Use Mock Data (Default - Recommended for Testing)
```env
VITE_USE_MOCK_DATA=true
```

### Option 2: Use Google Sheets (After Setup)
```env
VITE_USE_MOCK_DATA=false
VITE_GOOGLE_SHEETS_API_KEY=your_actual_api_key
VITE_GOOGLE_SHEETS_ID=your_actual_sheet_id
```

## 📊 Test Data Available

### Mock Products Include:
- **iPhone 15 Pro** - Featured, On Sale ($899, was $999)
- **MacBook Pro 16"** - Featured ($2,499)
- **AirPods Pro 2** - Featured, On Sale ($199, was $249)
- **Samsung Galaxy S24 Ultra** - New Arrival, On Sale ($999, was $1,199)
- **Sony WH-1000XM5** - Featured ($399)
- **Nike Air Max 270** - On Sale ($120, was $150)
- **Canon EOS R6 Mark II** - Featured, New ($2,499)
- **iPad Air 5th Gen** - On Sale ($549, was $599)
- **Microsoft Surface Pro 9** - Featured, New, On Sale ($999, was $1,199)
- **Adidas Ultraboost 22** - Out of Stock ($190)
- **Levi's 501 Jeans** - On Sale ($79, was $98)
- **Tesla Model Y Accessories** - New ($299)

### Categories Available:
- Electronics
- Fashion
- Automotive
- Smartphones
- Computers
- Audio
- Cameras
- Tablets

### Brands Available:
- Apple
- Samsung
- Sony
- Nike
- Canon
- Microsoft
- Adidas
- Levi's
- Tesla

## 🧪 Testing Scenarios

### 1. Home Page Testing
- ✅ **Featured Products Section**: Should show products marked as featured
- ✅ **New Arrivals Section**: Should show products marked as new
- ✅ **Best Sellers Section**: Should show products sorted by rating

### 2. Product List Page Testing
Visit `/products` or `/products/electronics` to test:
- ✅ **All Products**: Shows all available products
- ✅ **Category Filtering**: Filter by categories like "Electronics", "Fashion"
- ✅ **Brand Filtering**: Filter by brands like "Apple", "Samsung"
- ✅ **Price Range Filtering**: Use slider to filter by price
- ✅ **Sorting**: Sort by price (low to high, high to low), rating, newest
- ✅ **Pagination**: Navigate through pages if many products
- ✅ **Search**: Search for products by name, description, or tags

### 3. Product Features Testing
- ✅ **Product Cards**: Display images, prices, discounts, stock status
- ✅ **Sale Badges**: Show discount percentages
- ✅ **Featured Badges**: Mark featured products
- ✅ **Stock Status**: Show "In Stock", "Low Stock", or "Out of Stock"
- ✅ **Add to Cart**: Click add to cart button (requires cart functionality)

### 4. Responsive Design Testing
- ✅ **Mobile View**: Test on mobile devices or browser dev tools
- ✅ **Tablet View**: Test intermediate screen sizes
- ✅ **Desktop View**: Test on full desktop screens
- ✅ **Filter Drawer**: Mobile filter drawer functionality

## 🔍 Development Status Indicator

In development mode, you'll see a status indicator in the bottom-right corner:

### Mock Data Mode:
- **Orange Badge**: "Mock Data"
- **Click to Expand**: Shows development information

### Google Sheets Mode:
- **Green Badge**: "Live Data"
- **Cache Information**: Shows cache status, product count, and age
- **Connection Status**: Indicates if Google Sheets is connected

## 🛠️ Testing Different Scenarios

### Test Loading States
```javascript
// Simulate slow network in browser dev tools
// Network tab → Throttling → Slow 3G
```

### Test Error States
```env
# Set invalid API key to test error handling
VITE_GOOGLE_SHEETS_API_KEY=invalid_key
VITE_USE_MOCK_DATA=false
```

### Test Empty States
```javascript
// Modify mock data to return empty array
// Edit src/data/mockProducts.ts
export const MOCK_PRODUCTS: Product[] = [];
```

## 🎯 Key Features to Test

### ✅ Product Display
- [ ] Products load and display correctly
- [ ] Images load with fallback for broken URLs
- [ ] Prices display correctly with currency formatting
- [ ] Discount calculations are accurate
- [ ] Stock status is shown correctly

### ✅ Filtering & Search
- [ ] Category filters work
- [ ] Brand filters work
- [ ] Price range slider works
- [ ] Search finds relevant products
- [ ] Filters can be cleared
- [ ] Multiple filters work together

### ✅ Sorting
- [ ] Sort by price (ascending/descending)
- [ ] Sort by rating (highest first)
- [ ] Sort by newest (featured/new items first)

### ✅ Pagination
- [ ] Pagination shows correct total pages
- [ ] Navigation between pages works
- [ ] Products per page limit works
- [ ] Page numbers update correctly

### ✅ Performance
- [ ] Initial load is fast
- [ ] Filtering is responsive
- [ ] Images load progressively
- [ ] Cache reduces repeated API calls

## 🐛 Common Issues & Solutions

### Issue: Products not loading
**Solution**: Check the development status indicator
- If using mock data: Check console for JavaScript errors
- If using Google Sheets: Verify API key and sheet ID

### Issue: Images not displaying
**Solution**: 
- Mock data uses Unsplash images (requires internet)
- Add placeholder images in public folder
- Check browser console for image loading errors

### Issue: Filters not working
**Solution**:
- Check if products have the required fields (categories, tags, etc.)
- Verify filter logic in ProductFilters component

### Issue: Search not finding products
**Solution**:
- Ensure search terms match product names, descriptions, or tags
- Check case sensitivity handling in search function

## 🔄 Switching to Google Sheets

When ready to test with real Google Sheets data:

1. **Set up Google Sheets API** (see GOOGLE_SHEETS_SETUP.md)
2. **Create your product sheet** with the required columns
3. **Update .env file**:
   ```env
   VITE_USE_MOCK_DATA=false
   VITE_GOOGLE_SHEETS_API_KEY=your_real_api_key
   VITE_GOOGLE_SHEETS_ID=your_real_sheet_id
   ```
4. **Restart development server**:
   ```bash
   yarn dev
   ```

## 📱 Mobile Testing Checklist

- [ ] Product cards stack properly on mobile
- [ ] Filter drawer opens and closes correctly
- [ ] Touch interactions work smoothly
- [ ] Text is readable at mobile sizes
- [ ] Images scale appropriately
- [ ] Navigation is thumb-friendly

## 🚀 Production Testing

Before deploying:

1. **Build the app**:
   ```bash
   yarn build
   ```

2. **Preview the build**:
   ```bash
   yarn preview
   ```

3. **Test in production mode**:
   - Verify all features work
   - Check console for errors
   - Test on different devices
   - Verify Google Sheets connection (if using)

## 📈 Performance Testing

### Test with Large Dataset
- Add more products to mock data
- Test pagination with 100+ products
- Verify search performance
- Check memory usage in browser dev tools

### Test Network Conditions
- Test on slow network (3G simulation)
- Test offline behavior
- Verify cache fallback works

---

## 🎉 Ready to Test!

Your ecommerce application is now fully integrated with Google Sheets and ready for testing. The mock data provides a complete testing environment while you set up your Google Sheets integration.

**Happy Testing!** 🛍️

For detailed setup instructions, see `GOOGLE_SHEETS_SETUP.md`
For integration details, see `INTEGRATION_COMPLETE.md`
