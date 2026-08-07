import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, Wrench, Package, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { serializeDecimals } from "@/lib/serialize";
import { STOREFRONT_PRODUCT_FILTER } from "@/lib/product-queries";

type CategorySummary = {
  id: string;
  name: string;
  slug: string;
};

type ApplicationAreaSummary = {
  id: string;
  name: string;
  slug: string;
};

type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  packSize: string;
  description: string;
  images: string[];
  discountPercent?: number | null;
  tieredPrices: Array<{
    id: string;
    minQty: number;
    price: number;
  }>;
};

export default async function HomePage() {
  let categories: CategorySummary[] = [];
  let applicationAreas: ApplicationAreaSummary[] = [];
  let featuredProducts: FeaturedProduct[] = [];
  let isDbOffline = false;

  try {
    categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 4,
    });

    applicationAreas = await prisma.applicationArea.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 4,
    });

    const rawFeaturedProducts = await prisma.product.findMany({
      where: {
        ...STOREFRONT_PRODUCT_FILTER,
        isFeatured: true,
      },
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        packSize: true,
        description: true,
        images: true,
        discountPercent: true,
        tieredPrices: {
          select: {
            id: true,
            minQty: true,
            price: true,
          },
          orderBy: { minQty: "asc" },
        },
      },
    });

    featuredProducts = serializeDecimals(rawFeaturedProducts) as unknown as FeaturedProduct[];
  } catch (error) {
    console.error("[Homepage] Database fetch degraded:", error);
    isDbOffline = true;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-neutral-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80"
            alt="Sika Construction Background"
            fill
            priority
            className="object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-900/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-2xl space-y-6">
            <span className="inline-block bg-amber-500 text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
              Official Sika Online Store
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              BUILDING TRUST WITH <br />
              <span className="text-amber-500">SIKA SOLUTIONS</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Explore high-performance sealants, adhesives, waterproofing, and
              concrete repair systems directly from the manufacturer.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold px-6 py-3.5 rounded-lg transition shadow-lg inline-flex items-center gap-2"
              >
                Shop Products <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION STRIP */}
      <section className="bg-amber-500 text-black py-4 border-b border-amber-600">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm font-bold">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-5 w-5" /> 100% Authentic Sika Products
          </div>
          <div className="flex items-center justify-center gap-2">
            <Truck className="h-5 w-5" /> Nationwide Delivery & Distribution
          </div>
          <div className="flex items-center justify-center gap-2">
            <Wrench className="h-5 w-5" /> Technical Datasheets (TDS/SDS) Included
          </div>
        </div>
      </section>

      {/* PRODUCTS BY CATEGORY */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
              Products By Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select your product category
            </p>
          </div>
          <Link href="/products" className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition text-center flex flex-col items-center justify-center hover:border-amber-500"
              >
                <div className="h-16 w-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-black transition">
                  <Package className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 text-sm bg-white">
            {isDbOffline
              ? "Product categories are temporarily unavailable. Please check back shortly."
              : "No categories currently available."}
          </div>
        )}
      </section>

      {/* PRODUCTS BY APPLICATION AREA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
              Products By Application Area
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Find solutions mapped to your construction site requirements
            </p>
          </div>
          <Link href="/locator" className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            Store Locator <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {applicationAreas.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {applicationAreas.map((area) => (
              <Link
                key={area.id}
                href={`/products?area=${area.slug}`}
                className="group rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm hover:shadow-md transition text-center flex flex-col items-center justify-center hover:border-amber-500 hover:bg-white"
              >
                <div className="h-16 w-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-black transition">
                  <Layers className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition">
                  {area.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 text-sm bg-gray-50">
            {isDbOffline
              ? "Application areas are temporarily unavailable."
              : "No application areas currently listed."}
          </div>
        )}
      </section>

      {/* BEST SELLERS / FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Top Rated Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              BEST SELLERS
            </h2>
          </div>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const retailPrice =
                product.tieredPrices.find((p) => p.minQty === 1)?.price ?? 0;
              const mainImage = product.images?.[0] || null;

              // Discount Logic
              const discount = product.discountPercent || 0;
              const hasDiscount = discount > 0;
              const finalPrice = hasDiscount 
                ? retailPrice * (1 - discount / 100) 
                : retailPrice;

              return (
                <div
                  key={product.id}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition flex flex-col justify-between relative"
                >
                  <div>
                    <div className="relative aspect-square w-full rounded-lg bg-gray-100 mb-4 overflow-hidden border border-gray-100 flex items-center justify-center">
                      
                      {/* Discount Badge */}
                      {hasDiscount && (
                        <div className="absolute top-2 right-2 z-10 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded shadow-sm tracking-wide">
                          {discount}% OFF
                        </div>
                      )}

                      {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <span className="font-bold text-gray-400 text-sm">
                          [ {product.name} ]
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      {product.packSize}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-amber-600 transition">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block">
                        Starting Price
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-gray-900">
                          Rs. {finalPrice.toLocaleString()}
                        </span>
                        {/* Strikethrough original price if discounted */}
                        {hasDiscount && (
                          <span className="text-[10px] text-gray-400 line-through font-medium">
                            Rs. {retailPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-2 rounded transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 text-sm bg-gray-50">
            {isDbOffline
              ? "Featured catalog currently re-connecting. Browse our direct product categories above."
              : "No featured products listed."}
          </div>
        )}
      </section>
    </div>
  );
}