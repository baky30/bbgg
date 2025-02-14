const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const config = require('../../config');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class RolesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const roles = await db.roles.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        role_customization: data.role_customization || null,
        globalAccess: data.globalAccess || false,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await roles.setPermissions(data.permissions || [], {
      transaction,
    });

    return roles;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const rolesData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      role_customization: item.role_customization || null,
      globalAccess: item.globalAccess || false,

      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const roles = await db.roles.bulkCreate(rolesData, { transaction });

    // For each item created, replace relation files

    return roles;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const roles = await db.roles.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.name !== undefined) updatePayload.name = data.name;

    if (data.role_customization !== undefined)
      updatePayload.role_customization = data.role_customization;

    if (data.globalAccess !== undefined)
      updatePayload.globalAccess = data.globalAccess;

    updatePayload.updatedById = currentUser.id;

    await roles.update(updatePayload, { transaction });

    if (data.permissions !== undefined) {
      await roles.setPermissions(data.permissions, { transaction });
    }

    return roles;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const roles = await db.roles.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of roles) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of roles) {
        await record.destroy({ transaction });
      }
    });

    return roles;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const roles = await db.roles.findByPk(id, options);

    await roles.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await roles.destroy({
      transaction,
    });

    return roles;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const roles = await db.roles.findOne({ where }, { transaction });

    if (!roles) {
      return roles;
    }

    const output = roles.get({ plain: true });

    output.users_app_role = await roles.getUsers_app_role({
      transaction,
    });

    output.permissions = await roles.getPermissions({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    let where = {};
    const currentPage = +filter.page;

    const user = (options && options.currentUser) || null;
    const userOrganizations = (user && user.organizations?.id) || null;

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;

    let include = [
      {
        model: db.permissions,
        as: 'permissions',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('roles', 'name', filter.name),
        };
      }

      if (filter.role_customization) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'roles',
            'role_customization',
            filter.role_customization,
          ),
        };
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.globalAccess) {
        where = {
          ...where,
          globalAccess: filter.globalAccess,
        };
      }

      if (filter.permissions) {
        const searchTerms = filter.permissions.split('|');

        include = [
          {
            model: db.permissions,
            as: 'permissions_filter',
            required: searchTerms.length > 0,
            where:
              searchTerms.length > 0
                ? {
                    [Op.or]: [
                      {
                        id: {
                          [Op.in]: searchTerms.map((term) => Utils.uuid(term)),
                        },
                      },
                      {
                        name: {
                          [Op.or]: searchTerms.map((term) => ({
                            [Op.iLike]: `%${term}%`,
                          })),
                        },
                      },
                    ],
                  }
                : undefined,
          },
          ...include,
        ];
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    if (!globalAccess) {
      where = { name: { [Op.ne]: config.roles.super_admin } };
    }

    const queryOptions = {
      where,
      include,
      distinct: true,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction: options?.transaction,
      logging: console.log,
    };

    if (!options?.countOnly) {
      queryOptions.limit = limit ? Number(limit) : undefined;
      queryOptions.offset = offset ? Number(offset) : undefined;
    }

    try {
      const { rows, count } = await db.roles.findAndCountAll(queryOptions);

      return {
        rows: options?.countOnly ? [] : rows,
        count: count,
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async findAllAutocomplete(query, limit, offset, globalAccess) {
    let where = {};

    if (!globalAccess) {
      where = { name: { [Op.ne]: config.roles.super_admin } };
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('roles', 'name', query),
        ],
      };
    }

    const records = await db.roles.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
