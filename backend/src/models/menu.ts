import { Model, Schema, model, Document } from 'mongoose';
import { MenuItemTypes } from './menuitem';
import { randomUUID } from 'crypto';

export interface MenuTypes extends Document {
    menu_id: string;
    startTime: Date;
    endTime: Date;
    menuItems: Map<string, MenuItemTypes>;
    type: string;
}

export const menuSchema: Schema = new Schema({
    menu_id: { type: String, required: true, unique: true, default: randomUUID },
    startTime: { type: Date },
    endTime: { type: Date },
    menuItems: {
        type: Map,
        of: {
            type: Object,
            ref: 'Menu Item'
        }
    },
    type: { type: String, required: true, enum: ["breakfast", "lunch", "dinner"] }
});


export const MenuModel: Model<MenuTypes> = model<MenuTypes>('Menu', menuSchema);
