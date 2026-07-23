export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div
      className={`space-y-4 mb-16 md:mb-20 ${
        align === "center" ? "text-center mx-auto" : "text-left"
      } ${description ? "max-w-2xl" : ""} ${align === "center" ? "max-w-2xl" : ""}`}
    >
      <span
        className={`font-label-md uppercase tracking-widest ${
          light ? "text-tertiary-fixed/60" : "text-secondary-container"
        }`}
      >
        {eyebrow}
      </span>
      <h2 className={`font-headline text-3xl md:text-4xl font-semibold ${light ? "text-white" : "text-primary"}`}>
        {title}
      </h2>
      {description && (
        <p className={`font-body-lg ${light ? "text-white/80" : "text-on-surface-variant"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
