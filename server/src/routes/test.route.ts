import { Router } from "express";
import * as testController from "@/controllers/test.controller";

const router: Router = Router();

router.get("/email-config", testController.testEmailConfig);
router.post("/email", testController.testEmail);

export default router;
