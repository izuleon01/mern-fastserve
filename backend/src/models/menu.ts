import { Model, Schema, model, Document } from 'mongoose';
import { randomUUID } from 'crypto';

// Define the interface for MenuTypes, extending Mongoose's Document interface
export interface MenuTypes extends Document {
    menu_id: string;
    startTime: string;
    endTime: string;
    menuItems: string[];
    type: 'breakfast' | 'lunch' | 'dinner';
}

// Create a schema for Menu
export const menuSchema: Schema = new Schema({
    menu_id: {
        type: String,
        required: true,
        unique: true,
        default: randomUUID, // Generate a unique UUID by default
    },
    startTime: { type: String }, // Define startTime as a string
    endTime: { type: String }, // Define endTime as a string
    menuItems: { type: [String] }, // Define menuItems as an array of strings
    type: { type: String, enum: ['breakfast', 'lunch', 'dinner'] }, // Define type with limited enum values
});

// Middleware that runs before saving a Menu document
menuSchema.pre('save', function (next) {
    // Check if startTime is not a string or is empty
    if (typeof this.startTime !== 'string' || !this.startTime) {
        return next();
    }
    // Check if endTime is not a string or is empty
    if (typeof this.endTime !== 'string' || !this.endTime) {
        return next();
    }

    // Split startTime and endTime into hours and minutes
    const [startHours, startMinutes] = this.startTime.split(':').map(Number);
    const [endHours, endMinutes] = this.endTime.split(':').map(Number);

    // Check if the time range falls within breakfast hours
    if (
        startHours >= 8 &&
        startMinutes <= 59 &&
        endHours <= 11 &&
        endMinutes <= 59
    ) {
        this.type = 'breakfast'; // Set type to breakfast
        return next();
    }
    // Check if the time range falls within lunch hours
    if (
        startHours >= 12 &&
        startMinutes <= 59 &&
        endHours <= 16 &&
        endMinutes <= 59
    ) {
        this.type = 'lunch'; // Set type to lunch
        return next();
    }
    // Check if the time range falls within dinner hours
    if (
        startHours >= 17 &&
        startMinutes <= 59 &&
        endHours <= 22 &&
        endMinutes <= 0
    ) {
        this.type = 'dinner'; // Set type to dinner
        return next();
    }
    next();
});

// Create and export the Menu model using the schema and interface
export const MenuModel: Model<MenuTypes> = model<MenuTypes>('Menu', menuSchema);
