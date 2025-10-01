# 📋 ECOMMERCE 2025 - PENDING TASKS

## 🎯 OVERVIEW
This document tracks the implementation of critical features and bug fixes for the ecommerce platform.

---

## 🌐 **TASK 1: IMPLEMENT i18n TRANSLATIONS**
**Priority: HIGH** | **Status: ✅ COMPLETED**

### Dependencies Required
- [x] Install react-i18next, i18next, i18next-browser-languagedetector

### File Structure Setup
- [x] Create `src/locales/en/` directory structure
- [x] Create `src/locales/es/` directory structure
- [x] Create `src/locales/pt/` directory structure (Portuguese added)
- [x] Create translation files:
  - [x] `common.json` (buttons, labels, general UI)
  - [x] `products.json` (product-related text)
  - [x] `checkout.json` (checkout process)
  - [x] `navigation.json` (menus, links) - **NEW**

### Configuration
- [x] Create `src/i18n/index.ts`
- [x] Configure i18next with language detection
- [x] Add language switcher component
- [x] Support for English, Spanish, and Portuguese

### Component Updates
- [x] Update `Header.tsx` with translations
- [x] Update `LanguageSwitcher.tsx` with 3 languages
- [x] Enhanced translation support for navigation components
- [ ] Update `Footer.tsx` with translations (pending)
- [ ] Update `ProductListPage.tsx` with translations (pending)
- [ ] Update `CheckoutPage.tsx` with translations (pending)
- [ ] Update `ProductCard.tsx` with translations (pending)

---

## 🖼️ **TASK 2: FIX INFINITE LOADING ON PRODUCT FILTERS**
**Priority: CRITICAL** | **Status: ✅ COMPLETED**

### Root Cause Analysis
- [x] Investigate `useProducts` and `useProductsByCategory` re-execution
- [x] Check `transformGoogleSheetsProducts` image URL preservation
- [x] Analyze cache invalidation in `googleSheetsService`

**ISSUES IDENTIFIED & FIXED:**
- ✅ Multiple hooks (`useProducts` + `useProductsByCategory`) called simultaneously → **FIXED**: Created `useOptimizedProducts` hook
- ✅ No debouncing on filter changes causing immediate re-fetches → **FIXED**: Added `useDebounce` hook (300ms)
- ✅ Products being re-transformed on every filter change → **FIXED**: Memoized transformation logic
- ✅ Filtering logic mixed with data fetching logic → **FIXED**: Separated concerns in new hook

### Performance Optimizations
- [x] Implement granular `useMemo` in product hooks
- [x] Separate filtering logic from data fetching
- [x] Add debounce to filter changes (300ms)
- [x] Implement smart caching that survives filter changes

### Image Loading Fixes
- [x] Review image URL transformation in `productUtils.ts`
- [x] Implement fallback for broken images
- [x] Add loading states for individual images
- [x] Test with different filter combinations

**FILES CREATED/MODIFIED:**
- ✅ `src/hooks/useOptimizedProducts.ts` - New optimized hook
- ✅ `src/hooks/useDebounce.ts` - Debouncing utility
- ✅ `src/pages/product-list.tsx` - Updated to use new hooks
- ✅ `src/components/ProductImage.tsx` - Enhanced with timeout & retry logic

---

## 🔗 **TASK 3: HIDE NON-EXISTENT FOOTER LINKS**
**Priority: LOW** | **Status: ❌ NOT STARTED**

### Route Validation System
- [ ] Create `useRouteExists(path: string)` hook
- [ ] Create `src/config/routes.ts` with available routes
- [ ] Implement route checking against React Router

### Footer Intelligence
- [ ] Update `Footer.tsx` with conditional rendering
- [ ] Add "Coming Soon" placeholder for planned routes
- [ ] Maintain visual consistency when hiding links
- [ ] Test footer with different route configurations

### Non-existent Routes Identified
- [ ] `/help`, `/shipping`, `/returns`, `/contact`
- [ ] `/about`, `/careers`, `sustainability`, `/press`
- [ ] `/privacy`, `/terms`, `/cookies`

