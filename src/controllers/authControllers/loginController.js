const users = require("../../data/users"); // Importar la lista de usuarios

function loginController(req, res) {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({ message: "Login exitoso", user });
  } else {
    res.status(401).json({ message: "Credenciales incorrectas" });
  }
}

module.exports = loginController; // Exportar la función
