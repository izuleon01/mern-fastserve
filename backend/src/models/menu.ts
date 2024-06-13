import { Model, Schema, model, Document } from 'mongoose';
import { randomUUID } from 'crypto';

export interface MenuTypes extends Document {
    menu_id: string;
    startTime: string;
    endTime: string;
    menuItems: string[];
    type: 'breakfast' | 'lunch' | 'dinner';
}

export const menuSchema: Schema = new Schema({
    menu_id: { type: String, required: true, unique: true, default: randomUUID },
    startTime: { type: String },
    endTime: { type: String },
    menuItems: { type: [String] },
    type: { type: String, enum: ["breakfast", "lunch", "dinner"] }
});

menuSchema.pre('save', function (next) {
    if (typeof this.startTime !== 'string' || !this.startTime) {
        return next();
    }
    if (typeof this.endTime !== 'string' || !this.endTime) {
        return next();
    }

    const [startHours, startMinutes] = this.startTime.split(':').map(Number);
    const [endHours, endMinutes] = this.endTime.split(':').map(Number);
    if (startHours >= 8 && startMinutes <= 59 && endHours <= 11 && endMinutes <= 59) {
        this.type = 'breakfast';
        return next();
    }
    if (startHours >= 12 && startMinutes <= 59 && endHours <= 16 && endHours <= 59) {
        this.type = 'lunch';
        return next();
    }
    if (startHours >= 17 && startMinutes <= 59 && endHours <= 22 && endMinutes <= 0) {
        this.type = 'dinner';
        return next();
    }
    next();
});

export const MenuModel: Model<MenuTypes> = model<MenuTypes>('Menu', menuSchema);
