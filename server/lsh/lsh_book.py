from sklearn.datasets import fetch_20newsgroups
import numpy as np  # to get unique shhingles of list
import random  # to get permutations of Matrix
import math  # infinity
import collections  # check if signature parts, contain same elements
import mmh3
from itertools import combinations


def main(numOfArticles):

    Doc_ready = numOfArticles
    shingle_size = 3

    # SHINGLES CREATION
    # , 'soc.religion.christian','comp.graphics', 'sci.med']
    categories = ['alt.atheism']
    # Here you can delete the "] #" from the above line in order to gather Documents
    # from 3 extra categories

    temp = fetch_20newsgroups(
        subset='train', categories=categories, shuffle=False, random_state=42)
    Doc = []

    for i in range(Doc_ready):  # for every document
        File = temp.data[i].replace('\n', '')
        File = File.replace('\t', '')
        shingles = []
        sets = ''
        for x in range(len(File)-shingle_size):
            for y in range(shingle_size):
                sets = sets + File[x+y]
            shingles.append(sets)
            sets = ''
        Doc.append(shingles)

    # print(len(temp.data))

    data = np.array(temp.data)

    print(data.shape)

# The dataset is an array of emails


main(5)
