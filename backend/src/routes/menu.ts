import express, { Request, Response } from "express";
import { MenuController } from "../controller/menu";
import { METHOD_NOT_IMPLEMENTED } from "../shared/error";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const result = await new MenuController().getActiveMenu();
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        if (error.message == METHOD_NOT_IMPLEMENTED) {
            res.status(501).json({ message: METHOD_NOT_IMPLEMENTED });
            return;
        };
        res.status(500).json({
            error: error
        });
    }
});

router.get("/item/:menuItemId", async (req: Request, res: Response) => {
    try {
        const menuItemId = req.params.menuItemId;
        const result = await new MenuController().getMenuItem(menuItemId);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        if (error.message == METHOD_NOT_IMPLEMENTED) {
            res.status(501).json({ message: METHOD_NOT_IMPLEMENTED });
            return;
        };
        res.status(500).json({
            error: error
        });
    }
});

router.get("/:menuId", async (req: Request, res: Response) => {
    try {
        const menuId = req.params.menuId;
        const result = await new MenuController().getMenuItems(menuId);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        if (error.message == METHOD_NOT_IMPLEMENTED) {
            res.status(501).json({ message: METHOD_NOT_IMPLEMENTED })
            return;
        };
        res.status(500).json({
            error: error
        });
    }
});


export default router;
