import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, wordpunct_tokenize
import time

start = time.time()

path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\Preprocessed_data.csv"
path_summaries = "C:\\Users\pauli\Work\Book Recommendation System\dataset\isbn_sum_cat.csv"
path_books = "C:\\Users\pauli\Work\Book Recommendation System\dataset\\books.csv"
pd.options.display.max_colwidth = 400



summaries = pd.read_csv(path, usecols=['isbn', 'Summary', 'Category' ],dtype={'isbn': str})

summaries = summaries.drop_duplicates()

summaries = summaries[summaries.Category != '9']

books =  pd.read_csv(path_books, sep=';',dtype={'isbn': str},encoding = "ISO-8859-1")

merged = pd.merge(books, summaries, on='isbn', how='left')

end = time.time()
print('Joined in :: ',end - start, ' seconds')

print(books.head())



print('summaries', len(summaries))
print('books', len(books))
print('merged', len(merged))
merged.to_csv(
    "C:\\Users\pauli\Work\Book Recommendation System\dataset\\books_website.csv")
