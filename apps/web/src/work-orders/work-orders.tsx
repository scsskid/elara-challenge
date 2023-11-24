import React, { useEffect, useState } from 'react';
import { IWorkOrder } from './interfaces';
import NewWorkOrder from './new-work-order';
import WorkOrder from './work-order';

// Make use of fetchWorkOrders and SubmitWorkOrder from './api'
import { fetchWorkOrders, submitWorkOrder, updateWorkOrderDone } from './api';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState<IWorkOrder[]>([]);

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
          {workOrders.map((workOrder) => (
            <WorkOrder
              key={workOrder.id}
              workOrder={workOrder}
              onDoneChange={(id, done) => {
                updateWorkOrderDone(id, done).then((updatedWorkOrders) => {
                  // todo: update state with res instesf of local state

                  setWorkOrders(updatedWorkOrders);
                });
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkOrders;
