import UserModel from "../models/mongo/user.model";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";
import {
    generateAccessToken, generateRefreshToken, verifyRefreshToken
} from "../utils/jwt";
import { ConflictError, UnauthorizedError } from "../utils/GlobalError";

type User = any;
type userRole = {
    _id: Types.ObjectId;
    name: string;
    role: string;
    mobile: string;
    email: string;
}

const sanitizeUser = (user: any) => {
    const userObj = typeof user.toObject === "function" ? user.toObject() : user;
    const { password, __v, ...sanitized } = userObj;
    return sanitized;
};

const getAuthTokens = (user: userRole) => {
    const payload = { 
        _id: user._id, 
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
    };
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};

export const authService = {
    signup: async function (data: User) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await bcrypt.compare(data.password, hashedPassword)
        const user = await UserModel.create({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            role: data.role,
            password: hashedPassword,
        });

        return {
            user: sanitizeUser(user),
            ...getAuthTokens({
                _id: new Types.ObjectId(String(user._id)),
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
            }),
        };
    },

    login: async function (email: string, password: string) {
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            throw new UnauthorizedError("Invalid credentials");
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            throw new UnauthorizedError("Invalid credentials");
        }
        const tokens = getAuthTokens({
            _id: new Types.ObjectId(String(existingUser._id)),
            name: existingUser.name,
            email: existingUser.email,
            mobile: existingUser.mobile, 
            role: existingUser.role 
        });
        return {
            user: sanitizeUser(existingUser),
            ...tokens
        };
    },

    refresh: async function (token: string) {
        try {
            const { _id, name, email, mobile, role } = verifyRefreshToken(token) as userRole;
            const newAccessToken = generateAccessToken({ _id, name, email, mobile, role });
            return { accessToken: newAccessToken };
        }
        catch (err) {
            throw new UnauthorizedError("Invalid refresh token");
        }
    }
}; 