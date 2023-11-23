import fs from "fs"
import path from "path"

/**
 * We use the most naive data base possible here. A blob of json stored and loaded on disk.
 * Using `get` you can get all the stored data and using `set` you can persist all the data.
 */

const DB_FILE = path.resolve(__dirname, "../data.json")

export interface IWorkOrder {
  id: string
  name: string
  date: string
  done: boolean
}

export interface IDBSchema {
  workOrders: IWorkOrder[]
}

export const get = () => {
  return new Promise<IDBSchema>((resolve, reject) => {
    fs.readFile(DB_FILE, "utf8", (err, data) => {
      if (err) {
        reject(err)
      } else {
        console.log(JSON.parse(data))
        resolve(JSON.parse(data))
      }
    })
  })
}

export const set = (data: IDBSchema) => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(DB_FILE, JSON.stringify(data), "utf8", (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
