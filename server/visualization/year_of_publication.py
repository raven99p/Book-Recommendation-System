import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\Preprocessed_data.csv"
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

unique_year_of_publication = df.year_of_publication.values

# print(unique_location)

# print(x for x in unique_location if str(x).isnumeric())

# for x in unique_location:

#     if str(x).isnumeric():
#         print(x)

fig, ax = plt.subplots(1, 1)
ax.hist(unique_year_of_publication, bins=20, rwidth=0.5)

ax.set_title("year_of_publication")

ax.set_xlabel('year_of_publication')
ax.set_ylabel('number of people')

plt.show()
