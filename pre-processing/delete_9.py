import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
path = "C:\\Users\pauli\Work\Book Recommendation System\data\\original_ratings.csv"
pd.options.display.max_colwidth = 400

df = pd.read_csv(path, usecols=['user_id',
                                'location',
                                'age',
                                'isbn',
                                'rating',
                                'book_title',
                                'book_author',
                                'year_of_publication',
                                'publisher',
                                'img_s',
                                'img_m',
                                'img_l',
                                'Summary',
                                'Language',
                                'Category',
                                'city',
                                'state',
                                'country', ])

unique_Language = df.Language.values



df = df[(df.Language != '9') & (df.Category != '9') & (df.Summary != '9')]

print(df)

df.to_csv(
    "C:\\Users\pauli\Work\Book Recommendation System\data\\original_ratings_wo_9.csv", index=False)
