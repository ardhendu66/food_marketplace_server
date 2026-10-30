import { Schema, Document, Types, model } from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    mobile: string;
    role: "user" | "vendor" | "delivery" | "admin";
}

const userSchema: Schema = new Schema<User>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["user", "vendor", "delivery", "admin"],
        required: true,
    },
}, {
    timestamps: true
});

const UserModel = model<User>("User", userSchema);

export default UserModel;