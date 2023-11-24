import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { A11yDialog } from 'react-a11y-dialog';
import A11yDialogInstance from 'a11y-dialog';
import { IWorkOrder } from './interfaces';
import NewWorkOrder from './new-work-order';
import WorkOrder from './work-order';

// Make use of fetchWorkOrders and SubmitWorkOrder from './api'
import { fetchWorkOrders, submitWorkOrder, updateWorkOrderDone } from './api';

const WorkOrders = () => {
  const dialog =
    useRef<A11yDialogInstance>() as MutableRefObject<A11yDialogInstance>;
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
      <div>
        <button
          type="button"
          onClick={() => {
            if (!dialog.current) return;
            dialog.current.show();
          }}
        >
          New Work Order
        </button>
      </div>

      <div>
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
      </div>

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

      <A11yDialog
        id="my-accessible-dialog"
        dialogRef={(instance) => (dialog.current = instance!)}
        title="The dialog title"
        closeButtonPosition="none"
        classNames={{
          container: 'dialog-container',
          overlay: 'dialog-overlay',
          dialog: 'dialog-dialog',
          title: 'sr-only'
        }}
      >
        <div className="dialog-content">
          <button
            type="button"
            aria-label="Close the dialog"
            onClick={() => {
              dialog.current.hide();
            }}
          >
            Close the dialog
          </button>

          <NewWorkOrder
            onSubmit={submitWorkOrder}
            onAddNewWorkOrder={(updatedWorkOrders) => {
              setWorkOrders(updatedWorkOrders);
              dialog.current.hide();
            }}
          />
        </div>
      </A11yDialog>
    </div>
  );
};

export default WorkOrders;
