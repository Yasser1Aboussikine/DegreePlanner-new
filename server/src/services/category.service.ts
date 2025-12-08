import { getSession } from "../config/neo4j";
import logger from "../config/logger";

export interface Category {
  id: string;
  name: string;
}

export interface Subcategory {
  id: string;
  category: string;
  discipline: string;
}

export interface Area {
  programId: string;
  categoryName: string;
  credits: number;
}

export async function getAllCategories(): Promise<Category[]> {
  const session = getSession();

  try {
    logger.info("Fetching all categories from Neo4j...");

    const result = await session.run(`
      MATCH (c:Category)
      RETURN c.id as id, c.name as name
      ORDER BY c.name
    `);

    const categories: Category[] = result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
    }));

    logger.info(`Found ${categories.length} categories`);
    return categories;
  } catch (error) {
    logger.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  } finally {
    await session.close();
  }
}

export async function getAllSubcategories(): Promise<Subcategory[]> {
  const session = getSession();

  try {
    logger.info("Fetching all subcategories from Neo4j...");

    const result = await session.run(`
      MATCH (s:Subcategory)
      RETURN s.id as id, s.category as category, s.discipline as discipline
      ORDER BY s.category, s.discipline
    `);

    const subcategories: Subcategory[] = result.records.map((record) => ({
      id: record.get("id"),
      category: record.get("category"),
      discipline: record.get("discipline"),
    }));

    logger.info(`Found ${subcategories.length} subcategories`);
    return subcategories;
  } catch (error) {
    logger.error("Error fetching subcategories:", error);
    throw new Error("Failed to fetch subcategories");
  } finally {
    await session.close();
  }
}

export async function getSubcategoriesByCategory(
  categoryName: string
): Promise<Subcategory[]> {
  const session = getSession();

  try {
    logger.info(
      `Fetching subcategories for category: ${categoryName} from Neo4j...`
    );

    const result = await session.run(
      `
      MATCH (s:Subcategory {category: $categoryName})
      RETURN s.id as id, s.category as category, s.discipline as discipline
      ORDER BY s.discipline
    `,
      { categoryName }
    );

    const subcategories: Subcategory[] = result.records.map((record) => ({
      id: record.get("id"),
      category: record.get("category"),
      discipline: record.get("discipline"),
    }));

    logger.info(
      `Found ${subcategories.length} subcategories for category: ${categoryName}`
    );
    return subcategories;
  } catch (error) {
    logger.error(
      `Error fetching subcategories for category ${categoryName}:`,
      error
    );
    throw new Error("Failed to fetch subcategories");
  } finally {
    await session.close();
  }
}

export async function getAreasByProgramId(
  programId: string
): Promise<Area[]> {
  const session = getSession();

  try {
    logger.info(`Fetching areas for program: ${programId} from Neo4j...`);

    const result = await session.run(
      `
      MATCH (p:Program {id: $programId})-[r:HAS_AREA]->(c:Category)
      RETURN p.id as programId, c.name as categoryName, r.n_credits as credits
      ORDER BY c.name
    `,
      { programId }
    );

    const areas: Area[] = result.records.map((record) => ({
      programId: record.get("programId"),
      categoryName: record.get("categoryName"),
      credits: record.get("credits")?.toNumber() || 0,
    }));

    logger.info(`Found ${areas.length} areas for program: ${programId}`);
    return areas;
  } catch (error) {
    logger.error(`Error fetching areas for program ${programId}:`, error);
    throw new Error("Failed to fetch areas");
  } finally {
    await session.close();
  }
}

export async function getAllAreas(): Promise<Area[]> {
  const session = getSession();

  try {
    logger.info("Fetching all areas from Neo4j...");

    const result = await session.run(`
      MATCH (p:Program)-[r:HAS_AREA]->(c:Category)
      RETURN p.id as programId, c.name as categoryName, r.n_credits as credits
      ORDER BY p.id, c.name
    `);

    const areas: Area[] = result.records.map((record) => ({
      programId: record.get("programId"),
      categoryName: record.get("categoryName"),
      credits: record.get("credits")?.toNumber() || 0,
    }));

    logger.info(`Found ${areas.length} areas`);
    return areas;
  } catch (error) {
    logger.error("Error fetching areas:", error);
    throw new Error("Failed to fetch areas");
  } finally {
    await session.close();
  }
}
