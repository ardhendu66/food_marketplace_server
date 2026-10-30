// import OrderModel from "../models/mongo/order.model";
// // import CartModel from "../models/mongo/cart.model";
// import { BadRequestError, ServiceNotFoundError } from "../utils/GlobalError";
// import restaurantService from "./restaurant.service";
// import { OrderCreationAttributes } from "../dtos/order.dto";
// import { getIo } from "../socket";

// const orderService = {
//     checkout: async (user_id: string, order_details: OrderCreationAttributes) => {
//         console.log(order_details);

//         // 1. Fetch the user's cart from MongoDB
//         const cart = await CartModel.findOne({ userId: user_id });
//         if (!cart || cart.items.length === 0) {
//             throw new ServiceNotFoundError("Cart is empty, add item to cart.");
//         }
        
//         // 2. Validate restaurant details
//         const restaurant = await restaurantService.getRestaurantById(
//             order_details.restaurant_id
//         );
//         if (!restaurant) {
//             throw new ServiceNotFoundError("Provide correct restaurant details");
//         }

//         // 3. Calculate total amount using the fetched cart document items
//         const total_amount = cart.items.reduce(
//             (sum, item) => sum + (item.price * item.quantity), 0
//         );

//         // 4. Create the new order document in MongoDB (added await)
//         const newOrder = await OrderModel.create({
//             user_id,
//             restaurant_id: order_details.restaurant_id,
//             items: cart.items,
//             total_amount,
//             payment_status: 'PENDING',
//             order_status: 'PLACED',
//             delivery_address: order_details.delivery_address,
//         });

//         if(!newOrder) {
//             throw new BadRequestError("Failed to create order, please try again.");
//         }
        
//         await CartModel.deleteOne({ userId: user_id });

//         return newOrder;
//     },
    
//     getAllOrdersOfUser: async (userId: string) => {
//         return await OrderModel.findOne({ userId });
//     },
    
//     getSingleOrder: async (order_id: string) => {
//         return await OrderModel.findById(order_id);
//     },
    
//     getAllOrdersOfRestaurants: async (restaurantId: string) => {
//         return await OrderModel.findOne({ restaurantId });
//     },
    
//     updateStatusOfAOrder: async (orderId: string, order_status: string) => {
//         const order = await OrderModel.findByIdAndUpdate(orderId, {
//             $set: { order_status }
//         });
//         if(!order) {
//             throw new ServiceNotFoundError("Order not found");
//         }
//         return order;
//     },
    
//     updatePaymentStatusOfAOrder: async (orderId: string, payment_status: string) => {
//         const order = await OrderModel.findByIdAndUpdate(orderId, {
//             $set: { payment_status }
//         });
//         if(!order) {
//             throw new ServiceNotFoundError("Order not found");
//         }
//         return order;
//     }
// }

// export default orderService;