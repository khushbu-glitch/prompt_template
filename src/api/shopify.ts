import {
  ShopifyProduct,
  ShopifyProductsResponse,
  FetchProductsParams,
  ApiError,
} from '../types/shopify';
import { mockProducts } from '../utils/mockData';

/**
 * Configuration for Shopify Storefront API
 * Securely loads from environment variables
 */
const SHOPIFY_CONFIG = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  apiVersion: '2023-10',
};

/**
 * GraphQL query to fetch products from Shopify Storefront API
 */
const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Validates that required environment variables are set
 */
function validateConfig(): boolean {
  return !!(SHOPIFY_CONFIG.storeDomain && SHOPIFY_CONFIG.storefrontAccessToken);
}

/**
 * Fetches products from Shopify Storefront API
 * Falls back to mock data if API is not configured or fails
 * 
 * @param params - Optional parameters for pagination and filtering
 * @returns Promise resolving to array of products
 * @throws ApiError if API call fails and mock data is disabled
 */
export async function fetchProducts(
  params: FetchProductsParams = {}
): Promise<ShopifyProduct[]> {
  const { first = 10, after = null, query = '' } = params;

  // Check if API is configured
  const isConfigured = validateConfig();

  if (!isConfigured) {
    console.warn(
      'Shopify API credentials not configured. Using mock data. ' +
      'Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env file.'
    );
    return mockProducts;
  }

  try {
    const endpoint = `https://${SHOPIFY_CONFIG.storeDomain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: {
          first,
          after,
          query,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ShopifyProductsResponse = await response.json();

    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map((err) => err.message).join(', ');
      throw new Error(`GraphQL errors: ${errorMessages}`);
    }

    // Extract products from response
    const products = result.data.products.edges.map((edge) => edge.node);

    return products;
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);

    // Fallback to mock data on error
    console.warn('Falling back to mock data due to API error');
    return mockProducts;
  }
}

/**
 * Formats price for display
 * @param amount - Price amount as string
 * @param currencyCode - Currency code (e.g., 'USD')
 * @returns Formatted price string
 */
export function formatPrice(amount: string, currencyCode: string): string {
  const numericAmount = parseFloat(amount);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount);
}

/**
 * Custom error class for API errors
 */
export class ShopifyApiError extends Error implements ApiError {
  code?: string;
  details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'ShopifyApiError';
    this.code = code;
    this.details = details;
  }
}

