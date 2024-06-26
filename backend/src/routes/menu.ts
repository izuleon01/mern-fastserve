import express, { Request, Response } from 'express';
import { MenuController } from '../controller/menu';

// Create a new Router instance from Express
const router = express.Router();

/**
 * GET endpoint to retrieve the active menu.
 * Fetches the currently active menu from the MenuController.
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await new MenuController().getActiveMenu();
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result,
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

/**
 * POST endpoint to add a new menu.
 * @param req.body.startTime - The start time of the menu.
 * @param req.body.endTime - The end time of the menu.
 * @param req.body.menuItems - Array of menu item IDs associated with the menu.
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { startTime, endTime, menuItems } = req.body;
        const result = await new MenuController().addMenu(
            startTime,
            endTime,
            menuItems
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
 * POST endpoint to add a new menu item.
 * @param req.body.name - The name of the menu item.
 * @param req.body.description - The description of the menu item.
 * @param req.body.price - The price of the menu item.
 * @param req.body.imageUrl - The image URL of the menu item.
 */
router.post('/item', async (req: Request, res: Response) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        const result = await new MenuController().addMenuItem(
            name,
            description,
            price,
            imageUrl
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
 * GET endpoint to retrieve a menu item by its menuItemId.
 * @param req.params.menuItemId - The ID of the menu item.
 */
router.get('/item/:menuItemId', async (req: Request, res: Response) => {
    try {
        const menuItemId = req.params.menuItemId;
        const result = await new MenuController().getMenuItem(menuItemId);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result,
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

/**
 * GET endpoint to retrieve all menu items under a specific menu.
 * @param req.params.menuId - The ID of the menu.
 */
router.get('/:menuId', async (req: Request, res: Response) => {
    try {
        const menuId = req.params.menuId;
        const result = await new MenuController().getMenuItems(menuId);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result,
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

export default router;
