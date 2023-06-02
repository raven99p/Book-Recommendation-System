import pandas as pd 

path = "C:\\Users\pauli\Work\Book Recommendation System\data\original_ratings_wo_9.csv"

df = pd.read_csv(path, usecols=['isbn','rating'] ,encoding='utf8')

ratings = df.groupby('isbn').mean()

ratings = ratings[ratings.rating >= 7.5]

ratings.to_csv("C:\\Users\pauli\Work\Book Recommendation System\jaccard sim\good_books.csv")