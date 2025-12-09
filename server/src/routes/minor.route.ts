import { Router } from "express";
import * as minorController from "@/controllers/minor.controller";

const router: Router = Router();

// Public route - no authentication needed for signup
router.get("/", minorController.getAllMinors);

export default router;
