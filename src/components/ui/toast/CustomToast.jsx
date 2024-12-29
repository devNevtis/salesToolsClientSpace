// src/components/ui/toast/CustomToast.jsx
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const variants = {
  success: {
    icon: CheckCircle,
    containerClass: "bg-emerald-50 border-emerald-200",
    iconClass: "text-emerald-500",
    textClass: "text-emerald-800"
  },
  error: {
    icon: XCircle,
    containerClass: "bg-red-50 border-red-200",
    iconClass: "text-red-500",
    textClass: "text-red-800"
  },
  loading: {
    icon: AlertCircle,
    containerClass: "bg-blue-50 border-blue-200",
    iconClass: "text-blue-500",
    textClass: "text-blue-800"
  }
};

export function CustomToast({ title, description, variant = "success" }) {
  const { icon: Icon, containerClass, iconClass, textClass } = variants[variant];

  return (
    <div className={`
      flex items-start gap-3 rounded-lg border p-4 shadow-lg 
      ${containerClass} animate-in fade-in slide-in-from-right-full
    `}>
      <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
      <div className="flex-1">
        {title && <p className={`font-medium mb-1 ${textClass}`}>{title}</p>}
        {description && <p className={`text-sm opacity-90 ${textClass}`}>{description}</p>}
      </div>
    </div>
  );
}