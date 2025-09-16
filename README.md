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

## **Setup**

### **Dependencies**
```bash
npm install
```
Database & Sample Data
Tables

groceries: id, user_id, name, qty, size, category, created_at
product_prices: id, product_name, retailer_name, price, size
View: grocery_price_comparison (joins groceries with product_prices, calculates total cost)

Sample SQL
```
INSERT INTO product_prices (product_name, retailer_name, price, size) VALUES
('Chicken Breasts','Ralphs',2.99,'per lb'),
('Chicken Breasts','Whole Foods',7.99,'per lb'),
('Chicken Breasts','Walmart',2.49,'per lb'),
('Seedless Grapes','Vons',0.99,'per lb'),
('Milk','Walmart',2.78,'1 gallon');

INSERT INTO groceries (user_id, name, qty, size, category) VALUES
('<USER_ID>', 'Milk', 2, '1 gallon', 'dairy'),
('<USER_ID>', 'Chicken Breasts', 1, 'per lb', 'protein');
```
