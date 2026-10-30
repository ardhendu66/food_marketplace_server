import redis from "../config/redis";
import { ActionNotAllowedError, ServiceNotFoundError, ServiceUnavailableError,
} from "../utils/GlobalError";
import { CartItem, Cart } from "../dtos/cart.dto";

interface AddItemOptions {
    allowReplace?: boolean;
}
const CART_TTL_SECONDS = 100 * 24 * 60 * 60;
const cartKey = (userId: string): string => `cart:${userId}`;

const createEmptyCart = (restaurantId: string): Cart => ({
    restaurantId,
    items: [],
    totalAmount: 0,
});

const calculateTotal = (items: CartItem[]): number =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const saveCart = async (userId: string, cart: Cart) => {
    cart.totalAmount = calculateTotal(cart.items);

    const result = await redis.set(
        cartKey(userId), JSON.stringify(cart), "EX", CART_TTL_SECONDS
    );

    if (result !== "OK") {
        throw new ServiceUnavailableError(
            "Saving cart failed"
        );
    }
};

const cartService = {
    getCart: async (userId: string) => {
        const cachedCart = await redis.get(cartKey(userId));
        return cachedCart ? JSON.parse(cachedCart) as Cart : null;
    },

    addItem: async (
        userId: string,
        restaurantId: string,
        menuItemId: string,
        price: number,
        options?: AddItemOptions
    ) => {
        if(!Number.isFinite(price) || price < 0) {
            throw new Error("Invalid item price");
        }

        let cart = (await cartService.getCart(userId)) ?? createEmptyCart(restaurantId);

        // Prevent mixing items from different restaurants.
        if(cart.restaurantId !== restaurantId && cart.items.length > 0) {
            if (!options?.allowReplace) {
                throw new ActionNotAllowedError(
                    "Cart already contains items from another restaurant."
                );
            }
            cart = createEmptyCart(restaurantId);
        }

        const existingItem = cart.items.find(
            (item) => item.menuItemId === menuItemId
        );

        if(existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                menuItemId,
                price,
                quantity: 1,
            });
        }

        await saveCart(userId, cart);

        return cart;
    },

    removeItem: async (
        userId: string,
        menuItemId: string
    ) => {
        const cart = await cartService.getCart(userId);

        if(!cart) {
            throw new ServiceNotFoundError(
                "Cart not found"
            );
        }

        const item = cart.items.find(
            (item) => item.menuItemId === menuItemId
        );

        if(!item) {
            throw new ServiceNotFoundError(
                "Item you want to remove was not found"
            );
        }

        item.quantity -= 1;

        if(item.quantity <= 0) {
            cart.items = cart.items.filter(
                (item) => item.menuItemId !== menuItemId
            );
        }

        if(cart.items.length === 0) {
            await redis.del(cartKey(userId));
            return null;
        }

        await saveCart(userId, cart);

        return cart;
    },

    clearCart: async (userId: string) => {
        await redis.del(cartKey(userId));
    },
};

export default cartService;