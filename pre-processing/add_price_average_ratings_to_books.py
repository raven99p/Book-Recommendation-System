import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, wordpunct_tokenize
import time

start = time.time()


path_books = "C:\\Users\pauli\Work\Book Recommendation System\data\\books.csv"
path_average_ratings = "C:\\Users\pauli\Work\Book Recommendation System\data\\average_ratings.csv"
pd.options.display.max_colwidth = 400



books = pd.read_csv(path_books, dtype={'id': int, 'isbn':str})

average_ratings =  pd.read_csv(path_average_ratings, dtype={'isbn':str})


merged = pd.merge(books, average_ratings, on='isbn', how='left')

end = time.time()
print('Joined in :: ',end - start, ' seconds')

merged['price'] = 15


print('books', len(books))
print('average_ratings', len(average_ratings))
print('merged', len(merged))

merged.to_csv("C:\\Users\pauli\Work\Book Recommendation System\data\\books_complete.csv")
