import { Router } from "express";
import * as programController from "@/controllers/program.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { validate } from "@/middlewares/validate.middleware";
import * as programSchema from "@/schemas/program.schema";

const router: Router = Router();

router.get("/", authenticate, programController.getAllPrograms);

router.get("/active", authenticate, programController.getActivePrograms);

router.get(
  "/:id",
  authenticate,
  validate(programSchema.getProgramByIdSchema),
  programController.getProgramById
);

router.get(
  "/code/:code",
  authenticate,
  validate(programSchema.getProgramByCodeSchema),
  programController.getProgramByCode
);

router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  validate(programSchema.createProgramSchema),
  programController.createProgram
);

router.post(
  "/with-requirements",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  validate(programSchema.createProgramWithRequirementsSchema),
  programController.createProgramWithRequirements
);

router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  validate(programSchema.updateProgramSchema),
  programController.updateProgram
);

router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  programController.deleteProgram
);

router.get(
  "/:programId/requirements",
  authenticate,
  validate(programSchema.getProgramRequirementsSchema),
  programController.getProgramRequirements
);

router.post(
  "/requirements",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  validate(programSchema.createProgramRequirementSchema),
  programController.createProgramRequirement
);

router.put(
  "/requirements/:id",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  validate(programSchema.updateProgramRequirementSchema),
  programController.updateProgramRequirement
);

router.delete(
  "/requirements/:id",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  programController.deleteProgramRequirement
);

export default router;
