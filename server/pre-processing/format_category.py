import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\\ratings_age_group.csv"
pd.options.display.max_colwidth = 400

df = pd.read_csv(path)





print(df.Category[:5])

df.to_csv(
    "C:\\Users\pauli\Work\Book Recommendation System\dataset\\ratings_age_group_v2.csv", index=False)
