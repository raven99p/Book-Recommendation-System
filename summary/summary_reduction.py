import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, wordpunct_tokenize
import time

start = time.time()


path_summaries = "C:\\Users\pauli\Work\Book Recommendation System\dataset\summaries_v3_sorted.csv"
path_rating = "C:\\Users\pauli\Work\Book Recommendation System\dataset\data_v2.csv"
pd.options.display.max_colwidth = 400



summaries = pd.read_csv(path_summaries, usecols=['isbn', 'Summary', ], dtype={'id': int})

ratings =  pd.read_csv(path_rating, usecols=['isbn', 'rating', ], dtype={'rating': int})

ratings = ratings.groupby('isbn').mean()

merged = pd.merge(summaries, ratings, on='isbn')

end = time.time()
print('Joined in :: ',end - start, ' seconds')


merged = merged[merged.rating >= 7.5]




print('summaries', len(summaries))
print('ratings', len(ratings))
print('merged', len(merged))
merged.to_csv(
    "C:\\Users\pauli\Work\Book Recommendation System\dataset\summaries_v4.csv")
