export class NotificationDTO {
    type: string;
    notificationData: string[];

    constructor(type: string, notificationData: string[]) {
        this.type = type;
        this.notificationData = notificationData;
    }

}

export class MenuDTO {
    type: string;
    menuItems: MenuItemDto[];

    constructor(type: string, menuItems: MenuItemDto[]) {
        this.type = type;
        this.menuItems = menuItems;
    }

}

export class MenuItemDto {
    menuItemId: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;

    constructor(menuItemId: string, name: string, description: string, price: number, imageUrl: string) {
        this.menuItemId = menuItemId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
    }

}

export class OrderDTO {
    totalOrderPrice: number;
    orderItems: OrderItemDTO[];

    constructor(orderItems: OrderItemDTO[]) {
        this.totalOrderPrice = this.getTotalOrderPrice(orderItems);
        this.orderItems = orderItems;
    };

    getTotalOrderPrice(orderItems: OrderItemDTO[]): number {
        let sum = 0;
        orderItems.forEach(orderItem => {
            sum += orderItem.itemTotal;
        })
        return sum;
    };

}

export class OrderItemDTO {
    menuItemId: string;
    menuItemName: string;
    menuItemDescription: string;
    menuItemPrice: number;
    menuItemImageUrl: string;
    quantity: number;
    itemTotal: number;

    constructor(menuItemId: string, quantity: number) {
        let menuItem = this.getMenuItem();
        this.menuItemId = menuItemId;
        this.menuItemName = menuItem.name;
        this.menuItemDescription = menuItem.description;
        this.menuItemPrice = menuItem.price;
        this.menuItemImageUrl = menuItem.imageUrl;
        this.quantity = quantity;
        this.itemTotal = quantity * menuItem.price;
    }

    getMenuItem(): MenuItemDto {
        throw new Error("Method not implemented.");
    }


}
