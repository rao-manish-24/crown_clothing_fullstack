# Crown Clothing

This project is a modern e-commerce application built with React and Vite. It allows users to browse products, manage a shopping cart, and complete purchases using Stripe. Firebase is used for user authentication (Google & Email/Password) and storing application data (users, products, categories) in Firestore.

## Features

- **User Authentication:**
    - Sign Up & Sign In with Email/Password (`createAuthUserWithEmailAndPassword`, `signInAuthUserWithEmailAndPassword`).
    - Sign In with Google Popup (`signInWithGooglePopup`).
    - Sign Out (`signOutUser`).
    - Managed via the `/auth` route (component: `src/routes/authentication/authentication.component.jsx`).
    - User authentication state is tracked globally via Firebase's `onAuthStateChangedListener` within `UserContext`.
    - Creates a user document in Firestore (`users` collection) upon first sign-in/sign-up using `createUserDocumentFromAuth`.
- **Product Browsing:**
    - View products grouped by category on the `/shop` route (component: `src/routes/shop/shop.component.jsx`), displaying `CategoriesPreview`.
    - View specific category pages via nested routes `/shop/:category` (handled within the `Shop` component, displaying `Category`).
    - Product data (categories and items) is fetched asynchronously from the Firestore `categories` collection via `getCategoriesAndDocuments` within `ShopProvider` (`src/context/shop.context.jsx`) and stored in `categoriesMap`.
    - Utilizes components like `category-preview`, `category-item`, and `product-card` for display.
- **Shopping Cart:**
    - Add/remove items using `addItemToCart`, `removeItemfromCart`, and `clearItemFromCart` functions provided by `CartContext`.
    - View cart contents via the `cart-icon` and `card-dropdown` components (part of the shared `Navigation`).
    - Cart state (`isCartOpen`, `cartItems`) managed globally by `CartProvider` (`src/context/cart.context.jsx`).
    - `cartCount` and `cartTotal` are automatically calculated within the context using `useEffect` based on `cartItems`.
    - Helper functions (`addCartItem`, `removeCartItem`, `clearCartItem`) handle the logic for updating item quantities or removing items.
- **Checkout Process:**
    - Dedicated `/checkout` route (component: `src/routes/checkout/checkout.component.jsx`) displaying items using `checkout-item` components.
    - Integrated Stripe payment form (`payment-form` component), enabled by the `Elements` provider from `@stripe/react-stripe-js` set up in `main.jsx`.
    - Secure payment processing via a Netlify serverless function (`netlify/functions/create-payment-intent.js`) which creates a Stripe PaymentIntent (using INR currency).
- **Shared Navigation:**
    - A persistent navigation bar (component: `src/routes/navigation/navigation.component.jsx`) wraps all main routes, providing consistent access to links (Home, Shop), sign-in/out actions, and the cart icon/dropdown.
- **Data Flow:**
    - **Products/Categories:** Firestore (`categories` collection) -> `firebase.utils.js` (`getCategoriesAndDocuments`) -> `ShopContext` (`useEffect` fetch) -> Components (`useContext`).
    - **Cart:** Component Action -> `CartContext` (e.g., `addItemToCart`) -> Update `cartItems` state -> `useEffect` recalculates `cartCount`/`cartTotal` -> UI updates.
    - **Auth & User Data:** Component Action (Sign In/Up) -> `firebase.utils.js` (auth functions) -> Firebase Auth -> `UserContext` (`onAuthStateChangedListener`) -> `firebase.utils.js` (`createUserDocumentFromAuth` on first login) -> Firestore (`users` collection) -> UI updates.
- **Data Seeding (Potential):**
    - The `firebase.utils.js` file includes an `addCollectionAndDocuments` function designed for batch-writing documents (using `object.title.toLowerCase()` as the document ID). This is likely intended for initially seeding the Firestore `categories` collection. The mechanism to trigger this function (e.g., a temporary component or script) is not detailed here.

## Project Structure

