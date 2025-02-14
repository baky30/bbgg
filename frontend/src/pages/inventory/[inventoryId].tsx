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

import { update, fetch } from '../../stores/inventory/inventorySlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditInventory = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    product_name: '',

    available_quantity: '',

    reserved_quantity: '',

    returned_quantity: '',

    organizations: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { inventory } = useAppSelector((state) => state.inventory);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { inventoryId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: inventoryId }));
  }, [inventoryId]);

  useEffect(() => {
    if (typeof inventory === 'object') {
      setInitialValues(inventory);
    }
  }, [inventory]);

  useEffect(() => {
    if (typeof inventory === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = inventory[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [inventory]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: inventoryId, data }));
    await router.push('/inventory/inventory-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit inventory')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit inventory'}
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
              <FormField label='ProductName'>
                <Field name='product_name' placeholder='ProductName' />
              </FormField>

              <FormField label='AvailableQuantity'>
                <Field
                  type='number'
                  name='available_quantity'
                  placeholder='AvailableQuantity'
                />
              </FormField>

              <FormField label='ReservedQuantity'>
                <Field
                  type='number'
                  name='reserved_quantity'
                  placeholder='ReservedQuantity'
                />
              </FormField>

              <FormField label='ReturnedQuantity'>
                <Field
                  type='number'
                  name='returned_quantity'
                  placeholder='ReturnedQuantity'
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
                  onClick={() => router.push('/inventory/inventory-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditInventory.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_INVENTORY'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditInventory;
