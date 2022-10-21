const Employees = require("./employee");
const Roles = require("./role");
const Department = require("./department");

Employees.hasOne(Roles, {
    foreignKey: 'role_id',
    onDelete: 'CASCADE'
});

Roles.belongsTo(Employees, {
    foreignKey: 'role_id',
  });

Employees.hasOne(Employees, {
    foreignKey: 'manager_id',
});

Employees.belongsTo(Employees, {
    foreignKey: 'manager_id',
  });

  module.exports = { Employees, Roles, Department };