import { Model, Schema, model } from 'mongoose';

export interface MenuItemTypes extends Document {
    menuItem_id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

export const menuItemSchema: Schema = new Schema({
    menuItem_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    imageUrl: { type: String },
}, { _id: false });

export const MenuItemModel: Model<MenuItemTypes> = model<MenuItemTypes>('Menu Item', menuItemSchema);
