import express, { Request, Response } from "express"
import * as db from "./db"
import { v4 as uuid } from "uuid"

export function getRoutes() {
  const router = express.Router()

  router.get("/api/work-orders", async (req: Request, res: Response) => {
    try {
      const { workOrders } = await db.get()
      // success
      return res.status(200).json(workOrders)
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      })
    }
  })

  /**
   * Create new work order
   */
  router.post("/api/work-orders", async (req: Request, res: Response) => {
    const { name, date } = req.body
    const { workOrders } = await db.get()

    workOrders.push({ name, date, id: uuid(), done: false })
    await db.set({ workOrders })

    res.status(201).json(workOrders)
  })

  /**
   * Check
   */
  router.put("/api/work-orders/:id/check", async (req: Request, res: Response) => {
    const { id } = req.params
    const { done } = req.body

    const { workOrders } = await db.get()

    const workOrder = workOrders.find((wo) => wo.id === id)

    if (workOrder) {
      workOrder.done = done
      await db.set({ workOrders })
      res.status(200).json(workOrders)
    } else {
      res.status(404).json({ error: "Work order not found" })
    }
  })

  return router
}
