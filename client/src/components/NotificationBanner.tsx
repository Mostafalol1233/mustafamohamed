import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { Notification } from "@shared/schema";

export default function NotificationBanner() {
  const [dismissedIds, setDismissedIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("dismissedNotifications") || "[]"); } catch { return []; }
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const activeNotifications = notifications.filter(n => !dismissedIds.includes(n.id));

  const handleDismiss = (id: number) => {
    const next = [...dismissedIds, id];
    setDismissedIds(next);
    localStorage.setItem("dismissedNotifications", JSON.stringify(next));
  };

  useEffect(() => {
    const allIds = notifications.map(n => n.id);
    const valid = dismissedIds.filter(id => allIds.includes(id));
    if (valid.length !== dismissedIds.length) {
      setDismissedIds(valid);
      localStorage.setItem("dismissedNotifications", JSON.stringify(valid));
    }
  }, [notifications]);

  if (activeNotifications.length === 0) return null;

  const getStyles = (type: string) => {
    switch (type) {
      case "success": return { bg: "bg-green-50 border-green-200 dark:bg-green-950/50", text: "text-green-800 dark:text-green-200", icon: CheckCircle, iconColor: "text-green-500" };
      case "warning": return { bg: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50", text: "text-yellow-800 dark:text-yellow-200", icon: AlertTriangle, iconColor: "text-yellow-500" };
      case "error":   return { bg: "bg-red-50 border-red-200 dark:bg-red-950/50", text: "text-red-800 dark:text-red-200", icon: XCircle, iconColor: "text-red-500" };
      default:        return { bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/50", text: "text-blue-800 dark:text-blue-200", icon: Info, iconColor: "text-blue-500" };
    }
  };

  return (
    <div className="fixed top-20 left-0 right-0 z-40 space-y-2 p-4 pointer-events-none">
      {activeNotifications.map(n => {
        const styles = getStyles(n.type);
        const Icon = styles.icon;
        return (
          <div key={n.id} className={`${styles.bg} border-2 ${styles.text} rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300 pointer-events-auto max-w-2xl mx-auto`}>
            <Icon className={`${styles.iconColor} flex-shrink-0 mt-0.5`} size={20} />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{n.title}</h3>
              <p className="text-sm opacity-90">{n.message}</p>
            </div>
            <button onClick={() => handleDismiss(n.id)} className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}>
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
