import { Request, Response } from "express";
import * as categoryService from "@/services/category.service";
import logger from "../config/logger";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    logger.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllSubcategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subcategories = await categoryService.getAllSubcategories();

    res.status(200).json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    logger.error("Error fetching subcategories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subcategories",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getSubcategoriesByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryName } = req.params;

    if (!categoryName) {
      res.status(400).json({
        success: false,
        message: "Category name is required",
      });
      return;
    }

    const subcategories = await categoryService.getSubcategoriesByCategory(
      categoryName
    );

    res.status(200).json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    logger.error("Error fetching subcategories by category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subcategories",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllAreas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const areas = await categoryService.getAllAreas();

    res.status(200).json({
      success: true,
      data: areas,
    });
  } catch (error) {
    logger.error("Error fetching areas:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch areas",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAreasByProgramId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { programId } = req.params;

    if (!programId) {
      res.status(400).json({
        success: false,
        message: "Program ID is required",
      });
      return;
    }

    const areas = await categoryService.getAreasByProgramId(programId);

    res.status(200).json({
      success: true,
      data: areas,
    });
  } catch (error) {
    logger.error("Error fetching areas by program:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch areas",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
