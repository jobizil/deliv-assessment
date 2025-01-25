import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        fetchVendors: async (args: { limit?: number; offset?: number }) => {
          return await prisma.vendor.findMany({
            skip: args.offset || 0,
            take: args.limit || 10,
            include: { menus: true },
          });
        },
        fetchOrdersByUser: async (_: any, args: { userId: number; limit?: number; offset?: number }) => {
          return await prisma.order.findMany({
            where: { userId: args.userId },
            skip: args.offset || 0,
            take: args.limit || 10,
          });
        },
      },
  Mutation: {
    addUser: async (_: any, args: { name: string; email: string; phone: string }) => {
      const userSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
      });
      userSchema.parse(args);

      return await prisma.user.create({ data: args });
    },
    addVendor: async (_: any, args: { name: string; email: string; phone: string; address: string }) => {
      return await prisma.vendor.create({ data: args });
    },
    addMenu: async (_: any, args: { vendor_id: number; name: string; price: number; category: string }) => {
      const menuSchema = z.object({
        vendor_id: z.number(),
        name: z.string(),
        price: z.number().positive(),
        category: z.string(),
      });
      menuSchema.parse(args);

      return await prisma.menu.create({ data: args });
    },
    placeOrder: async (_: any, args: { userId: number; menu_id: number; quantity: number }) => {
      return await prisma.order.create({ data: args });
    },
    updateOrderStatus: async (_: any, args: { orderId: number; status: string }) => {
      return await prisma.order.update({ where: { id: args.orderId }, data: { status: args.status } });
    },
  },
};
