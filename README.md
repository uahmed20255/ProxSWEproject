Prox Grocery Price Comparison App – Track B
Project Overview

This mobile app allows users to manage a grocery list and find the best prices across multiple stores. Built with React Native / Expo, it features Prox branding, authentication, and grocery list functionality backed by Supabase.

Key Goals:

Provide a clean, professional mobile experience

Enable users to track groceries, search, and manage their list

Allow users to find the cheapest total basket across multiple retailers

Features
1. Branding & App Shell

Expo/React Native mobile app

Prox brand colors and professional UI

Home screen navigation:

Grocery List

Price Comparison

Sign In / Sign Out

2. Authentication System

Email/password sign up & login via Supabase Auth

"Continue as Guest" option with local session fallback

Proper sign-out functionality

3. Grocery List (Manual Entry)

Add Item Form:

Name (required)

Size (optional)

Category dropdown: produce, protein, snacks, pantry, household

Quantity (number input)

List View:

Displays all grocery items

Search functionality

Sorting by name (A-Z) or category

Add/remove items

Persistent data for logged-in users via Supabase

4. Data Model

Tables:

profiles: id, email

grocery_items: id, user_id, name, size, category, qty, created_at

product_prices: id, product_name, retailer_name, price, size, updated_at

5. Price Comparison Feature

"Find Best Prices" screen shows grocery items with pricing across multiple retailers

Users can adjust 1-5 retailers:

1 = cheapest single store

2 = best 2 stores, etc.

Displays total basket cost and which stores to visit

Setup Instructions

Clone the repository:

git clone https://github.com/uahmed20255/ProxSWEproject.git
cd ProxSWEproject


Install dependencies:

npm install


Supabase Setup:

Create a Supabase project

Add tables and seed product prices (see SQL below)

Copy supabaseUrl and supabaseAnonKey into lib/supabase.js

Run the app:

npm start


Launch on Expo Go app or simulator

Technical Decisions

React Native / Expo: Cross-platform mobile development

Supabase: Authentication & persistent storage

DropDownPicker: Select number of stores in Price Comparison

State Management: useState and useEffect

Price Calculation: calculateBestBasket function finds cheapest items across multiple stores

Challenges & Solutions

Dropdown overlap on UI: Solved with DropDownPicker and zIndex

Multiple store price calculation: Fixed logic to sum cheapest items across all groceries

Data persistence for guest users: Implemented local session fallback

Database Setup & Sample Data
1. Tables

Groceries Table

CREATE TABLE groceries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  qty int NOT NULL DEFAULT 1,
  size text,
  category text CHECK (LOWER(category) IN ('produce','protein','snacks','pantry','household','dairy','bakery','meat')),
  created_at timestamp DEFAULT now()
);


Product Prices Table

CREATE TABLE product_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  retailer_name text NOT NULL,
  price numeric(10,2) NOT NULL,
  size text
);


Indexes

CREATE INDEX idx_groceries_user ON groceries(user_id);
CREATE INDEX idx_prices_product ON product_prices(product_name);


View for Price Comparison

CREATE OR REPLACE VIEW grocery_price_comparison AS
SELECT 
  g.id AS grocery_id,
  g.user_id,
  g.name AS grocery_item,
  g.qty,
  g.size,
  g.category,
  p.retailer_name,
  p.price,
  p.size AS price_size,
  (p.price * g.qty) AS total_cost
FROM groceries g
JOIN product_prices p
  ON LOWER(g.name) = LOWER(p.product_name);

2. Seed Product Prices
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


Sample Groceries for Testing

INSERT INTO groceries (user_id, name, qty, size, category) VALUES
('<replace-with-user-id>', 'Milk', 2, '1 gallon', 'dairy'),
('<replace-with-user-id>', 'Boneless Skinless Chicken Breasts', 1, 'per lb', 'protein'),
('<replace-with-user-id>', 'Seedless Grapes', 3, 'per lb', 'produce');


Note: Replace <replace-with-user-id> with the actual id of a signed-up Supabase user.

Reviewer Instructions

Create a Supabase project.

Run the SQL script to create tables and seed product_prices.

Sign up a test user to get a valid user_id.

Optionally insert some test groceries for that user.

Run the app, sign in, and verify the price comparison feature.
