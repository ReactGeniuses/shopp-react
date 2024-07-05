// controllers/SalesOrderController.js
import SalesOrder from '../Models/SalesOrder.js';
import { Op } from 'sequelize';

export const getAllSalesOrders = async (req, res) => {
  try {
    const salesOrders = await SalesOrder.findAll();
    res.json(salesOrders);
  } catch (error) {
    console.error('Error al obtener las órdenes de venta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createSalesOrder = async (req, res) => {
  try {
    const { EmailUser, Nombre, Direccion } = req.body;

    console.log("tengo datos");
    console.log(EmailUser, Nombre, Direccion);


    const newSalesOrder = await SalesOrder.create({ 
      EmailUser, 
      Nombre, 
      Direccion, 
      OrderDate: new Date(), 
      StateOrder: "proceso",
      Total: 0
    });

    console.log("Lo logre");
    console.log(newSalesOrder.ID_Order);

    res.status(201).json({ ID_Order: newSalesOrder.ID_Order });
    
  } catch (error) {
    console.error('Error al crear la orden de venta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// export const getSalesOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const salesOrder = await SalesOrder.findByPk(id);
//     if (salesOrder) {
//       res.json(salesOrder);
//     } else {
//       res.status(404).json({ message: 'Orden de venta no encontrada' });
//     }
//   } catch (error) {
//     console.error('Error al obtener la orden de venta:', error);
//     res.status(500).json({ message: 'Error interno del servidor' });
//   }
// };

export const updateSalesOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { StateOrder } = req.body; // Solo necesitamos actualizar StateOrder
    const salesOrder = await SalesOrder.findByPk(id);
    if (salesOrder) {
      salesOrder.StateOrder = StateOrder; // Actualizamos el campo StateOrder
      await salesOrder.save();
      res.json(salesOrder);
    } else {
      res.status(404).json({ message: 'Orden de venta no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar la orden de venta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteSalesOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const salesOrder = await SalesOrder.findByPk(id);
    if (salesOrder) {
      await salesOrder.destroy();
      res.json({ message: 'Orden de venta eliminada' });
    } else {
      res.status(404).json({ message: 'Orden de venta no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar la orden de venta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
// Buscar órdenes de ventas con criterios dinámicos
export const searchSalesOrders = async (req, res) => {
  try {
    const { query, type } = req.query;

    // Configurar las condiciones de búsqueda dinámicamente
    let searchCondition = {};

    if (type === 'ID_Order') {
      // Convertir el valor de búsqueda a entero para evitar errores de conversión
      const id = parseInt(query, 10);
      if (!isNaN(id)) {
        searchCondition = { ID_Order: id };
      } else {
        return res.status(400).json({ message: 'El valor de ID_Order debe ser un número' });
      }
    } else if (type === 'EmailUser') {
      searchCondition = { EmailUser: { [Op.like]: `%${query}%` } };
    } else if (type === 'OrderDate') {
      // Asegurarse de que la fecha es válida
      const date = new Date(query);
      if (!isNaN(date.getTime())) {
        searchCondition = { OrderDate: date };
      } else {
        return res.status(400).json({ message: 'El valor de OrderDate debe ser una fecha válida' });
      }
    } else if (type === 'StateOrder') {
      searchCondition = { StateOrder: { [Op.like]: `%${query}%` } };
    } else {
      return res.status(400).json({ message: 'Tipo de búsqueda no válido' });
    }


    const salesOrders = await SalesOrder.findAll({ where: searchCondition });
    res.json(salesOrders);
  } catch (error) {
    console.error('Error al buscar órdenes de venta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

///parametros de fechas
//es el metodo para hacer la busqueda
export const searchSalesOrdersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;


    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Los valores de startDate y endDate deben ser fechas válidas' });
    }

    const searchCondition = {
      OrderDate: {
        [Op.between]: [start, end],
      },
    };
    //Se busca por rango
    const salesOrders = await SalesOrder.findAll({ where: searchCondition });
    res.json(salesOrders);
  } catch (error) {
    console.error('Error al buscar órdenes de venta por rango de fechas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};