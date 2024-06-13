import { MenuModel } from "../models/menu";
import { MenuItemModel, MenuItemTypes } from "../models/menuitem";
import { OrderTypes } from "../models/order";
import { OrderItemTypes } from "../models/orderitem";
import { DefaultError, MethodNotImplementedError, NotFoundError, InvalidInputError } from "../shared/error";
import { isValidUUID } from "../shared/helper";
import { MenuDTO, MenuItemDto, OrderDTO, OrderItemDTO } from "../shared/types";

export class MenuController {

    async addMenuItem(name: string, description: string, price: number, imageUrl: string): Promise<MenuItemDto> {
        const newMenuItem = new MenuItemModel({
            name: name,
            description: description,
            price: price,
            imageUrl: imageUrl
        })
        const savedMenuItem = await newMenuItem.save();
        return new MenuItemDto(
            savedMenuItem.menuItem_id,
            savedMenuItem.name,
            savedMenuItem.description,
            savedMenuItem.price,
            savedMenuItem.imageUrl
        );
    }

    async addMenu(startTime: string, endTime: string, menuItemId: string[]): Promise<MenuDTO> {
        let menuItemsDto: MenuItemDto[] = [];
        for (const id of menuItemId) {
            const menuItem = await this.getMenuItem(id)
            menuItemsDto.push(
                menuItem
            );
        }
        const newMenu = new MenuModel({
            startTime: startTime,
            endTime: endTime,
            menuItems: menuItemId
        });
        await newMenu.save();
        if (!newMenu.type) {
            await MenuModel.deleteOne({ _id: newMenu._id })
            throw Error("invalid time format or time range")
        }
        return new MenuDTO(newMenu.type, menuItemsDto)
    }

    async getActiveMenu(): Promise<MenuDTO> {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTime = currentHour + ":" + currentMinutes;
        let activeMenus;
        try {
            activeMenus = await MenuModel.find({
                $expr: {
                    $and: [
                        { $lte: [{ $substr: ["$startTime", 0, 5] }, currentTime] },
                        { $gte: [{ $substr: ["$endTime", 0, 5] }, currentTime] }
                    ]
                }
            })
        } catch (error) {
            throw new DefaultError(500, "Something Wrong with the database")
        }
        if (activeMenus.length === 0) {
            throw new NotFoundError("No active menu found")
        }
        let menuItems: MenuItemDto[] = [];
        let type = "asd";
        for (const activeMenu of activeMenus) {
            const menuItemDetail = await this.getMenuItems(activeMenu.menu_id);
            menuItems = menuItems.concat(menuItemDetail);
            if (!type) {
                type = activeMenu.type;
            }
        }
        if (menuItems.length === 0) {
            throw new NotFoundError("No menu item found")
        }
        return new MenuDTO(
            type, menuItems
        )
    }

    async getMenuItem(menuItemId: string): Promise<MenuItemDto> {
        let menuItem;
        if (!menuItemId || !isValidUUID(menuItemId)) {
            throw new InvalidInputError("Menu Item ID is null or invalid format")
        }
        try {
            menuItem = await MenuItemModel.findOne({ menuItem_id: menuItemId });
        } catch (error) {
            throw new DefaultError(500, "Something Wrong with the database")
        }
        if (!menuItem) {
            throw new NotFoundError("Menu Item " + menuItemId + " Not Found")
        };
        return new MenuItemDto(
            menuItem.menuItem_id,
            menuItem.name,
            menuItem.description,
            menuItem.price,
            menuItem.imageUrl);
    }

    async getMenuItems(menuId: string): Promise<MenuItemDto[]> {
        let menu;
        let menuItems: MenuItemDto[] = [];
        if (!menuId || !isValidUUID(menuId)) {
            throw new InvalidInputError("Menu ID is null or invalid format")
        }
        try {
            menu = await MenuModel.findOne({ menu_id: menuId });
        } catch (error) {
            throw new DefaultError(500, "Something Wrong with the database")
        }
        if (!menu) {
            throw new NotFoundError("Menu Item " + menuId + " Not Found")
        };
        for (const id of menu.menuItems) {
            const menuItemDetail = await this.getMenuItem(id);
            menuItems.push(menuItemDetail);
        }
        return menuItems
    }

    async addToOrder(menuItemId: string, quantity: number): Promise<OrderItemDTO> {
        throw new MethodNotImplementedError()
    }

    async getOrder(): Promise<OrderDTO> {
        throw new MethodNotImplementedError()
    }

    async getOrderItem(menuItemId: string): Promise<OrderItemTypes> {
        throw new MethodNotImplementedError()
    }

    async getOrderItems(): Promise<OrderItemDTO[]> {
        throw new MethodNotImplementedError()
    }

    async addOrderItem(menuItemId: string, quantity: number): Promise<OrderItemDTO> {
        throw new MethodNotImplementedError()
    }

    async updateOrderItem(menuItemId: string, quantity: number): Promise<OrderItemDTO> {
        throw new MethodNotImplementedError()
    }

    async removeOrderItem(menuItemId: string): Promise<OrderTypes> {
        throw new MethodNotImplementedError()
    }

    async confirmOrder(): Promise<void> {
        throw new MethodNotImplementedError()
    }

}