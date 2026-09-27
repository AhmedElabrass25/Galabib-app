import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/pages/DashboardPageV2";
import CustomersPage from "@/pages/CustomersPage";
import CustomerDetailsPage from "@/pages/CustomerDetailsPageV2";
import OrdersPage from "@/pages/OrdersPage";
import NewOrderPage from "@/pages/new-order/NewOrderPage";
import OrderDetailsPage from "@/pages/OrderDetailsPageV2";
import SettingsPage from "@/pages/SettingsPageV2";
import ShowcasePage from "@/pages/showcase/ShowcasePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-left" richColors closeButton />
        <Routes>
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
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
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
