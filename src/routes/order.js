import { confirmOrder, createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/order/order.js";
import { verifyToken } from "../middleware/auth.js";

export const orderRoutes = async (fastify, options) => {
    fastify.addHook("preHandler", async (request, reply) => {
        const isAuthenticated = await verifyToken(request, reply);
        if (!isAuthenticated) {
            return reply.code(401).send({ message: "Unauthenticated" });
        }
    });

    fastify.post('/order', createOrder); // Create a new order
    fastify.get('/order', getOrders); // Get all orders
    fastify.patch('/order/:orderId/status', updateOrderStatus); // Update order status
    fastify.post('/order/:orderId/confirm', confirmOrder); // Confirm an order
    fastify.get('/order/:orderId', getOrderById); // Get order by ID (changed from post to get)
};
