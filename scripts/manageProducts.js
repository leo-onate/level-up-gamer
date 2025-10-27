const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "src", "data", "products.json");

function load() {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    console.error("Error leyendo products.json:", e.message);
    process.exit(1);
  }
}

function save(list) {
  try {
    fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf8");
  } catch (e) {
    console.error("Error escribiendo products.json:", e.message);
    process.exit(1);
  }
}

function parseFlags(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      out[key] = "true";
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

const [cmd, ...rest] = process.argv.slice(2);
const flags = parseFlags(process.argv.slice(3));

if (!cmd || cmd === "help") {
  console.log("Usage:");
  console.log("  node scripts/manageProducts.js list");
  console.log('  node scripts/manageProducts.js add --nombre "Prod" --precio 12.5 --imagen "img.jpg" --descripcion "desc" --categoria "x" --oferta true');
  console.log('  node scripts/manageProducts.js update --id p123 --nombre "Nuevo nombre"');
  console.log("  node scripts/manageProducts.js delete --id p123");
  process.exit(0);
}

let list = load();

if (cmd === "list") {
  if (!list.length) {
    console.log("No hay productos.");
    process.exit(0);
  }
  console.table(list.map(p => ({ id: p.id, nombre: p.nombre, precio: p.precio, oferta: p.oferta })));
  process.exit(0);
}

if (cmd === "add") {
  const id = `p${Date.now()}`;
  const nuevo = {
    id,
    nombre: flags.nombre || "Sin nombre",
    imagen: flags.imagen || "",
    precio: Number(flags.precio || 0),
    descripcion: flags.descripcion || "",
    oferta: flags.oferta === "true" || flags.oferta === true,
    categoria: flags.categoria || ""
  };
  list.push(nuevo);
  save(list);
  console.log("Producto creado:", id);
  process.exit(0);
}

if (cmd === "delete") {
  const id = flags.id;
  if (!id) {
    console.error("Falta --id");
    process.exit(1);
  }
  const before = list.length;
  list = list.filter(p => String(p.id) !== String(id));
  save(list);
  console.log(`Eliminados ${before - list.length} productos.`);
  process.exit(0);
}

if (cmd === "update") {
  const id = flags.id;
  if (!id) {
    console.error("Falta --id");
    process.exit(1);
  }
  const idx = list.findIndex(p => String(p.id) === String(id));
  if (idx === -1) {
    console.error("Producto no encontrado:", id);
    process.exit(1);
  }
  const campos = ["nombre", "imagen", "precio", "descripcion", "categoria", "oferta"];
  campos.forEach(k => {
    if (flags[k] !== undefined) {
      list[idx][k] = k === "precio" ? Number(flags[k]) : (k === "oferta" ? (flags[k] === "true") : flags[k]);
    }
  });
  save(list);
  console.log("Producto actualizado:", id);
  process.exit(0);
}

console.error("Comando no reconocido:", cmd);
process.exit(1);