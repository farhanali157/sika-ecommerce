# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\checkout-flow.spec.ts >> Customer End-to-End Flow >> browses products, adds to cart, and completes checkout
- Location: e2e\checkout-flow.spec.ts:4:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/products", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test"
  2  | 
  3  | test.describe("Customer End-to-End Flow", () => {
  4  |   test("browses products, adds to cart, and completes checkout", async ({ page }) => {
  5  |     // 1. Visit store catalog
> 6  |     await page.goto("/products")
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  7  |     await expect(page.locator("h1")).toContainText("Product Catalog")
  8  | 
  9  |     // 2. Click first product
  10 |     const firstProduct = page.locator("a[href^='/product/']").first()
  11 |     await firstProduct.click()
  12 | 
  13 |     // 3. Add to cart
  14 |     const addToCartBtn = page.locator("button:has-text('Add to Cart')")
  15 |     await addToCartBtn.click()
  16 | 
  17 |     // 4. Proceed to Checkout
  18 |     await page.goto("/checkout")
  19 |     await page.fill("input[name='customerName']", "Test Customer")
  20 |     await page.fill("input[name='customerEmail']", "test@sika.pk")
  21 |     await page.fill("input[name='customerPhone']", "+923001234567")
  22 |     await page.fill("input[name='shippingAddress']", "Plot 12, Industrial Area, Gulberg")
  23 |     await page.fill("input[name='city']", "Lahore")
  24 | 
  25 |     // Select COD
  26 |     await page.click("text=Cash on Delivery")
  27 | 
  28 |     // Submit Order
  29 |     await page.click("button:has-text('Confirm & Place Order')")
  30 | 
  31 |     // Expect redirect to order confirmation page
  32 |     await expect(page).toHaveURL(/\/account\/orders\//)
  33 |   })
  34 | })
```