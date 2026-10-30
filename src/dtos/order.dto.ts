interface OrderModelDto {
    createOrder: (order: Object) => {};
    findOrderById: (order_id: string) => {};
    findOrdersByUser: (user_id: string) => {};
    findRestaurantOrders: (restaurant_id: string) => {};
    updateOrderStatus: (order_id: string, order_status: string) => {};
    updatePaymentStatus: (order_id: string, payment_status: string) => {};
}

interface OrderCreationAttributes {
    restaurant_id: string;
    delivery_address: string;
}

export { OrderModelDto, OrderCreationAttributes };