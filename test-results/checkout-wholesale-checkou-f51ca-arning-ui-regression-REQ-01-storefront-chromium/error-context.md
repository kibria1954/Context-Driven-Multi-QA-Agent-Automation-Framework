# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout\wholesale-checkout.spec.ts >> Wholesale Checkout Suite >> TC-CHK-010: UI: Terms of Service Agreement Unchecked Warning @ui @regression @REQ-01
- Location: tests\e2e\checkout\wholesale-checkout.spec.ts:122:7

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.goto: Test timeout of 120000ms exceeded.
Call log:
  - navigating to "https://kbd.nop-station.site/apple-iphone-16-128gb", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=f6e1]:
  - status
  - generic [ref=f6e2]:
    - generic [ref=f6e3]:
      - group "1 / 1" [ref=f6e6]:
        - generic [ref=f6e7]: Free shipping on all orders above ৳100
      - button "Announcement Minimize or maximize" [ref=f6e8] [cursor=pointer]: 
    - banner [ref=f6e9]:
      - link "Skip navigation" [ref=f6e10] [cursor=pointer]:
        - /url: "#main"
      - generic [ref=f6e12]:
        - text: 
        - link [ref=f6e14] [cursor=pointer]:
          - /url: /
          - img "Your store name" [ref=f6e15]
        - search [ref=f6e17]:
          - generic [ref=f6e18]:
            - generic [ref=f6e19]:
              - combobox [ref=f6e20] [cursor=pointer]:
                - generic [ref=f6e21]: All categories
              - generic: 
            - textbox "Search store" [ref=f6e23]:
              - /placeholder: Search for K-Beauty products, brands, ingredients...
            - button "Search" [ref=f6e25] [cursor=pointer]:
              - generic [ref=f6e26]: 
        - list [ref=f6e30]:
          - listitem [ref=f6e31]:
            - link "Wishlist" [ref=f6e32] [cursor=pointer]:
              - /url: /wishlist
              - text: 
              - generic [ref=f6e34]: (0)
          - listitem [ref=f6e35]:
            - generic [ref=f6e36]:
              - generic [ref=f6e37]: 
              - generic [ref=f6e39]:
                - generic [ref=f6e40]: user
                - generic [ref=f6e41]: 
          - listitem [ref=f6e42]:
            - generic [ref=f6e43]:
              - link "Shopping cart" [ref=f6e44] [cursor=pointer]:
                - /url: /cart
                - text: 
                - generic [ref=f6e46]: (26)
              - generic: "26"
          - listitem [ref=f6e47]:
            - link "Quick Order" [ref=f6e48] [cursor=pointer]:
              - /url: /Favourites
              - generic [ref=f6e49]: 
      - generic [ref=f6e52]:
        - generic [ref=f6e53]:
          - generic [ref=f6e54]:
            - generic [ref=f6e55] [cursor=pointer]:
              - text: 
              - generic [ref=f6e56]: K-Beauty Categories
              - text: 
            - text:     
          - navigation [ref=f6e58]:
            - list [ref=f6e59]:
              - listitem [ref=f6e60]:
                - link "The picture of Brand Brand" [ref=f6e61] [cursor=pointer]:
                  - /url: /manufacturer/all
                  - img "The picture of Brand" [ref=f6e63]
                  - generic [ref=f6e64]: Brand
              - listitem [ref=f6e65]:
                - link "The picture of Promotion Promotion" [ref=f6e66] [cursor=pointer]:
                  - /url: /promotions
                  - img "The picture of Promotion" [ref=f6e68]
                  - generic [ref=f6e69]: Promotion
              - listitem [ref=f6e70]:
                - link "The picture of Box Damage Box Damage" [ref=f6e71] [cursor=pointer]:
                  - /url: /box-damage
                  - img "The picture of Box Damage" [ref=f6e73]
                  - generic [ref=f6e74]: Box Damage
              - listitem [ref=f6e75]:
                - link "The picture of Restock Request Restock Request" [ref=f6e76] [cursor=pointer]:
                  - /url: /restock-request
                  - img "The picture of Restock Request" [ref=f6e78]
                  - generic [ref=f6e79]: Restock Request
              - listitem [ref=f6e80]:
                - link "The picture of Pre-Order Pre-Order" [ref=f6e81] [cursor=pointer]:
                  - /url: /
                  - img "The picture of Pre-Order" [ref=f6e83]
                  - generic [ref=f6e84]: Pre-Order
        - generic [ref=f6e87] [cursor=pointer]:
          - text: 
          - generic [ref=f6e88]: Support
          - text: 
    - main [ref=f6e89]:
      - generic [ref=f6e90]:
        - navigation "Breadcrumb" [ref=f6e91]:
          - list [ref=f6e92]:
            - listitem [ref=f6e93]:
              - link " Home" [ref=f6e94] [cursor=pointer]:
                - /url: /
                - text: 
                - generic [ref=f6e95]: Home
            - listitem [ref=f6e97]:
              - link "Electronics" [ref=f6e98] [cursor=pointer]:
                - /url: /electronics
            - listitem [ref=f6e101]:
              - link "Cell phones" [ref=f6e102] [cursor=pointer]:
                - /url: /cell-phones
            - listitem [ref=f6e105]:
              - strong [ref=f6e106]: Apple iPhone 16 128GB — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance
        - generic [ref=f6e109]:
          - article [ref=f6e111]:
            - generic [ref=f6e112]:
              - generic [ref=f6e114]:
                - generic [ref=f6e115]:
                  - generic:
                    - generic: "-17%"
                    - generic: New Arrival
                  - button " Add to wishlist" [ref=f6e117] [cursor=pointer]:
                    - text: 
                    - generic [ref=f6e118]: Add to wishlist
                  - link [ref=f6e119] [cursor=pointer]:
                    - /url: https://kbd.nop-station.site/images/thumbs/0000045_apple-iphone-16-128gb-authentic-korean-beauty-wholesale-product-with-premium-quality-assurance.png
                    - img "Picture of Apple iPhone 16 128GB — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance" [ref=f6e120]
                - generic [ref=f6e121]:
                  - group "1 / 1" [ref=f6e123]:
                    - link [ref=f6e124] [cursor=pointer]:
                      - /url: https://kbd.nop-station.site/images/thumbs/0000045_apple-iphone-16-128gb-authentic-korean-beauty-wholesale-product-with-premium-quality-assurance.png
                      - img "Picture of Apple iPhone 16 128GB — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance" [ref=f6e125]
                  - text:  
              - generic [ref=f6e126]:
                - heading "Apple iPhone 16 128GB — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance" [level=1] [ref=f6e128]
                - generic [ref=f6e129]: "SKU: A_16_128T"
                - generic [ref=f6e130]: "Barcode: 9321758000357"
                - generic [ref=f6e131]: In stock
                - generic [ref=f6e136]:
                  - generic [ref=f6e137]: $958.80
                  - generic [ref=f6e138]: $799.00
                  - generic [ref=f6e139]: Save $159.80
                - generic [ref=f6e140]: Apple iPhone 16 128GB Teal with 6.1 inches screen and 48 megapixels rear-facing camera
                - text: "|"
                - generic [ref=f6e142]:
                  - generic [ref=f6e143]:
                    - button "Decrease quantity" [ref=f6e144] [cursor=pointer]: 
                    - generic [ref=f6e145]:
                      - textbox "Enter a quantity" [ref=f6e146]: "1"
                      - generic [ref=f6e147]: pcs
                    - button "Increase quantity" [ref=f6e148] [cursor=pointer]: 
                  - button " Add to cart" [ref=f6e149] [cursor=pointer]
                - generic [ref=f6e150]:
                  - generic [ref=f6e151]:
                    - generic [ref=f6e152]: SKU
                    - generic [ref=f6e153]: A_16_128T
                  - generic [ref=f6e154]:
                    - generic [ref=f6e155]: Category
                    - generic [ref=f6e156]: Cell phones
                  - generic [ref=f6e157]:
                    - generic [ref=f6e158]: Stock
                    - generic [ref=f6e159]: 5606 units available
          - generic [ref=f6e160]:
            - tablist [ref=f6e161]:
              - tab "Description" [selected] [ref=f6e162] [cursor=pointer]
              - tab "How to use?" [ref=f6e163] [cursor=pointer]
              - tab "Reviews" [ref=f6e164] [cursor=pointer]
            - tabpanel [ref=f6e166]:
              - paragraph [ref=f6e168]: iPhone 16 brings you Dynamic Island, a 48MP Main camera and USB-C — all in a durable colour-infused glass and aluminium design. iPhone 16 has the Dynamic Island, an innovative way to interact with important alerts and Live Activities.
          - generic [ref=f6e169]:
            - generic [ref=f6e170]:
              - generic [ref=f6e171]:
                - generic [ref=f6e172]: Others also like
                - heading "Customers who bought this item also bought" [level=2] [ref=f6e173]
              - generic [ref=f6e174]:
                - button "Previous slide" [disabled]: 
                - button "Next slide" [disabled]: 
            - generic [ref=f6e176]:
              - group "1 / 4" [ref=f6e177]:
                - article [ref=f6e178]:
                  - generic [ref=f6e179]:
                    - generic [ref=f6e180]: "-19%"
                    - link [ref=f6e182] [cursor=pointer]:
                      - /url: /apple-macbook-pro
                      - img "Picture of Apple MacBook Pro" [ref=f6e183]
                    - button " Add to wishlist" [ref=f6e184] [cursor=pointer]:
                      - text: 
                      - generic [ref=f6e185]: Add to wishlist
                  - generic [ref=f6e186]:
                    - heading [level=2] [ref=f6e187]:
                      - link "[Apple] Apple MacBook Pro" [ref=f6e188] [cursor=pointer]:
                        - /url: /apple-macbook-pro
                    - generic [ref=f6e190]:
                      - generic [ref=f6e191]: "SKU: AP_MBP_13"
                      - generic [ref=f6e192]: "Barcode: 9321758000068"
                      - generic [ref=f6e194]:
                        - generic [ref=f6e195]: In stock (4611)
                        - generic [ref=f6e196]: "Exp: 06/2030"
                    - generic [ref=f6e198]:
                      - generic [ref=f6e199]:
                        - generic [ref=f6e200]: $2,214.00
                        - generic [ref=f6e201]: $1,800.00
                        - generic [ref=f6e202]: Save $414.00
                      - generic [ref=f6e203]:
                        - generic [ref=f6e205]:
                          - button "Decrease quantity" [ref=f6e206] [cursor=pointer]: 
                          - generic [ref=f6e207]:
                            - textbox "Enter" [ref=f6e208]: "2"
                            - generic [ref=f6e209]: Pcs
                          - button "Increase quantity" [ref=f6e210] [cursor=pointer]: 
                        - button "Add to cart" [ref=f6e212] [cursor=pointer]:
                          - generic [ref=f6e213]: 
                          - text: Add to cart
              - group "2 / 4" [ref=f6e214]:
                - article [ref=f6e215]:
                  - generic [ref=f6e216]:
                    - generic [ref=f6e217]: "-19%"
                    - link [ref=f6e219] [cursor=pointer]:
                      - /url: /leica-t-mirrorless-digital-camera
                      - img "Picture of Leica T Mirrorless Digital Camera" [ref=f6e220]
                    - button " Add to wishlist" [ref=f6e221] [cursor=pointer]:
                      - text: 
                      - generic [ref=f6e222]: Add to wishlist
                  - generic [ref=f6e223]:
                    - heading [level=2] [ref=f6e224]:
                      - link "Leica T Mirrorless Digital Camera" [ref=f6e225] [cursor=pointer]:
                        - /url: /leica-t-mirrorless-digital-camera
                    - generic [ref=f6e227]:
                      - generic [ref=f6e228]: "SKU: LT_MIR_DC"
                      - generic [ref=f6e229]: "Barcode: 9321758000272"
                      - generic [ref=f6e231]:
                        - generic [ref=f6e232]: In stock (5129)
                        - generic [ref=f6e233]: "Exp: 03/2029"
                    - generic [ref=f6e235]:
                      - generic [ref=f6e236]:
                        - generic [ref=f6e237]: $646.60
                        - generic [ref=f6e238]: $530.00
                        - generic [ref=f6e239]: Save $116.60
                      - generic [ref=f6e240]:
                        - generic [ref=f6e242]:
                          - button "Decrease quantity" [ref=f6e243] [cursor=pointer]: 
                          - generic [ref=f6e244]:
                            - textbox "Enter" [ref=f6e245]: "1"
                            - generic [ref=f6e246]: Pcs
                          - button "Increase quantity" [ref=f6e247] [cursor=pointer]: 
                        - button "Add to cart" [ref=f6e249] [cursor=pointer]:
                          - generic [ref=f6e250]: 
                          - text: Add to cart
              - group "3 / 4" [ref=f6e251]:
                - article [ref=f6e252]:
                  - generic [ref=f6e253]:
                    - generic [ref=f6e254]: "-15%"
                    - link [ref=f6e256] [cursor=pointer]:
                      - /url: /asus-laptop
                      - img "Picture of Asus Laptop" [ref=f6e257]
                    - button " Add to wishlist" [ref=f6e258] [cursor=pointer]:
                      - text: 
                      - generic [ref=f6e259]: Add to wishlist
                  - generic [ref=f6e260]:
                    - heading [level=2] [ref=f6e261]:
                      - link "Asus Laptop" [ref=f6e262] [cursor=pointer]:
                        - /url: /asus-laptop
                    - generic [ref=f6e264]:
                      - generic [ref=f6e265]: "SKU: AS_551_LP"
                      - generic [ref=f6e266]: "Barcode: 9321758000085"
                      - generic [ref=f6e268]:
                        - generic [ref=f6e269]: In stock (4549)
                        - generic [ref=f6e270]: "Exp: 09/2029"
                    - generic [ref=f6e272]:
                      - generic [ref=f6e273]:
                        - generic [ref=f6e274]: $1,755.00
                        - generic [ref=f6e275]: $1,500.00
                        - generic [ref=f6e276]: Save $255.00
                      - generic [ref=f6e277]:
                        - generic [ref=f6e279]:
                          - button "Decrease quantity" [ref=f6e280] [cursor=pointer]: 
                          - generic [ref=f6e281]:
                            - textbox "Enter" [ref=f6e282]: "1"
                            - generic [ref=f6e283]: Pcs
                          - button "Increase quantity" [ref=f6e284] [cursor=pointer]: 
                        - button "Add to cart" [ref=f6e286] [cursor=pointer]:
                          - generic [ref=f6e287]: 
                          - text: Add to cart
              - group "4 / 4" [ref=f6e288]:
                - article [ref=f6e289]:
                  - generic [ref=f6e290]:
                    - link [ref=f6e291] [cursor=pointer]:
                      - /url: /hp-spectre-xt-pro-ultrabook
                      - img "Picture of HP Spectre XT Pro UltraBook — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance" [ref=f6e292]
                    - button " Add to wishlist" [ref=f6e293] [cursor=pointer]:
                      - text: 
                      - generic [ref=f6e294]: Add to wishlist
                  - generic [ref=f6e295]:
                    - heading [level=2] [ref=f6e296]:
                      - link "[HP] HP Spectre XT Pro UltraBook — Authentic Korean Beauty Wholesale Product with Premium Quality Assurance" [ref=f6e297] [cursor=pointer]:
                        - /url: /hp-spectre-xt-pro-ultrabook
                    - generic [ref=f6e299]:
                      - generic [ref=f6e300]: "SKU: HP_SPX_UB"
                      - generic [ref=f6e301]: "Barcode: 9321758000119"
                      - generic [ref=f6e303]:
                        - generic [ref=f6e304]: In stock (5130)
                        - generic [ref=f6e305]: "Exp: 12/2030"
                    - generic [ref=f6e307]:
                      - generic [ref=f6e308]: $1,350.00
                      - generic [ref=f6e310]:
                        - generic [ref=f6e312]:
                          - button "Decrease quantity" [ref=f6e313] [cursor=pointer]: 
                          - generic [ref=f6e314]:
                            - textbox "Enter" [ref=f6e315]: "1"
                            - generic [ref=f6e316]: Pcs
                          - button "Increase quantity" [ref=f6e317] [cursor=pointer]: 
                        - button "Add to cart" [ref=f6e319] [cursor=pointer]:
                          - generic [ref=f6e320]: 
                          - text: Add to cart
    - contentinfo [ref=f6e321]:
      - generic [ref=f6e322]:
        - generic [ref=f6e325]:
          - generic [ref=f6e326]:
            - img "Your store name" [ref=f6e328]
            - generic [ref=f6e329]:
              - paragraph [ref=f6e330]: Distributor | Importer | Wholesaler | Retailer
              - paragraph [ref=f6e331]: Bangladesh’s No.1 Korean Cosmetics Wholesale Supplier
              - paragraph [ref=f6e332]: The widest range of authentic Korean skincare in stock official distributor for leading K-beauty brands. Best wholesale prices, 100% authenticity guaranteed, with fastest nationwide delivery.
            - link " info@koreandemandsbd.com" [ref=f6e333] [cursor=pointer]:
              - /url: mailto:info@koreandemandsbd.com
            - list [ref=f6e335]:
              - listitem [ref=f6e336]:
                - link " Facebook" [ref=f6e337] [cursor=pointer]:
                  - /url: https://www.facebook.com/nopCommerce
              - listitem [ref=f6e338]:
                - link " WhatsApp" [ref=f6e339] [cursor=pointer]:
                  - /url: https://wa.me/01721111111
              - listitem [ref=f6e340]:
                - link " Twitter" [ref=f6e341] [cursor=pointer]:
                  - /url: https://twitter.com/nopCommerce
              - listitem [ref=f6e342]:
                - link " Instagram" [ref=f6e343] [cursor=pointer]:
                  - /url: https://www.instagram.com/nopcommerce_official
              - listitem [ref=f6e344]:
                - link " Email" [ref=f6e345] [cursor=pointer]:
                  - /url: mailto:info@koreandemandsbd.com
              - listitem [ref=f6e346]:
                - link " YouTube" [ref=f6e347] [cursor=pointer]:
                  - /url: https://www.youtube.com/user/nopCommerce
          - navigation [ref=f6e348]:
            - heading "Information" [level=2] [ref=f6e349]
            - menu "Information" [ref=f6e350]:
              - menuitem [ref=f6e351]:
                - link "Sitemap" [ref=f6e352] [cursor=pointer]:
                  - /url: /sitemap
              - menuitem [ref=f6e353]:
                - link "Shipping & returns" [ref=f6e354] [cursor=pointer]:
                  - /url: /shipping-returns
              - menuitem [ref=f6e355]:
                - link "Privacy notice" [ref=f6e356] [cursor=pointer]:
                  - /url: /privacy-notice
              - menuitem [ref=f6e357]:
                - link "Conditions of Use" [ref=f6e358] [cursor=pointer]:
                  - /url: /conditions-of-use
              - menuitem [ref=f6e359]:
                - link "About us" [ref=f6e360] [cursor=pointer]:
                  - /url: /about-us
              - menuitem [ref=f6e361]:
                - link "Contact us" [ref=f6e362] [cursor=pointer]:
                  - /url: /contactus
            - heading "Customer service" [level=2] [ref=f6e363]
            - menu "Customer service" [ref=f6e364]:
              - menuitem [ref=f6e365]:
                - link "Search" [ref=f6e366] [cursor=pointer]:
                  - /url: /search
              - menuitem [ref=f6e367]:
                - link "News" [ref=f6e368] [cursor=pointer]:
                  - /url: /news
              - menuitem [ref=f6e369]:
                - link "Blog" [ref=f6e370] [cursor=pointer]:
                  - /url: /blog
              - menuitem [ref=f6e371]:
                - link "Recently viewed products" [ref=f6e372] [cursor=pointer]:
                  - /url: /recentlyviewedproducts
              - menuitem [ref=f6e373]:
                - link "Compare products list" [ref=f6e374] [cursor=pointer]:
                  - /url: /compareproducts
              - menuitem [ref=f6e375]:
                - link "New products" [ref=f6e376] [cursor=pointer]:
                  - /url: /newproducts
            - heading "My account" [level=2] [ref=f6e377]
            - menu "My account" [ref=f6e378]:
              - menuitem [ref=f6e379]:
                - link "My account" [ref=f6e380] [cursor=pointer]:
                  - /url: /customer/info
              - menuitem [ref=f6e381]:
                - link "Orders" [ref=f6e382] [cursor=pointer]:
                  - /url: /order/history
              - menuitem [ref=f6e383]:
                - link "Addresses" [ref=f6e384] [cursor=pointer]:
                  - /url: /customer/addresses
              - menuitem [ref=f6e385]:
                - link "Shopping cart" [ref=f6e386] [cursor=pointer]:
                  - /url: /cart
              - menuitem [ref=f6e387]:
                - link "Wishlist" [ref=f6e388] [cursor=pointer]:
                  - /url: /wishlist
              - menuitem [ref=f6e389]:
                - link "Apply for vendor account" [ref=f6e390] [cursor=pointer]:
                  - /url: /vendor/apply
        - generic [ref=f6e393]:
          - generic [ref=f6e394]:
            - text: 
            - paragraph [ref=f6e395]: "Korea Warehouse: 2001-12, 101, Jeongwang-dong,"
            - paragraph [ref=f6e396]: Siheung-si,Gyeonggi-do, Republic of Korea
          - generic [ref=f6e397]:
            - text: 
            - generic [ref=f6e398]: "Bangladesh Warehouse: 72, Arjatpara"
            - generic [ref=f6e399]: Road, Mohakhali, Dhaka – 1215
          - generic [ref=f6e400]:
            - text: 
            - generic [ref=f6e401]: "Bangladesh Retail Shop: Shop #07,"
            - generic [ref=f6e402]: Level-1, Block-C, SKS Tower, Mohakhali, Dhaka, Bangladesh
      - generic [ref=f6e405]:
        - generic [ref=f6e406]: Copyright © 2026 Your store name. All rights reserved.
        - img "Supported Cards" [ref=f6e408]
        - generic [ref=f6e409]:
          - text: Powered by
          - link "nopCommerce" [ref=f6e410] [cursor=pointer]:
            - /url: https://www.nopcommerce.com/
      - text:  
    - text:     
  - text: 
