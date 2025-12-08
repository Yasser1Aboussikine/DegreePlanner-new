import neo4j, { Driver } from "neo4j-driver";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

const driver: Driver = neo4j.driver(
  process.env.NEO4J_URI || "neo4j://127.0.0.1:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "degree-planner"
  )
);

export const getSession = () => driver.session();

export const verifyConnection = async () => {
  await driver.verifyConnectivity();
  logger.info("Neo4j connected");
};

export const closeConnection = async () => {
  await driver.close();
};

export default driver;
