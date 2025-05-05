// context/OrderStatusContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const OrderStatusContext = createContext();

export function OrderStatusProvider({ children }) {
    const [status, setStatus] = useState(null);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        let active = true;

        const init = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) return;

            const fetchOrders = async () => {
                const res = await fetch(`/api/user/${session.user.id}/orders`);
                const orders = await res.json();

                const latest = orders?.find((o) =>
                    ["PENDING", "IN_PROGRESS"].includes(o.status)
                );

                if (latest && active) {
                    setStatus(latest.status);
                    setOrderId(latest.id);
                }
            };

            // Polling
            fetchOrders();
            const interval = setInterval(fetchOrders, 10000);

            // Real-time subscription (if orders are in Supabase)
            const channel = supabase
                .channel("order-status")
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "orders",
                        filter: `user_id=eq.${session.user.id}`,
                    },
                    (payload) => {
                        const updated = payload.new;
                        if (
                            ["PENDING", "IN_PROGRESS"].includes(updated.status) &&
                            active
                        ) {
                            setStatus(updated.status);
                            setOrderId(updated.id);
                        } else if (active) {
                            // Clear if order is completed or canceled
                            setStatus(null);
                            setOrderId(null);
                        }
                    }
                )
                .subscribe();

            return () => {
                active = false;
                clearInterval(interval);
                supabase.removeChannel(channel);
            };
        };

        init();
    }, []);


    return (
        <OrderStatusContext.Provider value={{ status, orderId }}>
            {children}
        </OrderStatusContext.Provider>
    );
}

export function useOrderStatus() {
    return useContext(OrderStatusContext);
}
