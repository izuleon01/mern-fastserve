import { randomUUID } from 'crypto';
import { Model, Schema, model, Document } from 'mongoose';

// Define the interface for MenuItemTypes, extending Mongoose's Document interface
export interface MenuItemTypes extends Document {
    menuItem_id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

// Create a schema for Menu Item
export const menuItemSchema: Schema = new Schema({
    menuItem_id: {
        type: String,
        required: true,
        unique: true,
        default: randomUUID, // Automatically generate a UUID for menuItem_id
    },
    name: { type: String, required: true }, // Define name as a required string
    description: { type: String }, // Define description as an optional string
    price: { type: Number, default: 0 }, // Define price as a number with a default value of 0
    imageUrl: { type: String }, // Define imageUrl as an optional string
});

// Create and export the MenuItem model using the schema and interface
export const MenuItemModel: Model<MenuItemTypes> = model<MenuItemTypes>(
    'Menu Item',
    menuItemSchema
);
