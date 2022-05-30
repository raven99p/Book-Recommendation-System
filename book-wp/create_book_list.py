import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, wordpunct_tokenize
import time

pd.options.display.max_colwidth = 400


path_original_ratings = "C:\\Users\pauli\Work\Book Recommendation System\data\original_ratings_wo_9.csv"
path_books = "C:\\Users\pauli\Work\Book Recommendation System\dataset\\books.csv"


# from original ratings get caregoty and summary
ratings = pd.read_csv(path_original_ratings, usecols=[
                      'isbn', 'Summary', 'Category'], dtype={'isbn': str})
ratings = ratings.drop_duplicates()
ratings['Category'] = ratings['Category'].apply(lambda x: x.split('\'')[1])


average_ratings = pd.read_csv(path_original_ratings, usecols=[
                              'isbn', 'rating'], dtype={'isbn': str})
average_ratings = average_ratings.groupby('isbn').mean()

average_ratings.rating = average_ratings.rating.apply(lambda x: x/2)

# print(average_ratings)

books = pd.read_csv(path_books, sep=';', dtype={
                    'isbn': str}, encoding="ISO-8859-1")


# add to books summary and category
merged = pd.merge(books, ratings, on='isbn', how='left')

#  add to books average rating
merged = pd.merge(merged, average_ratings, on='isbn', how='left')

merged['price'] = np.random.randint(5, 15, merged.shape[0])
merged['stock'] = np.random.randint(0, 5, merged.shape[0])

print(merged.columns)

merged = merged.rename(columns={"Book-Title": "title",
                                "Book-Author": "author",
                                "Year-Of-Publication": "YOP",
                                "Publisher": "publisher",
                                "Image-URL-S": "ImageS",
                                "Image-URL-M": "ImageM",
                                "Image-URL-L": "ImageL",
                                "Summary": "summary",
                                "Category": "category",
                                "rating": "averageRating"

                                }, errors="raise")

merged.to_csv(
    "C:\\Users\pauli\Work\Book Recommendation System\\book-wp\\books_complete_rating_5.csv")
