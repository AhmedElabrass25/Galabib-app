import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Scissors, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate smooth loading transition for realistic feedback
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });

      if (error) {
        toast.error("خطأ في تسجيل الدخول: البريد أو كلمة المرور غير صحيحة");
      } else {
        toast.success("تم تسجيل الدخول بنجاح!");
      }
    } catch (err: unknown) {
      toast.error("حدث خطأ غير متوقع أثناء الاتصال بالحساب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-[#142b27] to-slate-900 flex items-center justify-center p-4 dir-rtl">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 space-y-7 text-right transition-all">
        {/* Logo & Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30">
            <Scissors className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              نظام إدارة الجلابيب
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              سجّل دخولك للوصول إلى اللوحة والبيانات
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-bold text-slate-700"
            >
              البريد الإلكتروني <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                dir="ltr"
                disabled={isSubmitting}
                placeholder="name@example.com"
                {...register("email")}
                className={`w-full rounded-xl border bg-slate-50/80 px-4 py-3 pl-11 text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                  errors.email
                    ? "border-rose-500 bg-rose-50/30"
                    : "border-slate-300 hover:border-slate-400 focus:bg-white"
                }`}
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
            {errors.email && (
              <p
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-600 animate-fade-in"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-bold text-slate-700"
            >
              كلمة المرور <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                disabled={isSubmitting}
                placeholder="••••••••"
                {...register("password")}
                className={`w-full rounded-xl border bg-slate-50/80 px-4 py-3 pl-11 pr-11 text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                  errors.password
                    ? "border-rose-500 bg-rose-50/30"
                    : "border-slate-300 hover:border-slate-400 focus:bg-white"
                }`}
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-600 animate-fade-in"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[52px] rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 font-black text-lg text-white transition-all active:scale-[0.98] disabled:opacity-75 shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-white" />
                <span>جاري التحقق والدخول...</span>
              </>
            ) : (
              <span>دخول إلى النظام</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
