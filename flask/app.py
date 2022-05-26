from dao import *
from flask import Flask, request
from flask import jsonify
import pandas as pd

app = Flask(__name__)


@app.route('/findSimilarBooks', methods=["POST"])
def findSimilarBooks():
    data = request.get_json()
    print(data['isbn'])
    similar_book_list = get_similar_books(data['isbn'])
    return jsonify({'message': similar_book_list})
