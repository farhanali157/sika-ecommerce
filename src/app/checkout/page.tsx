import { getCart } from "@/app/actions/cart"
import { CheckoutFormClient } from "./checkout-form-client"

// Force dynamic rendering so server-side cookie/session cart is always fresh
export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
  // Fetch cart directly from database via session cookie on the server
  const cart = await getCart()

  return <CheckoutFormClient initialCart={cart} />
}