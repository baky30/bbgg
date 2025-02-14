const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Quality_controlDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.create(
      {
        id: data.id || undefined,

        check_name: data.check_name || null,
        compliance_passed: data.compliance_passed || false,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await quality_control.setWork_order(data.work_order || null, {
      transaction,
    });

    await quality_control.setOrganizations(data.organizations || null, {
      transaction,
    });

    return quality_control;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const quality_controlData = data.map((item, index) => ({
      id: item.id || undefined,

      check_name: item.check_name || null,
      compliance_passed: item.compliance_passed || false,

      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const quality_control = await db.quality_control.bulkCreate(
      quality_controlData,
      { transaction },
    );

    // For each item created, replace relation files

    return quality_control;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const quality_control = await db.quality_control.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.check_name !== undefined)
      updatePayload.check_name = data.check_name;

    if (data.compliance_passed !== undefined)
      updatePayload.compliance_passed = data.compliance_passed;

    updatePayload.updatedById = currentUser.id;

    await quality_control.update(updatePayload, { transaction });

    if (data.work_order !== undefined) {
      await quality_control.setWork_order(
        data.work_order,

        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await quality_control.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return quality_control;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of quality_control) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of quality_control) {
        await record.destroy({ transaction });
      }
    });

    return quality_control;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.findByPk(id, options);

    await quality_control.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await quality_control.destroy({
      transaction,
    });

    return quality_control;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.findOne(
      { where },
      { transaction },
    );

    if (!quality_control) {
      return quality_control;
    }

    const output = quality_control.get({ plain: true });

    output.work_order = await quality_control.getWork_order({
      transaction,
    });

    output.organizations = await quality_control.getOrganizations({
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
        model: db.work_orders,
        as: 'work_order',

        where: filter.work_order
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.work_order
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  order_number: {
                    [Op.or]: filter.work_order
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
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.check_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'quality_control',
            'check_name',
            filter.check_name,
          ),
        };
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.compliance_passed) {
        where = {
          ...where,
          compliance_passed: filter.compliance_passed,
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
      const { rows, count } = await db.quality_control.findAndCountAll(
        queryOptions,
      );

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
          Utils.ilike('quality_control', 'check_name', query),
        ],
      };
    }

    const records = await db.quality_control.findAll({
      attributes: ['id', 'check_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['check_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.check_name,
    }));
  }
};
