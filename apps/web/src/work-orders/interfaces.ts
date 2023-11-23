export interface IWorkOrderCreate {
  date: string
  name: string
}

export interface IWorkOrder {
  id: string
  date: string
  done: boolean
  name: string
}
