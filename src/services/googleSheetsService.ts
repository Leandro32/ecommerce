interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  images: string[];
  inStock: boolean;
  featured: boolean;
  categories: string[];
  tags: string[];
  sku?: string;
}

// Import mock data
import {
  MOCK_PRODUCTS,
  getMockFeaturedProducts,
  getMockNewArrivals,
  getMockBestSellers,
  getMockProductById,
  getMockProductsByCategory,
  searchMockProducts,
} from "../data/mockProducts";

interface GoogleSheetsResponse {
  values?: string[][];
}

// Configuration
const GOOGLE_SHEETS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
  spreadsheetId: import.meta.env.VITE_GOOGLE_SHEETS_ID,
  range: import.meta.env.VITE_GOOGLE_SHEETS_RANGE || "Sheet1!A:Z",
  baseUrl: "https://sheets.googleapis.com/v4/spreadsheets",
};

// Check if we should use mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cachedProducts: Product[] | null = null;
let cacheTimestamp: number = 0;

// Utility functions
const parseNumber = (value: string): number => {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const parseBoolean = (
  value: string,
  defaultValue: boolean = false,
): boolean => {
  if (!value) return defaultValue;
  const lower = value.toLowerCase().trim();
  return lower === "true" || lower === "1" || lower === "yes" || lower === "on";
};

const parseArray = (value: string): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const normalizeHeader = (header: string): string => {
  return header
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/gi, "");
};

const mapRowToProduct = (
  headers: string[],
  row: string[],
  rowIndex: number,
): Product => {
  const product: Partial<Product> = {
    id: rowIndex.toString(),
  };

  headers.forEach((header, index) => {
    const key = normalizeHeader(header);
    const value = row[index] || "";

    switch (key) {
      case "name":
      case "title":
      case "productname":
        product.name = value;
        break;
      case "description":
      case "desc":
        product.description = value;
        break;
      case "price":
        product.price = parseNumber(value);
        break;
      case "saleprice":
      case "discountprice":
        if (value) product.salePrice = parseNumber(value);
        break;
      case "originalprice":
      case "regularprice":
        if (value) product.originalPrice = parseNumber(value);
        break;
      case "images":
      case "image":
      case "imageurl":
        product.images = parseArray(value);
        break;
      case "instock":
      case "available":
      case "stock":
        product.inStock = parseBoolean(value, true);
        break;
      case "featured":
        product.featured = parseBoolean(value, false);
        break;
      case "categories":
      case "category":
        product.categories = parseArray(value);
        break;
      case "tags":
      case "tag":
        product.tags = parseArray(value);
        break;
      case "sku":
        product.sku = value;
        break;
    }
  });

  // Return with required defaults
  return {
    id: product.id || rowIndex.toString(),
    name: product.name || `Product ${rowIndex}`,
    description: product.description || "",
    price: product.price || 0,
    salePrice: product.salePrice,
    originalPrice: product.originalPrice,
    images: product.images || [],
    inStock: product.inStock !== undefined ? product.inStock : true,
    featured: product.featured || false,
    categories: product.categories || [],
    tags: product.tags || [],
    sku: product.sku,
  };
};

const validateConfig = (): void => {
  if (!GOOGLE_SHEETS_CONFIG.apiKey) {
    throw new Error(
      "Google Sheets API key is required. Please set VITE_GOOGLE_SHEETS_API_KEY in your environment variables.",
    );
  }
  if (!GOOGLE_SHEETS_CONFIG.spreadsheetId) {
    throw new Error(
      "Google Sheets ID is required. Please set VITE_GOOGLE_SHEETS_ID in your environment variables.",
    );
  }
};

const fetchSheetData = async (): Promise<string[][]> => {
  validateConfig();

  const url = `${GOOGLE_SHEETS_CONFIG.baseUrl}/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/values/${GOOGLE_SHEETS_CONFIG.range}?key=${GOOGLE_SHEETS_CONFIG.apiKey}`;

  console.log("Fetching data from Google Sheets...");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google Sheets API error: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    const data: GoogleSheetsResponse = await response.json();
    return data.values || [];
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    throw error;
  }
};

const transformRowsToProducts = (rows: string[][]): Product[] => {
  if (rows.length === 0) {
    console.log("No data found in Google Sheet");
    return [];
  }

  const [headers, ...dataRows] = rows;

  if (!headers || headers.length === 0) {
    console.warn("No headers found in Google Sheet");
    return [];
  }

  return dataRows
    .map((row, index) => mapRowToProduct(headers, row, index + 1))
    .filter(
      (product) => product.name && product.name !== `Product ${product.id}`,
    ); // Only include products with real names
};

const isCacheValid = (): boolean => {
  return (
    cachedProducts !== null && Date.now() - cacheTimestamp < CACHE_DURATION
  );
};

// Main service functions
export const getProducts = async (
  useCache: boolean = true,
): Promise<Product[]> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log("Using mock data for products");
    return MOCK_PRODUCTS;
  }

  try {
    // Return cached data if valid and caching is enabled
    if (useCache && isCacheValid()) {
      console.log("Returning cached products");
      return cachedProducts!;
    }

    // Fetch fresh data
    const rows = await fetchSheetData();
    const products = transformRowsToProducts(rows);

    // Update cache
    cachedProducts = products;
    cacheTimestamp = Date.now();

    console.log(
      `Successfully fetched ${products.length} products from Google Sheets`,
    );
    return products;
  } catch (error) {
    console.error("Error in getProducts:", error);

    // Return cached data as fallback if available
    if (cachedProducts !== null) {
      console.log("Returning cached products as fallback");
      return cachedProducts;
    }

    // Fallback to mock data if Google Sheets fails
    console.log("Falling back to mock data due to error");
    return MOCK_PRODUCTS;
  }
};

export const getProduct = async (id: string): Promise<Product | null> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log("Using mock data for single product");
    return getMockProductById(id);
  }

  try {
    const products = await getProducts();
    return products.find((product) => product.id === id) || null;
  } catch (error) {
    console.error("Error in getProduct:", error);
    // Fallback to mock data
    return getMockProductById(id);
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log("Using mock data for featured products");
    return getMockFeaturedProducts();
  }

  try {
    const products = await getProducts();
    return products.filter((product) => product.featured);
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    // Fallback to mock data
    return getMockFeaturedProducts();
  }
};

export const getProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log("Using mock data for products by category");
    return getMockProductsByCategory(category);
  }

  try {
    const products = await getProducts();
    return products.filter((product) =>
      product.categories.some((cat) =>
        cat.toLowerCase().includes(category.toLowerCase()),
      ),
    );
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    // Fallback to mock data
    return getMockProductsByCategory(category);
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log("Using mock data for product search");
    return searchMockProducts(query);
  }

  try {
    const products = await getProducts();
    const searchTerm = query.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.categories.some((cat) =>
          cat.toLowerCase().includes(searchTerm),
        ) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    );
  } catch (error) {
    console.error("Error in searchProducts:", error);
    // Fallback to mock data
    return searchMockProducts(query);
  }
};

// Cache management
export const clearCache = (): void => {
  cachedProducts = null;
  cacheTimestamp = 0;
  console.log("Product cache cleared");
};

export const getCacheInfo = () => {
  return {
    hasCachedData: cachedProducts !== null,
    cacheAge: cachedProducts ? Date.now() - cacheTimestamp : 0,
    isValid: isCacheValid(),
    productsCount: cachedProducts?.length || 0,
    usingMockData: USE_MOCK_DATA,
  };
};

// Export types
export type { Product };
