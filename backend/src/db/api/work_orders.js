const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Work_ordersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.create(
      {
        id: data.id || undefined,

        order_number: data.order_number || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await work_orders.setProduction_manager(data.production_manager || null, {
      transaction,
    });

    await work_orders.setOrganizations(data.organizations || null, {
      transaction,
    });

    await work_orders.setMaterials(data.materials || [], {
      transaction,
    });

    return work_orders;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const work_ordersData = data.map((item, index) => ({
      id: item.id || undefined,

      order_number: item.order_number || null,
      start_date: item.start_date || null,
      end_date: item.end_date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const work_orders = await db.work_orders.bulkCreate(work_ordersData, {
      transaction,
    });

    // For each item created, replace relation files

    return work_orders;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const work_orders = await db.work_orders.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.order_number !== undefined)
      updatePayload.order_number = data.order_number;

    if (data.start_date !== undefined)
      updatePayload.start_date = data.start_date;

    if (data.end_date !== undefined) updatePayload.end_date = data.end_date;

    updatePayload.updatedById = currentUser.id;

    await work_orders.update(updatePayload, { transaction });

    if (data.production_manager !== undefined) {
      await work_orders.setProduction_manager(
        data.production_manager,

        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await work_orders.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    if (data.materials !== undefined) {
      await work_orders.setMaterials(data.materials, { transaction });
    }

    return work_orders;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of work_orders) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of work_orders) {
        await record.destroy({ transaction });
      }
    });

    return work_orders;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findByPk(id, options);

    await work_orders.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await work_orders.destroy({
      transaction,
    });

    return work_orders;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findOne(
      { where },
      { transaction },
    );

    if (!work_orders) {
      return work_orders;
    }

    const output = work_orders.get({ plain: true });

    output.quality_control_work_order =
      await work_orders.getQuality_control_work_order({
        transaction,
      });

    output.materials = await work_orders.getMaterials({
      transaction,
    });

    output.production_manager = await work_orders.getProduction_manager({
      transaction,
    });

    output.organizations = await work_orders.getOrganizations({
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
        model: db.users,
        as: 'production_manager',

        where: filter.production_manager
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.production_manager
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  firstName: {
                    [Op.or]: filter.production_manager
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
        model: db.raw_materials,
        as: 'materials',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.order_number) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'work_orders',
            'order_number',
            filter.order_number,
          ),
        };
      }

      if (filter.start_dateRange) {
        const [start, end] = filter.start_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            start_date: {
              ...where.start_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            start_date: {
              ...where.start_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.end_dateRange) {
        const [start, end] = filter.end_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            end_date: {
              ...where.end_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            end_date: {
              ...where.end_date,
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

      if (filter.organizations) {
        const listItems = filter.organizations.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationsId: { [Op.or]: listItems },
        };
      }

      if (filter.materials) {
        const searchTerms = filter.materials.split('|');

        include = [
          {
            model: db.raw_materials,
            as: 'materials_filter',
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
      const { rows, count } = await db.work_orders.findAndCountAll(
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
          Utils.ilike('work_orders', 'order_number', query),
        ],
      };
    }

    const records = await db.work_orders.findAll({
      attributes: ['id', 'order_number'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['order_number', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.order_number,
    }));
  }
};
