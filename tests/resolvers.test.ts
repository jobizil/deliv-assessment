import { resolvers } from '../src/resolvers';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

const prisma = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prisma);
});

describe('Resolvers', () => {
  describe('Query', () => {
    it('fetchVendors should return a list of vendors with menus', async () => {
      prisma.vendor.findMany.mockResolvedValue([
        {
          id: 1,
          name: 'Pizza Place',
          email: 'vendor@example.com',
          phone: '1234567890',
          address: '123 Main St',
          created_at: new Date(),
          menus: [
            { id: 1, name: 'Margherita Pizza', price: 9.99, category: 'Pizza', is_available: true },
          ],
        },
      ]);

      const result = await resolvers.Query.fetchVendors({ limit: 10, offset: 0 });
      expect(result).toEqual([
        {
          id: 1,
          name: 'Pizza Place',
          email: 'vendor@example.com',
          phone: '1234567890',
          address: '123 Main St',
          created_at: expect.any(Date),
          menus: [
            { id: 1, name: 'Margherita Pizza', price: 9.99, category: 'Pizza', is_available: true },
          ],
        },
      ]);
      expect(prisma.vendor.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: { menus: true },
      });
    });

    it('fetchOrdersByUser should return orders for a specific user', async () => {
      prisma.order.findMany.mockResolvedValue([
        {
          id: 1,
          userId: 1,
          menu_id: 1,
          quantity: 2,
          status: 'PENDING',
          created_at: new Date(),
        },
      ]);

      const result = await resolvers.Query.fetchOrdersByUser({ userId: 1, limit: 5, offset: 0 });
      expect(result).toEqual([
        {
          id: 1,
          userId: 1,
          menu_id: 1,
          quantity: 2,
          status: 'PENDING',
          created_at: expect.any(Date),
        },
      ]);
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        skip: 0,
        take: 5,
      });
    });
  });

  describe('Mutation', () => {
    it('addUser should create a new user', async () => {
      prisma.user.create.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        created_at: new Date(),
      });

      const result = await resolvers.Mutation.addUser({}, {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      });

      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        created_at: expect.any(Date),
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
        },
      });
    });

    it('addMenu should create a new menu item', async () => {
      prisma.menu.create.mockResolvedValue({
        id: 1,
        vendor_id: 1,
        name: 'Pepperoni Pizza',
        price: 12.99,
        category: 'Pizza',
        is_available: true,
      });

      const result = await resolvers.Mutation.addMenu({}, {
        vendor_id: 1,
        name: 'Pepperoni Pizza',
        price: 12.99,
        category: 'Pizza',
      });

      expect(result).toEqual({
        id: 1,
        vendor_id: 1,
        name: 'Pepperoni Pizza',
        price: 12.99,
        category: 'Pizza',
        is_available: true,
      });
      expect(prisma.menu.create).toHaveBeenCalledWith({
        data: {
          vendor_id: 1,
          name: 'Pepperoni Pizza',
          price: 12.99,
          category: 'Pizza',
        },
      });
    });

    it('placeOrder should create a new order', async () => {
      prisma.order.create.mockResolvedValue({
        id: 1,
        userId: 1,
        menu_id: 1,
        quantity: 2,
        status: 'PENDING',
        created_at: new Date(),
      });

      const result = await resolvers.Mutation.placeOrder({}, {
        userId: 1,
        menu_id: 1,
        quantity: 2,
      });

      expect(result).toEqual({
        id: 1,
        userId: 1,
        menu_id: 1,
        quantity: 2,
        status: 'PENDING',
        created_at: expect.any(Date),
      });
      expect(prisma.order.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          menu_id: 1,
          quantity: 2,
        },
      });
    });
  });
});
