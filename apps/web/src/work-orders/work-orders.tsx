import React, { useEffect, useState } from 'react';
import { IWorkOrder } from './interfaces';
import NewWorkOrder from './new-work-order';
import WorkOrder from './work-order';

// Make use of fetchWorkOrders and SubmitWorkOrder from './api'
import { fetchWorkOrders, submitWorkOrder, updateWorkOrderDone } from './api';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState<IWorkOrder[]>([]);
  const [searchProperty, setSearchProperty] = useState<'name' | 'id'>('id');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // call api function when done checkbox is changed and update state
  const doneChangeHandler = (id: string, done: boolean) => {
    updateWorkOrderDone(id, done).then((updatedWorkOrders) =>
      setWorkOrders(updatedWorkOrders)
    );
  };

  // only return work orders that match the search term or return all if no search term
  const workOrderFilter = (workOrder: IWorkOrder) => {
    return workOrder[searchProperty].includes(searchTerm) || searchTerm === '';
  };

  // initial fetch, only run at first render
  useEffect(() => {
    fetchWorkOrders().then((workOrders) => setWorkOrders(workOrders));
  }, []);

  return (
    <div>
      <NewWorkOrder
        onSubmit={submitWorkOrder}
        onAddNewWorkOrder={(updatedWorkOrders) =>
          setWorkOrders(updatedWorkOrders)
        }
      />

      <select
        value={searchProperty}
        onChange={(e) => {
          setSearchProperty(e.target.value as 'name' | 'id');
        }}
      >
        <option value="id">ID</option>
        <option value="name">Name</option>
      </select>

      <input
        type="search"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      <p>{searchProperty}</p>
      <p>{searchTerm}</p>

      <h2>Work Orders</h2>
      <table>
        <thead>
          <tr>
            <th className="table-head">Done</th>
            <th className="table-head">ID</th>
            <th className="table-head">Date</th>
            <th className="table-head">Name</th>
          </tr>
        </thead>
        <tbody>
          {workOrders
            // filter work orders by search term and property (id or name)
            .filter(workOrderFilter)
            .map((workOrder) => (
              <WorkOrder
                key={workOrder.id}
                workOrder={workOrder}
                onDoneChange={doneChangeHandler}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkOrders;
