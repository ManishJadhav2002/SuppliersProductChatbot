# SuppliersProductChatbot
 This project is a chatbot application that allows users to interact with a backend API to retrieve data from a database and receive dynamic responses. The chatbot is styled with an attractive, responsive UI and greets users with a friendly welcome message.
 
Frontend
React.js: For building the interactive chatbot UI.
Axios: For making API requests to the backend.

Backend
Flask: Python web framework for handling API requests.
Flask-CORS: To handle cross-origin requests from the frontend.
Hugging Face Transformers: For natural language processing and summarization.

Database
MySQL: To store product and supplier data.

*Setup Instructions
  Backend Setup
  1.Navigate to the backend directory:
      cd chatbot_backend

  2.Install Python dependencies:
   pip install flask langchain langgraph mysql-connector-python transformers

  3.Set Up the Database: 
   
  CREATE DATABASE product_supplier_db;
USE product_supplier_db;

CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    contact_info VARCHAR(255),
    product_categories TEXT
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    brand VARCHAR(255),
    price DECIMAL(10, 2),
    category VARCHAR(255),
    description TEXT,
    supplier_id INT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Sample data
INSERT INTO suppliers (name, contact_info, product_categories) 
VALUES 
("Supplier A", "contact@supplierA.com", "laptops,mobiles"),
("Supplier B", "contact@supplierB.com", "furniture,electronics");

INSERT INTO products (name, brand, price, category, description, supplier_id) 
VALUES 
("Laptop Pro 2023", "Brand X", 1200.00, "laptops", "High-performance laptop", 1),
("Office Chair", "Brand Y", 150.00, "furniture", "Ergonomic office chair", 2);

 4.Start the Flask server:
 python app.py

    Frontend Setup
1.Navigate to the frontend directory:
 cd chatbot-frontend

2.Start the React development server:
   npm start

   How to Use
Open the frontend in your browser at http://localhost:3000.
Start a conversation by typing a query into the input box. Example queries:
"Show me all products under brand Brand X"
"Which suppliers provide laptops?"
"Give me details of product Laptop Pro 2023"
The chatbot will fetch data from the backend and respond dynamically.
