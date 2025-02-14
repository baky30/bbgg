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

import { update, fetch } from '../../stores/suppliers/suppliersSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditSuppliers = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    supplier_name: '',

    contract_terms: '',

    delivery_schedule: new Date(),

    payment_due: '',

    organizations: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { suppliers } = useAppSelector((state) => state.suppliers);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { suppliersId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: suppliersId }));
  }, [suppliersId]);

  useEffect(() => {
    if (typeof suppliers === 'object') {
      setInitialValues(suppliers);
    }
  }, [suppliers]);

  useEffect(() => {
    if (typeof suppliers === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = suppliers[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [suppliers]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: suppliersId, data }));
    await router.push('/suppliers/suppliers-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit suppliers')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit suppliers'}
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
              <FormField label='SupplierName'>
                <Field name='supplier_name' placeholder='SupplierName' />
              </FormField>

              <FormField label='ContractTerms' hasTextareaHeight>
                <Field
                  name='contract_terms'
                  id='contract_terms'
                  component={RichTextField}
                ></Field>
              </FormField>

              <FormField label='DeliverySchedule'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.delivery_schedule
                      ? new Date(
                          dayjs(initialValues.delivery_schedule).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({
                      ...initialValues,
                      delivery_schedule: date,
                    })
                  }
                />
              </FormField>

              <FormField label='PaymentDue'>
                <Field
                  type='number'
                  name='payment_due'
                  placeholder='PaymentDue'
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
                  onClick={() => router.push('/suppliers/suppliers-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditSuppliers.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_SUPPLIERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditSuppliers;
