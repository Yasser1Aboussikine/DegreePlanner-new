import neo4j from "neo4j-driver";

const convertNeo4jIntegers = (value: any): any => {
  if (neo4j.isInt && neo4j.isInt(value)) {
    try {
      return value.toNumber(); // convert to JS number if safe
    } catch {
      return value.toString(); // fall back to string if out of safe range
    }
  }
  if (Array.isArray(value)) return value.map(convertNeo4jIntegers);
  if (value && typeof value === "object") {
    const out: any = {};
    for (const k of Object.keys(value)) out[k] = convertNeo4jIntegers(value[k]);
    return out;
  }
  return value;
};

export default convertNeo4jIntegers;
