import React, { useState } from "react"
import { IWorkOrder } from "./interfaces"
import NewWorkOrder from "./new-work-order"
import WorkOrder from "./work-order"

// Make use of fetchWorkOrders and SubmitWorkOrder from './api'
import { fetchWorkOrders, submitWorkOrder } from './api'

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState<IWorkOrder[]>([])

  return (
    <div>
      <NewWorkOrder />

      <h2>Work Orders</h2>
      {workOrders.map((workOrder) => (
        <WorkOrder key={workOrder.id} workOrder={workOrder} />
      ))}
    </div>
  )
}

export default WorkOrders
