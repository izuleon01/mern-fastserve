import { Model, Schema, model, Document } from 'mongoose';
import { MenuItemDto } from '../shared/types';

// Define the interface for OrderItemTypes, extending Mongoose's Document interface
export interface OrderItemTypes extends Document {
    menuItem: MenuItemDto; // A menu item associated with the order
    quantity: number; // The quantity of the menu item ordered
}

// Create a schema for Order Item
export const orderItemSchema: Schema = new Schema({
    menuItem: { type: Object, required: true }, // Define menuItem as a required object
    quantity: { type: Number, default: 0 }, // Define quantity as a number with a default value of 0
});

// Create and export the OrderItem model using the schema and interface
export const OrderItemModel: Model<OrderItemTypes> = model<OrderItemTypes>(
    'Order Item',
    orderItemSchema
);
