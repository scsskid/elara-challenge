import { useState } from 'react';
import { IWorkOrderCreate, IWorkOrder } from './interfaces';

type NewWorkOrderProps = {
  onSubmit?: (workOrder: IWorkOrderCreate) => Promise<IWorkOrder[]>;
  onAddNewWorkOrder: (updatedWorkOrders: IWorkOrder[]) => void;
  cancelButton?: JSX.Element;
};
const NewWorkOrder = ({
  onSubmit,
  onAddNewWorkOrder,
  cancelButton
}: NewWorkOrderProps) => {
  const [currentDate] = useState(new Date());

  if (!onSubmit) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // get form data
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form as HTMLFormElement);
    const formDataEntries = Object.fromEntries(formData.entries());

    // create data object
    const data = {
      name: formDataEntries.name,
      date: formDataEntries.date
    } as IWorkOrderCreate;

    // submit data
    onSubmit(data).then((updatedWorkOrders) => {
      form.reset();

      // set state to update UI
      onAddNewWorkOrder(updatedWorkOrders);
    });
  };

  return (
    <div>
      <h2>New Work Order</h2>

      <form className="new-workorder-container" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">
            <span className="form-label">Name</span>
            <input
              type="text"
              placeholder="Task Description..."
              name="name"
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="name">
            <span className="form-label">Date</span>
            <input
              type="date"
              name="date"
              required
              defaultValue={currentDate.toISOString().split('T')[0]}
            />
          </label>
        </div>

        <div className="new-work-order__button-row">
          {cancelButton}
          <button type="submit">Submit New Work Order</button>
        </div>
      </form>
    </div>
  );
};

export default NewWorkOrder;
