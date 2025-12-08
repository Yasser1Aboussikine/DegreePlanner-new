-- Update existing PENDING_MENTOR review requests for JUNIOR and SENIOR students
-- to PENDING_ADVISOR status (skip mentor review)

UPDATE "PlanSemesterReviewRequest"
SET 
  status = 'PENDING_ADVISOR',
  "mentorId" = NULL
WHERE 
  status = 'PENDING_MENTOR'
  AND "studentId" IN (
    SELECT id FROM "User" 
    WHERE classification IN ('JUNIOR', 'SENIOR')
  );

-- Show the updated records
SELECT 
  prr.id,
  prr.status,
  prr."studentId",
  u.name,
  u.classification,
  prr."mentorId",
  prr."advisorId"
FROM "PlanSemesterReviewRequest" prr
JOIN "User" u ON u.id = prr."studentId"
WHERE u.classification IN ('JUNIOR', 'SENIOR')
ORDER BY u.name, prr."requestedAt";
