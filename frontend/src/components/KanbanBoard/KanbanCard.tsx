import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import ListActionsPopover from '../ListActionsPopover';
import { DragSourceMonitor, useDrag } from 'react-dnd';

type Props = {
  item: any;
  column: { id: string; label: string };
  entityName: string;
  showFieldName: string;
  setItemIdToDelete: (id: string) => void;
};

const KanbanCard = ({
  item,
  entityName,
  showFieldName,
  setItemIdToDelete,
  column,
}: Props) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'box',
      item: { item, column },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [item],
  );

  return (
    <div
      ref={drag}
      className={`bg-gray-50 dark:bg-dark-800 rounded-md space-y-2 p-4 relative ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <div className={'flex items-center justify-between'}>
        <Link
          href={`/${entityName}/${entityName}-view/?id=${item.id}`}
          className={'text-base font-semibold'}
        >
          {item[showFieldName] ?? 'No data'}
        </Link>
      </div>
      <div className={'flex items-center justify-between'}>
        <p>{moment(item.createdAt).format('MMM DD hh:mm a')}</p>
        <ListActionsPopover
          itemId={item.id}
          pathEdit={`/${entityName}/${entityName}-edit/?id=${item.id}`}
          pathView={`/${entityName}/${entityName}-view/?id=${item.id}`}
          onDelete={(id) => setItemIdToDelete(id)}
          hasUpdatePermission={true}
          className={'w-2 h-2 text-white'}
          iconClassName={'w-5'}
        />
      </div>
    </div>
  );
};

export default KanbanCard;
