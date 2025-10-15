# 📋 ECOMMERCE 2025 - PENDING TASKS

## 🎯 OVERVIEW
This document tracks the implementation of critical features and bug fixes for the ecommerce platform. The **V1.0 FINAL SPRINT - ACTION PLAN** at the end of this document is the definitive source of truth for all remaining work.

---

## STATUS OF PREVIOUS TASKS

*   **TASK 1: i18n TRANSLATIONS**: ✅ COMPLETED
*   **TASK 2: FIX INFINITE LOADING ON PRODUCT FILTERS**: ✅ COMPLETED
*   **TASK 3: HIDE NON-EXISTENT FOOTER LINKS**: 🟡 SUPERSEDED *(Now part of Final Plan Task 4.2)*
*   **TASK 4: WHATSAPP CHECKOUT WITH LOCAL STORAGE PERSISTENCE**: ✅ COMPLETED
*   **TASK 5: ENHANCE CART VIEW WITH ORDER HISTORY**: ✅ COMPLETED
*   **TASK 6: MIGRATE APPLICATION FROM VITE TO NEXT.JS**: ✅ COMPLETED
*   **TASK 7: INTEGRATE ADMIN PANEL UI**: ✅ COMPLETED
*   **TASK 8: CREATE SECURE ADMIN PANEL FOR INVENTORY MANAGEMENT**: 🟡 SUPERSEDED *(Core is complete, UI/UX improvements are in Final Plan Task 4.1)*
*   **TASK 9: CONNECT FRONTEND COMPONENTS TO BACKEND API**: ✅ COMPLETED
*   **TASK 10: IMPLEMENT SERVER-SIDE IMAGE UPLOAD AND SERVING**: ✅ COMPLETED
*   **TASK 11: IMPLEMENT PRODUCT CATEGORIES (CRUD)**: ❌ OBSOLETE
*   **TASK 12: IMPLEMENT CUSTOMIZABLE HERO BANNER**: ❌ OBSOLETE
*   **TASK 13: CREATE ADMINISTRATOR VIEW FOR HERO (STRAPI)**: ❌ OBSOLETE
*   **TASK 14: REFACTOR IMAGE URLS FOR PRODUCTION (MINIO)**: ✅ COMPLETED
*   **TASK 15: IMPLEMENT MULTI-IMAGE SUPPORT FOR PRODUCTS**: 🟡 SUPERSEDED *(Backend is complete, UI is in Final Plan Task 2.2)*
*   **TASK 16: REFACTOR DATA FETCHING WITH TANSTACK QUERY**: ✅ COMPLETED

---
---

# 🏆 V1.0 FINAL SPRINT - ACTION PLAN

This is the definitive, consolidated action plan for completing the V1.0 release.

---

## PHASE 1: BACKEND & DATA MODEL OVERHAUL

*Goal: Restructure the database and backend logic to support the new perfume-specific features. The current database is mock data and can be safely deleted and replaced.*

### **1.1: Implement Advanced Fragrance Notes (Many-to-Many)**
*Goal: Rework Fragrance Notes into a standalone, reusable entity with its own CRUD and image, and connect it to Products via a many-to-many relationship that includes the percentage.*

-   [x] **Action: Redefine Prisma Schema (`prisma/schema.prisma`)**
    1.  Add a `color: String` field to the `FragranceNote` model.
    2.  The rest of the many-to-many schema is correct.

-   [x] **Action: Build Admin CRUD for Fragrance Notes**
-   [x] **Action: Integrate into Product Edit Page**
    1.  The UI for adding a fragrance note to a product must include an input for the `percentage`.

### **1.2. Update Seed Script**
-   [x] **Action:** Modify `prisma/seed.cjs` to generate mock data that conforms to the new schema, including adding a `color` to each fragrance note.

---

## PHASE 2: STOREFRONT - CORE PRODUCT EXPERIENCE

*Goal: Overhaul the product list and detail pages to use the new data model and provide a richer user experience.*

