"use client";

import { useState } from "react";
import { MapPin, Phone, Printer, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // PROD NOTE: Replace this timeout with your actual API call or Server Action
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify({ name, email, message }) });
      await new Promise((resolve) => setTimeout(resolve, 1500)); 
      
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");

      // Reset the success message after 4 seconds
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      console.error("Failed to send message:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <span className="bg-amber-500 text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
            Get In Touch
          </span>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            CONTACT SIKA PAKISTAN HEAD OFFICE
          </h1>
          <p className="text-sm text-gray-600">
            Reach out to our technical support and sales team for product inquiries and project specifications.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-gray-900 uppercase border-b pb-2">Head Office Details</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <span>First Floor 141-CCA, Phase IV DHA, 54792 Lahore, Pakistan</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-600 shrink-0" />
                <span>+92 42 3569 4266-7</span>
              </div>
              <div className="flex items-center space-x-3">
                <Printer className="h-5 w-5 text-red-600 shrink-0" />
                <span>+92 42 3569 4268</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-red-600 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>+92 321 7452360 (WhatsApp)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-600 shrink-0" />
                <span>information@pk.sika.com</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Quick Inquiry</h4>
              <p className="text-xs text-gray-500">Send us a direct message and our technical team will respond within 24 business hours.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3 pt-4">
              <input 
                type="text" 
                required
                disabled={status === "submitting"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name" 
                className="w-full text-sm p-2.5 rounded border border-gray-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors" 
              />
              <input 
                type="email" 
                required
                disabled={status === "submitting"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" 
                className="w-full text-sm p-2.5 rounded border border-gray-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors" 
              />
              <textarea 
                required
                disabled={status === "submitting"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message / Project Details" 
                rows={4} 
                className="w-full text-sm p-2.5 rounded border border-gray-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors resize-none"
              ></textarea>
              
              <button 
                type="submit" 
                disabled={status === "submitting" || status === "success"}
                className="w-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed text-black font-bold text-sm py-2.5 rounded transition-colors"
              >
                {status === "submitting" ? (
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

              {/* Status Messages */}
              {status === "success" && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2.5 rounded text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  Your message has been sent successfully.
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2.5 rounded text-xs font-bold border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}