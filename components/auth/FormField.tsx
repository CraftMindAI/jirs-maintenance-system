export default function FormField({
  id,
  label,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-label-md text-on-surface-variant mb-2">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required
        className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
