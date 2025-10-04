import { ShopifyProduct } from '../types/shopify';

/**
 * Mock product data for development and fallback
 * Follows the Shopify Storefront API structure
 */
export const mockProducts: ShopifyProduct[] = [
  {
    id: 'gid://shopify/Product/1',
    title: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with active noise cancellation and superior sound quality. Perfect for music lovers and professionals.',
    handle: 'premium-wireless-headphones',
    availableForSale: true,
    priceRange: {
      minVariantPrice: {
        amount: '299.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '299.99',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductImage/1',
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
            altText: 'Premium wireless headphones in black',
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
              amount: '299.99',
              currencyCode: 'USD',
            },
          },
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Minimalist Leather Wallet',
    description: 'Handcrafted genuine leather wallet with RFID protection. Slim design fits comfortably in your pocket.',
    handle: 'minimalist-leather-wallet',
    availableForSale: true,
    priceRange: {
      minVariantPrice: {
        amount: '49.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '49.99',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductImage/2',
            url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop',
            altText: 'Brown leather wallet',
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
            id: 'gid://shopify/ProductVariant/2',
            title: 'Default Title',
            availableForSale: true,
            priceV2: {
              amount: '49.99',
              currencyCode: 'USD',
            },
          },
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/3',
    title: 'Stainless Steel Water Bottle',
    description: 'Eco-friendly insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and dishwasher safe.',
    handle: 'stainless-steel-water-bottle',
    availableForSale: true,
    priceRange: {
      minVariantPrice: {
        amount: '34.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '34.99',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductImage/3',
            url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop',
            altText: 'Blue stainless steel water bottle',
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
            id: 'gid://shopify/ProductVariant/3',
            title: 'Default Title',
            availableForSale: true,
            priceV2: {
              amount: '34.99',
              currencyCode: 'USD',
            },
          },
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/4',
    title: 'Smart Watch Pro',
    description: 'Advanced fitness tracking, heart rate monitoring, and smartphone notifications. Water-resistant with 7-day battery life.',
    handle: 'smart-watch-pro',
    availableForSale: true,
    priceRange: {
      minVariantPrice: {
        amount: '199.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '199.99',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductImage/4',
            url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop',
            altText: 'Black smart watch displaying fitness stats',
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
            id: 'gid://shopify/ProductVariant/4',
            title: 'Default Title',
            availableForSale: true,
            priceV2: {
              amount: '199.99',
              currencyCode: 'USD',
            },
          },
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/5',
    title: 'Organic Cotton T-Shirt',
    description: 'Soft, breathable organic cotton t-shirt. Ethically made with sustainable materials. Available in multiple colors.',
    handle: 'organic-cotton-tshirt',
    availableForSale: true,
    priceRange: {
      minVariantPrice: {
        amount: '29.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '29.99',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductImage/5',
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
            altText: 'White organic cotton t-shirt',
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
            id: 'gid://shopify/ProductVariant/5',
            title: 'Default Title',
            availableForSale: true,
            priceV2: {
              amount: '29.99',
              currencyCode: 'USD',
            },
          },
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/6',
    title: 'Portable Bluetooth Speaker',
    description: '360-degree sound with deep bass. Waterproof design perfect for outdoor adventures. 20-hour battery life.',
    handle: 'portable-bluetooth-speaker',
    availableForSale: true,
    priceRange: {
      minVariantPrice: {
        amount: '79.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '79.99',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductImage/6',
            url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
            altText: 'Red portable bluetooth speaker',
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
            id: 'gid://shopify/ProductVariant/6',
            title: 'Default Title',
            availableForSale: true,
            priceV2: {
              amount: '79.99',
              currencyCode: 'USD',
            },
          },
        },
      ],
    },
  },
];

