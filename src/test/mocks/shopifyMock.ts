import { ShopifyProduct, ShopifyProductsResponse } from '../../types/shopify';

export const mockProduct: ShopifyProduct = {
  id: 'gid://shopify/Product/test-1',
  title: 'Test Product',
  description: 'Test product description',
  handle: 'test-product',
  availableForSale: true,
  priceRange: {
    minVariantPrice: {
      amount: '99.99',
      currencyCode: 'USD',
    },
    maxVariantPrice: {
      amount: '99.99',
      currencyCode: 'USD',
    },
  },
  images: {
    edges: [
      {
        node: {
          id: 'gid://shopify/ProductImage/1',
          url: 'https://example.com/image.jpg',
          altText: 'Test product image',
          width: 800,
          height: 800,
        },
      },
    ],
  },
  variants: {
    edges: [
      {
        node: {
          id: 'gid://shopify/ProductVariant/1',
          title: 'Default Title',
          availableForSale: true,
          priceV2: {
            amount: '99.99',
            currencyCode: 'USD',
          },
        },
      },
    ],
  },
};

export const mockProducts: ShopifyProduct[] = [
  mockProduct,
  {
    ...mockProduct,
    id: 'gid://shopify/Product/test-2',
    title: 'Test Product 2',
    priceRange: {
      minVariantPrice: {
        amount: '149.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '149.99',
        currencyCode: 'USD',
      },
    },
  },
];

export const mockShopifyResponse: ShopifyProductsResponse = {
  data: {
    products: {
      edges: mockProducts.map((product) => ({ node: product })),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
  },
};

