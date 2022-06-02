from dao import *
from flask import Flask, request
from flask import jsonify
import pandas as pd
# from ..Clustering.clustering import *
import sys

sys.path.insert(1, "C:\\Users\\pauli\Work\Book Recommendation System\\Clustering")
import clustering

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


@app.route('/addReview', methods=["POST"])
def addReview():
    # user_data = {"user_id": int,
    #                          "age": float,
    #                          "country": int code,
    #                          "isbn": string,
    #                          "category": string,
    #                          "rating": float}
    data = request.get_json()
    # print(data)
    clustering.update_tables(data)
    clustering.create_cluster()
    # create review

    #update cluster table 


    #cluster
    
    # print(data['isbn_list'])
    # similar_book_list = get_similar_books_with_clicks(data['isbn_list'])
    return jsonify({'message': 'similar_book_list'})
