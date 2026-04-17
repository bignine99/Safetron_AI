const db = require('./dashboard/node_modules/better-sqlite3')('./dashboard/src/data/safety_graph.db');
const types = db.prepare("SELECT id, name FROM nodes WHERE label = 'AccidentType' LIMIT 20").all();
console.log("Types:", types);
const edges = db.prepare("SELECT COUNT(*) FROM edges").get();
console.log("Total edges:", edges);
