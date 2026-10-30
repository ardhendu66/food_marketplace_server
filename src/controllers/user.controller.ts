import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { catchAsync } from "../utils/catchAsync";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ServiceNotFoundError, ServiceUnavailableError } from "../utils/GlobalError";

// get profile: User
const getMyProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    console.log(`GET /api/v1/users/me`);
    const user = await userService.getUserById(req.user!._id);
    if (!user) {
        throw new ServiceNotFoundError("User not found");
    }
    return res.status(200).json({ user });
})

// get user-lists: Admin
const getAllUsers = catchAsync(async (req: AuthRequest, res: Response) => {
    console.log(`GET /api/v1/admin/users/all`);
    const users = await userService.getAllUsers();
    return res.status(200).json({ users });
});

// update profile: User
const updateMyProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    console.log(`PUT /api/v1/users/me`);
    const updates = req.body;
    const updated = await userService.updateUserProfileById(req.user!._id, updates);
    return res.status(200).json({ message: "user Profile updated", user: updated });
});

// update user role: Admin
const updateUserRole = catchAsync(async (req: AuthRequest, res: Response) => {
    const { _id } = req.params;
    console.log(`PUT /api/v1/admin/users/${_id}/role`);
    const { role } = req.body;
    const updated = await userService.updateUserRole(_id as string, role);
    if(!updated) {
        throw new ServiceNotFoundError("User not found");
    }
    return res.status(202).json({ message: "Role of user updated", user: updated });
});

// delete user: Admin
const deleteUser = catchAsync(async (req: AuthRequest, res: Response) => {
    const { _id } = req.params;
    console.log(`DELETE /api/v1/admin/users/${_id}/delete`);
    const deleted = await userService.deleteUser(_id as string);
    if(!deleted) {
        throw new ServiceUnavailableError("User not deleted");
    }
    return res.status(202).json({ message: "User deleted successfully" });
});

export {
    getMyProfile, getAllUsers, updateMyProfile, updateUserRole, deleteUser
};