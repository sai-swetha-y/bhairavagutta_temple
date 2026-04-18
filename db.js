const sql = require("mssql");

const baseConfig = {
  server: process.env.DB_SERVER || "localhost",
  port: Number(process.env.DB_PORT || 1433),
  database: process.env.DB_DATABASE || "BhairavaguttaTemple",
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "",
  options: {
    encrypt: String(process.env.DB_ENCRYPT || "false").toLowerCase() === "true",
    trustServerCertificate:
      String(process.env.DB_TRUST_SERVER_CERTIFICATE || "true").toLowerCase() ===
      "true",
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise;

function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(baseConfig)
      .connect()
      .then((pool) => pool)
      .catch((error) => {
        poolPromise = null;
        throw error;
      });
  }

  return poolPromise;
}

function applyParameters(request, parameters = []) {
  for (const parameter of parameters) {
    request.input(parameter.name, parameter.type, parameter.value);
  }

  return request;
}

async function executeQuery(query, parameters = []) {
  const pool = await getPool();
  const request = applyParameters(pool.request(), parameters);
  return request.query(query);
}

async function executeProcedure(procedureName, parameters = []) {
  const pool = await getPool();
  const request = applyParameters(pool.request(), parameters);
  return request.execute(procedureName);
}

module.exports = {
  sql,
  getPool,
  executeQuery,
  executeProcedure,
};
