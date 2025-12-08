import { Request, Response, NextFunction } from "express";
import * as programService from "@/services/program.service";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import logger from "@/config/logger";

export async function getAllPrograms(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const programs = await programService.getAllPrograms();
    return successResponse(res, programs, "Programs retrieved successfully");
  } catch (error) {
    logger.error("Error fetching programs:", error);
    return errorResponse(res, "Failed to fetch programs", 500);
  }
}

export async function getActivePrograms(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const programs = await programService.getActiveProgramsOnly();
    return successResponse(
      res,
      programs,
      "Active programs retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching active programs:", error);
    return errorResponse(res, "Failed to fetch active programs", 500);
  }
}

export async function getProgramById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const program = await programService.getProgramById(id);

    if (!program) {
      return errorResponse(res, "Program not found", 404);
    }

    return successResponse(res, program, "Program retrieved successfully");
  } catch (error) {
    logger.error("Error fetching program:", error);
    return errorResponse(res, "Failed to fetch program", 500);
  }
}

export async function getProgramByCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { code } = req.params;
    const program = await programService.getProgramByCode(code);

    if (!program) {
      return errorResponse(res, "Program not found", 404);
    }

    return successResponse(res, program, "Program retrieved successfully");
  } catch (error) {
    logger.error("Error fetching program by code:", error);
    return errorResponse(res, "Failed to fetch program", 500);
  }
}

export async function createProgram(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const programData = req.body;
    const program = await programService.createProgram(programData);
    return successResponse(res, program, "Program created successfully", 201);
  } catch (error: any) {
    logger.error("Error creating program:", error);
    if (error.code === "P2002") {
      return errorResponse(res, "Program code already exists", 409);
    }
    return errorResponse(res, "Failed to create program", 500);
  }
}

export async function updateProgram(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const program = await programService.updateProgram(id, updateData);
    return successResponse(res, program, "Program updated successfully");
  } catch (error: any) {
    logger.error("Error updating program:", error);
    if (error.code === "P2025") {
      return errorResponse(res, "Program not found", 404);
    }
    if (error.code === "P2002") {
      return errorResponse(res, "Program code already exists", 409);
    }
    return errorResponse(res, "Failed to update program", 500);
  }
}

export async function deleteProgram(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await programService.deleteProgram(id);
    return successResponse(res, null, "Program deleted successfully");
  } catch (error: any) {
    logger.error("Error deleting program:", error);
    if (error.code === "P2025") {
      return errorResponse(res, "Program not found", 404);
    }
    if (error.code === "P2003") {
      return errorResponse(
        res,
        "Cannot delete program with existing degree plans",
        409
      );
    }
    return errorResponse(res, "Failed to delete program", 500);
  }
}

export async function getProgramRequirements(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { programId } = req.params;
    const requirements = await programService.getProgramRequirements(programId);
    return successResponse(
      res,
      requirements,
      "Program requirements retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching program requirements:", error);
    return errorResponse(res, "Failed to fetch program requirements", 500);
  }
}

export async function createProgramRequirement(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const requirementData = req.body;
    const requirement =
      await programService.createProgramRequirement(requirementData);
    return successResponse(
      res,
      requirement,
      "Program requirement created successfully",
      201
    );
  } catch (error: any) {
    logger.error("Error creating program requirement:", error);
    if (error.code === "P2002") {
      return errorResponse(
        res,
        "Program requirement for this category already exists",
        409
      );
    }
    if (error.code === "P2003") {
      return errorResponse(res, "Program not found", 404);
    }
    return errorResponse(res, "Failed to create program requirement", 500);
  }
}

export async function updateProgramRequirement(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const requirement = await programService.updateProgramRequirement(
      id,
      updateData
    );
    return successResponse(
      res,
      requirement,
      "Program requirement updated successfully"
    );
  } catch (error: any) {
    logger.error("Error updating program requirement:", error);
    if (error.code === "P2025") {
      return errorResponse(res, "Program requirement not found", 404);
    }
    return errorResponse(res, "Failed to update program requirement", 500);
  }
}

export async function deleteProgramRequirement(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await programService.deleteProgramRequirement(id);
    return successResponse(
      res,
      null,
      "Program requirement deleted successfully"
    );
  } catch (error: any) {
    logger.error("Error deleting program requirement:", error);
    if (error.code === "P2025") {
      return errorResponse(res, "Program requirement not found", 404);
    }
    return errorResponse(res, "Failed to delete program requirement", 500);
  }
}

export async function createProgramWithRequirements(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { requirements, ...programData } = req.body;
    const program = await programService.createProgramWithRequirements(
      programData,
      requirements
    );
    return successResponse(
      res,
      program,
      "Program with requirements created successfully",
      201
    );
  } catch (error: any) {
    logger.error("Error creating program with requirements:", error);
    if (error.code === "P2002") {
      return errorResponse(res, "Program code already exists", 409);
    }
    return errorResponse(
      res,
      "Failed to create program with requirements",
      500
    );
  }
}
