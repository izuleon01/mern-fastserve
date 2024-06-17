import mongoose from 'mongoose';
import { MenuModel } from '../models/menu';
import { MenuItemModel } from '../models/menuitem';
import { OrderItemModel } from '../models/orderitem';
import {
    DefaultError,
    NotFoundError,
    InvalidInputError,
} from '../shared/error';
import { isValidUUID } from '../shared/helper';
import { MenuDTO, MenuItemDto, OrderDTO, OrderItemDTO } from '../shared/types';

/**
 * Controller for managing menu-related operations.
 */
export class MenuController {
    /**
     * Adds a new menu item.
     * @param {string} name - The name of the menu item.
     * @param {string} description - The description of the menu item.
     * @param {number} price - The price of the menu item.
     * @param {string} imageUrl - The image URL of the menu item.
     * @returns {Promise<MenuItemDto>} - The created menu item DTO.
     */
    async addMenuItem(
        name: string,
        description: string,
        price: number,
        imageUrl: string
    ): Promise<MenuItemDto> {
        // Create a new MenuItemModel instance with the provided data.
        const newMenuItem = new MenuItemModel({
            name: name,
            description: description,
            price: price,
            imageUrl: imageUrl,
        });
        // Save the new menu item to the database.
        const savedMenuItem = await newMenuItem.save();
        // Return the saved menu item as a MenuItemDto.
        return new MenuItemDto(
            savedMenuItem.menuItem_id,
            savedMenuItem.name,
            savedMenuItem.description,
            savedMenuItem.price,
            savedMenuItem.imageUrl
        );
    }

    /**
     * Adds a new menu with specified menu items.
     * @param {string} startTime - The start time of the menu.
     * @param {string} endTime - The end time of the menu.
     * @param {string[]} menuItemId - Array of menu item IDs to include in the menu.
     * @returns {Promise<MenuDTO>} - The created menu DTO.
     */
    async addMenu(
        startTime: string,
        endTime: string,
        menuItemId: string[]
    ): Promise<MenuDTO> {
        let menuItemsDto: MenuItemDto[] = [];
        // Retrieve details of each menu item by its ID and add to menuItemsDto array.
        for (const id of menuItemId) {
            const menuItem = await this.getMenuItem(id);
            menuItemsDto.push(menuItem);
        }
        // Create a new MenuModel instance with the provided data.
        const newMenu = new MenuModel({
            startTime: startTime,
            endTime: endTime,
            menuItems: menuItemId,
        });
        await newMenu.save();
        // If the menu type is invalid, delete the newly created menu and throw an error.
        if (!newMenu.type) {
            await MenuModel.deleteOne({ _id: newMenu._id });
            throw Error('invalid time format or time range');
        }
        // Return the saved menu as a MenuDTO.
        return new MenuDTO(newMenu.type, menuItemsDto);
    }

