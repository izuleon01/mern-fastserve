import { Model, Schema, model } from 'mongoose';
import { MenuItemTypes } from './menuitem';

export interface OrderItemTypes extends Document {
    menuItem_id: MenuItemTypes;
    quantity: number;
}

export const orderItemSchema: Schema = new Schema({
    menuItem_id: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, default: 0 },
});

export const OrderItemModel: Model<OrderItemTypes> = model<OrderItemTypes>(
    'Order Item',
    orderItemSchema
);
