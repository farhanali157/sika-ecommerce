import { test, expect } from "@playwright/test"

test.describe("Customer End-to-End Flow", () => {
  test("browses products, adds to cart, and completes checkout", async ({ page }) => {
    // 1. Visit store catalog
    await page.goto("/products")
    await expect(page.locator("h1")).toContainText("Product Catalog")

    // 2. Click first product
    const firstProduct = page.locator("a[href^='/product/']").first()
    await firstProduct.click()

    // 3. Add to cart
    const addToCartBtn = page.locator("button:has-text('Add to Cart')")
    await addToCartBtn.click()

    // 4. Proceed to Checkout
    await page.goto("/checkout")
    await page.fill("input[name='customerName']", "Test Customer")
    await page.fill("input[name='customerEmail']", "test@sika.pk")
    await page.fill("input[name='customerPhone']", "+923001234567")
    await page.fill("input[name='shippingAddress']", "Plot 12, Industrial Area, Gulberg")
    await page.fill("input[name='city']", "Lahore")

    // Select COD
    await page.click("text=Cash on Delivery")

    // Submit Order
    await page.click("button:has-text('Confirm & Place Order')")

    // Expect redirect to order confirmation page
    await expect(page).toHaveURL(/\/account\/orders\//)
  })
})