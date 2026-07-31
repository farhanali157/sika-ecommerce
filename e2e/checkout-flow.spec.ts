import { test, expect } from "@playwright/test"

test.describe("Customer End-to-End Flow", () => {
  test("browses products, adds to cart, and completes checkout", async ({ page }) => {
    // 1. Visit store catalog
    await page.goto("/products")
    
    await expect(
      page.getByRole("heading", { level: 1, name: /All Sika® Construction Solutions/i })
    ).toBeVisible()

    // 2. Click first product
    const firstProduct = page.locator("a[href^='/product/']").first()
    await firstProduct.click()

    // 3. Add to cart
    const addToCartBtn = page.getByRole("button", { name: /Add to Cart/i })
    await addToCartBtn.click()

    // 4. Open Cart Drawer and click link to navigate to /cart
    await page.getByRole("button", { name: /Open Cart Drawer/i }).click()
    await page.getByRole("link", { name: /Proceed to Checkout/i }).click()

    // 5. Arrive on /cart and click the checkout link to go to /checkout
    await expect(page).toHaveURL("/cart")
    await page.getByRole("main").getByRole("link", { name: /Proceed to Checkout/i }).click()

    // 6. Confirm arrival on /checkout
    await expect(page).toHaveURL("/checkout")

    // Fill form inputs on Checkout page
    await page.getByPlaceholder(/Ali Khan/i).fill("Test Customer")
    await page.getByPlaceholder(/name@company.com/i).fill("test@sika.pk")
    await page.getByPlaceholder(/0300-1234567/i).fill("03001234567")
    await page.getByPlaceholder(/Plot #, Street/i).fill("Plot 12, Industrial Area, Gulberg")

    // Select City from dropdown
    await page.getByRole("combobox").selectOption("Lahore")

    // Submit Order
    await page.getByRole("button", { name: /Place Order/i }).click()

    // 7. Expect redirect to Order Success page
    await expect(page).toHaveURL(/\/order\/success/, { timeout: 10000 })
    await expect(
      page.getByRole("heading", { level: 1, name: /Order Placed Successfully/i })
    ).toBeVisible()
  })
})