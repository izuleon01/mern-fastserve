import mongoose from 'mongoose';
import { MenuModel } from '../models/menu';
import { MenuItemModel } from '../models/menuitem';
import { OrderItemModel } from '../models/orderitem';
import {
    DefaultError,
    MethodNotImplementedError,
    NotFoundError,
    InvalidInputError,
} from '../shared/error';
import { isValidUUID } from '../shared/helper';
import { MenuDTO, MenuItemDto, OrderDTO, OrderItemDTO } from '../shared/types';

export class MenuController {
    async addMenuItem(
        name: string,
        description: string,
        price: number,
        imageUrl: string
    ): Promise<MenuItemDto> {
        const newMenuItem = new MenuItemModel({
            name: name,
            description: description,
            price: price,
            imageUrl: imageUrl,
        });
        const savedMenuItem = await newMenuItem.save();
        return new MenuItemDto(
            savedMenuItem.menuItem_id,
            savedMenuItem.name,
            savedMenuItem.description,
            savedMenuItem.price,
            savedMenuItem.imageUrl
        );
    }

    async addMenu(
        startTime: string,
        endTime: string,
        menuItemId: string[]
    ): Promise<MenuDTO> {
        let menuItemsDto: MenuItemDto[] = [];
        for (const id of menuItemId) {
            const menuItem = await this.getMenuItem(id);
            menuItemsDto.push(menuItem);
        }
        const newMenu = new MenuModel({
            startTime: startTime,
            endTime: endTime,
            menuItems: menuItemId,
        });
        await newMenu.save();
        if (!newMenu.type) {
            await MenuModel.deleteOne({ _id: newMenu._id });
            throw Error('invalid time format or time range');
        }
        return new MenuDTO(newMenu.type, menuItemsDto);
    }

    async getActiveMenu(): Promise<MenuDTO> {
        const db = mongoose.connection;
        const result = await db.db.command({ isMaster: 1 });
        const now = result.localTime;
        const currentHour = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = currentHour + ':' + currentMinutes;
        let activeMenus;
        try {
            activeMenus = await MenuModel.find({
                $expr: {
                    $and: [
                        {
                            $lte: [
                                { $substr: ['$startTime', 0, 5] },
                                currentTime,
                            ],
                        },
                        {
                            $gte: [
                                { $substr: ['$endTime', 0, 5] },
                                currentTime,
                            ],
                        },
                    ],
                },
            });
        } catch (error) {
            throw new DefaultError(500, 'Something Wrong with the database');
        }
        if (activeMenus.length === 0) {
            throw new NotFoundError('No active menu found');
        }
        let menuItems: MenuItemDto[] = [];
        let type = '';
        for (const activeMenu of activeMenus) {
            const menuItemDetail = await this.getMenuItems(activeMenu.menu_id);
            menuItems = menuItems.concat(menuItemDetail);
            if (type === '') {
                type = activeMenu.type;
            }
        }
        if (menuItems.length === 0) {
            throw new NotFoundError('No menu item found');
        }
        return new MenuDTO(type, menuItems);
    }

    async getMenuItem(menuItemId: string): Promise<MenuItemDto> {
        let menuItem;
        if (!menuItemId || !isValidUUID(menuItemId)) {
            throw new InvalidInputError(
                'Menu Item ID is null or invalid format'
            );
        }
        try {
            menuItem = await MenuItemModel.findOne({ menuItem_id: menuItemId });
        } catch (error) {
            throw new DefaultError(500, 'Something Wrong with the database');
        }
        if (!menuItem) {
            throw new NotFoundError('Menu Item ' + menuItemId + ' Not Found');
        }
        return new MenuItemDto(
            menuItem.menuItem_id,
            menuItem.name,
            menuItem.description,
            menuItem.price,
            menuItem.imageUrl
        );
    }

    async getMenuItems(menuId: string): Promise<MenuItemDto[]> {
        let menu;
        let menuItems: MenuItemDto[] = [];
        if (!menuId || !isValidUUID(menuId)) {
            throw new InvalidInputError('Menu ID is null or invalid format');
        }
        try {
            menu = await MenuModel.findOne({ menu_id: menuId });
        } catch (error) {
            throw new DefaultError(500, 'Something Wrong with the database');
        }
        if (!menu) {
            throw new NotFoundError('Menu Item ' + menuId + ' Not Found');
        }
        for (const id of menu.menuItems) {
            const menuItemDetail = await this.getMenuItem(id);
            menuItems.push(menuItemDetail);
        }
        return menuItems;
    }

