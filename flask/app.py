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


@app.route('/findSimilarBooksClicks', methods=["POST"])
def findSimilarBooksClicks():
    data = request.get_json()
    print(data['isbn_list'])
    similar_book_list = get_similar_books_with_clicks(data['isbn_list'])
    return jsonify({'message': similar_book_list})
