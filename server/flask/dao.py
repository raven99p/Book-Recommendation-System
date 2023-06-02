import asyncio
from datetime import datetime
from pymongo import MongoClient
import json
import hashlib
from bson.json_util import dumps


def parse_json(data):
    return json.loads(dumps(data))


def get_similar_books(isbn):
    client = MongoClient(
        'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false')
    db = client.ecommerce
    similarities = db.similarities
    books = db.Books

    try:
        most_similar_books = similarities.find_one({'pivot_isbn': isbn})
        isbn_list = []
        for b in most_similar_books['most_similar']:
            isbn_list.append(b['isbn'])

        print(isbn_list)

        details = books.find({"isbn": {"$in": isbn_list}})

        if details:
            return parse_json(details)
        else:
            return []
    except:
        return []


def get_similar_books_with_clicks(list_of_isbns):
    client = MongoClient(
        'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false')
    db = client.ecommerce
    similarities = db.similarities
    books = db.Books

    try:
        most_similar_books = similarities.find(
            {'pivot_isbn': {"$in": list_of_isbns}})
        print(most_similar_books)
        isbn_list = []
        for b in most_similar_books:
            print('---------------------')
            print(b)
            for msb in b["most_similar"]:
                isbn_list.append(msb["isbn"])

        print(isbn_list)

        details = books.find({"isbn": {"$in": isbn_list}}).limit(
            3).sort("averageRating", -1)

        if details:
            return parse_json(details)
        else:
            return []
    except:
        return []
