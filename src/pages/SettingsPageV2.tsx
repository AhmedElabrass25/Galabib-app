import PageHeader from "@/components/shared/PageHeader";
import BackupExportPanel from "@/components/settings/BackupExportPanel";
import BackupRestorePanel from "@/components/settings/BackupRestorePanel";
import SystemInfoCard from "@/components/settings/SystemInfoCard";

export default function SettingsPageV2() {
  return (
    <div className="animate-fade-in max-w-4xl space-y-6">
      <PageHeader
        title="إعدادات النظام والنسخ الاحتياطي"
        subtitle="حفظ واستعادة بيانات المحل وحمايتها من الضياع"
      />
      <BackupExportPanel />
      <BackupRestorePanel />
      <SystemInfoCard />
    </div>
  );
}
