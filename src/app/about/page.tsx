import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Lightbulb, Leaf, Users, Target } from "lucide-react";

export const metadata = {
  title: "About Us | Sika Pakistan",
  description: "Learn about Sika Pakistan's history, corporate values, and commitment to building trust in the construction and motor vehicle industries.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 text-center overflow-hidden min-h-[60vh] flex flex-col justify-center">
        {/* Image sits at the back */}
        <Image 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
          alt="Modern construction and architecture" 
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        
        {/* Overlay sits on top of the image */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Content sits on top of everything with z-10 */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
            Building Trust
          </h1>
          <p className="text-lg md:text-xl text-gray-100 font-medium max-w-3xl mx-auto drop-shadow-md">
            Sika is a specialty chemical company with a leading position in the development and production of systems and products for bonding, sealing, damping, reinforcing and protecting in the building sector and motor vehicle industry.
          </p>
        </div>
      </section>

      {/* Company History Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-red-600 pl-4">
              Our Journey in Pakistan
            </h2>
            <div className="text-gray-600 space-y-4 leading-relaxed">
              <p>
                Sika Pakistan (Pvt) Limited is a proud subsidiary of Sika AG - Switzerland. We officially started our operations in Pakistan in 2010, marking the momentous 100th anniversary of Sika worldwide. 
              </p>
              <p>
                With an unwavering aim to become the number one construction chemical company in the country, Sika Pakistan opened its head office in Lahore, alongside regional offices in Karachi, Islamabad, and Faisalabad. To facilitate our customers&apos; needs rapidly, we simultaneously launched our manufacturing facility in Lahore during our very first year of operations.
              </p>
              <p>
                Globally, Sika&apos;s remarkable history began when Kaspar Winkler founded the business in 1910. Today, the Sika Brand stands as a global symbol for quality, innovation, and unparalleled service.
              </p>
            </div>
          </div>
          
          {/* Facility Image */}
          <div className="relative rounded-2xl aspect-video overflow-hidden shadow-xl border border-gray-100 group">
            <Image 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070" 
              alt="Sika Manufacturing Facility" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transform group-hover:scale-105 transition duration-700 ease-in-out"
            />
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-amber-500/50 transition duration-500 rounded-2xl pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Corporate Values Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">The Sika Spirit</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
            <p className="mt-6 text-gray-600">
              The Sika Spirit is a synonym of the strong set of values and principles which makes up the DNA of the company. Five management principles express our corporate culture and serve as the foundation of our future success:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-t-red-600 hover:shadow-lg transition">
              <ShieldCheck className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600 text-sm">
                Sika is dedicated to providing and maintaining the highest quality standards. All solutions are designed with the customers&apos; success in mind to build long-lasting and mutually beneficial relationships.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-t-amber-500 hover:shadow-lg transition">
              <Lightbulb className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Courage for Innovation</h3>
              <p className="text-gray-600 text-sm">
                Our success is based on a long-lasting tradition of innovation. We focus on consistently developing new products, systems, and solutions for our target markets.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-t-red-600 hover:shadow-lg transition">
              <Leaf className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainability & Integrity</h3>
              <p className="text-gray-600 text-sm">
                We operate with a strong focus on safety, environment, fair treatment, and responsible growth. We do not compromise on integrity and apply high ethical standards to all our work.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-t-amber-500 hover:shadow-lg transition">
              <Users className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Empowerment & Respect</h3>
              <p className="text-gray-600 text-sm">
                The well-being and health of our employees and partners is a prerequisite to Sika&apos;s success. Creating safe work environments is always a top priority.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-t-red-600 hover:shadow-lg transition">
              <Target className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manage for Results</h3>
              <p className="text-gray-600 text-sm">
                Sika aims for success and takes pride in continuously achieving outstanding results and outperforming its markets, pursuing targets with persistency and a long-term view.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-black text-gray-900">Experience Sika Quality</h2>
        <p className="text-gray-600 text-lg">
          Customers throughout the world can rest assured that they will receive Sika quality and service wherever they see the Sika logo.
        </p>
        <div className="pt-6">
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-wider py-4 px-10 rounded-sm shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            Explore Our Products
          </Link>
        </div>
      </section>
    </div>
  );
}