"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

const OrderStatusContext = createContext();

export function OrderStatusProvider({ children }) {
    const [status, setStatus] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [userId, setUserId] = useState(null);

    const previousOrderId = useRef(null);
    const previousStatus = useRef(null);

    useEffect(() => {
        const { data: subscription } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user?.id) {
                    setUserId(session.user.id);
                } else {
                    setUserId(null);
                    setStatus(null);
                    setOrderId(null);
                    previousOrderId.current = null;
                    previousStatus.current = null;
                }
            }
        );


        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.id) {
                setUserId(session.user.id);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!userId) return;
        let active = true;

        const setOrderState = (order) => {
            const { id, status, stored } = order;

            if (!active) return;

            const changed =
                id !== previousOrderId.current || status !== previousStatus.current;

            if (!changed) return;

            previousOrderId.current = id;
            previousStatus.current = status;

            if (status === "COMPLETED" && stored === false) {
                setStatus("COMPLETED");
                setOrderId(id);
                return;
            }

            if (["PENDING", "IN_PROGRESS"].includes(status)) {
                setStatus(status);
                setOrderId(id);
            } else {
                setStatus(null);
                setOrderId(null);
            }
        };

        const fetchOrders = async () => {
            try {
                const res = await fetch(`/api/user/${userId}/orders`);
                const data = await res.json();
                const orders = Array.isArray(data) ? data : data?.orders;

                if (!Array.isArray(orders)) return;

                const latest = orders.find((o) =>
                    ["PENDING", "IN_PROGRESS", "COMPLETED"].includes(o.status)
                );

                if (latest) setOrderState(latest);
                else {
                    setStatus(null);
                    setOrderId(null);
                }
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);

        const channel = supabase
            .channel("order-status")
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "orders",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    const updated = payload.new;
                    setOrderState(updated);
                }
            )
            .subscribe();

        return () => {
            active = false;
            clearInterval(interval);
            supabase.removeChannel(channel);
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
