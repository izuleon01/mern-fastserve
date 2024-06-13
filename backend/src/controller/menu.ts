import { MenuModel } from "../models/menu";
import { MenuItemModel, MenuItemTypes } from "../models/menuitem";
import { OrderTypes } from "../models/order";
import { OrderItemTypes } from "../models/orderitem";
import { MethodNotImplementedError, NotFoundError } from "../shared/error";
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
        throw new MethodNotImplementedError()
    }

    async getMenuItem(menuItemId: string): Promise<MenuItemDto> {
        let menuItem = await MenuItemModel.findOne({ menuItem_id: menuItemId });
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

    async getMenuItems(menuId: string): Promise<MenuItemTypes[]> {
        throw new MethodNotImplementedError()
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