```
crown-clothing/
├── netlify/
│   └── functions/
│       └── create-payment-intent.js  # Serverless function for Stripe (uses STRIPE_SECRET_KEY env var)
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Reusable UI components (Button, FormInput, CartIcon, ProductCard, PaymentForm etc.)
│   ├── context/             # Global state via React Context (UserProvider, ShopProvider, CartProvider)
│   ├── data/                # Potentially static data or data seeding logic (if any)
│   ├── routes/              # Page-level components (Home, Navigation, Shop, Authentication, Checkout)
│   ├── utils/               # Utility functions
│   │   ├── firebase/        # Firebase interaction logic (auth, firestore, config)
│   │   │   └── firebase.utils.js
│   │   └── stripe.utils.js  # Stripe.js initialization helper
│   ├── App.jsx              # Defines main application routes (/, /auth, /shop/*, /checkout) under Navigation
│   ├── app.styles.scss      # Global styles
│   └── main.jsx             # App entry point, sets up Providers (Stripe Elements, BrowserRouter, Contexts)
├── .env                     # Local environment variables (Firebase, Stripe keys) - MUST BE CREATED & GITIGNORED
├── .eslintrc.cjs            # ESLint configuration
├── .gitignore               # Git ignore rules
├── index.html               # Main HTML entry point for Vite
├── package.json             # Project metadata and dependencies
├── README.md                # This file
└── vite.config.js         # Vite configuration
```

## Tech Stack

- **Frontend:**
    - **Framework/Library:** React (`react`, `react-dom`)
    - **Build Tool:** Vite (`vite`)
    - **Routing:** React Router (`react-router-dom`) - Defines routes in `App.jsx`, utilizes nested routes in `Shop`.
    - **Styling:** `styled-components`, Sass (`sass`), Global styles in `app.styles.scss`.
    - **State Management:** React Context API (`src/context/`) - Providers initialized in `main.jsx`, utilize `useState` and `useEffect` for state logic and side effects.
        - `UserProvider`: Manages user authentication state via Firebase `onAuthStateChangedListener`.
        - `ShopProvider`: Fetches product/category data from Firestore (`categories` collection) on mount via `getCategoriesAndDocuments`.
        - `CartProvider`: Manages shopping cart state (`cartItems`, `isCartOpen`) and derived state (`cartCount`, `cartTotal`) with internal helper functions.
