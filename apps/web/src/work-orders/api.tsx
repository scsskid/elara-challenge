import { IWorkOrderCreate } from './interfaces';

const fetchWorkOrders = async () => {
  const response = await fetch('/api/work-orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

const submitWorkOrder = async (workOrder: IWorkOrderCreate) => {
  const response = await fetch('/api/work-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(workOrder)
  });
  return response.json();
};

const updateWorkOrderDone = async (id: string, done: boolean) => {
  const response = await fetch(`/api/work-orders/${id}/check`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ done })
  });
  return response.json();
};

export { fetchWorkOrders, submitWorkOrder, updateWorkOrderDone };
