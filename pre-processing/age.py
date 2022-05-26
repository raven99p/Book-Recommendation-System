import pandas as pd
import numpy as np
import math

path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\\ratings_v2.csv"
pd.options.display.max_colwidth = 400

df = pd.read_csv(path, dtype={'id': int})

bins = [0, 22, 35, 42, 52, 62, 100]
labels = ['teen', 'young_aduts', 'adults', 'middle_aged', 'older_udults', 'elderly']
df['AgeGroup'] = pd.cut(df['age'], bins=bins, labels=labels, right=False)
print(df[['age', 'AgeGroup']][:6])

df.to_csv(
    "C:\\Users\pauli\Work\Book Recommendation System\dataset\\ratings_age_group.csv")
