const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const bcrypt = require('bcrypt');
const config = require('../../config');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class UsersDBApi {
  static async create(data, globalAccess, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.create(
      {
        id: data.data.id || undefined,

        firstName: data.data.firstName || null,
        lastName: data.data.lastName || null,
        phoneNumber: data.data.phoneNumber || null,
        email: data.data.email || null,
        disabled: data.data.disabled || false,

        password: data.data.password || null,
        emailVerified: data.data.emailVerified || true,

        emailVerificationToken: data.data.emailVerificationToken || null,
        emailVerificationTokenExpiresAt:
          data.data.emailVerificationTokenExpiresAt || null,
        passwordResetToken: data.data.passwordResetToken || null,
        passwordResetTokenExpiresAt:
          data.data.passwordResetTokenExpiresAt || null,
        provider: data.data.provider || null,
        importHash: data.data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    if (!data.data.app_role) {
      const role = await db.roles.findOne({
        where: { name: 'User' },
      });
      if (role) {
        await users.setApp_role(role, {
          transaction,
        });
      }
    } else {
      await users.setApp_role(data.data.app_role || null, {
        transaction,
      });
    }

    await users.setOrganizations(data.data.organizations || null, {
      transaction,
    });

    await users.setCustom_permissions(data.data.custom_permissions || [], {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.users.getTableName(),
        belongsToColumn: 'avatar',
        belongsToId: users.id,
      },
      data.data.avatar,
      options,
    );

    return users;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const usersData = data.map((item, index) => ({
      id: item.id || undefined,

      firstName: item.firstName || null,
      lastName: item.lastName || null,
      phoneNumber: item.phoneNumber || null,
      email: item.email || null,
      disabled: item.disabled || false,

      password: item.password || null,
      emailVerified: item.emailVerified || false,

      emailVerificationToken: item.emailVerificationToken || null,
      emailVerificationTokenExpiresAt:
        item.emailVerificationTokenExpiresAt || null,
      passwordResetToken: item.passwordResetToken || null,
      passwordResetTokenExpiresAt: item.passwordResetTokenExpiresAt || null,
      provider: item.provider || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const users = await db.users.bulkCreate(usersData, { transaction });

    // For each item created, replace relation files

    for (let i = 0; i < users.length; i++) {
      await FileDBApi.replaceRelationFiles(
        {
          belongsTo: db.users.getTableName(),
          belongsToColumn: 'avatar',
          belongsToId: users[i].id,
        },
        data[i].avatar,
        options,
      );
    }

    return users;
  }

  static async update(id, data, globalAccess, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findByPk(id, {}, { transaction });

    if (!data?.app_role) {
      data.app_role = users?.app_role?.id;
    }
    if (!data?.custom_permissions) {
      data.custom_permissions = users?.custom_permissions?.map(
        (item) => item.id,
      );
    }

    if (data.password) {
      data.password = bcrypt.hashSync(data.password, config.bcrypt.saltRounds);
    } else {
      data.password = users.password;
    }

    const updatePayload = {};

    if (data.firstName !== undefined) updatePayload.firstName = data.firstName;

    if (data.lastName !== undefined) updatePayload.lastName = data.lastName;

    if (data.phoneNumber !== undefined)
      updatePayload.phoneNumber = data.phoneNumber;

    if (data.email !== undefined) updatePayload.email = data.email;

    if (data.disabled !== undefined) updatePayload.disabled = data.disabled;

    if (data.password !== undefined) updatePayload.password = data.password;

    if (data.emailVerified !== undefined)
      updatePayload.emailVerified = data.emailVerified;
    else updatePayload.emailVerified = true;

    if (data.emailVerificationToken !== undefined)
      updatePayload.emailVerificationToken = data.emailVerificationToken;

    if (data.emailVerificationTokenExpiresAt !== undefined)
      updatePayload.emailVerificationTokenExpiresAt =
        data.emailVerificationTokenExpiresAt;

    if (data.passwordResetToken !== undefined)
      updatePayload.passwordResetToken = data.passwordResetToken;

    if (data.passwordResetTokenExpiresAt !== undefined)
      updatePayload.passwordResetTokenExpiresAt =
        data.passwordResetTokenExpiresAt;

    if (data.provider !== undefined) updatePayload.provider = data.provider;

    updatePayload.updatedById = currentUser.id;

    await users.update(updatePayload, { transaction });

    if (data.app_role !== undefined) {
      await users.setApp_role(
        data.app_role,

        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await users.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    if (data.custom_permissions !== undefined) {
      await users.setCustom_permissions(data.custom_permissions, {
        transaction,
      });
    }

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.users.getTableName(),
        belongsToColumn: 'avatar',
        belongsToId: users.id,
      },
      data.avatar,
      options,
    );

    return users;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of users) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of users) {
        await record.destroy({ transaction });
      }
    });

    return users;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findByPk(id, options);

    await users.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await users.destroy({
      transaction,
    });

    return users;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findOne({ where }, { transaction });

    if (!users) {
      return users;
    }

    const output = users.get({ plain: true });

    output.work_orders_production_manager =
      await users.getWork_orders_production_manager({
        transaction,
      });

    output.avatar = await users.getAvatar({
      transaction,
    });

    output.app_role = await users.getApp_role({
      transaction,
    });

    if (output.app_role) {
      output.app_role_permissions = await output.app_role.getPermissions({
        transaction,
      });
    }

    output.custom_permissions = await users.getCustom_permissions({
      transaction,
    });

    output.organizations = await users.getOrganizations({
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

    if (userOrganizations) {
      if (options?.currentUser?.organizationsId) {
        where.organizationsId = options.currentUser.organizationsId;
      }
    }

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;

    let include = [
      {
        model: db.roles,
        as: 'app_role',

        where: filter.app_role
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.app_role
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  name: {
                    [Op.or]: filter.app_role
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.organizations,
        as: 'organizations',
      },

      {
        model: db.permissions,
        as: 'custom_permissions',
      },

      {
        model: db.file,
        as: 'avatar',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.firstName) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('users', 'firstName', filter.firstName),
        };
      }

      if (filter.lastName) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('users', 'lastName', filter.lastName),
        };
      }

      if (filter.phoneNumber) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('users', 'phoneNumber', filter.phoneNumber),
        };
      }

      if (filter.email) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('users', 'email', filter.email),
        };
      }

      if (filter.password) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('users', 'password', filter.password),
        };
      }

      if (filter.emailVerificationToken) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'users',
            'emailVerificationToken',
            filter.emailVerificationToken,
          ),
        };
      }

      if (filter.passwordResetToken) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'users',
            'passwordResetToken',
            filter.passwordResetToken,
          ),
        };
      }

      if (filter.provider) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('users', 'provider', filter.provider),
        };
      }

      if (filter.emailVerificationTokenExpiresAtRange) {
        const [start, end] = filter.emailVerificationTokenExpiresAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            emailVerificationTokenExpiresAt: {
              ...where.emailVerificationTokenExpiresAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            emailVerificationTokenExpiresAt: {
              ...where.emailVerificationTokenExpiresAt,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.passwordResetTokenExpiresAtRange) {
        const [start, end] = filter.passwordResetTokenExpiresAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            passwordResetTokenExpiresAt: {
              ...where.passwordResetTokenExpiresAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            passwordResetTokenExpiresAt: {
              ...where.passwordResetTokenExpiresAt,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.disabled) {
        where = {
          ...where,
          disabled: filter.disabled,
        };
      }

      if (filter.emailVerified) {
        where = {
          ...where,
          emailVerified: filter.emailVerified,
        };
      }

      if (filter.organizations) {
        const listItems = filter.organizations.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationsId: { [Op.or]: listItems },
        };
      }

      if (filter.custom_permissions) {
        const searchTerms = filter.custom_permissions.split('|');

        include = [
          {
            model: db.permissions,
            as: 'custom_permissions_filter',
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

    if (globalAccess) {
      delete where.organizationId;
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
      const { rows, count } = await db.users.findAndCountAll(queryOptions);

      return {
        rows: options?.countOnly ? [] : rows,
        count: count,
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async findAllAutocomplete(
    query,
    limit,
    offset,
    globalAccess,
    organizationId,
  ) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('users', 'firstName', query),
        ],
      };
    }

    const records = await db.users.findAll({
      attributes: ['id', 'firstName'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['firstName', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.firstName,
    }));
  }

  static async createFromAuth(data, options) {
    const transaction = (options && options.transaction) || undefined;
    const users = await db.users.create(
      {
        email: data.email,
        firstName: data.firstName,
        authenticationUid: data.authenticationUid,
        password: data.password,

        organizationId: data.organizationId,
      },
      { transaction },
    );

    const app_role = await db.roles.findOne({
      where: { name: 'User' },
    });
    if (app_role?.id) {
      await users.setApp_role(app_role?.id || null, {
        transaction,
      });
    }

    await users.update(
      {
        authenticationUid: users.id,
      },
      { transaction },
    );

    delete users.password;
    return users;
  }

  static async updatePassword(id, password, options) {
    const currentUser = (options && options.currentUser) || { id: null };

    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findByPk(id, {
      transaction,
    });

    await users.update(
      {
        password,
        authenticationUid: id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return users;
  }

  static async generateEmailVerificationToken(email, options) {
    return this._generateToken(
      ['emailVerificationToken', 'emailVerificationTokenExpiresAt'],
      email,
      options,
    );
  }

  static async generatePasswordResetToken(email, options) {
    return this._generateToken(
      ['passwordResetToken', 'passwordResetTokenExpiresAt'],
      email,
      options,
    );
  }

  static async findByPasswordResetToken(token, options) {
    const transaction = (options && options.transaction) || undefined;

    return db.users.findOne(
      {
        where: {
          passwordResetToken: token,
          passwordResetTokenExpiresAt: {
            [db.Sequelize.Op.gt]: Date.now(),
          },
        },
      },
      { transaction },
    );
  }

  static async findByEmailVerificationToken(token, options) {
    const transaction = (options && options.transaction) || undefined;
    return db.users.findOne(
      {
        where: {
          emailVerificationToken: token,
          emailVerificationTokenExpiresAt: {
            [db.Sequelize.Op.gt]: Date.now(),
          },
        },
      },
      { transaction },
    );
  }

  static async markEmailVerified(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findByPk(id, {
      transaction,
    });

    await users.update(
      {
        emailVerified: true,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return true;
  }

  static async _generateToken(keyNames, email, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const users = await db.users.findOne(
      {
        where: { email: email.toLowerCase() },
      },
      {
        transaction,
      },
    );

    const token = crypto.randomBytes(20).toString('hex');
    const tokenExpiresAt = Date.now() + 360000;

    if (users) {
      await users.update(
        {
          [keyNames[0]]: token,
          [keyNames[1]]: tokenExpiresAt,
          updatedById: currentUser.id,
        },
        { transaction },
      );
    }

    return token;
  }
};
