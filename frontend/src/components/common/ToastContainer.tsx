import { useToast } from "@/context/ToastContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => {
        const iconMap = {
          success: "ri-check-circle-line",
          error: "ri-error-warning-line",
          info: "ri-information-line",
          warning: "ri-alert-line",
        };

        const colorMap = {
          success: {
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            icon: "text-emerald-500",
            text: "text-emerald-800",
          },
          error: {
            bg: "bg-rose-50",
            border: "border-rose-200",
            icon: "text-rose-500",
            text: "text-rose-800",
          },
          info: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            icon: "text-blue-500",
            text: "text-blue-800",
          },
          warning: {
            bg: "bg-amber-50",
            border: "border-amber-200",
            icon: "text-amber-500",
            text: "text-amber-800",
          },
        };

        const colors = colorMap[toast.type];
        const icon = iconMap[toast.type];

        return (
          <div
            key={toast.id}
            className={`${colors.bg} border ${colors.border} rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm animate-[slideInRight_0.3s_ease] group cursor-pointer`}
            onClick={() => removeToast(toast.id)}
          >
            <i className={`${icon} ${icon} text-lg flex-shrink-0`}></i>
            <p className={`text-sm font-medium ${colors.text} flex-1`}>
              {toast.message}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              className={`${colors.icon} hover:opacity-70 transition-opacity text-lg flex-shrink-0 cursor-pointer`}
            >
              <i className="ri-close-line"></i>
            </button>

            {/* Auto-dismiss progress bar */}
            {toast.duration && toast.duration > 0 && (
              <div
                className={`absolute bottom-0 left-0 h-0.5 ${
                  toast.type === "success"
                    ? "bg-emerald-500"
                    : toast.type === "error"
                      ? "bg-rose-500"
                      : toast.type === "warning"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                }`}
                style={{
                  animation: `shrinkWidth ${toast.duration}ms linear forwards`,
                }}
              />
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrinkWidth {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