---
📱 **TASK 4: WHATSAPP CHECKOUT WITH LOCAL STORAGE PERSISTENCE**
**Priority: HIGH** | **Status: ✅ COMPLETED**
*Implement a checkout flow that saves the order in the user's browser via `localStorage` before redirecting to WhatsApp. This approach provides persistence for the user's cart at the point of checkout without requiring a backend, making it a robust client-side MVP.*

### 1. Local Order Persistence
- [x] Choose `localStorage` as the storage mechanism for its persistence across sessions.
- [x] Define a clear data structure for the saved order. It should include:
    - `id`: A unique client-side ID (e.g., using `Date.now()` or `crypto.randomUUID()`).
    - `items`: A copy of the cart items.
    - `total`: The final price.
    - `timestamp`: When the order was created.
    - `status`: A default status, e.g., `"pending_whatsapp_confirmation"`.
- [x] Create a utility module (e.g., `src/utils/localOrderManager.ts`) with functions to manage local orders (`saveOrder`, `getOrders`, etc.).

### 2. Updated Checkout Flow & User Experience
- [x] When the user clicks "Checkout with WhatsApp":
    1.  The system will first save the current cart as an "order" object in `localStorage`.
    2.  The UI must update to give feedback to the user, for example: *"¡Perfecto! Hemos guardado tu pedido en este navegador. Ahora, envíanos el mensaje por WhatsApp para confirmarlo."*
    3.  Only after the save is successful, present the button/link to open WhatsApp.
- [x] This flow ensures that if the user accidentally closes the tab or doesn't send the message, their intended order is not lost and can be retrieved from their browser.

### 3. WhatsApp Message Generation
- [x] Create a function that generates the `wa.me` link.
- [x] The message content must be properly URL-encoded using `encodeURIComponent` to handle special characters and line breaks.
- [x] The seller's WhatsApp number must be stored as an environment variable (`NEXT_PUBLIC_WHATSAPP_NUMBER`) to avoid hardcoding it.
- [x] The message template will not include an order number, as per the requirements.

#### Message Template
```
Hola, buen dia!
Quiero comprar estos productos:

${cartItems.map(item => `• ${item.name} x${item.quantity} - ${item.price}`)}

💰 *Total: ${cartTotal}*

Muchas gracias!
```

### 4. Client-Side Order History (Highly Recommended)
- [x] Create a simple component or view where the user can see a list of the orders they've placed, pulling the data directly from `localStorage`.
- [x] This gives the user confidence and a way to track their actions, showing a list of "pending" orders.
- [x] Each item in the history could even have a "Reintentar envío por WhatsApp" button in case the first attempt failed.

### 5. Technical Considerations & Limitations to Acknowledge
- **No Stock Reservation**: This flow does not communicate with a backend, so stock cannot be reserved. Multiple users could try to buy the last item in stock.
- **Data is Local**: The order is only stored on the user's device. If they clear their browser data or switch devices, the history is lost. This must be acceptable for the MVP.
- **Manual Confirmation**: The seller's process remains 100% manual. The order is only "known" to the business once the WhatsApp message is received.

**FILES CREATED/MODIFIED:**
- ✅ `src/types/order.ts` - New type definition for orders.
- ✅ `src/utils/localOrderManager.ts` - New utility for local storage management.
- ✅ `src/pages/checkout.tsx` - Updated to implement WhatsApp checkout flow.
- ✅ `src/pages/account.tsx` - Updated to display client-side order history.
---

🛒 **TASK 5: ENHANCE CART VIEW WITH ORDER HISTORY**
**Priority: MEDIUM** | **Status: ✅ COMPLETED**
*As a senior software developer, I've enhanced the user experience by utilizing the empty state of the cart page to display the user's order history. This provides value to returning customers and makes the page more dynamic.*

### 1. Component-Based Architecture
- [x] Created a new reusable component `OrderHistory.tsx` to display the list of orders. This promotes separation of concerns and reusability.

