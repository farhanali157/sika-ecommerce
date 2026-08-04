import { MapPin, Phone, Printer, MessageSquare, Mail } from "lucide-react";

export default function ContactUsPage() {
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
                <MessageSquare className="h-5 w-5 text-red-600 shrink-0" />
                <span>+92 321 7452360 (WhatsApp Support)</span>
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
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3 pt-4">
              <input type="text" placeholder="Your Name" className="w-full text-sm p-2.5 rounded border border-gray-300 bg-white" />
              <input type="email" placeholder="Email Address" className="w-full text-sm p-2.5 rounded border border-gray-300 bg-white" />
              <textarea placeholder="Message / Project Details" rows={3} className="w-full text-sm p-2.5 rounded border border-gray-300 bg-white"></textarea>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm py-2.5 rounded transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}