from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import re
from transformers import pipeline
from langchain_huggingface import HuggingFacePipeline
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

app = Flask(__name__)

# Enable CORS for frontend only
CORS(app, resources={r"/chat": {"origins": "http://localhost:3000"}})

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="system",
    database="product_supplier_db"
)

# Hugging Face summarization model
summarizer_pipeline = pipeline("summarization", model="facebook/bart-large-cnn")
summarizer = HuggingFacePipeline(pipeline=summarizer_pipeline)

# Process user queries and fetch data
def process_query(query):
    cursor = db.cursor(dictionary=True)
    try:
        if "products under brand" in query.lower():
            # Extract brand name using regex
            match = re.search(r"brand\s+(.+)", query, re.IGNORECASE)
            if match:
                brand = match.group(1).strip()
                print(f"Extracted brand: {brand}")  # Debug log
                cursor.execute("SELECT * FROM products WHERE brand = %s", (brand,))
            else:
                return {"error": "Unable to extract brand from query."}
        elif "suppliers provide" in query.lower():
            # Extract category
            category = query.split("provide")[-1].strip()
            print(f"Extracted category: {category}")  # Debug log
            cursor.execute("SELECT * FROM suppliers WHERE FIND_IN_SET(%s, product_categories)", (category,))
        elif "details of product" in query.lower():
            # Extract product name
            product_name = query.split("product")[-1].strip()
            print(f"Extracted product name: {product_name}")  # Debug log
            cursor.execute("SELECT * FROM products WHERE name = %s", (product_name,))
        else:
            return {"error": "Query not understood."}

        # Fetch results
        results = cursor.fetchall()
        if results:
            print(f"Database results: {results}")  # Debug log
            return {"data": results, "summary": generate_response(query, results)}
        else:
            return {"error": "No data found for the query."}
    except Exception as e:
        return {"error": str(e)}
    finally:
        cursor.close()

def generate_response(query, results):
    # Check query type and summarize accordingly
    if "products under brand" in query.lower():
        # Extract brand from the query
        brand = query.split("brand")[-1].strip()
        formatted_results = "\n".join(
            f"- {result['name']}: {result['description']} (${result['price']})"
            for result in results
        )
        summary = (
            f"The following products are offered by {brand}:\n"
            f"{formatted_results}\n"
            "These products are known for their excellent quality and reasonable pricing."
        )

    elif "suppliers provide" in query.lower():
        # Extract category from the query
        category = query.split("provide")[-1].strip()
        formatted_results = "\n".join(
            f"- {result['name']} (Contact: {result['contact_info']})"
            for result in results
        )
        summary = (
            f"The following suppliers provide {category}:\n"
            f"{formatted_results}\n"
            "You can reach out to these suppliers for more details or bulk orders."
        )

    elif "details of product" in query.lower():
        formatted_results = "\n".join(
            f"- {result['name']} ({result['category']}): {result['description']} priced at ${result['price']}"
            for result in results
        )
        summary = (
            f"Here are the details of the requested product:\n"
            f"{formatted_results}\n"
            "For further information, please contact the supplier."
        )

    else:
        # Fallback for queries that don't match any expected pattern
        summary = "I couldn't understand the query. Please try rephrasing it."

    # Log the generated summary for debugging
    print(f"Generated summary: {summary}")
    return summary

# Flask route for the chatbot
@app.route("/chat", methods=["POST"])
def chat():
    user_query = request.json.get("query")
    print(f"Received query: {user_query}")  # Debug log
    response = process_query(user_query)
    print(f"Response sent: {response}")  # Debug log
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
