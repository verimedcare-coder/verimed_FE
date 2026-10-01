# TechPropose Pharmacy Management System
## Client User Manual

Welcome to the **TechPropose Pharmacy Management System**, a comprehensive, cloud-based solution designed to streamline your pharmacy's operations, manage inventory, handle multi-location stock, and process sales efficiently.

This manual will guide you through the core features of the system and how to use them.

---

### 1. Getting Started

#### Creating an Organization
1. Go to the landing page and click **"Create Organization"**.
2. Enter your Business Name, Email, Phone Number, and a secure password.
3. Once registered, your unique Organization ID will be generated, and you will be logged into the Central Dashboard.

#### Logging In
- For daily operations, use the **Login** portal.
- Enter your registered Phone Number and Password to access your specific role's dashboard.

---

### 2. Multi-Store Architecture (Organizations & Locations)

Our system is built for both single-store pharmacies and multi-branch enterprises. 

* **Organizations:** Represents your top-level company.
* **Locations:** You can create multiple locations under your organization (e.g., Central Warehouse, Retail Branch, Main Store).
* **Location Setup:** Go to the **Locations** tab to add new branches and assign Managers to each branch. Stock can be tracked independently for each location.

---

### 3. Inventory & Products

Efficient inventory management is the heart of any pharmacy.

#### Adding Products
1. Navigate to the **Inventory > Products** page.
2. Click **Add Product** to enter details like the generic name, brand name, category, and minimum stock alerts.
3. You can also organize items into specific **Categories** (e.g., Syrups, Tablets, Injectables).

#### Batch & Expiry Management
Since medications have strict expiry dates, the system tracks stock at the **Batch** level.
- Go to the **Batches** page to enter new stock shipments. 
- You must enter the **Batch Number, Manufacturing Date, and Expiry Date** for every entry.
- The system will automatically prioritize selling older batches first (FEFO - First Expire, First Out) and send alerts for soon-to-expire medications.

---

### 4. Point of Sale (POS) & Sales

The POS interface is designed for high-speed retail checkouts.

* **Billing:** Go to the **POS** page. You can scan barcodes or type medication names to add them to the cart.
* **Stock Validation:** The POS will only allow you to sell items if there is sufficient stock in your specific location.
* **Cash Register:** At the start of the day, cashiers open the **Cash Register**. All cash, card, and UPI transactions are recorded. At the end of the shift, the register is closed, and variances are reported to management.
* **Customers:** You can save patient/customer profiles in the **Customers** tab to track their purchase history and loyalty points.

---

### 5. Purchases & Suppliers

To restock your inventory, use the Procurement module.

* **Suppliers:** Add your distributors and wholesale partners in the **Suppliers** tab.
* **Purchases:** When a truck arrives with new stock, go to **Purchases** and record the Purchase Invoice. Entering a purchase will automatically increase the stock in your inventory and create the respective batches.
* **Purchase Orders:** You can draft Purchase Orders (POs) when stock runs low and send them to suppliers before the stock arrives.

---

### 6. Stock Transfers & Indents (Multi-Branch)

For pharmacies with a Central Warehouse and retail branches, this feature is critical.

* **Stock Indents:** Retail branches can generate an "Indent" (a request for stock) when they run low on specific medicines. This request is sent to the Central Warehouse.
* **Stock Transfers:** The Central Warehouse reviews the Indents and creates a **Stock Transfer**. The warehouse dispatches the stock, reducing their inventory. When the retail branch receives the truck, they accept the transfer, increasing their local stock.

---

### 7. Staff Management & Roles

Control who has access to sensitive data.

* **Roles:** Go to the **Roles** tab to create custom access levels (e.g., Cashier, Store Manager, Warehouse Admin).
* **Users:** Go to the **Users / Staff Management** page to add your employees. Assign them a Role and link them to a specific Location so they can only see stock and sales for their own branch.

---

### 8. Analytics & Reports

Keep a pulse on your business health using the **Reports** and **Dashboard** tabs.

* **Central Dashboard:** Provides a bird's-eye view of total revenue, low stock warnings, and expiring batches across *all* branches.
* **Store Dashboard:** Provides branch-specific metrics for store managers.
* **Alerts:** Get instant notifications for inventory that has fallen below the minimum threshold or batches that are expiring within the next 30-90 days.

> [!TIP]
> **Need Help?**
> If you encounter any issues or need custom reports configured for your pharmacy, please reach out to the TechPropose support team.
