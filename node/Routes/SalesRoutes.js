// routes/salesRoutes.js
import express from 'express';

import {
  getAllSalesOrders,
  createSalesOrder,
  // getSalesOrderById,createSalesOrder
  updateSalesOrder,
  deleteSalesOrder,
  searchSalesOrders,
  searchSalesOrdersByDateRange,
} from "../Controllers/SalesOrder.js";
import {
  getAllSalesOrdersDetails,
  createSalesOrdersDetails,
  getSalesOrdersDetailsById,
  updateSalesOrdersDetails,
  deleteSalesOrdersDetails,
} from "../Controllers/SalesOrdersDetails.js";

const router = express.Router();
// SalesOrder routes
router.get("/salesorders", getAllSalesOrders);
router.post("/salesorders", createSalesOrder);//talves?
// router.get("/salesorders/:id", getSalesOrderById);
router.put("/salesorders/:id", updateSalesOrder);
router.delete("/salesorders/:id", deleteSalesOrder);
router.get("/salesorders/search", searchSalesOrders);
router.get("/salesorders/date", searchSalesOrdersByDateRange);

// SalesOrdersDetails routes
router.get("/salesordersdetails", getAllSalesOrdersDetails);
router.post("/salesordersdetails", createSalesOrdersDetails);
router.get("/salesordersdetails/:id", getSalesOrdersDetailsById);
router.put("/salesordersdetails/:id", updateSalesOrdersDetails);
router.delete("/salesordersdetails/:id", deleteSalesOrdersDetails);

export default router;
