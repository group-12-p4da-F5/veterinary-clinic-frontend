
export default function SuccessDialog({
  open,
  title,
  message,
  actionLabel = "Aceptar",
  onAction,
  onClose,
}) {
  if (!open) return null;

  const handleAction = () => {
    onAction?.();
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="success-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 id="success-title" className="text-lg font-semibold">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg bg-gray px-4 py-2 text-sm font-medium text-gray-dark hover:opacity-90"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            type="button"
            className="rounded-lg bg-orange px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            onClick={handleAction}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
