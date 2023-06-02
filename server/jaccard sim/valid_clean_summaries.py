import pandas as pd 

path_clean_summaries = "C:\\Users\pauli\Work\Book Recommendation System\jaccard sim\clean_summaries.csv"
path_good_books = "C:\\Users\pauli\Work\Book Recommendation System\jaccard sim\good_books.csv"

clean_summaries = pd.read_csv(path_clean_summaries, encoding='utf8', dtype={'isbn': str})
good_books = pd.read_csv(path_good_books, encoding='utf8', dtype={'isbn': str})

good_book_isbn_list = good_books.isbn.values

print('clean_summaries total :: ',len(clean_summaries))

clean_summaries = clean_summaries[clean_summaries.isbn.isin(good_book_isbn_list)]

print('clean_summaries valid :: ', len(clean_summaries))

print('good_books',len(good_books))

clean_summaries.to_csv("C:\\Users\pauli\Work\Book Recommendation System\jaccard sim\\valid_clean_summaries.csv", index=False)