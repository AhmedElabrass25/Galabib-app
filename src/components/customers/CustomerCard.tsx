import type { Customer } from "@/types";
import { formatDate } from "@/lib/date-utils";
import {
  Phone,
  User,
  Edit3,
  Trash2,
  PlusCircle,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerCard({
  customer,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs">
      <div>
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 font-extrabold text-sky-700">
              <User className="size-6" />
            </div>
            <div>
              <h3 className="text-lg font-black leading-snug text-slate-900">
                {customer.name}
              </h3>
              <span className="text-xs font-semibold text-slate-500 num-tabular">
                تاريخ التسجيل: {formatDate(customer.created_at)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(customer)}
              className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
              title="تعديل بيانات العميل"
            >
              <Edit3 className="size-4.5" />
            </button>
            <button
              onClick={() => onDelete(customer)}
              className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-700"
              title="حذف العميل"
            >
              <Trash2 className="size-4.5" />
            </button>
          </div>
        </header>

        <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-700">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Phone className="size-4 text-sky-600" /> الهاتف:
          </span>
          <span
            dir="ltr"
            className="font-mono text-base font-extrabold text-slate-900 num-tabular"
          >
            {customer.phone}
          </span>
        </div>
        {customer.notes && (
          <p className="mb-4 whitespace-pre-wrap break-words rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 text-2xl font-bold text-slate-700">
            <strong className="text-amber-900 block text-center text-lg">
              {" "}
              ملاحظات العميل{" "}
            </strong>{" "}
            {customer.notes}
          </p>
        )}
      </div>

      <footer className="flex items-center justify-between gap-2.5 border-t border-slate-100 pt-4">
        <Link
          to={`/customers/${customer.id}`}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-200"
        >
          <ClipboardList className="size-4 text-sky-700" />{" "}
          <span>عرض الطلبات والمقاسات</span>
        </Link>
        <Link
          to={`/orders/new?customerId=${customer.id}`}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-slate-800"
          title="إضافة طلب جديد لهذا العميل"
        >
          <PlusCircle className="size-4 text-sky-400" /> <span>طلب جديد</span>
        </Link>
      </footer>
    </article>
  );
}
