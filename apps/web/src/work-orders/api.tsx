import { IWorkOrderCreate } from "./interfaces"

const fetchWorkOrders = async () => {
  const response = await fetch("/api/work-orders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.json()
}

const submitWorkOrder = async (workOrder: IWorkOrderCreate) => {
  const response = await fetch("/api/work-orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workOrder),
  })
  return response.json()
}

export default { fetchWorkOrders, submitWorkOrder }