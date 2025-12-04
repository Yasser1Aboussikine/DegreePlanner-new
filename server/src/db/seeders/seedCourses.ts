import fs from "fs";
import path from "path";
import logger from "../../config/logger";
import { getSession } from "../../config/neo4j";

interface GraphNode {
  id: string;
  labels: string[];
  [key: string]: any;
}

interface GraphRelationship {
  type: string;
  startNode: string;
  endNode: string;
  [key: string]: any;
}

export async function seedNeo4jCourses() {
  logger.info("Seeding courses into Neo4j...");
  console.log("➡️  Starting Neo4j course seeding...");

  const session = getSession();

  try {
    // ----- Load JSON file -----
    const dataPath = path.join(__dirname, "../seeds/courses.json");
    console.log("📄 Loading JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const { nodes, relationships } = JSON.parse(raw) as {
      nodes: GraphNode[];
      relationships: GraphRelationship[];
    };

    console.log(`📦 Loaded: ${nodes.length} nodes`);
    console.log(`🔗 Loaded: ${relationships.length} relationships`);
    logger.info(
      `Loaded ${nodes.length} nodes and ${relationships.length} relationships`
    );
    // ---------- Delete All Nodes ----------

    await session.run("MATCH (n) DETACH DELETE n");
    logger.info("✓ Connected to PostgreSQL database");
    // ---------- CONSTRAINTS ----------
    console.log("🛠️  Creating constraints (if not exist)...");

    await session.run(`
      CREATE CONSTRAINT course_id_unique IF NOT EXISTS
      FOR (c:Course) REQUIRE c.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT category_id_unique IF NOT EXISTS
      FOR (c:Category) REQUIRE c.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT subcategory_id_unique IF NOT EXISTS
      FOR (s:Subcategory) REQUIRE s.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT program_id_unique IF NOT EXISTS
      FOR (p:Program) REQUIRE p.id IS UNIQUE
    `);

    // ---------- Insert Nodes ----------
    logger.info("Creating nodes...");
    console.log("🟦 Creating nodes...");

    let nodeCount = 0;

    for (const node of nodes) {
      nodeCount++;

      const { id, labels, source_ids, ...props } = node;

      if (!labels || labels.length === 0) {
        console.warn(`⚠️  Skipping node with no labels: ${id}`);
        logger.warn(`Skipping node '${id}' because it has no labels`);
        continue;
      }

      if (nodeCount % 50 === 0) {
        console.log(`   → Inserted ${nodeCount}/${nodes.length} nodes...`);
      }

      const labelString = labels.map((l) => `\`${l}\``).join(":");

      await session.run(
        `
        MERGE (n:${labelString} {id: $id})
        SET n += $props
        `,
        { id, props }
      );
    }

    console.log(`🟦 Node creation complete (${nodeCount} nodes).`);
    logger.info("✓ All nodes inserted.");

    // ---------- Insert Relationships ----------
    logger.info("Creating relationships...");
    console.log("🟧 Creating relationships...");

    let relCount = 0;

    for (const rel of relationships) {
      relCount++;

      const { type, startNode, endNode, ...props } = rel;

      if (relCount % 50 === 0) {
        console.log(
          `   → Inserted ${relCount}/${relationships.length} rels...`
        );
      }

      await session.run(
        `
        MATCH (a {id: $startId})
        MATCH (b {id: $endId})
        MERGE (a)-[r:\`${type}\`]->(b)
        SET r += $props
        `,
        {
          startId: startNode,
          endId: endNode,
          props,
        }
      );
    }

    console.log(`🟧 Relationship creation complete (${relCount} rels).`);
    logger.info("✓ All relationships inserted.");

    // ---------- Create Program Nodes from JSON ----------
    const programsPath = path.join(__dirname, "../seeds/programs.json");
    console.log("🎓 Loading programs from:", programsPath);

    const programsRaw = fs.readFileSync(programsPath, "utf8");
    const programs = JSON.parse(programsRaw) as Array<{
      id: string;
      code: string;
      name: string;
      level: string;
      totalCredits: number;
      isActive: boolean;
    }>;

    console.log(`📦 Loaded: ${programs.length} programs`);
    logger.info(`Loaded ${programs.length} programs from JSON`);

    for (const program of programs) {
      console.log(`🎓 Creating Program node: ${program.code}...`);
      logger.info(`Creating Program node: ${program.code}...`);

      await session.run(
        `
        MERGE (p:Program {id: $id})
        SET p.code = $code,
            p.name = $name,
            p.level = $level,
            p.totalCredits = $totalCredits,
            p.isActive = $isActive
      `,
        {
          id: program.id,
          code: program.code,
          name: program.name,
          level: program.level,
          totalCredits: program.totalCredits,
          isActive: program.isActive,
        }
      );

      console.log(`✅ Program node created: ${program.code}`);
    }

    // ---------- Create HAS_AREA relationships from programRequirements.json ----------
    const reqPath = path.join(__dirname, "../seeds/programRequirements.json");
    console.log("🔗 Loading program requirements from:", reqPath);

    const reqRaw = fs.readFileSync(reqPath, "utf8");
    const programRequirements = JSON.parse(reqRaw) as Array<{
      id: string;
      programId: string;
      category: string;
      credits: number;
    }>;

    console.log(
      `📦 Loaded: ${programRequirements.length} program requirements`
    );
    logger.info(
      `Loaded ${programRequirements.length} program requirements from JSON`
    );

    console.log(
      "🔗 Creating HAS_AREA relationships with existing categories..."
    );
    logger.info("Creating HAS_AREA relationships...");

    // Map programRequirements category names to existing Category node names from courses.json
    // Existing Category nodes in courses.json: GenEd, Math_Engineering_Science, Computer_Science, Minor, Free_Electives, Specialization
    const categoryNameMap: Record<string, string> = {
      GENERAL_EDUCATION: "GenEd",
      ENGINEERING_SCIENCE_MATHS: "Math_Engineering_Science",
      COMPUTER_SCIENCE: "Computer_Science",
      MINOR: "Minor",
      FREE_ELECTIVES: "Free_Electives",
      SPECIALIZATION: "Specialization", // For future use
    };

    for (const req of programRequirements) {
      const categoryNodeName = categoryNameMap[req.category];

      if (!categoryNodeName) {
        console.warn(`⚠️  Unknown category: ${req.category}, skipping...`);
        logger.warn(`Unknown category: ${req.category}, skipping...`);
        continue;
      }

      await session.run(
        `
        MATCH (p:Program {id: $programId})
        MATCH (c:Category {name: $categoryName})
        MERGE (p)-[r:HAS_AREA]->(c)
        SET r.n_credits = $credits
      `,
        {
          programId: req.programId,
          categoryName: categoryNodeName,
          credits: req.credits,
        }
      );

      console.log(
        `   → Created HAS_AREA: ${req.programId} -> ${categoryNodeName} (${req.credits} credits)`
      );
    }

    console.log("✅ HAS_AREA relationships created.");

    console.log("✅ Neo4j course seeding COMPLETE.");
    logger.info("✓ Neo4j courses seeding completed!");
  } catch (error) {
    console.error("❌ Neo4j course seeding failed:", error);
    logger.error("Neo4j course seeding failed:", error);
    throw error;
  } finally {
    console.log("🔌 Closing Neo4j session...");
    await session.close();
  }
}

seedNeo4jCourses().catch((err) => {
  console.log("Error seeding neo4j");
  logger.error("Error seeding neo4j");
});
