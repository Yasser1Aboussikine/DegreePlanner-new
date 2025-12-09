import { getSession } from "@/config/neo4j";
import logger from "@/config/logger";

export interface Minor {
  name: string;
  code: string;
}

export async function getAllMinors(): Promise<Minor[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (s:Subcategory {category: "Minor"})
      RETURN s.id AS code, s.discipline AS name
      ORDER BY s.discipline ASC
    `);

    const minors = result.records.map((record) => ({
      name: record.get("name") as string,
      code: record.get("code") as string,
    }));

    logger.info(`Found ${minors.length} minors`);
    return minors;
  } catch (error) {
    logger.error("Error fetching minors from Neo4j:", error);
    throw new Error("Failed to fetch minors");
  } finally {
    await session.close();
  }
}
