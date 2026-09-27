import { supabase } from './supabase';
import { localStore } from './store';
import type { BackupData, Customer, Order, Measurement, OrderOption } from '@/types';
import { BACKUP_VERSION } from './constants';

export async function createBackup(): Promise<BackupData> {
  const now = new Date().toISOString();
  try {
    const [customersRes, ordersRes, measurementsRes, optionsRes] = await Promise.all([
      supabase.from('customers').select('*'),
      supabase.from('orders').select('*'),
      supabase.from('measurements').select('*'),
      supabase.from('order_options').select('*'),
    ]);

    if (customersRes.error || ordersRes.error || measurementsRes.error || optionsRes.error) {
      return createLocalBackup();
    }

    return {
      version: BACKUP_VERSION,
      created_at: now,
      timestamp: now,
      customers: (customersRes.data ?? []) as Customer[],
      orders: (ordersRes.data ?? []) as Order[],
      measurements: (measurementsRes.data ?? []) as Measurement[],
      order_options: (optionsRes.data ?? []) as OrderOption[],
    };
  } catch {
    return createLocalBackup();
  }
}

function createLocalBackup(): BackupData {
  const now = new Date().toISOString();
  const customers = localStore.getCustomers();
  const rawOrders = localStore.getRawOrders();

  const orders: Order[] = [];
  const measurements: Measurement[] = [];
  const order_options: OrderOption[] = [];

  rawOrders.forEach((o) => {
    const { measurements: ms, order_options: opts, customer: _, ...cleanOrder } = o;
    orders.push(cleanOrder as Order);
    if (ms) measurements.push(...ms);
    if (opts) order_options.push(...opts);
  });

  return {
    version: BACKUP_VERSION,
    created_at: now,
    timestamp: now,
    customers,
    orders,
    measurements,
    order_options,
  };
}

export function downloadBackup(backupData: BackupData) {
  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.href = url;
  link.download = `jalabib-backup-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function validateBackupStructure(data: any): data is BackupData {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.customers)) return false;
  if (!Array.isArray(data.orders)) return false;
  if (!Array.isArray(data.measurements)) return false;
  if (!Array.isArray(data.order_options)) return false;
  return true;
}

export async function restoreBackup(data: BackupData): Promise<void> {
  try {
    // Delete in reverse order of FKs
    await supabase.from('order_options').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('measurements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (data.customers.length > 0) await supabase.from('customers').insert(data.customers);
    if (data.orders.length > 0) await supabase.from('orders').insert(data.orders);
    if (data.measurements.length > 0) await supabase.from('measurements').insert(data.measurements);
    if (data.order_options.length > 0) await supabase.from('order_options').insert(data.order_options);
  } catch {
    localStore.restoreAll(data);
  } finally {
    localStore.restoreAll(data);
  }
}
