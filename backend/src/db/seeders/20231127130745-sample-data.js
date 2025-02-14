const db = require('../models');
const Users = db.users;

const HumanResources = db.human_resources;

const Inventory = db.inventory;

const Machinery = db.machinery;

const QualityControl = db.quality_control;

const RawMaterials = db.raw_materials;

const Suppliers = db.suppliers;

const WorkOrders = db.work_orders;

const Organizations = db.organizations;

const HumanResourcesData = [
  {
    employee_name: 'Nicolaus Copernicus',

    role: 'ManagerialStaff',

    shift: 'Charles Darwin',

    payroll: 24.56,

    // type code here for "relation_one" field
  },

  {
    employee_name: 'Edward O. Wilson',

    role: 'ManagerialStaff',

    shift: 'James Clerk Maxwell',

    payroll: 86.55,

    // type code here for "relation_one" field
  },

  {
    employee_name: 'Louis Victor de Broglie',

    role: 'SkilledLabor',

    shift: 'August Kekule',

    payroll: 72.03,

    // type code here for "relation_one" field
  },

  {
    employee_name: 'Paul Dirac',

    role: 'ManagerialStaff',

    shift: 'Louis Pasteur',

    payroll: 20.85,

    // type code here for "relation_one" field
  },

  {
    employee_name: 'Tycho Brahe',

    role: 'ManagerialStaff',

    shift: 'Albrecht von Haller',

    payroll: 53.81,

    // type code here for "relation_one" field
  },
];

const InventoryData = [
  {
    product_name: 'Hermann von Helmholtz',

    available_quantity: 90.32,

    reserved_quantity: 43.75,

    returned_quantity: 23.92,

    // type code here for "relation_one" field
  },

  {
    product_name: 'Johannes Kepler',

    available_quantity: 26.55,

    reserved_quantity: 50.88,

    returned_quantity: 77.71,

    // type code here for "relation_one" field
  },

  {
    product_name: 'Gregor Mendel',

    available_quantity: 96.47,

    reserved_quantity: 15.12,

    returned_quantity: 50.63,

    // type code here for "relation_one" field
  },

  {
    product_name: 'Charles Sherrington',

    available_quantity: 37.28,

    reserved_quantity: 10.11,

    returned_quantity: 43.58,

    // type code here for "relation_one" field
  },

  {
    product_name: 'Michael Faraday',

    available_quantity: 17.26,

    reserved_quantity: 76.63,

    returned_quantity: 27.63,

    // type code here for "relation_one" field
  },
];

const MachineryData = [
  {
    machine_name: 'Paul Dirac',

    model: 'Wilhelm Wundt',

    maintenance_schedule: new Date(),

    downtime_hours: 3,

    // type code here for "relation_one" field
  },

  {
    machine_name: 'Francis Crick',

    model: 'B. F. Skinner',

    maintenance_schedule: new Date(),

    downtime_hours: 5,

    // type code here for "relation_one" field
  },

  {
    machine_name: 'Sigmund Freud',

    model: 'Archimedes',

    maintenance_schedule: new Date(),

    downtime_hours: 3,

    // type code here for "relation_one" field
  },

  {
    machine_name: 'Carl Gauss (Karl Friedrich Gauss)',

    model: 'Alexander Fleming',

    maintenance_schedule: new Date(),

    downtime_hours: 9,

    // type code here for "relation_one" field
  },

  {
    machine_name: 'Charles Sherrington',

    model: 'Thomas Hunt Morgan',

    maintenance_schedule: new Date(),

    downtime_hours: 5,

    // type code here for "relation_one" field
  },
];

const QualityControlData = [
  {
    check_name: 'Johannes Kepler',

    // type code here for "relation_one" field

    compliance_passed: true,

    // type code here for "relation_one" field
  },

  {
    check_name: 'Frederick Sanger',

    // type code here for "relation_one" field

    compliance_passed: false,

    // type code here for "relation_one" field
  },

  {
    check_name: 'Antoine Laurent Lavoisier',

    // type code here for "relation_one" field

    compliance_passed: false,

    // type code here for "relation_one" field
  },

  {
    check_name: 'Francis Galton',

    // type code here for "relation_one" field

    compliance_passed: false,

    // type code here for "relation_one" field
  },

  {
    check_name: 'Willard Libby',

    // type code here for "relation_one" field

    compliance_passed: false,

    // type code here for "relation_one" field
  },
];

const RawMaterialsData = [
  {
    name: 'Antoine Laurent Lavoisier',

    quantity: 21.08,

    unit: 'Ernst Mayr',

    reorder_level: 99.48,

    // type code here for "relation_one" field
  },

  {
    name: 'August Kekule',

    quantity: 64.71,

    unit: 'Gustav Kirchhoff',

    reorder_level: 48.77,

    // type code here for "relation_one" field
  },

  {
    name: 'Gustav Kirchhoff',

    quantity: 68.03,

    unit: 'Marcello Malpighi',

    reorder_level: 68.91,

    // type code here for "relation_one" field
  },

  {
    name: 'Willard Libby',

    quantity: 53.83,

    unit: 'Hans Selye',

    reorder_level: 68.14,

    // type code here for "relation_one" field
  },

  {
    name: 'Charles Darwin',

    quantity: 26.61,

    unit: 'August Kekule',

    reorder_level: 17.97,

    // type code here for "relation_one" field
  },
];

