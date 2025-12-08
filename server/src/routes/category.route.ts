import { Router } from "express";
import * as categoryController from "../controllers/category.controller";

const categoryRouter: Router = Router();

categoryRouter.get("/categories", categoryController.getAllCategories);
categoryRouter.get("/subcategories", categoryController.getAllSubcategories);
categoryRouter.get(
  "/subcategories/:categoryName",
  categoryController.getSubcategoriesByCategory
);
categoryRouter.get("/areas", categoryController.getAllAreas);
categoryRouter.get("/areas/:programId", categoryController.getAreasByProgramId);

export default categoryRouter;
