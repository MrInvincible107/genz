
from flask import Flask, jsonify, render_template, request
import json, os

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/shop')
def shop():
    return render_template('shop.html')

@app.route('/api/products')
def api_products():
    with open(os.path.join(app.static_folder, 'products.json'), 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/api/order', methods=['POST'])
def api_order():
    order = request.json or {}
    return jsonify({"status": "ok", "received": order})

if __name__ == '__main__':
    app.run(debug=True)
