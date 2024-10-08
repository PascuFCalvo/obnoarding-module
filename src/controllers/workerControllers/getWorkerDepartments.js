const users = require("../../data/users");

function getDepartments(req, res) {
  const departments = users.reduce((acc, user) => {
    if (user.role === "worker") {
      acc.add(user.department);
    }
    return acc;
  }, new Set());

  res.json({ departments: Array.from(departments) });
}

module.exports = getDepartments;