const SuppliersData = [
  {
    supplier_name: 'John Dalton',

    contract_terms: 'Alexander Fleming',

    delivery_schedule: new Date(),

    payment_due: 39.74,

    // type code here for "relation_one" field
  },

  {
    supplier_name: 'Theodosius Dobzhansky',

    contract_terms: 'Tycho Brahe',

    delivery_schedule: new Date(),

    payment_due: 57.07,

    // type code here for "relation_one" field
  },

  {
    supplier_name: 'Paul Ehrlich',

    contract_terms: 'Wilhelm Wundt',

    delivery_schedule: new Date(),

    payment_due: 36.04,

    // type code here for "relation_one" field
  },

  {
    supplier_name: 'Francis Galton',

    contract_terms: 'Marcello Malpighi',

    delivery_schedule: new Date(),

    payment_due: 27.51,

    // type code here for "relation_one" field
  },

  {
    supplier_name: 'Rudolf Virchow',

    contract_terms: 'Robert Koch',

    delivery_schedule: new Date(),

    payment_due: 51.62,

    // type code here for "relation_one" field
  },
];

const WorkOrdersData = [
  {
    order_number: 'Jean Baptiste Lamarck',

    // type code here for "relation_many" field

    // type code here for "relation_one" field

    start_date: new Date(),

    end_date: new Date(),

    // type code here for "relation_one" field
  },

  {
    order_number: 'Erwin Schrodinger',

    // type code here for "relation_many" field

    // type code here for "relation_one" field

    start_date: new Date(),

    end_date: new Date(),

    // type code here for "relation_one" field
  },

  {
    order_number: 'Gustav Kirchhoff',

    // type code here for "relation_many" field

    // type code here for "relation_one" field

    start_date: new Date(),

    end_date: new Date(),

    // type code here for "relation_one" field
  },

  {
    order_number: 'Ernst Mayr',

    // type code here for "relation_many" field

    // type code here for "relation_one" field

    start_date: new Date(),

    end_date: new Date(),

    // type code here for "relation_one" field
  },

  {
    order_number: 'John von Neumann',

    // type code here for "relation_many" field

    // type code here for "relation_one" field

    start_date: new Date(),

    end_date: new Date(),

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'Richard Feynman',
  },

  {
    name: 'William Harvey',
  },

  {
    name: 'Linus Pauling',
  },

  {
    name: 'Leonard Euler',
  },

  {
    name: 'Charles Sherrington',
  },
];

// Similar logic for "relation_many"

async function associateUserWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setOrganization) {
    await User0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setOrganization) {
    await User1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setOrganization) {
    await User2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User3 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (User3?.setOrganization) {
    await User3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User4 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (User4?.setOrganization) {
    await User4.setOrganization(relatedOrganization4);
  }
}

async function associateHumanResourceWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const HumanResource0 = await HumanResources.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (HumanResource0?.setOrganization) {
    await HumanResource0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const HumanResource1 = await HumanResources.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (HumanResource1?.setOrganization) {
    await HumanResource1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const HumanResource2 = await HumanResources.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (HumanResource2?.setOrganization) {
    await HumanResource2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const HumanResource3 = await HumanResources.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (HumanResource3?.setOrganization) {
    await HumanResource3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const HumanResource4 = await HumanResources.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (HumanResource4?.setOrganization) {
    await HumanResource4.setOrganization(relatedOrganization4);
  }
}

async function associateInventoryWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory0 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Inventory0?.setOrganization) {
    await Inventory0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory1 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Inventory1?.setOrganization) {
    await Inventory1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory2 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Inventory2?.setOrganization) {
    await Inventory2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory3 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Inventory3?.setOrganization) {
    await Inventory3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory4 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Inventory4?.setOrganization) {
    await Inventory4.setOrganization(relatedOrganization4);
  }
}

async function associateMachineryWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Machinery0 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Machinery0?.setOrganization) {
    await Machinery0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Machinery1 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Machinery1?.setOrganization) {
    await Machinery1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Machinery2 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Machinery2?.setOrganization) {
    await Machinery2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Machinery3 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Machinery3?.setOrganization) {
    await Machinery3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Machinery4 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Machinery4?.setOrganization) {
    await Machinery4.setOrganization(relatedOrganization4);
  }
}

