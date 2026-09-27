import type { BackupData } from "@/types";
import { createBackupSheets } from "./backup-excel-sheets";

export async function downloadBackupExcel(backup: BackupData) {
  const { default: writeExcelFile } = await import("write-excel-file/browser");
  const blob = await writeExcelFile(createBackupSheets(backup)).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `jalabib-backup-${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
