const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connections');
const Roles = require("./role");

class Employees extends Model {}

Employees.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
          },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'role',
            key: 'id',
          },
      },
      manager_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'employees',
            key: 'id',
          },
      },
    },
    {
      sequelize,
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      modelName: 'employees'
    }
  );


  
  module.exports = Employees;