"use client";

import { useState } from "react";

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);

  return (
    <form className="bg-white p-6 md:p-10 rounded-3xl border border-outline-variant/20 shadow-sm space-y-6">
      <div>
        <label htmlFor="name" className="block font-label-md text-on-surface-variant mb-2">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          required
          className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-label-md text-on-surface-variant mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="rating" className="block font-label-md text-on-surface-variant mb-2">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                value <= rating
                  ? "bg-primary text-white"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block font-label-md text-on-surface-variant mb-2">
          Your Feedback
        </label>
        <textarea
          id="message"
          rows={5}
          required
          className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white px-8 py-4 rounded-xl font-label-md font-bold hover:shadow-lg hover:shadow-primary/20 transition-all w-full sm:w-auto"
      >
        Submit Feedback
      </button>
    </form>
  );
}
