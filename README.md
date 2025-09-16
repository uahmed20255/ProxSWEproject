# **Prox Grocery Price Comparison App – Track B**

## **Project Overview**
This mobile app allows users to manage a **grocery list** and find the **best prices** across multiple stores. Built with **React Native / Expo**, it features **Prox branding**, **authentication**, and **grocery list functionality** backed by **Supabase**.

**Key Goals:**
- Provide a **clean, professional mobile experience**
- Enable users to **track groceries**, **search**, and **manage their list**
- Allow users to find the **cheapest total basket** across multiple retailers

---

## **Features**

### **Branding & App Shell**
- **Expo / React Native** mobile app
- **Prox brand colors** and professional UI
- Home screen with clear navigation:
  - **Grocery List**
  - **Price Comparison**
  - **Sign In / Sign Out**

### **Authentication System**
- **Email/password sign up & login** via Supabase Auth
- **Continue as Guest** option with a local session
- **Proper sign-out functionality**

### **Grocery List (Manual Entry)**
**Add Item Form:**
- **Name** (required)
- **Size** (optional)
- **Category dropdown:** produce, protein, snacks, pantry, household
- **Quantity** (number input)

**List View:**
- Displays **all grocery items**
- **Search functionality**
- **Sorting by name (A-Z)** or category
- **Add/remove items**
- **Persistent data** for logged-in users via Supabase

### **Data Model**
**Tables:**
- **profiles:** id, email
- **grocery_items:** id, user_id, name, size, category, qty, created_at
- **product_prices:** id, product_name, retailer_name, price, size, updated_at

### **Price Comparison Feature**
- "**Find Best Prices**" screen shows grocery items with **pricing across multiple retailers**
- Users can adjust **1-5 retailers**:
  - 1 = cheapest single store
  - 2 = best 2 stores, etc.
- Displays **total basket cost** and **which stores to visit**

---

## **Setup Instructions & Database**

**Install Dependencies:**  
```bash
  npm install



## **Supabase Setup**
- **Create a Supabase project**
- **Add tables:** `profiles`, `grocery_items`, `product_prices`
- **Copy `supabaseUrl` and `supabaseAnonKey`** into `lib/supabase.js`

## **Run the App**
```bash
npm start


## **Launch**
- Launch on **Expo Go app** or simulator

## **Database Schema & Sample Data**

### **groceries** (linked to Supabase Auth users)
| Column     | Type      | Notes |
|-----------|-----------|-------|
| id        | UUID      | Primary key, default generated |
| user_id   | UUID      | References auth.users(id) |
| name      | text      | Required |
| qty       | int       | Required, default 1 |
| size      | text      | Optional |
| category  | text      | Must be one of: produce, protein, snacks, pantry, household, dairy, bakery, meat |
| created_at| timestamp | Default now |

### **product_prices**
| Column        | Type    | Notes |
|---------------|--------|-------|
| id            | UUID    | Primary key, default generated |
| product_name  | text    | Required |
| retailer_name | text    | Required |
| price         | numeric | Required |
| size          | text    | Optional |

### **View: grocery_price_comparison**
- Joins **groceries** with **product_prices** for price comparison  
- Includes: `grocery_id`, `user_id`, `grocery_item`, `qty`, `category`, `retailer_name`, `price`, `total_cost` (price × qty)

### **Sample Product Pricing Data**
```sql
INSERT INTO product_prices (product_name, retailer_name, price, size) VALUES
('Boneless Skinless Chicken Breasts','Ralphs',2.99,'per lb'),
('Boneless Skinless Chicken Breasts','Whole Foods',7.99,'per lb'),
('Boneless Skinless Chicken Breasts','Walmart',2.49,'per lb'),
('Seedless Grapes','Vons',0.99,'per lb'),
('Seedless Grapes','Sprouts',1.49,'per lb'),
('Seedless Grapes','Walmart',1.28,'per lb'),
('Organic Avocados','Whole Foods',1.49,'each'),
('Organic Avocados','Sprouts',1.25,'each'),
('Organic Avocados','Ralphs',1.99,'each'),
('Milk','Walmart',2.78,'1 gallon'),
('Milk','Aldi',2.45,'1 gallon'),
('Milk','Ralphs',3.29,'1 gallon');

## **Sample Grocery Items**  
*(replace `<USER_ID>` with actual Supabase user ID)*

```sql
INSERT INTO groceries (user_id, name, qty, size, category) VALUES
('<USER_ID>', 'Milk', 2, '1 gallon', 'dairy'),
('<USER_ID>', 'Boneless Skinless Chicken Breasts', 1, 'per lb', 'protein'),
('<USER_ID>', 'Seedless Grapes', 3, 'per lb', 'produce');



## **Technical Decisions**
- **React Native / Expo:** Cross-platform mobile app development
- **Supabase:** Authentication & persistent storage
- **DropDownPicker:** Select number of stores in Price Comparison
- **State Management:** `useState` and `useEffect` for simplicity
- **Price Calculation:** `calculateBestBasket` function finds cheapest items across groceries

## **Challenges & Solutions**
- **Dropdown overlap on UI:** Solved with DropDownPicker and zIndex
- **Multiple store price calculation:** Fixed logic to sum cheapest items across groceries
- **Data persistence for guest users:** Implemented local session fallback


