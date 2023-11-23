import { IWorkOrderCreate } from "./interfaces"

type NewWorkOrderProps = {
  onSubmit?: (workOrder: IWorkOrderCreate) => Promise<void>
}
const NewWorkOrder = (props: NewWorkOrderProps) => {
  return (
    <div>
      <h2>New Work Order</h2>
      <form
        className="new-workorder-container"
      >
        <div>
          <label htmlFor="name">
            <span className="form-label">Name</span>
            <input
              type="text"
              placeholder="Was ist zu tun"
              name="name"
            />
          </label>
        </div>
        <div>
          <label htmlFor="name">
            <span className="form-label">Date</span>
            <input type="date" name="date" />
          </label>
        </div>
        <div>
          <button role="submit">Neuen Auftrag anlegen</button>
        </div>
      </form>
    </div>
  )
}

export default NewWorkOrder
