export default function AuthFooterLinks() {
  return (
    <div className="mt-12 text-center">
      <p className="font-label-sm text-on-surface-variant">
        © 2026 JAIN International Residential School. All rights reserved.
      </p>
      <div className="mt-2 flex justify-center gap-4 font-label-sm text-secondary">
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <span className="text-outline-variant">•</span>
        <a href="#" className="hover:underline">
          Terms of Service
        </a>
        <span className="text-outline-variant">•</span>
        <a href="#" className="hover:underline">
          Support
        </a>
      </div>
    </div>
  );
}
