interface CreateMenuItemDTO {
    restaurantId: string;
    name: string;
    description?: string;
    price: number;
    available: boolean;
    imageUrl?: string;
    category?: string;
}

interface UpdateMenuItemDTO {
    name?: string;
    description?: string;
    price?: number;
    available?: boolean;
    imageUrl?: string;
    category?: string;
}

export { CreateMenuItemDTO, UpdateMenuItemDTO };