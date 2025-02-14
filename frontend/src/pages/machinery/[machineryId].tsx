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

import { update, fetch } from '../../stores/machinery/machinerySlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditMachinery = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    machine_name: '',

    model: '',

    maintenance_schedule: new Date(),

    downtime_hours: '',

    organizations: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { machinery } = useAppSelector((state) => state.machinery);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { machineryId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: machineryId }));
  }, [machineryId]);

  useEffect(() => {
    if (typeof machinery === 'object') {
      setInitialValues(machinery);
    }
  }, [machinery]);

  useEffect(() => {
    if (typeof machinery === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = machinery[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [machinery]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: machineryId, data }));
    await router.push('/machinery/machinery-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit machinery')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit machinery'}
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
              <FormField label='MachineName'>
                <Field name='machine_name' placeholder='MachineName' />
              </FormField>

              <FormField label='Model'>
                <Field name='model' placeholder='Model' />
              </FormField>

              <FormField label='MaintenanceSchedule'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.maintenance_schedule
                      ? new Date(
                          dayjs(initialValues.maintenance_schedule).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({
                      ...initialValues,
                      maintenance_schedule: date,
                    })
                  }
                />
              </FormField>

              <FormField label='DowntimeHours'>
                <Field
                  type='number'
                  name='downtime_hours'
                  placeholder='DowntimeHours'
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
                  onClick={() => router.push('/machinery/machinery-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditMachinery.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_MACHINERY'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditMachinery;
