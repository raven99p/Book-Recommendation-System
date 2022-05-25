import pandas as pd
import numpy as np
import math

path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\\ratings_age_group_v2.csv"
pd.options.display.max_colwidth = 400

df = pd.read_csv(path, usecols=['user_id', 'AgeGroup','Category', 'country'], dtype={'id': int})

df.dropna(inplace=True)

df_category_group = df.groupby('user_id')['Category'].apply(lambda x: list(set(list(x)))).to_frame()

df_category_group["user_id"] = df_category_group.index

df_category_group.index.name = 'id'

merged = pd.merge(df_category_group, df, on='user_id', how='left')


merged = merged.drop(columns=['Category_y'])

merged = merged.rename(columns={"Category_x": "category"})

merged = merged.drop_duplicates(subset=['user_id'], ignore_index = True)


print(merged.columns)
print(merged)



merged.to_csv(
    "C:\\Users\pauli\Work\Book Recommendation System\dataset\\KmeansReady.csv",index=False)