    /**
     * Retrieves the currently active menu based on the current time.
     * @returns {Promise<MenuDTO>} - The active menu DTO.
     */
    async getActiveMenu(): Promise<MenuDTO> {
        const db = mongoose.connection;
        const result = await db.db.command({ isMaster: 1 });
        const now = result.localTime;
        const currentHour = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = currentHour + ':' + currentMinutes;
        let activeMenus;
        try {
            // Find active menus based on the current time.
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
        // Retrieve details of each menu item in the active menus.
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
        // Return the active menu as a MenuDTO.
        return new MenuDTO(type, menuItems);
    }

    /**
     * Retrieves a menu item by its ID.
     * @param {string} menuItemId - The ID of the menu item.
     * @returns {Promise<MenuItemDto>} - The menu item DTO.
     */
    async getMenuItem(menuItemId: string): Promise<MenuItemDto> {
        let menuItem;
        if (!menuItemId || !isValidUUID(menuItemId)) {
            throw new InvalidInputError(
                'Menu Item ID is null or invalid format'
            );
        }
        try {
            // Find the menu item by its ID.
            menuItem = await MenuItemModel.findOne({ menuItem_id: menuItemId });
        } catch (error) {
            throw new DefaultError(500, 'Something Wrong with the database');
        }
        if (!menuItem) {
            throw new NotFoundError('Menu Item ' + menuItemId + ' Not Found');
        }
        // Return the menu item as a MenuItemDto.
        return new MenuItemDto(
            menuItem.menuItem_id,
            menuItem.name,
            menuItem.description,
            menuItem.price,
            menuItem.imageUrl
        );
    }

    /**
     * Retrieves all menu items for a given menu ID.
     * @param {string} menuId - The ID of the menu.
     * @returns {Promise<MenuItemDto[]>} - Array of menu item DTOs.
     */
    async getMenuItems(menuId: string): Promise<MenuItemDto[]> {
        let menu;
        let menuItems: MenuItemDto[] = [];
        if (!menuId || !isValidUUID(menuId)) {
            throw new InvalidInputError('Menu ID is null or invalid format');
        }
        try {
            // Find the menu by its ID.
            menu = await MenuModel.findOne({ menu_id: menuId });
        } catch (error) {
            throw new DefaultError(500, 'Something Wrong with the database');
        }
        if (!menu) {
            throw new NotFoundError('Menu Item ' + menuId + ' Not Found');
        }
        // Retrieve details of each menu item in the menu.
        for (const id of menu.menuItems) {
            const menuItemDetail = await this.getMenuItem(id);
            menuItems.push(menuItemDetail);
        }
        // Return the list of menu items.
        return menuItems;
    }

    /**
     * Adds an item to the order. If the item is already in the order, update its quantity.
     * @param {string} menuItemId - The ID of the menu item.
     * @param {number} quantity - The quantity to add.
     * @returns {Promise<OrderItemDTO>} - The updated or new order item DTO.
     */
    async addToOrder(
        menuItemId: string,
        quantity: number
    ): Promise<OrderItemDTO> {
        let orderItem;
        try {
            // Check if the menu item is already in the order.
            orderItem = await OrderItemModel.findOne({
                'menuItem.menuItemId': menuItemId,
            });
        } catch (error) {
            throw new DefaultError(500, 'Database Error');
        }
        if (orderItem) {
            // Update the quantity if the item is already in the order.
            return await this.updateOrderItem(
                menuItemId,
                quantity + orderItem.quantity
            );
        } else {
            // Add the item to the order if it is not already there.
            return await this.addOrderItem(menuItemId, quantity);
        }
    }

    /**
     * Retrieves the current order.
     * @returns {Promise<OrderDTO>} - The current order DTO.
     */
    async getOrder(): Promise<OrderDTO> {
        let orderItems;
        try {
            // Retrieve all items in the order.
            orderItems = await this.getOrderItems();
        } catch (error) {
            throw new DefaultError(500, 'Database Error');
        }
        // Return the order as an OrderDTO.
        return await new OrderDTO(orderItems);
    }

    /**
     * Retrieves an order item by its menu item ID.
     * @param {string} menuItemId - The ID of the menu item.
     * @returns {Promise<OrderItemDTO>} - The order item DTO.
     */
    async getOrderItem(menuItemId: string): Promise<OrderItemDTO> {
        if (!menuItemId || !isValidUUID(menuItemId)) {
            throw new InvalidInputError('Invalid or null id');
        }
        let orderItem;
        try {
            // Find the order item by its menu item ID.
            orderItem = await OrderItemModel.findOne({
                'menuItem.menuItemId': menuItemId,
            });
        } catch (error) {
            throw new DefaultError(500, 'Database Error');
        }
        if (!orderItem) {
            throw new NotFoundError('Order Item Not found');
        }
        // Convert the order item to a MenuItemDto and return it as an OrderItemDTO.
        const menuItem = new MenuItemDto(
            orderItem.menuItem.menuItemId,
            orderItem.menuItem.name,
            orderItem.menuItem.description,
            orderItem.menuItem.price,
            orderItem.menuItem.imageUrl
        );
        return new OrderItemDTO(menuItem, orderItem.quantity);
    }

    /**
     * Retrieves all order items.
     * @returns {Promise<OrderItemDTO[]>} - Array of order item DTOs.
     */
    async getOrderItems(): Promise<OrderItemDTO[]> {
        try {
            // Find all order items.
            const orderItems = await OrderItemModel.find({});
            // Convert each order item to OrderItemDTO and return the list.
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

    /**
     * Adds a new item to the order.
     * @param {string} menuItemId - The ID of the menu item.
     * @param {number} quantity - The quantity to add.
     * @returns {Promise<OrderItemDTO>} - The created order item DTO.
     */
    async addOrderItem(
        menuItemId: string,
        quantity: number
    ): Promise<OrderItemDTO> {
        if (quantity <= 0) {
            throw new InvalidInputError('Quantity has to be more than 0');
        }
        // Retrieve the menu item details.
        let item = await this.getMenuItem(menuItemId);
        try {
            // Create a new OrderItemModel instance with the provided data.
            let newOrderItem = new OrderItemModel({
                menuItem: item,
                quantity: quantity,
            });
            await newOrderItem.save();
        } catch (error) {
            throw new DefaultError(500, 'Database Error');
        }
        // Return the new order item as an OrderItemDTO.
        return new OrderItemDTO(item, quantity);
    }

    /**
     * Updates the quantity of an item in the order.
     * @param {string} menuItemId - The ID of the menu item.
     * @param {number} quantity - The new quantity.
     * @returns {Promise<OrderItemDTO>} - The updated order item DTO.
     */
    async updateOrderItem(
        menuItemId: string,
        quantity: number
    ): Promise<OrderItemDTO> {
        if (quantity <= 0) {
            throw new InvalidInputError('Quantity has to be more than 0');
        }
        // Retrieve the menu item details.
        let item = await this.getMenuItem(menuItemId);
        try {
            // Find the order item by its menu item ID.
            let orderItem = await OrderItemModel.findOne({
                'menuItem.menuItemId': menuItemId,
            });
            if (!orderItem) {
                throw new NotFoundError('orderItem not found');
            }
            // Update the quantity of the order item.
            orderItem.quantity = quantity;
            await orderItem.save();
        } catch (error) {
            throw new DefaultError(500, 'Database Error');
        }
        // Return the updated order item as an OrderItemDTO.
        return new OrderItemDTO(item, quantity);
    }

    /**
     * Updates the quantity of an item in the order and retrieves the updated order.
     * @param {string} menuItemId - The ID of the menu item.
     * @param {number} quantity - The new quantity.
     * @returns {Promise<OrderDTO>} - The updated order DTO.
     */
    async updateOrder(menuItemId: string, quantity: number): Promise<OrderDTO> {
        await this.updateOrderItem(menuItemId, quantity);
        return this.getOrder();
    }

    /**
     * Removes an item from the order.
     * @param {string} menuItemId - The ID of the menu item.
     * @returns {Promise<OrderDTO>} - The updated order DTO.
     */
    async removeOrderItem(menuItemId: string): Promise<OrderDTO> {
        const deletedOrder = await this.getOrderItem(menuItemId);
        // Delete the order item from the database.
        await OrderItemModel.deleteOne({
            'menuItem.menuItemId': deletedOrder.menuItemId,
        });
        // Return the updated order.
        return await this.getOrder();
    }

    /**
     * Confirms the order by clearing all items.
     * @returns {Promise<void>}
     */
    async confirmOrder(): Promise<void> {
        // Delete all items in the order.
        await OrderItemModel.deleteMany({});
    }
}
