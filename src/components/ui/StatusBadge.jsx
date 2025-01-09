import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    planned: { color: "bg-slate-100 text-slate-700", icon: Calendar },
    "in-progress": { color: "bg-blue-100 text-blue-700", icon: Calendar },
    completed: { color: "bg-green-100 text-green-700", icon: Calendar },
  };

  const config = statusConfig[status] || statusConfig.planned;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full",
        config.color
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{status}</span>
    </div>
  );
};

export default StatusBadge;