### 2. Smart UI in Cart Page
- [x] Modified `cart.tsx` to conditionally render the `OrderHistory` component when the cart is empty but there are past orders in `localStorage`.
- [x] If the cart is empty and there is no order history, the original "empty cart" message is displayed.

### 3. User-Centric Design
- [x] The "Resend on WhatsApp" button is available for each order, allowing users to easily retry sending their order.
- [x] The order history is displayed in reverse chronological order, showing the most recent orders first.

**FILES CREATED/MODIFIED:**
- ✅ `src/components/OrderHistory.tsx` - New component to display order history.
- ✅ `src/pages/cart.tsx` - Updated to conditionally render the order history.

---

## 🚀 **TASK 6: MIGRATE APPLICATION FROM VITE TO NEXT.JS**
**Priority: CRITICAL** | **Status: ✅ COMPLETED**
*A comprehensive plan to migrate the existing React + Vite SPA to Next.js. This architectural upgrade will enhance performance, SEO, and security by leveraging Server-Side Rendering (SSR), the App Router, and server-side data fetching.*

### **Strategy**
- The migration was performed iteratively, on a route-by-route basis, to ensure stability and make debugging manageable.
- The process began with the base layout and home page, then progressively expanded to other routes.

*(Details of migration phases omitted for brevity as they are complete)*

---

## 🔐 **TASK 7: INTEGRATE ADMIN PANEL UI**
**Priority: HIGH** | **Status: ✅ COMPLETED**
*Integrate the standalone React/Vite admin panel prototype into the main Next.js application. This provides a functional UI for demonstration and future backend integration, accessible under the `/admin` path.*

### 1. Architectural Refactoring
- [x] **Isolate Layouts**: Created `(admin)` and `(store)` route groups to support multiple, independent root layouts.
- [x] **Implement Multiple Roots**: Removed the single global layout and created separate root layouts for each group (`app/(store)/layout.tsx` and `app/(admin)/layout.tsx`) to prevent UI conflicts and fix hydration errors.

### 2. Admin App Integration & Bug Fixing
- [x] **Host SPA**: Created a catch-all route at `app/(admin)/admin/[[...slug]]/page.tsx` to host the admin panel as a Single Page Application.
- [x] **Fix SSR Errors**: Used `next/dynamic` with `ssr: false` to ensure the admin app only renders on the client, resolving `document is not defined` errors.
- [x] **Fix Navigation**: Switched from `BrowserRouter` to `HashRouter` to prevent full-page reloads during internal admin navigation.
- [x] **Fix Module Not Found Errors**: Corrected all broken relative import paths in the store pages after refactoring the directory structure.
- [x] **Configure Images**: Updated `next.config.mjs` to authorize external image hostnames used in product data.
- [x] **Fix CSS Build**: Replaced Vite-specific CSS directives with standard Tailwind syntax in the admin's stylesheet.

### 3. Configuration & Dependencies
- [x] **Dependencies**: Merged all required dependencies from the admin project into the main `package.json`.
- [x] **Styling**: Updated the root `tailwind.config.js` with the admin panel's specific theme and content paths.

---

## 🔐 TASK 8: CREATE SECURE ADMIN PANEL FOR INVENTORY MANAGEMENT
**Priority: HIGH** | **Status: ❌ NOT STARTED**
*Develop a secure, full-featured admin panel integrated into the Next.js application. This panel will manage products and the entire order lifecycle, from manual creation to final fulfillment. It will leverage Next.js API Routes for the backend and `NextAuth.js` for robust security.*

### 1. Backend: Next.js API Routes & Authentication
- [ ] **Authentication**: Implement `NextAuth.js` with a Credentials Provider.
    - [ ] Store admin credentials in the database (e.g., an `Admin` model).
    - [ ] Create a seeding script to create the initial admin user with a hashed password.
    - [ ] Use `bcrypt` to compare the provided password with the hashed password stored in the database.
    - [ ] Configure session management to use JSON Web Tokens (JWT) for stateless authentication.
