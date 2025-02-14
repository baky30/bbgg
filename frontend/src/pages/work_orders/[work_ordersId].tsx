import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/work_orders/work_ordersSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditWork_orders = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    order_number: '',

    materials: [],

    production_manager: '',

    start_date: new Date(),

    end_date: new Date(),

    organizations: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { work_orders } = useAppSelector((state) => state.work_orders);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { work_ordersId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: work_ordersId }));
  }, [work_ordersId]);

  useEffect(() => {
    if (typeof work_orders === 'object') {
      setInitialValues(work_orders);
    }
  }, [work_orders]);

  useEffect(() => {
    if (typeof work_orders === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = work_orders[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [work_orders]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: work_ordersId, data }));
    await router.push('/work_orders/work_orders-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit work_orders')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit work_orders'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='OrderNumber'>
                <Field name='order_number' placeholder='OrderNumber' />
              </FormField>

              <FormField label='Materials' labelFor='materials'>
                <Field
                  name='materials'
                  id='materials'
                  component={SelectFieldMany}
                  options={initialValues.materials}
                  itemRef={'raw_materials'}
                  showField={'name'}
                ></Field>
              </FormField>

              <FormField
                label='ProductionManager'
                labelFor='production_manager'
              >
                <Field
                  name='production_manager'
                  id='production_manager'
                  component={SelectField}
                  options={initialValues.production_manager}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='StartDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.start_date
                      ? new Date(
                          dayjs(initialValues.start_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, start_date: date })
                  }
                />
              </FormField>

              <FormField label='EndDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.end_date
                      ? new Date(
                          dayjs(initialValues.end_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, end_date: date })
                  }
                />
              </FormField>

              <FormField label='organizations' labelFor='organizations'>
                <Field
                  name='organizations'
                  id='organizations'
                  component={SelectField}
                  options={initialValues.organizations}
                  itemRef={'organizations'}
                  showField={'name'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/work_orders/work_orders-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditWork_orders.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_WORK_ORDERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditWork_orders;
