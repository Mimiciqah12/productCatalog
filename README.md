# Product Catalog App

A React Native app built for the **Neurogine Junior Mobile Developer technical assessment**. Browse products, search the catalog, and view product details using the DummyJSON API.

## Features

- Product list with thumbnails, titles, and prices
- Product details with images, price, rating, and description
- Infinite scrolling with 20 products per page
- Server-side search with a 500 ms debounce
- Pull-to-refresh
- Loading indicators, error messages, empty states, and retry actions
- Image loading indicators and fallback handling

## Tech Stack

- **React Native** — mobile UI
- **Expo SDK 57** — development tooling
- **TypeScript** — type checking
- **Expo Router** — navigation
- **DummyJSON API** — product data

## Getting Started

From the project folder, install dependencies and start the development server:

```bash
npm install
npm start
```

### Useful Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run android` | Start Expo and open Android |
| `npm run ios` | Start Expo and open the iOS Simulator |
| `npm run web` | Start Expo for web |
| `npx tsc --noEmit` | Check TypeScript types |

## Project Structure

```text
src/
├── app/
│   ├── _layout.tsx          # Root stack navigator
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab navigation
│   │   ├── index.tsx        # Product list, search, and pagination
│   │   └── explore.tsx      # Expo starter Explore screen
│   └── product/
│       └── [id].tsx         # Product details
├── components/
│   └── ProductImage.tsx     # Image loading and fallback handling
├── data/
│   └── productApi.ts        # Product API requests
└── types/
    └── Product.ts          # Shared product type
```

The project uses a simple layered structure: screens manage UI and screen state, reusable components handle shared presentation, and `productApi.ts` handles API requests. Local React state keeps the implementation small without adding a separate state-management library.

## API Endpoints

The app makes these requests to DummyJSON:

```text
GET https://dummyjson.com/products?limit=20&skip=0
GET https://dummyjson.com/products/{id}
GET https://dummyjson.com/products/search?q={query}&limit=20&skip=0
```

### Search

Search waits 500 ms after the user stops typing before sending a request. It runs on the server so results can include products that have not yet been loaded into the list.

### Pagination

The app requests 20 products at a time for both browsing and search. The number of loaded products becomes the next `skip` value. New results are appended to the list, and loading stops when the API's total has been reached.

### Navigation

Home and Explore sit inside a tab navigator. A root stack contains both the tabs and the product detail screen, allowing a product tap to open `/product/{id}` and the Back action to return to the list.

## Future Improvements

Development focused on the assessment requirements within the available time. Future improvements include:

- Unit tests
- Improved accessibility
- Better image caching
- Further UI polish

## AI Assistance

AI tools were used for learning, guidance, troubleshooting, and reviewing implementation ideas.

I reviewed and studied the final code so that I can explain the application flow, pagination, search, API handling, navigation, and architecture.

## Author

Nur Faqihah
