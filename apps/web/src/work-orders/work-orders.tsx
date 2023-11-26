import React, {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
  useMemo
} from 'react';
import { debounce } from 'lodash';
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
  const [searchProperty, setSearchProperty] = useState<'name' | 'id'>('name');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // store work orders in intermediate `let` to apply filter on demand
  let filteredWorkOrders = workOrders;

  // call api function when done checkbox is changed and update state
  const doneChangeHandler = (id: string, done: boolean) => {
    updateWorkOrderDone(id, done).then((updatedWorkOrders) =>
      setWorkOrders(updatedWorkOrders)
    );
  };

  // debounce search handler to not call api on every key stroke
  const seachChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const debouncedSearchChangeHandler = useMemo(
    () => debounce(seachChangeHandler, 300),
    []
  );

  // only return work orders that match the search term (not case sensitive) or return all if no search term
  const workOrderFilter = (workOrder: IWorkOrder) => {
    return workOrder[searchProperty]
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  };

  // only filter work orders if search term is not empty
  if (searchTerm !== '') {
    filteredWorkOrders = workOrders.filter(workOrderFilter);
  }

  // initial fetch, only run at first render
  useEffect(() => {
    fetchWorkOrders().then((workOrders) => setWorkOrders(workOrders));
  }, []);

  // cleanup function for debounced search handler in case of unmount
  useEffect(() => {
    return () => {
      debouncedSearchChangeHandler.cancel();
    };
  }, [debouncedSearchChangeHandler]);

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
          onChange={debouncedSearchChangeHandler}
        />
      </div>

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
          {filteredWorkOrders.map((workOrder) => (
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
          <NewWorkOrder
            onSubmit={submitWorkOrder}
            onAddNewWorkOrder={(updatedWorkOrders) => {
              setWorkOrders(updatedWorkOrders);
              dialog.current.hide();
            }}
            cancelButton={
              <button
                type="button"
                aria-label="Cancel and Close the dialog"
                onClick={() => {
                  if (!dialog.current) return;
                  dialog.current.hide();
                }}
              >
                Cancel
              </button>
            }
          />
        </div>
      </A11yDialog>
    </div>
  );
};

export default WorkOrders;
