import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/organizations/organizationsSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

import { hasPermission } from '../../helpers/userPermissions';

const OrganizationsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { organizations } = useAppSelector((state) => state.organizations);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View organizations')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View organizations')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/organizations/organizations-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{organizations?.name}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Users Organizations</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>First Name</th>

                      <th>Last Name</th>

                      <th>Phone Number</th>

                      <th>E-Mail</th>

                      <th>Disabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.users_organizations &&
                      Array.isArray(organizations.users_organizations) &&
                      organizations.users_organizations.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/users/users-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='firstName'>{item.firstName}</td>

                          <td data-label='lastName'>{item.lastName}</td>

                          <td data-label='phoneNumber'>{item.phoneNumber}</td>

                          <td data-label='email'>{item.email}</td>

                          <td data-label='disabled'>
                            {dataFormatter.booleanFormatter(item.disabled)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!organizations?.users_organizations?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>
              Human_resources organizations
            </p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>EmployeeName</th>

                      <th>Role</th>

                      <th>Shift</th>

                      <th>Payroll</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.human_resources_organizations &&
                      Array.isArray(
                        organizations.human_resources_organizations,
                      ) &&
                      organizations.human_resources_organizations.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/human_resources/human_resources-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='employee_name'>
                              {item.employee_name}
                            </td>

                            <td data-label='role'>{item.role}</td>

                            <td data-label='shift'>{item.shift}</td>

                            <td data-label='payroll'>{item.payroll}</td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!organizations?.human_resources_organizations?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Inventory organizations</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>ProductName</th>

                      <th>AvailableQuantity</th>

                      <th>ReservedQuantity</th>

                      <th>ReturnedQuantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.inventory_organizations &&
                      Array.isArray(organizations.inventory_organizations) &&
                      organizations.inventory_organizations.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/inventory/inventory-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='product_name'>{item.product_name}</td>

                          <td data-label='available_quantity'>
                            {item.available_quantity}
                          </td>

                          <td data-label='reserved_quantity'>
                            {item.reserved_quantity}
                          </td>

                          <td data-label='returned_quantity'>
                            {item.returned_quantity}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!organizations?.inventory_organizations?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Machinery organizations</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>MachineName</th>

                      <th>Model</th>

                      <th>MaintenanceSchedule</th>

                      <th>DowntimeHours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.machinery_organizations &&
                      Array.isArray(organizations.machinery_organizations) &&
                      organizations.machinery_organizations.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/machinery/machinery-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='machine_name'>{item.machine_name}</td>

                          <td data-label='model'>{item.model}</td>

                          <td data-label='maintenance_schedule'>
                            {dataFormatter.dateTimeFormatter(
                              item.maintenance_schedule,
                            )}
                          </td>

                          <td data-label='downtime_hours'>
                            {item.downtime_hours}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!organizations?.machinery_organizations?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>
              Quality_control organizations
            </p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>CheckName</th>

                      <th>CompliancePassed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.quality_control_organizations &&
                      Array.isArray(
                        organizations.quality_control_organizations,
                      ) &&
                      organizations.quality_control_organizations.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/quality_control/quality_control-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='check_name'>{item.check_name}</td>

                            <td data-label='compliance_passed'>
                              {dataFormatter.booleanFormatter(
                                item.compliance_passed,
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!organizations?.quality_control_organizations?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>
              Raw_materials organizations
            </p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>

                      <th>Quantity</th>

                      <th>Unit</th>

                      <th>ReorderLevel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.raw_materials_organizations &&
                      Array.isArray(
                        organizations.raw_materials_organizations,
                      ) &&
                      organizations.raw_materials_organizations.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/raw_materials/raw_materials-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='name'>{item.name}</td>

                            <td data-label='quantity'>{item.quantity}</td>

                            <td data-label='unit'>{item.unit}</td>

                            <td data-label='reorder_level'>
                              {item.reorder_level}
                            </td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!organizations?.raw_materials_organizations?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Suppliers organizations</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>SupplierName</th>

                      <th>DeliverySchedule</th>

                      <th>PaymentDue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.suppliers_organizations &&
                      Array.isArray(organizations.suppliers_organizations) &&
                      organizations.suppliers_organizations.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/suppliers/suppliers-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='supplier_name'>
                            {item.supplier_name}
                          </td>

                          <td data-label='delivery_schedule'>
                            {dataFormatter.dateTimeFormatter(
                              item.delivery_schedule,
                            )}
                          </td>

                          <td data-label='payment_due'>{item.payment_due}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!organizations?.suppliers_organizations?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Work_orders organizations</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>OrderNumber</th>

                      <th>StartDate</th>

                      <th>EndDate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.work_orders_organizations &&
                      Array.isArray(organizations.work_orders_organizations) &&
                      organizations.work_orders_organizations.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/work_orders/work_orders-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='order_number'>
                              {item.order_number}
                            </td>

                            <td data-label='start_date'>
                              {dataFormatter.dateTimeFormatter(item.start_date)}
                            </td>

                            <td data-label='end_date'>
                              {dataFormatter.dateTimeFormatter(item.end_date)}
                            </td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!organizations?.work_orders_organizations?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/organizations/organizations-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

OrganizationsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_ORGANIZATIONS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default OrganizationsView;
