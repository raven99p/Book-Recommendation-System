import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, wordpunct_tokenize
import time
from prettytable import PrettyTable

start = time.time()


sim = [[math.inf, 0.300, 0.150, 0.150, 0.100, 0.200, 0.250],
       [math.inf, math.inf, 0.150, 0.150, 0.000, 0.100, 0.350],
       [math.inf, math.inf, math.inf, 0.050, 0.050, 0.000, 0.050]]
#        [math.inf, math.inf, math.inf, math.inf, 0.150, 0.100, 0.200],
#        [math.inf, math.inf, math.inf, math.inf, math.inf, 0.000, 0.050],
#        [math.inf, math.inf, math.inf, math.inf, math.inf, math.inf, 0.250],
#        [math.inf, math.inf, math.inf, math.inf, math.inf, math.inf, math.inf]]


table = PrettyTable(
    ['book1', 'book2', 'book3', 'book4', 'book5', 'book6', 'book7'])

for rec in sim:
    table.add_row(rec)

print(table)

i = 1
group = []
group_to_sort = []
for book in sim:
    # get first book as pivot
    pivot = book[0]
    # books after the pivot
    for index, similarity in enumerate(book[i:]):
        obj = {"index": index, "similarity": similarity}
        group_to_sort.append(obj)
    # sorted list of similarities
    group_to_sort.sort(key=lambda x: x['similarity'], reverse=True)
    group.append(group_to_sort[:3])
    i += 1
    group_to_sort = []
print(group)