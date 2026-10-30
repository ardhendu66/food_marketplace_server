import { Schema, Document, Types, model } from "mongoose";

export interface Order extends Document {
    user_id: Types.ObjectId;
    restaurant_id: Types.ObjectId;
    items: Object[],
    total_amount: number,
    payment_status: 'PENDING' | 'PAID' | 'FAILED',
    order_status: "PLACED" | "ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED",
    delivery_address: string,
    created_at?: Date,
    updated_at?: Date,
}

const orderSchema: Schema = new Schema<Order>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    restaurant_id: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    items: {
        type: [Object],
        required: true,
    },
    total_amount: {
        type: Number,
        required: true,
    },
    payment_status: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        required: true,
    },
    order_status: {
        type: String,
        enum: ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
        required: true,
    },
    delivery_address: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const OrderModel = model<Order>("Order", orderSchema);

export default OrderModel;