async function associateQualityControlWithWork_order() {
  const relatedWork_order0 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl0 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (QualityControl0?.setWork_order) {
    await QualityControl0.setWork_order(relatedWork_order0);
  }

  const relatedWork_order1 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl1 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (QualityControl1?.setWork_order) {
    await QualityControl1.setWork_order(relatedWork_order1);
  }

  const relatedWork_order2 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl2 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (QualityControl2?.setWork_order) {
    await QualityControl2.setWork_order(relatedWork_order2);
  }

  const relatedWork_order3 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl3 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (QualityControl3?.setWork_order) {
    await QualityControl3.setWork_order(relatedWork_order3);
  }

  const relatedWork_order4 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl4 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (QualityControl4?.setWork_order) {
    await QualityControl4.setWork_order(relatedWork_order4);
  }
}

async function associateQualityControlWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const QualityControl0 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (QualityControl0?.setOrganization) {
    await QualityControl0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const QualityControl1 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (QualityControl1?.setOrganization) {
    await QualityControl1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const QualityControl2 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (QualityControl2?.setOrganization) {
    await QualityControl2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const QualityControl3 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (QualityControl3?.setOrganization) {
    await QualityControl3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const QualityControl4 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (QualityControl4?.setOrganization) {
    await QualityControl4.setOrganization(relatedOrganization4);
  }
}

async function associateRawMaterialWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const RawMaterial0 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (RawMaterial0?.setOrganization) {
    await RawMaterial0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const RawMaterial1 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (RawMaterial1?.setOrganization) {
    await RawMaterial1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const RawMaterial2 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (RawMaterial2?.setOrganization) {
    await RawMaterial2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const RawMaterial3 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (RawMaterial3?.setOrganization) {
    await RawMaterial3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const RawMaterial4 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (RawMaterial4?.setOrganization) {
    await RawMaterial4.setOrganization(relatedOrganization4);
  }
}

async function associateSupplierWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Supplier0 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Supplier0?.setOrganization) {
    await Supplier0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Supplier1 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Supplier1?.setOrganization) {
    await Supplier1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Supplier2 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Supplier2?.setOrganization) {
    await Supplier2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Supplier3 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Supplier3?.setOrganization) {
    await Supplier3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Supplier4 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Supplier4?.setOrganization) {
    await Supplier4.setOrganization(relatedOrganization4);
  }
}

// Similar logic for "relation_many"

async function associateWorkOrderWithProduction_manager() {
  const relatedProduction_manager0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const WorkOrder0 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (WorkOrder0?.setProduction_manager) {
    await WorkOrder0.setProduction_manager(relatedProduction_manager0);
  }

  const relatedProduction_manager1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const WorkOrder1 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (WorkOrder1?.setProduction_manager) {
    await WorkOrder1.setProduction_manager(relatedProduction_manager1);
  }

  const relatedProduction_manager2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const WorkOrder2 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (WorkOrder2?.setProduction_manager) {
    await WorkOrder2.setProduction_manager(relatedProduction_manager2);
  }

  const relatedProduction_manager3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const WorkOrder3 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (WorkOrder3?.setProduction_manager) {
    await WorkOrder3.setProduction_manager(relatedProduction_manager3);
  }

  const relatedProduction_manager4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const WorkOrder4 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (WorkOrder4?.setProduction_manager) {
    await WorkOrder4.setProduction_manager(relatedProduction_manager4);
  }
}

async function associateWorkOrderWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const WorkOrder0 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (WorkOrder0?.setOrganization) {
    await WorkOrder0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const WorkOrder1 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (WorkOrder1?.setOrganization) {
    await WorkOrder1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const WorkOrder2 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (WorkOrder2?.setOrganization) {
    await WorkOrder2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const WorkOrder3 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (WorkOrder3?.setOrganization) {
    await WorkOrder3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const WorkOrder4 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (WorkOrder4?.setOrganization) {
    await WorkOrder4.setOrganization(relatedOrganization4);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await HumanResources.bulkCreate(HumanResourcesData);

    await Inventory.bulkCreate(InventoryData);

    await Machinery.bulkCreate(MachineryData);

    await QualityControl.bulkCreate(QualityControlData);

    await RawMaterials.bulkCreate(RawMaterialsData);

    await Suppliers.bulkCreate(SuppliersData);

    await WorkOrders.bulkCreate(WorkOrdersData);

    await Organizations.bulkCreate(OrganizationsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithOrganization(),

      await associateHumanResourceWithOrganization(),

      await associateInventoryWithOrganization(),

      await associateMachineryWithOrganization(),

      await associateQualityControlWithWork_order(),

      await associateQualityControlWithOrganization(),

      await associateRawMaterialWithOrganization(),

      await associateSupplierWithOrganization(),

      // Similar logic for "relation_many"

      await associateWorkOrderWithProduction_manager(),

      await associateWorkOrderWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('human_resources', null, {});

    await queryInterface.bulkDelete('inventory', null, {});

    await queryInterface.bulkDelete('machinery', null, {});

    await queryInterface.bulkDelete('quality_control', null, {});

    await queryInterface.bulkDelete('raw_materials', null, {});

    await queryInterface.bulkDelete('suppliers', null, {});

    await queryInterface.bulkDelete('work_orders', null, {});

    await queryInterface.bulkDelete('organizations', null, {});
  },
};
