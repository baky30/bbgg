import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import Axios from 'axios';
import CardBox from '../CardBox';
import CardBoxModal from '../CardBoxModal';
import { AsyncThunk } from '@reduxjs/toolkit';
import { useDrop } from 'react-dnd';
import KanbanCard from './KanbanCard';

type Props = {
  column: { id: string; label: string };
  entityName: string;
  columnFieldName: string;
  showFieldName: string;
  filtersQuery: any;
  deleteThunk: AsyncThunk<any, any, any>;
  updateThunk: AsyncThunk<any, any, any>;
};

type DropResult = {
  sourceColumn: { id: string; label: string };
  item: any;
};

const perPage = 10;

const KanbanColumn = ({
  column,
  entityName,
  columnFieldName,
  showFieldName,
  filtersQuery,
  deleteThunk,
  updateThunk,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState('');
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const listInnerRef = useRef<HTMLDivElement>();
  const dispatch = useAppDispatch();

  const [{ dropResult }, drop] = useDrop<
    {
      item: any;
      column: {
        id: string;
        label: string;
      };
    },
    unknown,
    {
      dropResult: DropResult;
    }
  >(
    () => ({
      accept: 'box',
      drop: ({
        item,
        column: sourceColumn,
      }: {
        item: any;
        column: { id: string; label: string };
      }) => {
        if (sourceColumn.id === column.id) return;

        dispatch(
          updateThunk({
            id: item.id,
            data: {
              [columnFieldName]: column.id,
            },
          }),
        ).then((res) => {
          console.log('res', res);
          setData((prevState) => (prevState ? [...prevState, item] : [item]));
          setCount((prevState) => prevState + 1);
        });

        return { sourceColumn, item };
      },
      collect: (monitor) => ({
        dropResult: monitor.getDropResult(),
      }),
    }),
    [],
  );

  const loadData = useCallback(
    (page: number, filters = '') => {
      const query = `?page=${page}&limit=${perPage}&field=createdAt&sort=desc&${columnFieldName}=${column.id}&${filters}`;
      setLoading(true);
      Axios.get(`${entityName}${query}`)
        .then((res) => {
          setData((prevState) =>
            page === 0 ? res.data.rows : [...prevState, ...res.data.rows],
          );
          setCount(res.data.count);
          setCurrentPage(page);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [currentUser, column],
  );

  useEffect(() => {
    if (!currentUser) return;
    loadData(0, filtersQuery);
  }, [currentUser, loadData, filtersQuery]);

  useEffect(() => {
    loadData(0, filtersQuery);
  }, [loadData, filtersQuery]);

  useEffect(() => {
    if (dropResult?.sourceColumn && dropResult.sourceColumn.id === column.id) {
      setData((prevState) =>
        prevState.filter((item) => item.id !== dropResult.item.id),
      );
      setCount((prevState) => prevState - 1);
    }
  }, [dropResult]);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (Math.floor(scrollTop + clientHeight) === scrollHeight) {
        if (data.length < count && !loading) {
          loadData(currentPage + 1, filtersQuery);
        }
      }
    }
  };

  const onDeleteConfirm = () => {
    if (!itemIdToDelete) return;

    dispatch(deleteThunk(itemIdToDelete))
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setItemIdToDelete('');
          loadData(0, filtersQuery);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setItemIdToDelete('');
      });
  };

  return (
    <>
      <CardBox
        hasComponentLayout
        className={
          'w-72 rounded-md h-fit max-h-full overflow-hidden flex flex-col'
        }
      >
        <div className={'flex items-center justify-between p-3'}>
          <p className={'uppercase'}>{column.label}</p>
          <p>{count}</p>
        </div>
        <div
          ref={(node) => {
            drop(node);
            listInnerRef.current = node;
          }}
          className={'p-3 space-y-3 flex-1 overflow-y-auto max-h-[400px]'}
          onScroll={onScroll}
        >
          {data?.map((item) => (
            <KanbanCard
              key={item.id}
              item={item}
              column={column}
              showFieldName={showFieldName}
              entityName={entityName}
              setItemIdToDelete={setItemIdToDelete}
            />
          ))}
          {!data?.length && (
            <p className={'text-center py-8 bg-gray-50 dark:bg-dark-800'}>
              No data
            </p>
          )}
        </div>
      </CardBox>
      <CardBoxModal
        title='Please confirm'
        buttonColor='info'
        buttonLabel={loading ? 'Deleting...' : 'Confirm'}
        isActive={!!itemIdToDelete}
        onConfirm={onDeleteConfirm}
        onCancel={() => setItemIdToDelete('')}
      >
        <p>Are you sure you want to delete this item?</p>
      </CardBoxModal>
    </>
  );
};

export default KanbanColumn;
