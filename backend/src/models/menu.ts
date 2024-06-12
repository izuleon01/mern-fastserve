import { Model, Schema, model } from 'mongoose';
import { MenuItemTypes } from './menuitem';

export interface MenuTypes extends Document {
    menu_id: string;
    startTime: Date;
    endTime: Date;
    menuItems: Map<string, MenuItemTypes>
}

export const menuSchema: Schema = new Schema({
    menu_id: { type: String, required: true, unique: true },
    startTime: { type: Date },
    endTime: { type: Date },
    menuItems: {
        type: Map,
        of: {
            type: Schema.Types.ObjectId,
            ref: 'MenuItem'
        }
    }
}, { _id: false });

export const MenuModel: Model<MenuTypes> = model<MenuTypes>('Menu', menuSchema);
