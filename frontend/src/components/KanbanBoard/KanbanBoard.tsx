import React from 'react';
import KanbanColumn from './KanbanColumn';
import { AsyncThunk } from '@reduxjs/toolkit';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type Props = {
  columns: Array<{ id: string; label: string }>;
  filtersQuery: string;
  entityName: string;
  columnFieldName: string;
  showFieldName: string;
  deleteThunk: AsyncThunk<any, any, any>;
  updateThunk: AsyncThunk<any, any, any>;
};

const KanbanBoard = ({
  columns,
  entityName,
  columnFieldName,
  filtersQuery,
  showFieldName,
  deleteThunk,
  updateThunk,
}: Props) => {
  return (
    <div
      className={
        'pb-2 flex-grow min-h-[400px] flex-1 grid grid-rows-1 auto-cols-min grid-flow-col gap-x-3 overflow-y-hidden overflow-x-auto'
      }
    >
      <DndProvider backend={HTML5Backend}>
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            entityName={entityName}
            columnFieldName={columnFieldName}
            showFieldName={showFieldName}
            column={column}
            filtersQuery={filtersQuery}
            deleteThunk={deleteThunk}
            updateThunk={updateThunk}
          />
        ))}
      </DndProvider>
    </div>
  );
};

export default KanbanBoard;