### **2.1. Rework Product Filters**
-   [x] **Action:** In `src/components/product-filters.tsx`, remove the old filter logic.
-   [x] **Action:** Implement new filter sections using checkboxes for `brand` and `sex`. For `bottleSize`, use checkboxes for common values (e.g., 50, 100, 200).
-   [x] **UI for 'sex' filter:**
    *   Group the checkboxes: Display "Man" and "Woman" checkboxes first, then "Unisex".
    *   Style each checkbox label with a distinct border color: `dark blue` for Man, `soft pink` for Woman, `cream` for Unisex.
-   [x] **Action:** Ensure all filter selections update the URL with query parameters (e.g., `?brand=Chanel&sex=WOMAN`) using Next.js `useRouter` and `useSearchParams`.
-   [x] **Action:** Ensure the filter panel is accessible and usable on mobile devices, likely housed in a slide-out drawer.

### **2.2. Overhaul Product Image UI**
-   [x] **Action:** In `src/components/product-detail-page-client.tsx`, implement a multi-image viewer: a main image with a clickable horizontal row of thumbnails below it.
-   [x] **Action:** In `src/components/product-card.tsx`, transform the static image into a mini-carousel with subtle left/right arrow buttons overlaid on the image to allow users to cycle through `imageUrls`.
-   [x] **Action:** On the product detail page, make the entire image gallery container `sticky` to the top of its parent column on desktop screens.

### **2.3. Add "Buy Now" Button**
-   [x] **Action:** In `src/components/product-detail-page-client.tsx`, add a "Buy Now" button.
-   [x] **Action:** This button will trigger a function that immediately formats a WhatsApp message for the single product (bypassing the cart) and redirects the user.

---

## PHASE 3: STOREFRONT - UX & FEATURE ENHANCEMENTS

*Goal: Add smaller features that improve user engagement and overall site usability.*

### **3.1. Implement "Favorites" Feature**
-   [x] **Action:** Add a "heart" icon button to `product-card.tsx` and `product-detail-page-client.tsx`.
-   [x] **Action:** Create a `useFavorites` hook that manages a list of product IDs in `localStorage`.
-   [x] **Action:** Add a "Favorites" checkbox to the product filters and a corresponding link in the main header (`/products?favorites=true`).

### **3.2. Add Cart Toast Notifications**
-   [x] **Action:** Verified that the existing `UIProvider` and `useUI` hook provide notification functions (`showSuccess`, `showError`).
-   [x] **Action:** Added the `<NotificationToast />` component to the main `StoreLayout` to ensure notifications are rendered.
-   [x] **Action:** Confirmed that `useCartOperations.ts` already uses the `useUI` hook to show notifications for adding/removing items.

