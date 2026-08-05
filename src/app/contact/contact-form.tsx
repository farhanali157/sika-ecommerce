"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactInquiry } from "@/app/actions/contact";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    startTransition(async () => {
      const res = await submitContactInquiry({ name, email, message });

      if (res.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-4">
      <input
        type="text"
        required
        disabled={isPending}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        className="w-full text-sm p-2.5 rounded border border-gray-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
      />
      <input
        type="email"
        required
        disabled={isPending}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        className="w-full text-sm p-2.5 rounded border border-gray-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
      />
      <textarea
        required
        disabled={isPending}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message / Project Details"
        rows={4}
        className="w-full text-sm p-2.5 rounded border border-gray-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors resize-none"
      ></textarea>

      <button
        type="submit"
        disabled={isPending || status === "success"}
        className="w-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed text-black font-bold text-sm py-2.5 rounded transition-colors"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
      </button>

      {status === "success" && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2.5 rounded text-xs font-bold border border-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
          Your message has been sent successfully.
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2.5 rounded text-xs font-bold border border-red-200">
          <AlertCircle className="h-4 w-4" />
          {errorMessage}
        </div>
      )}
    </form>
  );
}