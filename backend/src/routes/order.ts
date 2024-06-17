import express, { Request, Response } from 'express';
import { MenuController } from '../controller/menu';

// Create a new Router instance from Express
const router = express.Router();

/**
 * POST endpoint to add a menu item to the order.
 * @param req.body.menuItemId - The ID of the menu item to add to the order.
 * @param req.body.quantity - The quantity of the menu item to add to the order.
 */
router.post('/item', async (req: Request, res: Response) => {
    try {
        const { menuItemId, quantity } = req.body;
        const result = await new MenuController().addToOrder(
            menuItemId,
            quantity
        );
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result,
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

/**
 * GET endpoint to retrieve the entire order.
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await new MenuController().getOrder();
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result,
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

/**
 * POST endpoint to update the quantity of a menu item in the order.
 * @param req.body.menuItemId - The ID of the menu item to update in the order.
 * @param req.body.quantity - The new quantity of the menu item.
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { menuItemId, quantity } = req.body;
        const result = await new MenuController().updateOrder(
            menuItemId,
            quantity
        );
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result,
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

/**
 * GET endpoint to confirm the order.
 * Confirms the current order.
 */
router.get('/confirm-order', async (req: Request, res: Response) => {
    try {
        await new MenuController().confirmOrder();
        res.json({
            message: 'Order Confirmed',
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

/**
 * GET endpoint to retrieve a specific order item by its menuItemId.
 * @param req.params.menuItemId - The ID of the menu item.
 */
router.get('/item/:menuItemId', async (req: Request, res: Response) => {
    try {
        const menuItemId = req.params.menuItemId;
        const result = await new MenuController().getOrderItem(menuItemId);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result,
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

/**
 * GET endpoint to retrieve all order items.
 */
router.get('/item', async (req: Request, res: Response) => {
    try {
        const result = await new MenuController().getOrderItems();
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result,
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

/**
 * DELETE endpoint to remove an order item from the order.
 * @param req.body.menuItemId - The ID of the menu item to remove from the order.
 */
router.delete('/item', async (req: Request, res: Response) => {
    try {
        const { menuItemId } = req.body;
        const result = await new MenuController().removeOrderItem(menuItemId);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result,
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

export default router;
