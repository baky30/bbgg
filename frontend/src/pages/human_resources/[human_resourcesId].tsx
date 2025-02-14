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

import {
  update,
  fetch,
} from '../../stores/human_resources/human_resourcesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditHuman_resources = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    employee_name: '',

    role: '',

    shift: '',

    payroll: '',

    organizations: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { human_resources } = useAppSelector((state) => state.human_resources);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { human_resourcesId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: human_resourcesId }));
  }, [human_resourcesId]);

  useEffect(() => {
    if (typeof human_resources === 'object') {
      setInitialValues(human_resources);
    }
  }, [human_resources]);

  useEffect(() => {
    if (typeof human_resources === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = human_resources[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [human_resources]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: human_resourcesId, data }));
    await router.push('/human_resources/human_resources-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit human_resources')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit human_resources'}
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
              <FormField label='EmployeeName'>
                <Field name='employee_name' placeholder='EmployeeName' />
              </FormField>

              <FormField label='Role' labelFor='role'>
                <Field name='role' id='role' component='select'>
                  <option value='SkilledLabor'>SkilledLabor</option>

                  <option value='ManagerialStaff'>ManagerialStaff</option>
                </Field>
              </FormField>

              <FormField label='Shift'>
                <Field name='shift' placeholder='Shift' />
              </FormField>

              <FormField label='Payroll'>
                <Field type='number' name='payroll' placeholder='Payroll' />
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
                  onClick={() =>
                    router.push('/human_resources/human_resources-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditHuman_resources.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_HUMAN_RESOURCES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditHuman_resources;
