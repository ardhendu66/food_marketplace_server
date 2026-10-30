// import { model, Types, Document, Schema } from "mongoose";
// import { CartItem } from "../../dtos/cart.dto";

// export interface Cart extends Document {
//     restaurantId?: Types.ObjectId,
//     items: CartItem[],
//     totalAmount: number,
// }

// const cartSchema: Schema = new Schema<Cart>({
//     restaurantId: {
//         type: Types.ObjectId,
//         required: false,
//     },
//     items: {
//         type: [{
//             menuItemId: { type: String, required: true },
//             quantity: { type: Number, required: true },
//             price: { type: Number, required: true },
//         }],
//         default: [],
//     },
//     totalAmount: {
//         type: Number,
//         required: true,
//         default: 0,
//     },
// }, { 
//     timestamps: true 
// });

// const CartModel = model<Cart>("Cart", cartSchema);

// export default CartModel;