- **Backend & Services:**
    - **Authentication:** Firebase Authentication (`firebase`) - Supports Google Popup and Email/Password methods (configured in `firebase.utils.js`).
    - **Database:** Firestore (`firebase`) - Stores `users` and `categories` collections. Accessed via functions in `firebase.utils.js`. **Requires appropriate Firestore Security Rules.**
    - **Serverless Functions:** Netlify Functions (`netlify/functions/create-payment-intent.js`).
    - **Payments:** Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`) - Uses `Elements` provider and `loadStripe` (from `stripe.utils.js`), plus the `stripe` Node.js library in the Netlify function.
- **Development:**
    - **Linting:** ESLint (`eslint`, various plugins)
    - **Type Checking (via Dev Dependencies):** `@types/react`, `@types/react-dom`

## Getting Started

### Prerequisites

- Node.js (LTS version recommended) and npm (or yarn).
- A Firebase project:
    - Enable **Authentication** (Google provider, Email/Password provider).
    - Enable **Firestore** database. **Crucially, configure Firestore Security Rules** to allow appropriate read/write access (e.g., public read for `categories`, authenticated read/write for `users`).
    - Obtain your Firebase project configuration keys.
- A Stripe account:
    - Obtain your **Publishable Key** (for the frontend).
    - Obtain your **Secret Key** (for the Netlify serverless function).
- Netlify account and Netlify CLI (optional, for local testing of functions): `npm install netlify-cli -g`

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd crown-clothing
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Security Improvement (Highly Recommended):**
    The current Firebase configuration keys are hardcoded in `src/utils/firebase/firebase.utils.js`. It is strongly recommended to move these keys to environment variables for security.
    - **Modify `src/utils/firebase/firebase.utils.js`**: Change the `firebaseConfig` object to read values from `import.meta.env` (e.g., `apiKey: import.meta.env.VITE_FIREBASE_API_KEY`).
    - **Update `.env` file** (see step 4) to include these `VITE_FIREBASE_...` variables.

4.  Set up environment variables:
    Create a `.env` file in the root directory. **This file contains sensitive keys and MUST be added to your `.gitignore` if not already present.**

    ```env
    # --- Firebase Configuration --- 
    # Recommended: Move keys here from firebase.utils.js and access via import.meta.env.VITE_... 
    VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
    VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
    VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
    VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID

    # --- Stripe Configuration (Client-side) --- 
    # IMPORTANT: Ensure this key is accessed correctly in src/utils/stripe.utils.js
    # It MUST use `import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY` for Vite projects.
    VITE_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY

    # --- Netlify Environment Variable --- 
    # The Stripe SECRET key is NOT placed in this .env file for security.
    # It must be configured as an environment variable named 'STRIPE_SECRET_KEY'
    # in your Netlify deployment settings (Build & Deploy -> Environment).
    STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY 
    ```
    **Verification Needed:** The file `src/utils/stripe.utils.js` currently appears to access the Stripe publishable key using `process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY`. In a Vite project, this **must be changed** to `import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY` to correctly read the variable from your `.env` file.

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```
This starts the Vite development server (usually at `http://localhost:5173`). Ensure your `.env` file is correctly configured as described above.

To test the Netlify function locally (requires Netlify CLI and configuration for the secret key):
```bash
netlify dev
```
This command runs your Vite dev server and the Netlify functions emulator together. For the `create-payment-intent` function to work locally, it needs access to the `STRIPE_SECRET_KEY`. You might need to:
    a) Set it as a system environment variable before running `netlify dev`.
    b) Use Netlify CLI commands to set environment variables locally (`netlify env:set STRIPE_SECRET_KEY your_secret_key`).
    c) Rely on the `require("dotenv").config();` line in the function, placing the `STRIPE_SECRET_KEY=your_secret_key` in the root `.env` file (less secure, ensure `.env` is gitignored).

## Available Scripts

- `npm run dev`: Starts the Vite development server with HMR.
- `npm run build`: Creates an optimized production-ready build in the `dist/` folder.
- `npm run lint`: Runs ESLint to check for code quality and style issues based on `.eslintrc.cjs`.
- `npm run preview`: Serves the production build locally from the `dist/` folder to preview it.

## Deployment

This project is configured for deployment on **Netlify**.

1.  **Build the project:** Ensure your code (including corrections to `stripe.utils.js` and potentially moving Firebase config to `.env`) is committed and pushed to your Git provider.
2.  **Configure Netlify:**
    - Connect your Git repository (GitHub, GitLab, Bitbucket) to Netlify.
    - Set the **Build command** to: `npm run build` (or `yarn build`).
    - Set the **Publish directory** to: `dist`.
    - Set the **Functions directory** to: `netlify/functions`.
    - **Crucially:** Navigate to **Site settings > Build & deploy > Environment** and add your **Stripe Secret Key** as an environment variable. The variable name **must be exactly** `STRIPE_SECRET_KEY` for the `create-payment-intent.js` function to access it via `process.env.STRIPE_SECRET_KEY`.
    - **If you moved Firebase config to `.env`**: You might also need to add the `VITE_FIREBASE_...` variables to the Netlify environment variables so they are available during the build process.
3.  Trigger a deploy (usually automatic on push to the connected branch).

Netlify will automatically build the site (using build-time environment variables like `VITE_FIREBASE_...` if configured), deploy the serverless function from the specified directory, and inject the configured runtime environment variables (like `STRIPE_SECRET_KEY`) into the function's environment.
