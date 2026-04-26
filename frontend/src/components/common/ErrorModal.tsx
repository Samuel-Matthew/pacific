interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  actionLabel?: string;
}

export default function ErrorModal({
  isOpen,
  title,
  message,
  onClose,
  actionLabel = "Try Again",
}: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
        {/* Error Icon */}
        <div className="bg-red-50 p-8 text-center border-b border-red-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <i className="ri-error-warning-fill text-3xl text-red-600"></i>
          </div>
          <h3 className="text-xl font-black text-red-900 mb-2">{title}</h3>
          <p className="text-red-700 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Action Button */}
        <div className="p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <i className="ri-arrow-right-line"></i>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
