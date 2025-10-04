import { Product } from '../types/product';

const mockProducts: Product[] = [
  {
    id: 'gid://shopify/Product/1',
    title: 'Mock Product 1',
    description: 'This is a mock product description.',
    featuredImage: {
      url: 'https://via.placeholder.com/150',
      altText: 'Mock Product 1 Image',
    },
    priceRange: {
      minVariantPrice: {
        amount: '19.99',
        currencyCode: 'USD',
      },
    },
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Mock Product 2',
    description: 'This is another mock product description.',
    featuredImage: {
      url: 'https://via.placeholder.com/150',
      altText: 'Mock Product 2 Image',
    },
    priceRange: {
      minVariantPrice: {
        amount: '29.99',
        currencyCode: 'USD',
      },
    },
  },
];

export const fetchProducts = async (): Promise<Product[]> => {
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 500);
    });
  }

  const accessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const storeDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
  const endpoint = `https://${storeDomain}/api/2023-01/graphql.json`;

  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            description
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const json = await response.json();
    return json.data.products.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
