/**
 * Represents a notification data transfer object.
 */
export class NotificationDTO {
    type: string;
    notificationData: string[];

    /**
     * Initialize a new NotificationDTO object.
     * @param type - The type of notification.
     * @param notificationData - Array of notification data.
     */
    constructor(type: string, notificationData: string[]) {
        this.type = type;
        this.notificationData = notificationData;
    }
}

/**
 * Represents a menu data transfer object.
 */
export class MenuDTO {
    type: string;
    menuItems: MenuItemDto[];

    /**
     * Initialize a new MenuDTO object.
     * @param type - The type of menu.
     * @param menuItems - Array of MenuItemDto objects.
     */
    constructor(type: string, menuItems: MenuItemDto[]) {
        this.type = type;
        this.menuItems = menuItems;
    }
}

/**
 * Represents a menu item data transfer object.
 */
export class MenuItemDto {
    menuItemId: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;

    /**
     * Initialize a new MenuItemDto object.
     * @param menuItemId - The ID of the menu item.
     * @param name - The name of the menu item.
     * @param description - The description of the menu item.
     * @param price - The price of the menu item.
     * @param imageUrl - The URL of the menu item's image.
     */
    constructor(
        menuItemId: string,
        name: string,
        description: string,
        price: number,
        imageUrl: string
    ) {
        this.menuItemId = menuItemId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
    }
}

/**
 * Represents an order data transfer object.
 */
export class OrderDTO {
    totalOrderPrice: number;
    orderItems: OrderItemDTO[];

    /**
     * Initialize a new OrderDTO object.
     * @param orderItems - Array of OrderItemDTO objects.
     */
    constructor(orderItems: OrderItemDTO[]) {
        this.orderItems = orderItems;
        this.totalOrderPrice = this.getTotalOrderPrice(orderItems);
    }

    /**
     * Calculate the total order price based on order items.
     * @param orderItems - Array of OrderItemDTO objects.
     * @returns The total order price.
     */
    getTotalOrderPrice(orderItems: OrderItemDTO[]): number {
        let sum = 0;
        orderItems.forEach((orderItem) => {
            sum += orderItem.itemTotal;
        });
        return sum;
    }
}

/**
 * Represents an order item data transfer object.
 */
export class OrderItemDTO {
    menuItemId: string;
    menuItemName: string;
    menuItemDescription: string;
    menuItemPrice: number;
    menuItemImageUrl: string;
    quantity: number;
    itemTotal: number;

    /**
     * Initialize a new OrderItemDTO object.
     * @param menuItemDto - The ID of the menu item.
     * @param quantity - The quantity of the menu item in the order.
     */
    constructor(menuItemDto: MenuItemDto, quantity: number) {
        this.menuItemId = menuItemDto.menuItemId;
        this.menuItemName = menuItemDto.name;
        this.menuItemDescription = menuItemDto.description;
        this.menuItemPrice = menuItemDto.price;
        this.menuItemImageUrl = menuItemDto.imageUrl;
        this.quantity = quantity;
        this.itemTotal = quantity * menuItemDto.price;
    }
}