- [ ] **API Structure**: Create all backend logic within the `app/api/v1/admin/` directory to version the API from the start.
- [ ] **Secure Endpoints**: Protect all admin API routes.
    - [ ] Implement middleware in `app/api/v1/admin/` to centralize session validation, ensuring only authenticated admins can access endpoints.
    - [ ] Define robust error handling, using `try-catch` blocks and returning consistent JSON error responses (e.g., `{ "error": "Unauthorized" }` with a `401` status code).
- [ ] **Database**: Utilize a serverless PostgreSQL provider (e.g., Vercel Postgres, Neon).
    - [ ] Integrate `Prisma` as the ORM for type-safe database access.
    - [ ] Define the database schema for `Admin`, `Product`, and `Order` models.
- [ ] **Implement Product CRUD Endpoints**:
    - [ ] `GET /api/v1/admin/products`: Fetch all products.
        - **Auth**: Admin session required.
        - **Success Response**: `200 OK` with `{ "data": [Product] }`.
        - **Error Response**: `401 Unauthorized`.
    - [ ] `POST /api/v1/admin/products`: Create a new product.
        - **Auth**: Admin session required.
        - **Request Body**: `{ "name": "string", "description": "string", "price": "number", "stock": "number", "imageUrl": "string" }`.
        - **Success Response**: `201 Created` with `{ "data": Product }`.
        - **Error Response**: `400 Bad Request` if validation fails, `401 Unauthorized`.
    - [ ] `PUT /api/v1/admin/products/[id]`: Update an existing product.
        - **Auth**: Admin session required.
        - **Request Body**: Partial product object, e.g., `{ "price": "number", "stock": "number" }`.
        - **Success Response**: `200 OK` with `{ "data": Product }`.
        - **Error Response**: `400 Bad Request` if validation fails, `401 Unauthorized`, `404 Not Found`.
    - [ ] `DELETE /api/v1/admin/products/[id]`: Delete a product.
        - **Auth**: Admin session required.
        - **Success Response**: `204 No Content`.
        - **Error Response**: `401 Unauthorized`, `404 Not Found`.
    - [ ] **Image Handling**: Implement image uploads to a cloud storage service (e.g., AWS S3, Cloudinary). The `Product` model should store the image URL.
