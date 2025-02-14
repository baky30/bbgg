const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const suppliers = sequelize.define(
    'suppliers',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      supplier_name: {
        type: DataTypes.TEXT,
      },

      contract_terms: {
        type: DataTypes.TEXT,
      },

      delivery_schedule: {
        type: DataTypes.DATE,
      },

      payment_due: {
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

  suppliers.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.suppliers.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.suppliers.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.suppliers.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return suppliers;
};