```

# Test source

```ts
  76  |   get termsOfServiceWarningModal() {
  77  |     return this.page.locator(sel(CHECKOUT_SELECTORS.termsOfServiceDialog));
  78  |   }
  79  | 
  80  |   // ─── Actions ──────────────────────────────────────────────────────────────
  81  | 
  82  |   /**
  83  |    * Helper: Dismiss any modal overlays strictly
  84  |    */
  85  |   async dismissModals(): Promise<void> {
  86  |     await super.dismissModals();
  87  |     const welcomeClose = this.page.locator('button.kdn-welcome-modal__close, .kdn-welcome-modal__close').first();
  88  |     if (await welcomeClose.isVisible({ timeout: 1500 }).catch(() => false)) {
  89  |       await welcomeClose.click({ force: true }).catch(() => {});
  90  |       await this.page.waitForTimeout(500);
  91  |     }
  92  |   }
  93  | 
  94  |   /**
  95  |    * Clears existing shopping cart strictly by deleting multiple items ONE BY ONE.
  96  |    */
  97  |   async clearCart(): Promise<void> {
  98  |     await this.page.goto('/cart');
  99  |     await this.waitForPageReady();
  100 |     await this.dismissModals();
  101 | 
  102 |     // Loop until cart is 100% empty (deleting items one by one)
  103 |     for (let loop = 0; loop < 10; loop++) {
  104 |       const removeCheckboxes = this.page.locator('input[name="removefromcart"]');
  105 |       const removeBtns = this.page.locator('button.remove-btn, .remove-from-cart input, button.remove-btn.cart-remove-btn');
  106 | 
  107 |       const cbCount = await removeCheckboxes.count();
  108 |       const btnCount = await removeBtns.count();
  109 | 
  110 |       if (cbCount === 0 && btnCount === 0) break;
  111 | 
  112 |       if (cbCount > 0) {
  113 |         // Delete item one by one
  114 |         await removeCheckboxes.first().check({ force: true }).catch(() => {});
  115 |         const updateCartBtn = this.page.locator('button[name="updatecart"], button.update-cart-button').first();
  116 |         if (await updateCartBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  117 |           await updateCartBtn.click({ force: true });
  118 |           await this.waitForPageReady();
  119 |           await this.dismissModals();
  120 |         } else {
  121 |           break;
  122 |         }
  123 |       } else if (btnCount > 0) {
  124 |         // Delete item one by one
  125 |         await removeBtns.first().click({ force: true }).catch(() => {});
  126 |         await this.waitForPageReady();
  127 |         await this.dismissModals();
  128 |       } else {
  129 |         break;
  130 |       }
  131 |     }
  132 |   }
  133 | 
  134 |   /**
  135 |    * Dynamically selects an in-stock product ONLY from the 12 eligible wholesale products.
  136 |    * Prioritizes high-value products first to satisfy the ৳10,000 threshold in a single fast pass.
  137 |    */
  138 |   async findAndNavigateToEligibleInStockProduct(preferHighValue: boolean = true): Promise<{ productName: string; pdpUrl: string }> {
  139 |     let candidateList = [...ELIGIBLE_WHOLESALE_PRODUCTS];
  140 | 
  141 |     if (preferHighValue) {
  142 |       const highValue = candidateList.filter(p => p.includes('MacBook') || p.includes('Asus') || p.includes('Ultrabook') || p.includes('Camera') || p.includes('Spectre') || p.includes('iPhone') || p.includes('S24'));
  143 |       const lowValue = candidateList.filter(p => !highValue.includes(p));
  144 |       candidateList = [...highValue.sort(() => Math.random() - 0.5), ...lowValue.sort(() => Math.random() - 0.5)];
  145 |     } else {
  146 |       candidateList.sort(() => Math.random() - 0.5);
  147 |     }
  148 | 
  149 |     for (const productName of candidateList) {
  150 |       const searchTerm = productName.split('—')[0].trim();
  151 |       await this.page.goto(`/search?q=${encodeURIComponent(searchTerm)}`);
  152 |       await this.waitForPageReady();
  153 |       await this.dismissModals();
  154 | 
  155 |       const productTitles = this.page.locator('.product-item .product-title a, .product-item a, .item-box a');
  156 |       const count = await productTitles.count();
  157 | 
  158 |       if (count === 0) continue;
  159 | 
  160 |       let foundHref = '';
  161 |       for (let i = 0; i < count; i++) {
  162 |         const link = productTitles.nth(i);
  163 |         const text = (await link.textContent().catch(() => '')) || '';
  164 |         if (text.toLowerCase().includes(searchTerm.toLowerCase()) || text.length > 0) {
  165 |           foundHref = (await link.getAttribute('href')) || '';
  166 |           if (foundHref) break;
  167 |         }
  168 |       }
  169 | 
  170 |       if (!foundHref) {
  171 |         foundHref = (await productTitles.first().getAttribute('href')) || '';
  172 |       }
  173 | 
  174 |       if (!foundHref) continue;
  175 | 
> 176 |       await this.page.goto(foundHref);
      |                       ^ Error: page.goto: Test timeout of 120000ms exceeded.
  177 |       await this.waitForPageReady();
  178 |       await this.dismissModals();
  179 | 
  180 |       const qtyInput = this.page.locator('input.qty-input, input[id*="EnteredQuantity"]').first();
  181 |       const addToCartBtn = this.page.locator('button.add-to-cart-button, button[id*="add-to-cart-button"]').first();
  182 | 
  183 |       const isQtyVisible = await qtyInput.isVisible({ timeout: 3000 }).catch(() => false);
  184 |       const isAddVisible = await addToCartBtn.isVisible({ timeout: 3000 }).catch(() => false);
  185 |       const isAddEnabled = isAddVisible ? await addToCartBtn.isEnabled().catch(() => false) : false;
  186 | 
  187 |       const pageText = (await this.page.locator('body').textContent().catch(() => '')) || '';
  188 |       const isOutOfStock = pageText.toLowerCase().includes('out of stock') || pageText.toLowerCase().includes('out-of-stock');
  189 | 
  190 |       if (isQtyVisible && isAddVisible && isAddEnabled && !isOutOfStock) {
  191 |         return { productName, pdpUrl: this.page.url() };
  192 |       }
  193 |     }
  194 | 
  195 |     await this.page.goto('/search?q=Apple');
  196 |     await this.waitForPageReady();
  197 |     await this.dismissModals();
  198 | 
  199 |     const fallbackLink = this.page.locator('.product-item .product-title a').first();
  200 |     const fallbackHref = (await fallbackLink.getAttribute('href').catch(() => '')) || '/';
  201 |     await this.page.goto(fallbackHref);
  202 |     await this.waitForPageReady();
  203 |     await this.dismissModals();
  204 | 
  205 |     return { productName: 'Apple MacBook Pro', pdpUrl: this.page.url() };
  206 |   }
  207 | 
  208 |   /**
  209 |    * Adds eligible product(s) to cart with dynamic quantity (10–15 per item) until cart subtotal meets/exceeds ৳10,000 threshold.
  210 |    */
  211 |   async addSufficientProductsToCart(): Promise<number> {
  212 |     const usedProducts: string[] = [];
  213 |     let lastQty = 10;
  214 | 
  215 |     for (let attempt = 0; attempt < 3; attempt++) {
  216 |       const { productName } = await this.findAndNavigateToEligibleInStockProduct(true);
  217 |       usedProducts.push(productName);
  218 | 
  219 |       const dynamicQty = Math.floor(Math.random() * 6) + 10;
  220 |       lastQty = dynamicQty;
  221 | 
  222 |       const qtyInput = this.page.locator('input.qty-input, input[id*="EnteredQuantity"]').first();
  223 |       await expect(qtyInput).toBeVisible({ timeout: 10000 });
  224 |       await qtyInput.click();
  225 |       await qtyInput.fill(dynamicQty.toString());
  226 | 
  227 |       const addToCartBtn = this.page.locator('button.add-to-cart-button, button[id*="add-to-cart-button"]').first();
  228 |       await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
  229 |       await addToCartBtn.click();
  230 | 
  231 |       await this.page.waitForSelector('#bar-notification.success, .bar-notification.success, .bar-notification', { timeout: 10000 }).catch(() => {});
  232 |       await this.page.waitForTimeout(1000);
  233 | 
  234 |       // Verify cart threshold on /cart
  235 |       await this.navigate();
  236 |       await this.waitForPageReady();
  237 | 
  238 |       const checkoutBtn = this.proceedToCheckoutButton;
  239 |       const isEnabled = await checkoutBtn.isEnabled({ timeout: 2000 }).catch(() => false);
  240 |       const pageText = (await this.page.locator('body').textContent().catch(() => '')) || '';
  241 |       const minNotMet = pageText.includes('Minimum order not met') || pageText.includes('Min: $10,000');
  242 | 
  243 |       if (isEnabled && !minNotMet) break;
  244 |     }
  245 | 
  246 |     return lastQty;
  247 |   }
  248 | 
  249 |   /**
  250 |    * Adds a small quantity (e.g. 1) of a low-cost eligible product (< ৳10,000) to verify min subtotal validation block (TC-CHK-005).
  251 |    */
  252 |   async addSmallQuantityToCart(qty: number = 1): Promise<void> {
  253 |     await this.clearCart();
  254 | 
  255 |     await this.page.goto('/search?q=a');
  256 |     await this.waitForPageReady();
  257 |     await this.dismissModals();
  258 | 
  259 |     const productCards = this.page.locator('.product-item, .item-box');
  260 |     const count = await productCards.count();
  261 |     let selectedHref = '';
  262 | 
  263 |     for (let i = 0; i < count; i++) {
  264 |       const card = productCards.nth(i);
  265 |       const priceText = (await card.locator('.actual-price, .price').first().textContent().catch(() => '')) ?? '';
  266 |       const cleanPrice = priceText.split('.')[0].replace(/[^0-9]/g, '');
  267 |       const numPrice = parseInt(cleanPrice, 10) || 0;
  268 | 
  269 |       if (numPrice > 0 && numPrice < 10000) {
  270 |         const link = card.locator('.product-title a, a').first();
  271 |         selectedHref = (await link.getAttribute('href')) || '';
  272 |         if (selectedHref) break;
  273 |       }
  274 |     }
  275 | 
  276 |     if (!selectedHref) {
```