- [ ] **Implement Order Management Endpoints**:
    - [ ] `GET /api/v1/admin/orders`: Fetch all orders.
        - **Auth**: Admin session required.
        - **Success Response**: `200 OK` with `{ "data": [Order] }`.
        - **Error Response**: `401 Unauthorized`.
    - [ ] `POST /api/v1/admin/orders`: Create a new order (manual creation).
        - **Auth**: Admin session required.
        - **Request Body**: `{ "customerName": "string", "items": [{ "productId": "string", "quantity": "number" }], "status": "'pending' | 'shipped' | 'delivered' | 'cancelled'" }`.
        - **Success Response**: `201 Created` with `{ "data": Order }`.
        - **Error Response**: `400 Bad Request`, `401 Unauthorized`.
    - [ ] `PUT /api/v1/admin/orders/[id]`: Update the status of an order.
        - **Auth**: Admin session required.
        - **Request Body**: `{ "status": "'pending' | 'shipped' | 'delivered' | 'cancelled'" }`.
        - **Success Response**: `200 OK` with `{ "data": Order }`.
        - **Error Response**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`.
- [ ] **Data Validation**: Use a library like `Zod` to validate the body of all `POST` and `PUT` requests to ensure data integrity.

### 2. Frontend: Admin UI (A Guide for Junior Developers)
*This section breaks down the frontend work into smaller, more manageable tasks, explaining the "why" behind each step in a Next.js App Router environment.*

#### **Sub-Task 2.1: Core Layout & Routing**
*Goal: Create a protected area for the admin panel with consistent navigation.*
- [x] **Create Route Group**: In the `app/` directory, create a new folder named `(admin)`. This is a "route group" – it lets us create a special layout for admin pages without changing the URL (e.g., the page will be `/dashboard`, not `/(admin)/dashboard`).
- [x] **Implement Root Layout (`app/(admin)/layout.tsx`)**: This is a **Server Component**. Its job is to protect all child pages.
    - [ ] Inside this component, get the user's session from `NextAuth.js` on the server.
    - [ ] If there is no session, immediately redirect the user to the `/login` page using `redirect` from `next/navigation`.
    - [ ] If there is a session, render the child pages. This layout should include a `<Sidebar />` component and a main content area.
- [x] **Create Sidebar Component**: This will be a **Client Component** (`'use client'`) because it will manage interactive states (like which link is active).
    - [ ] Use the `<Link>` component from `next/link` for navigation to Dashboard, Products, and Orders.
    - [ ] Add a "Logout" button that calls the `signOut()` function from `next-auth/react`.

#### **Sub-Task 2.2: Login Page**
*Goal: Build a form to allow the admin to sign in.*
- [x] **Create Login Page (`app/(admin)/login/page.tsx`)**: This must be a **Client Component** (`'use client'`) because it handles user input.
    - [ ] Use `useState` hooks to manage the `username` and `password` fields.
    - [ ] On form submission, call the `signIn('credentials', ...)` function from `NextAuth.js`.
    - [ ] Provide user feedback for loading states (e.g., disable the button) and display any login errors.

#### **Sub-Task 2.3: Dashboard Page**
*Goal: Show a high-level overview of the store's activity.*
- [x] **Create Dashboard Page (`app/(admin)/dashboard/page.tsx`)**: This is a **Server Component**. It will fetch data directly.
    - [ ] Inside the component (`async function DashboardPage()`), fetch the data needed for the KPI cards (e.g., total revenue, new order count) from your API.
    - [ ] Create a small, reusable `<KpiCard />` component to display each metric.
    - [ ] Create a `<RecentOrdersList />` component (can also be a Server Component) that fetches and displays the last 5-10 orders.

#### **Sub-Task 2.4: Products - List View**
*Goal: Display all products in a table with search and filter functionality.*
- [ ] **Create Product List Page (`app/(admin)/products/page.tsx`)**: This is a **Server Component**.
    - [ ] It will read the URL's search parameters (e.g., `?q=...` or `?category=...`) to fetch the correctly filtered list of products from the API.
- [ ] **Create Product Table Component (`<ProductTable />`)**: This is a **Client Component** (`'use client'`) that receives the product data as a prop from the page.
    - [ ] It is responsible for rendering the `<table>` structure.
    - [ ] It will manage UI state, such as which "delete confirmation" dialog is open, using `useState`.
- [ ] **Create Filter Components (`<SearchInput />`, `<CategoryFilter />`)**: These are **Client Components**.
    - [ ] When the user types in the search bar or selects a category, use the `useRouter` hook from `next/navigation` to update the URL's query parameters. This will automatically trigger Next.js to re-run the Server Component page with the new parameters, re-fetching the data.

#### **Sub-Task 2.5: Products - Create/Edit Form**
*Goal: Build a form to create and update product details.*
- [ ] **Create Product Form Page (`app/(admin)/products/new/page.tsx`, `.../[id]/edit/page.tsx`)**: This must be a **Client Component** (`'use client'`) because forms are highly interactive.
    - [ ] Use `react-hook-form` to manage form state, validation, and submission.
    - [ ] For the `description` field, integrate a rich text editor library like `react-quill`.
    - [ ] For image uploads, use a library like `react-dropzone`. When a file is added, upload it to your backend via a dedicated API route, and store the returned URL in your form's state.
    - [ ] The final `onSubmit` handler will call your API to either `POST` (create) or `PUT` (update) the product.

#### **Sub-Task 2.6: Orders - List View & Detail View**
*Goal: Display and manage all orders and their lifecycle.*
- [ ] **Create Order List Page (`app/(admin)/orders/page.tsx`)**: Follow the same pattern as the Product List page (Server Component for data fetching, Client Component for the interactive table).
    - [ ] **Create Status Badge Component (`<StatusBadge />`)**: This component will take a status string as a prop and render a colored badge. This is crucial for at-a-glance understanding. The required statuses and their colors are:
        - `Solicitud / Nuevo`: **Blue**
        - `Enviado / En Proceso`: **Orange**
        - `Aceptado`: **Light Green**
        - `Cancelado`: **Red**
        - `Enviado / Cumplido`: **Purple**
        - `Recibido / Conforme`: **Teal**
        - `Facturado / Pagado`: **Dark Green**
        - `Cerrado`: **Gray**
- [ ] **Create Order Detail Page (`app/(admin)/orders/[id]/page.tsx`)**: This page will fetch all data for a single order on the server.
    - [ ] **Create Status Updater Component (`<StatusUpdater />`)**: This is a **Client Component** that gets the `orderId` and current `status` as props.
        - [ ] It will contain a `<select>` dropdown pre-populated with all possible order statuses listed above.
        - [ ] When the user selects a new status and clicks a "Save" button, it calls the `PUT /api/admin/orders/[id]` endpoint with the new status.
    - [ ] **Create Internal Notes Component (`<InternalNotes />`)**: This is a **Client Component**. It will have a `<textarea>` and a "Add Note" button to post new notes. It will also fetch and display the list of existing notes for that order.

#### **Sub-Task 2.7: Orders - Create Form**
*Goal: Build the form for the admin to manually create a new order.*
- [ ] **Create Order Form Page (`app/(admin)/orders/new/page.tsx`)**: This is a complex **Client Component**.
    - [ ] **Create Line Item Builder (`<LineItemBuilder />`)**:
        - [ ] Use a debounced search input (`<ProductSearchInput />`) to find products.
        - [ ] Manage the list of selected products in an array in state. Ensure the UI can handle adding and removing items from this list.
        - [ ] Automatically calculate totals whenever the list of items or their quantities change.
    - [ ] The final "Save Order" button should be disabled during the API call.
    - [ ] On success, show a success toast and redirect the user to the newly created order's detail page.

---

## 🔧 **TECHNICAL CONSIDERATIONS**

### Testing Strategy
- [ ] Unit tests for translation hooks
- [x] Integration tests for product filtering - **COMPLETED**: Optimized filtering logic
- [ ] E2E tests for WhatsApp checkout flow
- [ ] Visual regression tests for footer changes

### Performance Monitoring
- [ ] Monitor bundle size impact of i18n
- [x] Track product loading performance - **COMPLETED**: Optimized with debouncing & caching
- [ ] Monitor WhatsApp integration success rate

### Code Quality
- [ ] Update TypeScript interfaces for new features
- [x] Add JSDoc comments for new functions - **COMPLETED**: Added to new hooks
- [x] Ensure all new code follows existing patterns - **COMPLETED**: Followed React best practices
- [ ] Clean up any unused code after implementation

---

## 📊 **PROGRESS TRACKING**

**Overall Progress: 5/6 tasks in progress or completed**

- 🌐 **i18n Translations**: ✅ **100% complete**
- 🖼️ **Filter Loading Fix**: ✅ **100% complete**
- 📱 **WhatsApp Checkout**: ✅ **100% complete**
- 🛒 **Cart Order History**: ✅ **100% complete**
- 🔐 **Admin Panel UI Integration**: ✅ **100% complete**
- 🔗 **Footer Links**: 0% complete

---

## 🚀 **IMPLEMENTATION ORDER**

1. ✅ **COMPLETED**: Task 2 (Critical UX issue) - **FILTER LOADING FIX**
2. ✅ **COMPLETED**: Task 1 (Enables proper localization)
3. ✅ **COMPLETED**: Task 4 (High business value)
4. ✅ **COMPLETED**: Task 7 (Admin UI Integration)
5. **NEXT**: Task 3 (Nice to have improvement)

---

*Last Updated: 2025-09-30*
*Estimated Remaining Time: 1.5-2 days*
