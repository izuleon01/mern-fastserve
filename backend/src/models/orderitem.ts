import { Model, Schema, model, Document } from 'mongoose';
import { MenuItemDto } from '../shared/types';

export interface OrderItemTypes extends Document {
    menuItem: MenuItemDto;
    quantity: number;
}

export const orderItemSchema: Schema = new Schema({
    menuItem: { type: Object, required: true },
    quantity: { type: Number, default: 0 },
});

export const OrderItemModel: Model<OrderItemTypes> = model<OrderItemTypes>(
    'Order Item',
    orderItemSchema
);
