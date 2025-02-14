const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class SuppliersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.create(
      {
        id: data.id || undefined,

        supplier_name: data.supplier_name || null,
        contract_terms: data.contract_terms || null,
        delivery_schedule: data.delivery_schedule || null,
        payment_due: data.payment_due || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await suppliers.setOrganizations(data.organizations || null, {
      transaction,
    });

    return suppliers;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const suppliersData = data.map((item, index) => ({
      id: item.id || undefined,

      supplier_name: item.supplier_name || null,
      contract_terms: item.contract_terms || null,
      delivery_schedule: item.delivery_schedule || null,
      payment_due: item.payment_due || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const suppliers = await db.suppliers.bulkCreate(suppliersData, {
      transaction,
    });

    // For each item created, replace relation files

    return suppliers;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const suppliers = await db.suppliers.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.supplier_name !== undefined)
      updatePayload.supplier_name = data.supplier_name;

    if (data.contract_terms !== undefined)
      updatePayload.contract_terms = data.contract_terms;

    if (data.delivery_schedule !== undefined)
      updatePayload.delivery_schedule = data.delivery_schedule;

    if (data.payment_due !== undefined)
      updatePayload.payment_due = data.payment_due;

    updatePayload.updatedById = currentUser.id;

    await suppliers.update(updatePayload, { transaction });

    if (data.organizations !== undefined) {
      await suppliers.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return suppliers;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of suppliers) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of suppliers) {
        await record.destroy({ transaction });
      }
    });

    return suppliers;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.findByPk(id, options);

    await suppliers.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await suppliers.destroy({
      transaction,
    });

    return suppliers;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.findOne({ where }, { transaction });

    if (!suppliers) {
      return suppliers;
    }

    const output = suppliers.get({ plain: true });

    output.organizations = await suppliers.getOrganizations({
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

      if (filter.supplier_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'suppliers',
            'supplier_name',
            filter.supplier_name,
          ),
        };
      }

      if (filter.contract_terms) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'suppliers',
            'contract_terms',
            filter.contract_terms,
          ),
        };
      }

      if (filter.delivery_scheduleRange) {
        const [start, end] = filter.delivery_scheduleRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            delivery_schedule: {
              ...where.delivery_schedule,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            delivery_schedule: {
              ...where.delivery_schedule,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.payment_dueRange) {
        const [start, end] = filter.payment_dueRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            payment_due: {
              ...where.payment_due,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            payment_due: {
              ...where.payment_due,
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
      const { rows, count } = await db.suppliers.findAndCountAll(queryOptions);

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
          Utils.ilike('suppliers', 'supplier_name', query),
        ],
      };
    }

    const records = await db.suppliers.findAll({
      attributes: ['id', 'supplier_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['supplier_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.supplier_name,
    }));
  }
};
