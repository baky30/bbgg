const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const machinery = sequelize.define(
    'machinery',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      machine_name: {
        type: DataTypes.TEXT,
      },

      model: {
        type: DataTypes.TEXT,
      },

      maintenance_schedule: {
        type: DataTypes.DATE,
      },

      downtime_hours: {
        type: DataTypes.INTEGER,
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

  machinery.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.machinery.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.machinery.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.machinery.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return machinery;
};
