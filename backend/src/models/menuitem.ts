import { randomUUID } from 'crypto';
import { Model, Schema, model, Document } from 'mongoose';

export interface MenuItemTypes extends Document {
    menuItem_id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

export const menuItemSchema: Schema = new Schema({
    menuItem_id: { type: String, required: true, unique: true, default: randomUUID },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    imageUrl: { type: String },
});

export const MenuItemModel: Model<MenuItemTypes> = model<MenuItemTypes>('Menu Item', menuItemSchema);
