const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "https://proyecto-final-ods-6-1zwh.vercel.app/",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// 🔗 Conexión MySQL
const db = mysql.createConnection({
  host: "mysql://root:YkvxEisAymqSNDplOJSNruMAeOqbSJzd@viaduct.proxy.rlwy.net:42226/railway",
  user: "root",
  password: "YkvxEisAymqSNDplOJSNruMAeOqbSJzd",
  database: "railway",
  port: 3306
});

db.connect(err => {
  if (err) {
    console.log("❌ Error conexión");
  } else {
    console.log("✅ Conectado a MySQL");
  }
});

app.get("/", (req, res) => {
  res.send("Backend funcionando en Render ");
});

//  REGISTRO
app.post("/registro", (req, res) => {
  const { usuario, email, password, departamento, municipio } = req.body;
  const sql = "INSERT INTO usuarios (usuario, email, password, departamento, municipio) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [usuario, email, password, departamento, municipio], (err, result) => {
    if (err) return res.send(err);
    res.json({ message: "Registro exitoso" });
  });
});

//  LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) return res.send(err);

    if (result.length > 0) {
      const usuario = result[0];

      res.json({
        success: true,
        usuario: usuario.usuario,
        departamento: usuario.departamento,
        municipio: usuario.municipio
      });

    } else {
      res.json({ success: false });
    }
  });
});

//  USUARIOS
app.get("/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// Servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});