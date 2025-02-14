const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const organizations = sequelize.define(
    'organizations',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
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

  organizations.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.organizations.hasMany(db.users, {
      as: 'users_organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.organizations.hasMany(db.human_resources, {
      as: 'human_resources_organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.organizations.hasMany(db.inventory, {
      as: 'inventory_organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.organizations.hasMany(db.machinery, {
      as: 'machinery_organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.organizations.hasMany(db.quality_control, {
      as: 'quality_control_organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.organizations.hasMany(db.raw_materials, {
      as: 'raw_materials_organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.organizations.hasMany(db.suppliers, {
      as: 'suppliers_organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.organizations.hasMany(db.work_orders, {
      as: 'work_orders_organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    //end loop

    db.organizations.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.organizations.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return organizations;
};
