import { Router } from "express";
import authRouter from "./auth.route";
import coursesRouter from "./courses.route";
import degreePlanRouter from "./degreePlan.route";
import planSemesterRouter from "./planSemester.route";
import plannedCourseRouter from "./plannedCourse.route";

const router: Router = Router();

router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

router.use("/auth", authRouter);
router.use("/courses", coursesRouter);
router.use("/degree-plans", degreePlanRouter);
router.use("/plan-semesters", planSemesterRouter);
router.use("/planned-courses", plannedCourseRouter);


export default router;
