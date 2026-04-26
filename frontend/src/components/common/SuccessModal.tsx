interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  actionLabel?: string;
}

export default function SuccessModal({
  isOpen,
  title,
  message,
  onClose,
  actionLabel = "Continue",
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
        {/* Success Icon */}
        <div className="bg-emerald-50 p-8 text-center border-b border-emerald-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <i className="ri-check-double-fill text-3xl text-emerald-600"></i>
          </div>
          <h3 className="text-xl font-black text-emerald-900 mb-2">{title}</h3>
          <p className="text-emerald-700 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Action Button */}
        <div className="p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#d4af37] hover:bg-[#c9a227] text-[#1a1a1a] font-bold rounded-full transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <i className="ri-arrow-right-line"></i>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
