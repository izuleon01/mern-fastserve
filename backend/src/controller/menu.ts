import { MenuModel } from "../models/menu";
import { MenuItemModel, MenuItemTypes } from "../models/menuitem";
import { OrderTypes } from "../models/order";
import { OrderItemTypes } from "../models/orderitem";
import { METHOD_NOT_IMPLEMENTED } from "../shared/error";
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
            let menuItem = await MenuItemModel.findOne({ menuItem_id: id });
            if (!menuItem) {
                throw new Error("Menu item " + id + " is nonexistent")
            };
            menuItemsDto.push(
                new MenuItemDto(
                    menuItem.menuItem_id,
                    menuItem.name,
                    menuItem.description,
                    menuItem.price,
                    menuItem.imageUrl)
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
        throw new Error(METHOD_NOT_IMPLEMENTED);
    }

    async getMenuItem(menuItemId: string): Promise<MenuItemDto> {
        throw new Error(METHOD_NOT_IMPLEMENTED);
    }

    async getMenuItems(menuId: string): Promise<MenuItemTypes[]> {
        throw new Error(METHOD_NOT_IMPLEMENTED);
    }

    async addToOrder(menuItemId: string, quantity: number): Promise<OrderItemDTO> {
        throw new Error(METHOD_NOT_IMPLEMENTED);
    }

    async getOrder(): Promise<OrderDTO> {
        throw new Error(METHOD_NOT_IMPLEMENTED);
    }

    async getOrderItem(menuItemId: string): Promise<OrderItemTypes> {
        throw new Error(METHOD_NOT_IMPLEMENTED);
    }

    async getOrderItems(): Promise<OrderItemDTO[]> {
        throw new Error(METHOD_NOT_IMPLEMENTED);
    }

    async addOrderItem(menuItemId: string, quantity: number): Promise<OrderItemDTO> {
        throw new Error(METHOD_NOT_IMPLEMENTED);
    }

    async updateOrderItem(menuItemId: string, quantity: number): Promise<OrderItemDTO> {
        throw new Error(METHOD_NOT_IMPLEMENTED);
    }

    async removeOrderItem(menuItemId: string): Promise<OrderTypes> {
        throw new Error(METHOD_NOT_IMPLEMENTED);
    }

    async confirmOrder(): Promise<void> {
        throw new Error(METHOD_NOT_IMPLEMENTED);
    }

}