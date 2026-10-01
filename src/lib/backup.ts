import { supabase } from './supabase';
import type { BackupData, Customer, Order, Measurement, OrderOption } from '@/types';
import { BACKUP_VERSION } from './constants';

export async function createBackup(): Promise<BackupData> {
  const now = new Date().toISOString();

  const [customersRes, ordersRes, measurementsRes, optionsRes] = await Promise.all([
    supabase.from('customers').select('*'),
    supabase.from('orders').select('*'),
    supabase.from('measurements').select('*'),
    supabase.from('order_options').select('*'),
  ]);

  if (customersRes.error) throw new Error(customersRes.error.message);
  if (ordersRes.error) throw new Error(ordersRes.error.message);
  if (measurementsRes.error) throw new Error(measurementsRes.error.message);
  if (optionsRes.error) throw new Error(optionsRes.error.message);

  return {
    version: BACKUP_VERSION,
    created_at: now,
    timestamp: now,
    customers: (customersRes.data ?? []) as Customer[],
    orders: (ordersRes.data ?? []) as Order[],
    measurements: (measurementsRes.data ?? []) as Measurement[],
    order_options: (optionsRes.data ?? []) as OrderOption[],
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

export function validateBackupStructure(data: unknown): data is BackupData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.customers)) return false;
  if (!Array.isArray(d.orders)) return false;
  if (!Array.isArray(d.measurements)) return false;
  if (!Array.isArray(d.order_options)) return false;
  return true;
}

export async function restoreBackup(data: BackupData): Promise<void> {
  // Delete existing data (cascade handles children)
  const { error: delOpts } = await supabase.from('order_options').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delOpts) throw new Error(delOpts.message);
  const { error: delMs } = await supabase.from('measurements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delMs) throw new Error(delMs.message);
  const { error: delOrd } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delOrd) throw new Error(delOrd.message);
  const { error: delCust } = await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delCust) throw new Error(delCust.message);

  // Restore
  if (data.customers.length > 0) {
    const { error } = await supabase.from('customers').insert(data.customers);
    if (error) throw new Error(error.message);
  }
  if (data.orders.length > 0) {
    const { error } = await supabase.from('orders').insert(data.orders);
    if (error) throw new Error(error.message);
  }
  if (data.measurements.length > 0) {
    const { error } = await supabase.from('measurements').insert(data.measurements);
    if (error) throw new Error(error.message);
  }
  if (data.order_options.length > 0) {
    const { error } = await supabase.from('order_options').insert(data.order_options);
    if (error) throw new Error(error.message);
  }
}
