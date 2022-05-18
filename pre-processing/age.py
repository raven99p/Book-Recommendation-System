import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\\ratings_v1.csv"
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

unique_age = df.age.values

fig, ax = plt.subplots(1, 1)
ax.hist(unique_age,  rwidth=0.5)

ax.set_title("Age")

ax.set_xlabel('Age')
ax.set_ylabel('number of people')

plt.show()
