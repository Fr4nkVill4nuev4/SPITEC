const { createHash } = require("node:crypto");
const { existsSync, mkdirSync, readFileSync } = require("node:fs");
const { createServer } = require("node:http");
const { extname, join, normalize } = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const PORT = Number(process.env.PORT || 4174);
const ROOT = __dirname;
const DATA_DIR = join(ROOT, "data");
const DB_PATH = join(DATA_DIR, "siptec.db");

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR);

const db = new DatabaseSync(DB_PATH);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8"
};

initDatabase();

const server = createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") {
      sendJson(response, 204, {});
      return;
    }

    if (request.url.startsWith("/api/users")) {
      await handleUsers(request, response);
      return;
    }

    serveStatic(request, response);
  } catch (error) {
    sendJson(response, error.status || 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`SIPTEC running at http://localhost:${PORT}/index.html`);
  console.log(`SQLite database: ${DB_PATH}`);
});

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      idRol INTEGER PRIMARY KEY AUTOINCREMENT,
      nombreRol TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS instituciones (
      idInstitucion INTEGER PRIMARY KEY AUTOINCREMENT,
      nombreInstitucion TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS usuarios (
      idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
      nombreUsuario TEXT NOT NULL,
      apellidoUsuario TEXT NOT NULL,
      correoUsuario TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      idRol INTEGER NOT NULL,
      idInstitucion INTEGER NOT NULL,
      activo INTEGER NOT NULL DEFAULT 1,
      creadoEn TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idRol) REFERENCES roles(idRol),
      FOREIGN KEY (idInstitucion) REFERENCES instituciones(idInstitucion)
    );
  `);

  seedLookup("roles", "nombreRol", ["ADMINISTRADOR", "EMPLEADO", "IT"]);
  seedLookup("instituciones", "nombreInstitucion", ["ITR", "CFP"]);

  const count = db.prepare("SELECT COUNT(*) AS total FROM usuarios").get().total;
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO usuarios (nombreUsuario, apellidoUsuario, correoUsuario, password_hash, idRol, idInstitucion, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run("Admin", "Principal", "admin@correo.com", hashPassword("admin123"), 1, 1, 1);
    insert.run("Marco", "Perez", "marco@siptec.edu", hashPassword("empleado123"), 2, 1, 1);
    insert.run("Sofia", "Mendez", "sofia@siptec.edu", hashPassword("empleado123"), 2, 2, 1);
  }
}

function seedLookup(table, column, values) {
  const insert = db.prepare(`INSERT OR IGNORE INTO ${table} (${column}) VALUES (?)`);
  values.forEach((value) => insert.run(value));
}

async function handleUsers(request, response) {
  if (request.method === "GET") {
    sendJson(response, 200, getUsers());
    return;
  }

  if (request.method === "POST") {
    const body = await readJson(request);
    const user = createUser(body);
    sendJson(response, 201, user);
    return;
  }

  const toggleMatch = request.url.match(/^\/api\/users\/(\d+)\/toggle/);
  if (request.method === "PATCH" && toggleMatch) {
    const id = Number(toggleMatch[1]);
    const user = db.prepare("SELECT activo FROM usuarios WHERE idUsuario = ?").get(id);
    if (!user) {
      sendJson(response, 404, { error: "Usuario no encontrado" });
      return;
    }
    db.prepare("UPDATE usuarios SET activo = ? WHERE idUsuario = ?").run(user.activo ? 0 : 1, id);
    sendJson(response, 200, getUserById(id));
    return;
  }

  sendJson(response, 405, { error: "Metodo no permitido" });
}

function createUser(body) {
  const firstName = cleanText(body.firstName);
  const lastName = cleanText(body.lastName);
  const email = cleanText(body.email).toLowerCase();
  const password = String(body.password || "").trim();
  const role = cleanText(body.role || "EMPLEADO").toUpperCase();
  const institution = cleanText(body.institution || "ITR").toUpperCase();

  if (!firstName || !lastName || !email || !password) {
    const error = new Error("Nombre, apellido, correo y contrasena son obligatorios.");
    error.status = 400;
    throw error;
  }

  const roleRow = db.prepare("SELECT idRol FROM roles WHERE nombreRol = ?").get(role);
  const institutionRow = db.prepare("SELECT idInstitucion FROM instituciones WHERE nombreInstitucion = ?").get(institution);

  if (!roleRow || !institutionRow) {
    const error = new Error("Rol o institucion no validos.");
    error.status = 400;
    throw error;
  }

  try {
    const result = db.prepare(`
      INSERT INTO usuarios (nombreUsuario, apellidoUsuario, correoUsuario, password_hash, idRol, idInstitucion, activo)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(firstName, lastName, email, hashPassword(password), roleRow.idRol, institutionRow.idInstitucion);
    return getUserById(Number(result.lastInsertRowid));
  } catch (error) {
    if (String(error.message).includes("UNIQUE")) {
      error.message = "Ya existe un usuario con ese correo.";
      error.status = 409;
    }
    throw error;
  }
}

function getUsers() {
  return db.prepare(`
    SELECT
      u.idUsuario AS id,
      u.nombreUsuario AS firstName,
      u.apellidoUsuario AS lastName,
      u.correoUsuario AS email,
      r.nombreRol AS role,
      i.nombreInstitucion AS institution,
      u.activo AS active
    FROM usuarios u
    JOIN roles r ON r.idRol = u.idRol
    JOIN instituciones i ON i.idInstitucion = u.idInstitucion
    ORDER BY u.idUsuario ASC
  `).all();
}

function getUserById(id) {
  return db.prepare(`
    SELECT
      u.idUsuario AS id,
      u.nombreUsuario AS firstName,
      u.apellidoUsuario AS lastName,
      u.correoUsuario AS email,
      r.nombreRol AS role,
      i.nombreInstitucion AS institution,
      u.activo AS active
    FROM usuarios u
    JOIN roles r ON r.idRol = u.idRol
    JOIN instituciones i ON i.idInstitucion = u.idInstitucion
    WHERE u.idUsuario = ?
  `).get(id);
}

function cleanText(value) {
  return String(value || "").trim();
}

function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

function serveStatic(request, response) {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  const pathname = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const resolvedPath = normalize(join(ROOT, pathname));

  if (!resolvedPath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const file = readFileSync(resolvedPath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(resolvedPath)] || "application/octet-stream"
    });
    response.end(file);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("Solicitud demasiado grande."));
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON invalido."));
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end(statusCode === 204 ? "" : JSON.stringify(data));
}
