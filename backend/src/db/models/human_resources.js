const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const human_resources = sequelize.define(
    'human_resources',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      employee_name: {
        type: DataTypes.TEXT,
      },

      role: {
        type: DataTypes.ENUM,

        values: ['SkilledLabor', 'ManagerialStaff'],
      },

      shift: {
        type: DataTypes.TEXT,
      },

      payroll: {
        type: DataTypes.DECIMAL,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  human_resources.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.human_resources.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.human_resources.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.human_resources.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return human_resources;
};
