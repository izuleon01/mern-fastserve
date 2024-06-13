import { Model, Schema, model } from 'mongoose';
import { OrderItemTypes } from './orderitem';

export interface OrderTypes extends Document {
    orderItems: Map<string, OrderItemTypes>;
}

export const orderSchema: Schema = new Schema({
    orderItems: {
        type: Map,
        of: {
            type: Schema.Types.ObjectId,
            ref: 'Order Item',
        },
    },
});

export const OrderModel: Model<OrderTypes> = model<OrderTypes>(
    'Order',
    orderSchema
);
