import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
  size?: "sm" | "md";
  dot?: boolean;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
}: BadgeProps) {
  const variants = {
    default:
      "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    success:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    purple:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  const dotColors = {
    default: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    purple: "bg-purple-500",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 
        font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}

// Status Badge for Colis
interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<
    string,
    { label: string; variant: BadgeProps["variant"] }
  > = {
    CREATED: { label: "Created", variant: "default" },
    COLLECTED: { label: "Collected", variant: "info" },
    IN_TRANSIT: { label: "In Transit", variant: "warning" },
    DELIVERED: { label: "Delivered", variant: "success" },
    IN_STOCK: { label: "In Stock", variant: "purple" },
  };

  const config = statusConfig[status] || { label: status, variant: "default" };

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}

// Priority Badge for Colis
interface PriorityBadgeProps {
  priority: "EXPRESS" | "NORMAL";
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge variant={priority === "EXPRESS" ? "danger" : "default"}>
      {priority === "EXPRESS" ? "⚡ Express" : "Standard"}
    </Badge>
  );
}
