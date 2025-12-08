import { Router } from "express";
import authRouter from "./auth.route";
import coursesRouter from "./courses.route";
import degreePlanRouter from "./degreePlan.route";
import planSemesterRouter from "./planSemester.route";
import plannedCourseRouter from "./plannedCourse.route";
import programRouter from "./program.route";
import mentorAssignmentRouter from "./mentorAssignment.route";
import advisorAssignmentRouter from "./advisorAssignment.route";
import reviewRouter from "./planSemesterReview.route";
import eligibleCoursesRouter from "./eligibleCourses.route";
import dashboardRouter from "./dashboard.route";
import categoryRouter from "./category.route";
import chatRouter from "./chat.route";

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
router.use("/programs", programRouter);
router.use("/mentor-assignments", mentorAssignmentRouter);
router.use("/advisor-assignments", advisorAssignmentRouter);
router.use("/review-requests", reviewRouter);
router.use("/eligible-courses", eligibleCoursesRouter);
router.use("/dashboard", dashboardRouter);
router.use("/catalog", categoryRouter);
router.use("/chat", chatRouter);
export default router;
