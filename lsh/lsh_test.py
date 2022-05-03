from sklearn.datasets import fetch_20newsgroups
import numpy as np  # to get unique shhingles of list
import random  # to get permutations of Matrix
import math  # infinity
import collections  # check if signature parts, contain same elements
import mmh3
from itertools import combinations


def main():

    Doc_ready = 2
    shingle_size = 2

    # SHINGLES CREATION
    # , 'soc.religion.christian','comp.graphics', 'sci.med']
    categories = ['alt.atheism']
    # Here you can delete the "] #" from the above line in order to gather Documents
    # from 3 extra categories

    temp = fetch_20newsgroups(
        subset='train', categories=categories, shuffle=False, random_state=42)
    Doc = []

    data = ['I am a man who hates politics and i love kicking doors down with force and killing insects',
            'I am a man who hates kicking doors and i love politics and not killing insects']

    for i in range(Doc_ready):  # for every document
        File = data[i].replace('\n', '')
        File = File.replace('\t', '')
        shingles = []
        sets = ''
        for x in range(len(File)-shingle_size):
            for y in range(shingle_size):
                sets = sets + File[x+y]
            shingles.append(sets)
            sets = ''
        Doc.append(shingles)

    # Now Doc contains in every cell, the shingles of every file. #
    # Doc[]=Shingles of single document,
    #    [][]=Shingle of shingles of single document
    # first index is also the id of the document

    ###########################################

    def unique(list_arg):  # get unique elements from List
        x = np.array(list_arg)
        return np.unique(x)

    # Create Universe of Sets

    U = []
    for i in range(Doc_ready):
        Doc[i] = unique(Doc[i])
        temp = unique(Doc[i])
        U.extend(temp)
    U = unique(U)

    ###########################################

    # Create Matrix

    M = [[0 for x in range(Doc_ready)] for y in range(len(U))]

    for i in range(Doc_ready):
        for j in range(len(U)):
            if U[j] in Doc[i]:
                M[j][i] = 1
                continue
            else:
                M[j][i] = 0
                continue

    print('\n'.join([''.join(['{:4}'.format(item) for item in row])
                     for row in M]))

    # Getting actual Jaccard Sim value
    # Accessing Shingles Correlation Matrix and compairing all values

    # Creating Jac Sim Matrix

    def comp_shingles(a, b, M,):
        same = 0
        count = 0
        for i in range(len(U)):
            if M[i][a] + M[i][b] == 1:
                count += 1
            if M[i][a] + M[i][b] == 2:
                count += 1
                same += 1
        return "%.4f" % (same/(count))

    JS = [[0 for x in range(Doc_ready)] for y in range(Doc_ready)]

    for i in range(Doc_ready):
        start = 0
        while start < Doc_ready:
            JS[i][start] = comp_shingles(i, start, M)
            start = start+1

    print("\nJaccard Similarity Matrix \n")
    print('\n'.join([''.join(['{:8}'.format(item) for item in row])
                     for row in JS]))

    ####################

    # Creating the Hash functions

    # Find first prime greater than the number of unique shingles

    def findPrime(N):
        while True:
            if isPrime(N):
                return N
            else:
                N = N + 1

    def isPrime(n):
        d = n - 1
        s = 0
        while not d & 1:
            s += 1
            d >>= 1
        for a in (2, 13, 23, 1662803):
            if pow(a, d, n) != 1 and all(pow(a, (1 << r) * d, n) != n - 1 for r in range(0, s)):
                return False
        return True

    #########################

    hash_number = 20  # number of hash functions

    hash_table = [[0 for x in range(2)] for y in range(hash_number)]

    p = findPrime(len(U))  # prime number

    # Filling hash_table with random numbers from [-100.000,100.000]

    for i in range(2):
        for j in range(hash_number):
            hash_table[j][i] = random.randint(-100000, 100000)

    # hi(x) = (ai*x + bi) % p

    def hashF(r, c, sig):
        for i in range(hash_number):
            h = (hash_table[i][0] * r + hash_table[i][1]) % p
            if h < sig[i][c]:
                sig[i][c] = h

    ################################

    # Creating Signature Matrix

    Sig = [[math.inf for x in range(Doc_ready)] for y in range(hash_number)]

    #print("\nSignature Matrix \n")

    for i in range(Doc_ready):
        for j in range(len(U)):
            if M[j][i] == 1:
                hashF(j, i, Sig)

    print('\n'.join([''.join(['{:4}'.format(item) for item in row])
                     for row in Sig]))

    #####################

    # LSH

    b = 10
    r = len(Sig)//b

    buckets = hash_number

    k = [[0 for x in range(Doc_ready)] for y in range(buckets)]

    # From list to bucket
    def hash(temp_list):
        temp = ""
        for i in temp_list:
            temp += str(i)
        h = mmh3.hash(temp)
        h = h % buckets
        return h

    # Get specific column of Band
    def getC(start, col, sig):
        temp = ""
        for i in range(start, start + r):
            temp += str(sig[i][col])
        return temp

    # Hashing Bands
    for j in range(b):
        start = 0
        while start < Doc_ready:
            curr = getC(r*j, start, Sig)
            index = hash(curr)
            k[index][start] = 1
            start = start+1
    #print("\nCorrelation Matrix\n")
    # K buckets filled with 1 at row=bucket column = Document id

    print('\n'.join([''.join(['{:4}'.format(item) for item in row])
                     for row in k]))

    Sim = [[math.inf for x in range(Doc_ready)] for y in range(Doc_ready)]

    # Read Correlation Matrix and compare documents which are in the same bucket

    def comp(a, b):
        same = 0
        for i in range(hash_number):
            if Sig[i][a] == Sig[i][b]:
                same += 1
        return "%.3f" % (same/hash_number)

    # Reading CM
    for i in range(buckets):
        candidate = []
        for j in range(Doc_ready):
            if k[i][j] == 1:
                candidate.append(j)  # list of Documents to be compared
        if len(candidate) >= 2:  # if there are more than 2 documents then compare, else dont compare, as you can not compare 1 or 0 documents
            comb = list(combinations(candidate, 2))
            for c in comb:
                if Sim[c[0]][c[1]] == math.inf:
                    Sim[c[0]][c[1]] = comp(c[0], c[1])

    print("\nLSH Similarity Matrix\n")
    print('\n'.join([''.join(['{:10}'.format(item)
          for item in row]) for row in Sim]))
    return Sim


main()