    async addToOrder(
        menuItemId: string,
        quantity: number
    ): Promise<OrderItemDTO> {
        let orderItem;
        try {
            orderItem = await OrderItemModel.findOne({
                'menuItem.menuItemId': menuItemId,
            });
        } catch (error) {
            throw new DefaultError(500, 'Database Error');
        }
        if (orderItem) {
            console.log('upda');
            return await this.updateOrderItem(
                menuItemId,
                quantity + orderItem.quantity
            );
        } else {
            return await this.addOrderItem(menuItemId, quantity);
        }
    }

    async getOrder(): Promise<OrderDTO> {
        let orderItems;
        try {
            orderItems = await this.getOrderItems();
        } catch (error) {
            throw new DefaultError(500, 'Database Error');
        }
        return await new OrderDTO(orderItems);
    }

    async getOrderItem(menuItemId: string): Promise<OrderItemDTO> {
        if (!menuItemId || !isValidUUID) {
            throw new InvalidInputError('Invalid or null id');
        }
        let orderItem;
        try {
            orderItem = await OrderItemModel.findOne({
                'menuItem.menuItemId': menuItemId,
            });
        } catch (error) {
            throw new DefaultError(500, 'Database Error');
        }
        if (!orderItem) {
            throw new NotFoundError('Order Item Not found');
        }
        const menuItem = new MenuItemDto(
            orderItem.menuItem.menuItemId,
            orderItem.menuItem.name,
            orderItem.menuItem.description,
            orderItem.menuItem.price,
            orderItem.menuItem.imageUrl
        );
        return new OrderItemDTO(menuItem, orderItem.quantity);
    }

    async getOrderItems(): Promise<OrderItemDTO[]> {
        try {
            const orderItems = await OrderItemModel.find({});
            return orderItems.map(
                (item) =>
                    new OrderItemDTO(
                        new MenuItemDto(
                            item.menuItem.menuItemId,
                            item.menuItem.name,
                            item.menuItem.description,
                            item.menuItem.price,
                            item.menuItem.imageUrl
                        ),
                        item.quantity
                    )
            );
        } catch (error) {
            throw new DefaultError(500, 'Database Error');
        }
    }

    async addOrderItem(
        menuItemId: string,
        quantity: number
    ): Promise<OrderItemDTO> {
        if (quantity <= 0) {
            throw new InvalidInputError('Quantity has to be more than 0');
        }
        let item = await this.getMenuItem(menuItemId);
        try {
            let newOrderItem = new OrderItemModel({
                menuItem: item,
                quantity: quantity,
            });
            await newOrderItem.save();
        } catch (error) {
            throw new DefaultError(500, 'Database Error');
        }
        return new OrderItemDTO(item, quantity);
    }

    async updateOrderItem(
        menuItemId: string,
        quantity: number
    ): Promise<OrderItemDTO> {
        if (quantity <= 0) {
            throw new InvalidInputError('Quantity has to be more than 0');
        }
        let item = await this.getMenuItem(menuItemId);
        try {
            let orderItem = await OrderItemModel.findOne({
                'menuItem.menuItemId': menuItemId,
            });
            if (!orderItem) {
                throw new NotFoundError('orderItem not found');
            }
            orderItem.quantity = quantity;
            await orderItem.save();
        } catch (error) {
            throw new DefaultError(500, 'Database Error');
        }
        return new OrderItemDTO(item, quantity);
    }

    async updateOrder(menuItemId: string, quantity: number): Promise<OrderDTO> {
        await this.updateOrderItem(menuItemId, quantity);
        return this.getOrder();
    }

    async removeOrderItem(menuItemId: string): Promise<OrderDTO> {
        const deletedOrder = await this.getOrderItem(menuItemId);
        await OrderItemModel.deleteOne({
            'menuItem.menuItemId': deletedOrder.menuItemId,
        });
        return await this.getOrder();
    }

    async confirmOrder(): Promise<void> {
        await OrderItemModel.deleteMany({});
    }
}
