
import numpy as np  # to get unique shhingles of list
import random  # to get permutations of Matrix
import math  # infinity
import collections  # check if signature parts, contain same elements
import mmh3
from itertools import combinations
import pandas as pd
from prettytable import PrettyTable
from itertools import groupby

lst = [
    [
        {
            "pivot": 0,
            "index": 1,
            "similarity": 0.45
        },
        {
            "pivot": 0,
            "index": 6,
            "similarity": 0.4
        },
        {
            "pivot": 0,
            "index": 2,
            "similarity": 0.25
        }
    ],
    [
        {
            "pivot": 1,
            "index": 6,
            "similarity": 0.35
        },
        {
            "pivot": 1,
            "index": 4,
            "similarity": 0.25
        },
        {
            "pivot": 1,
            "index": 3,
            "similarity": 0.2
        }
    ],
    [
        {
            "pivot": 2,
            "index": 6,
            "similarity": 0.4
        },
        {
            "pivot": 2,
            "index": 3,
            "similarity": 0.05
        },
        {
            "pivot": 2,
            "index": 4,
            "similarity": 0.05
        }
    ],
    [
        {
            "pivot": 3,
            "index": 4,
            "similarity": 0.35
        },
        {
            "pivot": 3,
            "index": 6,
            "similarity": 0.1
        },
        {
            "pivot": 3,
            "index": 5,
            "similarity": 0.05
        }
    ],
    [
        {
            "pivot": 4,
            "index": 6,
            "similarity": 0.05
        },
        {
            "pivot": 4,
            "index": 5,
            "similarity": 0.0
        }
    ],
    [
        {
            "pivot": 5,
            "index": 6,
            "similarity": 0.0
        }
    ]
]

temp_sim_books = []
groups = []
for book_index in lst:
    # print(book_index)
    pivot = book_index[0]["pivot"]
    for sim in book_index:
        temp_sim_books.append({"index": sim["index"], "similarity": sim["similarity"]})
    groups.append({"book_id": pivot, "most_similar":temp_sim_books})
    temp_sim_books = []

print(groups)