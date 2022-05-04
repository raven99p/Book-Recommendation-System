import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\data_v1.csv"
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



df.age = df.age.apply(lambda x: int(x))

print(df.age)

df.to_csv(
    "C:\\Users\pauli\Work\Book Recommendation System\dataset\data_v2.csv", index=False)
