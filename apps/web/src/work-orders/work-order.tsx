import React from 'react';
import { IWorkOrder } from './interfaces';

type WorkOrderProps = {
  workOrder: IWorkOrder;
  onDoneChange: (id: string, done: boolean) => void;
};

const WorkOrder = ({ workOrder, onDoneChange }: WorkOrderProps) => {
  const { id, date, name, done } = workOrder;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.closest('tr')?.dataset.id;

    // abort if no id
    if (!id) {
      return;
    }

    // put request to update work order
    onDoneChange(id, event.target.checked);
  };

  return (
    <tr className="workorder-item | table-row" data-id={id}>
      <td className="workorder-item-done | table-cell">
        <label htmlFor="done">
          {/* <span className="sr-only">Done</span> */}
        </label>
        <input
          name="done"
          type="checkbox"
          checked={done}
          onChange={handleChange}
        />
      </td>
      <td className="workorder-item-id | table-cell">{id}</td>
      <td className="workorder-item-date | table-cell">{date}</td>
      <td className="workorder-item-name | table-cell">{name}</td>
    </tr>
  );
};

export default WorkOrder;
