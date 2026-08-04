"use client"

import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-amber-500 text-gray-950 border-t border-amber-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tighter text-gray-950 uppercase">
                Sika® <span className="text-red-600">Pakistan</span>
              </span>
            </div>
            <p className="text-sm text-gray-900 max-w-sm font-medium">
              Global leader in specialty chemicals for construction and industry. Providing high-performance waterproofing, concrete repair, sealing, and structural strengthening solutions.
            </p>
            <div className="flex items-center space-x-3 text-xs text-gray-950 font-semibold pt-2">
              <Shield className="h-4 w-4 text-red-600" />
              <span>ISO 9001 Certified Quality Construction Solutions</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-950">Solutions & Catalog</h3>
            <ul className="mt-4 space-y-2 text-sm font-medium">
              <li>
                <Link href="/products?category=waterproofing" className="hover:text-red-700 transition-colors">
                  Waterproofing Systems
                </Link>
              </li>
              <li>
                <Link href="/products?category=concrete-repair" className="hover:text-red-700 transition-colors">
                  Concrete Repair & Grouts
                </Link>
              </li>
              <li>
                <Link href="/products?category=tile-adhesives" className="hover:text-red-700 transition-colors">
                  Tile Adhesives & Grouts
                </Link>
              </li>
              <li>
                <Link href="/products?category=sealants" className="hover:text-red-700 transition-colors">
                  Sealants & Joint Fillers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Portal */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-950">Contractor Portal</h3>
            <ul className="mt-4 space-y-2 text-sm font-medium">
              <li>
                <Link href="/orders" className="hover:text-red-700 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-red-700 transition-colors">
                  B2B Contractor Account
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-red-700 transition-colors">
                  Tiered Pricing Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-950">Stay Updated</h3>
            <p className="text-xs text-gray-900 font-medium">
              Subscribe for technical datasheets and product launch alerts.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 border border-amber-600 shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                <span>Subscribe</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-amber-600/40 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-900 font-medium">
          <p>&copy; {new Date().getFullYear()} Sika Pakistan (Pvt) Ltd. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0 font-semibold">
            <span className="hover:text-red-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-red-700 cursor-pointer">Terms of Service</span>
            <span className="hover:text-red-700 cursor-pointer">Technical Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}