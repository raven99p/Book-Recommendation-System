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
    db = client.book_similarities
    users = db.similarities
    book = users.find_one({'pivot_isbn': isbn})
    if book:
        return parse_json(book)
    else:
        return False
   
