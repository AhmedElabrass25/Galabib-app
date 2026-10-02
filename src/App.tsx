import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/pages/DashboardPageV2";
import CustomersPage from "@/pages/CustomersPage";
import CustomerDetailsPage from "@/pages/CustomerDetailsPageV2";
import OrdersPage from "@/pages/OrdersPage";
import NewOrderPage from "@/pages/new-order/NewOrderPage";
import OrderDetailsPage from "@/pages/OrderDetailsPageV2";
import SettingsPage from "@/pages/SettingsPageV2";
import ShowcasePage from "@/pages/showcase/ShowcasePage";
import LoginPage from "@/pages/LoginPage";
import PriorityBoardPage from "@/pages/PriorityBoardPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      // Clear react-query cache on logout so stale data isn't shown
      if (!s) queryClient.clear();
    });
    return () => subscription.unsubscribe();
  }, []);

  // Still loading auth state
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-left" richColors closeButton />
        <Routes>
          <Route path="/showcase" element={<ShowcasePage />} />
          {session ? (
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="priority" element={<PriorityBoardPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:id" element={<CustomerDetailsPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/new" element={<NewOrderPage />} />
              <Route path="orders/:id" element={<OrderDetailsPage />} />
              <Route path="measurements" element={<NewOrderPage />} />
              <Route path="backup" element={<SettingsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Route>
          ) : (
            <Route path="*" element={<LoginPage />} />
          )}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
