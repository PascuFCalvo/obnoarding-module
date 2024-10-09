// data/user.js
const users = [
  {
    id: 1,
    name: "Pascu",
    username: "worker1",
    password: "1234",
    role: "worker",
    societyId: 1,
    department: "Recepcion",
  },
  {
    id: 2,
    name: "Pepe",
    username: "worker2",
    password: "1234",
    role: "worker",
    societyId: 1,
    department: "HouseKeeping",
  },
  {
    id: 3, // Corrige el ID, no puede haber dos con el mismo ID
    name: "Manager1",
    username: "manager1",
    password: "1234",
    role: "manager",
    societyId: 1,
  },
];

// Exportar el arreglo de usuarios
module.exports = users;
