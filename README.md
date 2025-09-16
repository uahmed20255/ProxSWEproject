# **Prox Grocery Price Comparison App – Track B**

## **Overview**
A **React Native / Expo** mobile app that lets users manage a **grocery list** and find the **best prices** across multiple stores. Features include **Prox branding**, **authentication**, and **price comparison** backed by **Supabase**.

**Key Goals:**
- Clean, professional mobile experience  
- Track, search, and manage grocery lists  
- Find the **cheapest total basket** across retailers  

---

## **Features**
- **Branding & Navigation:** Home screen with **Grocery List**, **Price Comparison**, **Sign In/Out**  
- **Authentication:** Email/password login via **Supabase Auth**, **Guest session**, proper sign-out  
- **Grocery List:** Add items (name, size, category, quantity), search, sort, add/remove, persistent storage  
- **Price Comparison:** Select 1–5 stores, displays **total basket cost** and recommended stores  

---

## **Supabase Setup**
- Create a Supabase project
- Add tables: profiles, grocery_items, product_prices
- Copy supabaseUrl and supabaseAnonKey into lib/supabase.js

### **Run the App**
```bash
npm install
```
Launch on Expo Go app or simulator

### **Database & Sample Data**
### **Tables**
**groceries**
| Column     | Type      | Notes |
|-----------|-----------|-------|
| id        | UUID      | Primary key, default generated |
| user_id   | UUID      | References auth.users(id) |
| name      | text      | Required |
| qty       | int       | Required, default 1 |
| size      | text      | Optional |
| category  | text      | Must be one of: produce, protein, snacks, pantry, household, dairy, bakery, meat |
| created_at| timestamp | Default now |

**product_prices**
| Column        | Type    | Notes |
|---------------|--------|-------|
| id            | UUID    | Primary key, default generated |
| product_name  | text    | Required |
| retailer_name | text    | Required |
| price         | numeric | Required |
| size          | text    | Optional |

**View:** `grocery_price_comparison` – joins groceries with product_prices and calculates total cost

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
```

### **Sample Grocery Items**

(replace <USER_ID> with actual Supabase user ID)
```sql
INSERT INTO groceries (user_id, name, qty, size, category) VALUES
('<USER_ID>', 'Milk', 2, '1 gallon', 'dairy'),
('<USER_ID>', 'Chicken Breasts', 1, 'per lb', 'protein');
```

## **Setup Summary**
- Create Supabase project
- Add tables: profiles, grocery_items, product_prices
- Copy supabaseUrl and supabaseAnonKey into lib/supabase.js
- Install dependencies: `npm install`
- Run app: `npm start` and open in Expo Go or simulator

 
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
