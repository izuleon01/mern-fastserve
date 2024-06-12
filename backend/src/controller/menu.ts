import { MenuItemTypes } from "../models/menuitem";
import { OrderTypes } from "../models/order";
import { OrderItemTypes } from "../models/orderitem";
import { METHOD_NOT_IMPLEMENTED } from "../shared/error";
import { MenuDTO, MenuItemDto, OrderDTO, OrderItemDTO } from "../shared/types";

export class MenuController {

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