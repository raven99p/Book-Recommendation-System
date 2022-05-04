import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\summaries.csv"
pd.options.display.max_colwidth = 400

df = pd.read_csv(path, usecols=['isbn', 'Summary', ], dtype={'id':int})



df = df.drop_duplicates()

df = df.sort_values(by=['isbn'])

print(df)


df.to_csv("C:\\Users\pauli\Work\Book Recommendation System\dataset\summaries.csv")