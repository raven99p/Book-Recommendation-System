import pandas as pd 

path_ratings = 'C:\\Users\pauli\Work\Book Recommendation System\Clustering\dataset\\original_ratings_wo_9.csv'

ratings = pd.read_csv(path_ratings)


ratings.Category = ratings.Category.apply(lambda x: x.split('\'')[1])

print(ratings.Category)


ratings.to_csv('C:\\Users\pauli\Work\Book Recommendation System\Clustering\dataset\\original_ratings_wo_9_category_format.csv')