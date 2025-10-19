import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { Notification } from "@shared/schema";

export default function NotificationBanner() {
  const [dismissedIds, setDismissedIds] = useState<number[]>(() => {
    const stored = localStorage.getItem("dismissedNotifications");
    return stored ? JSON.parse(stored) : [];
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const activeNotifications = notifications.filter(
    (notif) => !dismissedIds.includes(notif.id)
  );

  const handleDismiss = (id: number) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem("dismissedNotifications", JSON.stringify(newDismissed));
  };

  useEffect(() => {
    const allIds = notifications.map((n) => n.id);
    const validDismissed = dismissedIds.filter((id) => allIds.includes(id));
    if (validDismissed.length !== dismissedIds.length) {
      setDismissedIds(validDismissed);
      localStorage.setItem("dismissedNotifications", JSON.stringify(validDismissed));
    }
  }, [notifications]);

  if (activeNotifications.length === 0) {
    return null;
  }

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          text: "text-green-800",
          icon: CheckCircle,
          iconColor: "text-green-500",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          text: "text-yellow-800",
          icon: AlertTriangle,
          iconColor: "text-yellow-500",
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          text: "text-red-800",
          icon: XCircle,
          iconColor: "text-red-500",
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          icon: Info,
          iconColor: "text-blue-500",
        };
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 space-y-2 p-4">
      {activeNotifications.map((notification) => {
        const styles = getTypeStyles(notification.type);
        const IconComponent = styles.icon;

        return (
          <div
            key={notification.id}
            className={`${styles.bg} border-2 ${styles.text} rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300`}
          >
            <IconComponent className={`${styles.iconColor} flex-shrink-0 mt-0.5`} size={20} />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{notification.title}</h3>
              <p className="text-sm opacity-90">{notification.message}</p>
            </div>
            <button
              onClick={() => handleDismiss(notification.id)}
              className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}
              aria-label="Dismiss notification"
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
