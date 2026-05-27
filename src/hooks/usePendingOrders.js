import { useState } from "react";

export function usePendingOrders() {
  const [orders, setOrders] = useState([]);

  const addOrder = (order) => setOrders(o => [...o, order]);

  const removeOrder = (id) => setOrders(o => o.filter(x => x.id !== id));

  const clearOrders = () => setOrders([]);

  return { orders, setOrders, addOrder, removeOrder, clearOrders };
}
