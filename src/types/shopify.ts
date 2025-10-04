/**
 * TypeScript interfaces for Shopify Storefront API
 * Based on Shopify Storefront API v2023-10
 */

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        id: string;
        url: string;
        altText: string | null;
        width: number;
        height: number;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        priceV2: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export interface ShopifyProductsResponse {
  data: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    };
  };
  errors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
}

export interface FetchProductsParams {
  first?: number;
  after?: string | null;
  query?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

