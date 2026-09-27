export type MeasurementUnit = 'cm' | 'inch';

export type MeasurementFieldUnit = 'cm' | 'inch' | 'cm_or_inch';

export type GarmentType = 'balady' | 'afrangy' | 'saudi';

export type OrderStatus = 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  garment_type: GarmentType;
  quantity: number;
  sadary_count: number;
  delivery_date: string;
  status: OrderStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  customer?: Customer;
  measurements?: Measurement[];
  order_options?: OrderOption[];
}

export interface Measurement {
  id: string;
  order_id: string;
  field_name: string;
  value: number;
  unit: MeasurementUnit;
  notes?: string;
  created_at: string;
}

export interface OrderOption {
  id: string;
  order_id: string;
  option_name: string;
  option_value: string;
  created_at: string;
}

export interface BackupData {
  version: string;
  created_at: string;
  timestamp?: string;
  customers: Customer[];
  orders: Order[];
  measurements: Measurement[];
  order_options: OrderOption[];
}

export interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  readyOrders: number;
  deliveredThisMonth: number;
  upcomingDeliveries: Order[];
  recentOrders: Order[];
}
