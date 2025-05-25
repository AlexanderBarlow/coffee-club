// context/OrderStatusContext.js
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const OrderStatusContext = createContext();

/** Wrap your app (in layout.js) with this provider */
export function OrderStatusProvider({ children }) {
  const [status, setStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [userId, setUserId] = useState(null);
  const prev = useRef({ id: null, status: null });

  // 1) Listen for auth changes
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user?.id) setUserId(session.user.id);
      else {
        setUserId(null);
        setStatus(null);
        setOrderId(null);
        prev.current = { id: null, status: null };
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.id) setUserId(data.session.user.id);
    });
    return () => sub.unsubscribe();
  }, []);

  // 2) Fetch + subscribe to order updates
  useEffect(() => {
    if (!userId) return;
    let active = true;

    const setOrderState = (o) => {
      if (!active) return;
      const changed =
        o.id !== prev.current.id || o.status !== prev.current.status;
      if (!changed) return;
      prev.current = { id: o.id, status: o.status };

      if (o.status === "COMPLETED" && !o.stored) {
        setStatus("COMPLETED");
        setOrderId(o.id);
      } else if (["PENDING", "IN_PROGRESS"].includes(o.status)) {
        setStatus(o.status);
        setOrderId(o.id);
      } else {
        setStatus(null);
        setOrderId(null);
      }
    };

    // initial fetch
    (async () => {
      try {
        const res = await fetch(`/api/user/${userId}/orders`);
        const json = await res.json();
        const orders = Array.isArray(json) ? json : json.orders || [];
        const latest = orders.find((o) =>
          ["PENDING", "IN_PROGRESS", "COMPLETED"].includes(o.status)
        );
        if (latest) setOrderState(latest);
      } catch (e) {
        console.error("fetch orders failed:", e);
      }
    })();

    // realtime channel
    const chan = supabase
      .channel(`order-status-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`,
        },
        ({ new: updated }) => setOrderState(updated)
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(chan);
    };
  }, [userId]);

  return (
    <OrderStatusContext.Provider value={{ status, orderId }}>
      {children}
    </OrderStatusContext.Provider>
  );
}

export function useOrderStatus() {
  return useContext(OrderStatusContext);
}
