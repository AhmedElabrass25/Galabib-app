import type { BackupData } from "@/types";
import { customerSheet } from "./backup-excel-customers";
import { orderSheet } from "./backup-excel-orders";
import { measurementSheet } from "./backup-excel-measurements";
import { optionSheet } from "./backup-excel-options";

export function createBackupSheets(backup: BackupData) {
  return [
    customerSheet(backup),
    orderSheet(backup),
    measurementSheet(backup),
    optionSheet(backup),
  ];
}
