import pandas as pd 

path_ratings = 'C:\\Users\pauli\Work\Book Recommendation System\Clustering\dataset\\original_ratings_wo_9_category_format.csv'

ratings = pd.read_csv(path_ratings, usecols=['user_id','age','city' ,'isbn','book_title', 'Category', 'rating'])

# get unique user ids
unique_user_ids = ratings.user_id.unique()
unique_categories = ratings.Category.unique()

# print('length of categories :: ', len(unique_categories))
# for user_id in unique_user_ids[:3]:
#     print('user :: ', user_id)
#     for category in unique_categories:
#         print(category)
#         # temp_ratings = ratings[(ratings.user_id == user_id) & (ratings.Category == category)]


# df = ratings.groupby(['Category'])['Category'].count()
df = ratings.groupby('Category').size().sort_values(ascending=False)

# df = df.sort_values(by = 'Category')
print(df.head(15))