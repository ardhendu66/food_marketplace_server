import UserModel from "../models/mongo/user.model";
import { ServiceNotFoundError } from "../utils/GlobalError";

type AllInputs = {
    profileInputs: {
        name: string | undefined | null;
        email: string | undefined | null;
        mobile: string | undefined | null;
    }
}

const userService = {
    getUserById: async (userId: string) => {
        const user = await UserModel.findById(userId);
        if(!user) {
            throw new ServiceNotFoundError("User not found");
        }
        return user;
    },

    getAllUsers: async () => {
        const users = await UserModel.find();
        if(!users || users.length === 0) {
            throw new ServiceNotFoundError("No users found");
        }
        return users;
    },
    // update user profile(name, email, mobile) by id or email
    updateUserProfileById: async (userId: string, profileDetails: AllInputs["profileInputs"]) => {
        const user = await UserModel.findById(userId);
        if(!user) {
            throw new ServiceNotFoundError("User not found");
        }
        if(profileDetails.name && profileDetails.name !== user.name) {
            user.name = profileDetails.name;
        }
        if(profileDetails.email && profileDetails.email !== user.email) {
            user.email = profileDetails.email;
        }
        if(profileDetails.mobile && profileDetails.mobile !== user.mobile) {
            user.mobile = profileDetails.mobile;
        }
        return await user.save();
    },
    // update user role by id
    updateUserRole: async (userId: string, role: string) => {    
        const user = await UserModel.findByIdAndUpdate(userId, {
            $set: { role }
        });
        if(!user) {
            throw new ServiceNotFoundError("User not found");
        }
        return user;
    },
    // delete user by id or email
    deleteUser: async(userId: string) => { 
        const user = await UserModel.findByIdAndDelete(userId);
        if(!user) {
            throw new ServiceNotFoundError("User not found");
        }
        return user;
    },
}

export { userService };