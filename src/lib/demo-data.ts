/**
 * STRICTLY FOR UI FALLBACKS / SKELETON RENDER ONLY.
 * 
 * SECURITY NOTICE:
 * This file contains static mock UI structure for navigation headers, footers, 
 * and layout placeholders in the event of database connection latency or cold starts.
 * 
 * DO NOT import this file into src/auth.ts, src/auth.config.ts, or any login/API routes.
 * Authentication and user validation must ONLY query the database.
 */

export interface DemoCategory {
  id: string
  name: string
  slug: string
  description: string
}

export interface DemoArea {
  id: string
  name: string
  slug: string
  description: string
}

export interface DemoProduct {
  id: string
  name: string
  slug: string
  packSize: string
  description: string
  retailPrice: number
}

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    id: "cat-1",
    name: "Waterproofing",
    slug: "waterproofing",
    description: "High-performance cementitious and liquid waterproofing membranes.",
  },
  {
    id: "cat-2",
    name: "Sealing & Bonding",
    slug: "sealing-bonding",
    description: "Polyurethane and silicone sealants for joints and expansion gaps.",
  },
  {
    id: "cat-3",
    name: "Tile Adhesives",
    slug: "tile-adhesives",
    description: "Flexible tile adhesives and grouts for wet areas and commercial tiling.",
  },
  {
    id: "cat-4",
    name: "Concrete Repair",
    slug: "concrete-repair",
    description: "Non-shrink grouts, structural repair mortars, and bonding agents.",
  },
]

export const DEMO_AREAS: DemoArea[] = [
  {
    id: "area-1",
    name: "Roofs & Terraces",
    slug: "roofs-terraces",
    description: "Waterproofing and protective solutions for exposed building roofs and open terraces.",
  },
  {
    id: "area-2",
    name: "Wet Areas & Bathrooms",
    slug: "wet-areas-bathrooms",
    description: "Sealing and tiling systems designed for high-humidity indoor wet zones.",
  },
  {
    id: "area-3",
    name: "Basements & Foundations",
    slug: "basements-foundations",
    description: "Heavy-duty underground structural waterproofing against hydrostatic pressure.",
  },
  {
    id: "area-4",
    name: "Flooring & Commercial Decks",
    slug: "flooring-decks",
    description: "Industrial grade concrete grouting, levelling, and joint sealing systems.",
  },
]

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: "prod-1",
    name: "SikaTop® Seal-107",
    slug: "sikatop-seal-107",
    packSize: "25 kg Set",
    description: "Two-part polymer modified cementitious waterproofing slurry mortar.",
    retailPrice: 4800,
  },
  {
    id: "prod-2",
    name: "SikaGrout®-214 PK",
    slug: "sikagrout-214-pk",
    packSize: "25 kg Bag",
    description: "One-part cementitious flowable non-shrink precision grout.",
    retailPrice: 3200,
  },
  {
    id: "prod-3",
    name: "Sika® Ceram-102 PK",
    slug: "sika-ceram-102-pk",
    packSize: "20 kg Bag",
    description: "High quality polymer modified tile adhesive for indoor ceramic tiles.",
    retailPrice: 1850,
  },
]

export const DEMO_STORE_INFO = {
  phone: "+92 42 111 232 688",
  email: "info@pk.sika.com",
  address: "Sika Pakistan Pvt Ltd, Commercial Area, Lahore, Pakistan",
  operatingHours: "Mon - Fri: 9:00 AM - 5:30 PM",
}