import { PrismaClient, StatusEnum } from '@prisma/client';
import { z } from 'zod';
import { handleError } from './utils/errorHandler';

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        /**
         * Fetches vendors with menus.
         * @param {object} args
         * @param {number} [args.limit=10] The maximum number of vendors to return.
         * @param {number} [args.offset=0] The starting index of the range of vendors to return.
         * @returns {Promise<Array<{ id: number; name: string; email: string; phone: string; address: string; menus: Array<{ id: number; vendor_id: number; name: string; price: number; category: string; }> }>>}
         */
        fetchVendors: async ( _:any, args: { limit?: number; offset?: number }) => {
         try {
            return await prisma.vendor.findMany({
                skip: args.offset || 0,
                take: args.limit || 10,
                include: { menus: true },
              });
         } catch (error) {
            return handleError(error);
         }
        },

        /**
         * Fetches orders for a given user.
         * @param {object} _ unused
         * @param {object} args
         * @param {number} args.userId The user ID for which to fetch orders.
         * @param {number} [args.limit=10] The maximum number of orders to return.
         * @param {number} [args.offset=0] The starting index of the range of orders to return.
         * @returns {Promise<Array<{ id: number; userId: number; menu_id: number; quantity: number; status: string; created_at: string; }>>}
         */
        fetchOrdersByUser: async ( _:any, args: { user_id: number; limit?: number; offset?: number }) => {
        try {
            return await prisma.order.findMany({
                where: { user_id: args.user_id },
                skip: args.offset || 0,
                take: args.limit || 10,
              });
        } catch (error) {
            return handleError(error);
        }
        },
      },
  Mutation: {
        /**
         * Creates a new user.
         * @param {object} _ unused
         * @param {object} args
         * @param {string} args.name The user's name.
         * @param {string} args.email The user's email address.
         * @param {string} args.phone The user's phone number.
         * @returns {Promise<{ id: number; name: string; email: string; phone: string; created_at: string; }>}
         */
    createUser: async (_:any, args: { name: string; email: string; phone: string }) => {
    try {
        const userSchema = z.object({
            name: z.string(),
            email: z.string().email(),
            phone: z.string(),
          });
          userSchema.parse(args);

          return await prisma.user.create({ data: args });
    } catch (error) {
     return handleError(error);
    }
    },

        /**
         * Creates a new vendor.
         * @param {object} _ unused
         * @param {object} args
         * @param {string} args.name The vendor's name.
         * @param {string} args.email The vendor's email address.
         * @param {string} args.phone The vendor's phone number.
         * @param {string} args.address The vendor's address.
         * @returns {Promise<{ id: number; name: string; email: string; phone: string; address: string; created_at: string; }>}
         */
    createVendor: async ( _:any, args: { name: string; email: string; phone: string; address: string }) => {
try {
    return await prisma.vendor.create({ data: args });
} catch (error) {
    return handleError(error);
}
    },

        /**
         * Creates a new menu.
         * @param {object} _ unused
         * @param {object} args
         * @param {number} args.vendor_id The vendor ID for which to create the menu.
         * @param {string} args.name The menu item name.
         * @param {number} args.price The menu item price.
         * @param {string} args.category The menu item category.
         * @returns {Promise<{ id: number; vendor_id: number; name: string; price: number; category: string; created_at: string; }>}
         */
    addMenu: async (_:any, args: { vendor_id: number; name: string; price: number; category: string }) => {
      try {
        const menuSchema = z.object({
            vendor_id: z.number(),
            name: z.string(),
            price: z.number().positive(),
            category: z.string(),
          });
          menuSchema.parse(args);

          return await prisma.menu.create({ data: args });
      } catch (error) {
        throw handleError(error);
      }
    },
        /**
         * Places an order for a menu item.
         * @param {object} _ unused
         * @param {object} args
         * @param {number} args.userId The user ID for which to place the order.
         * @param {number} args.menu_id The menu ID for which to place the order.
         * @param {number} args.quantity The quantity of the menu item to order.
         * @returns {Promise<{ id: number; userId: number; menu_id: number; quantity: number; status: string; created_at: string; }>}
         */
    placeOrder: async ( _:any, args: { user_id: number; menu_id: number; quantity: number }) => {
try {


    return await prisma.order.create({ data: args });

} catch (error) {

    return handleError(error)
}    },
/**
 * Updates the status of an order.
 * @param {object} args
 * @param {number} args.orderId The ID of the order to update.
 * @param {string} args.status The new status to set for the order.
 * @returns {Promise<{ id: number; userId: number; menu_id: number; quantity: number; status: string; created_at: string; }>}
 */

    updateOrderStatus: async (_:any, args: { order_id: number; status: StatusEnum }) => {
try {console.log(args)
    return await prisma.order.update({ where: { id: args.order_id }, data: { status: args.status } });

} catch (error) {
    console.log(error)
    return handleError(error)
}
    },
  },
};