### **3.3. Change Quantity Selector to Dropdown**
-   [x] **Action:** In `cart-item.tsx`, replace the `+ / -` input with a `<select>` dropdown, populated with numbers from 1 up to a maximum of 10 (or the product's `stock` level, whichever is lower).

### **3.4. Add Related Products & Brand Links**
-   [x] **Action: Create Server-Side API Helpers**
    1.  Create a `lib/api.ts` file.
    2.  Implement `getAllBrands()` to fetch all unique brand names.
    3.  Implement `getRelatedProducts(brand, currentProductId)` to fetch products of the same brand.
-   [x] **Action: Update Product Detail Page (Server)**
    1.  In `app/(store)/product/[slug]/page.tsx`, use the new API helpers to fetch `allBrands` and `relatedProducts`.
    2.  Pass this data as props to the `ProductDetailPageClient` component.
-   [x] **Action: Update Product Detail Page (Client)**
    1.  The `ProductDetailPageClient` will receive `allBrands` and `relatedProducts` as props.
    2.  It will render the `RelatedProducts` component.
    3.  It will dynamically render the list of brand links using the `allBrands` prop.

### **3.5. Implement Fragrance Note Visualization**
-   [x] **Action:** In `ProductDetailPageClient.tsx`, in the "Fragrance Notes" accordion section:
    1.  Sort the incoming `product.fragranceNotes` array in descending order by `percentage`.
    2.  For each note, render a progress bar-style component.
    3.  The background color of the bar must be the `color` from the `fragranceNote` object.
    4.  The width of the bar will be determined by the `percentage`.
    5.  The name of the note will be displayed on top of or next to the bar.

---

## PHASE 4: ADMIN PANEL & FOOTER MANAGEMENT

*Goal: Improve admin usability and make static content editable.*

### **4.1. Improve Admin Products Table**
-   [x] **Action:** Refactor the products table at `app/(admin)/products/page.tsx`.
-   [x] **Action:** Implement server-side pagination, displaying only ~10 products per page.
-   [x] **Action:** Add search and filter capabilities that update the query.
-   [x] **Action:** In each table row, add an **inline stock editor**. This will be a small component showing the current stock, which, when clicked, turns into a number input and a "Save" button. Clicking "Save" will call a dedicated API route to update only the stock for that product.

### **4.12. Implement Editable Footer**
-   [x] **Action:** Create a new `FooterContent` model in `prisma/schema.prisma` to store footer links (e.g., column title, array of link texts and URLs).
-   [x] **Action:** Build a new page in the admin panel at `app/(admin)/footer/page.tsx` to allow editing of this content.
-   [x] **Action:** The main `src/components/footer.tsx` will now fetch its content from a new `GET /api/v1/footer` endpoint instead of being hardcoded. This also resolves the "hide non-existent links" task.

### **4.3: Fix Incomplete Product Form**
*Goal: Resolve product creation error by adding all mandatory fields to the admin product form.*
- [x] **Action: Add Missing Inputs to Form**
- [x] **Action: Update Backend API**

### **4.4: Add SEO Generator Buttons**
*Goal: Improve admin workflow by adding buttons to automatically generate SEO title and description.*
- [x] **Action: Add "Generate" buttons and logic to the product form.**

---

## PHASE 5: FINAL QA & CLEANUP

*Goal: Perform a final pass to ensure high quality across the application.*

### **5.1. Full Mobile Usability Review**
-   [ ] **Action:** Manually test the entire user flow on a mobile device viewport, checking for layout issues, non-responsive elements, and difficult-to-tap buttons.

### **5.2. Verify Checkout & Order History Flow**
-   [ ] **Action:** Perform an end-to-end test of the checkout process, confirming that the order is saved to `localStorage`, the cart is NOT cleared, and the user can view their past orders on the cart page when it's empty.





add animations
- [ ] **Action:** Implement smooth transitions and animations for key interactions, enhancing the user experience.

- [ ] **Action:** Add animations to the product card transitions on the home page.
- [ ] **Action:** Add animations to the product card transitions on the product detail page.- [ ] **Action:** Add animations to the product card transitions on the product detail page.
- [ ] **Action:** Add animations to the cart add product action

---

## PHASE 6: ADMIN NAVIGATION & ROUTING

*Goal: Ensure all admin sections are accessible through the sidebar and use correct, consistent routing.*

### **6.1: Add Fragrance Notes to Admin Sidebar**
*Goal: Add a navigation link to the admin sidebar for the Fragrance Notes CRUD section to make it discoverable.*

-   [x] **Action: Locate and Edit Sidebar Component**
    1.  The admin sidebar is defined in `src/admin/components/layout/sidebar.tsx`. Open this file for editing.
    2.  The navigation links are stored in a `navItems` array within this file.

-   [x] **Action: Add New Navigation Link**
    1.  In the `navItems` array, add a new object for "Fragrance Notes". It should be placed logically, for example, after "Products".
    2.  The object should look like this:
        ```javascript
        { path: "/admin/fragrance-notes", label: "Fragrance Notes", icon: "lucide:leaf" },
        ```
    3.  This will add the "Fragrance Notes" link to the sidebar with a leaf icon.

### **6.2: Verify Route Consistency**
*Goal: Confirm that the routing for fragrance notes is consistent and correctly spelled across the application.*

-   [x] **Action: Confirm Route `fragrance-notes`**
    1.  The correct route is `/admin/fragrance-notes`.
    2.  This task is a verification step to ensure no typos like `fragance-notes` exist in the codebase. A quick search for `fragance-notes` should be performed to be certain. If any are found, they must be corrected to `fragrance-notes`.
