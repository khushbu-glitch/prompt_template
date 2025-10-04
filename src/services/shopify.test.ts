import { fetchProducts } from './shopify';
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
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        data: {
          products: {
            edges: mockProducts.map((product) => ({ node: product })),
          },
        },
      }),
  })
) as jest.Mock;

describe('Shopify Service', () => {
  it('fetchProducts should return a list of products', async () => {
    const products = await fetchProducts();
    expect(products).toEqual(mockProducts);
  });
});
