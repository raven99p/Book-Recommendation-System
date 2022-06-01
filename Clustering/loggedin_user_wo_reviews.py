import pandas as pd
import json
import math

path_reviews = 'C:\\Users\pauli\Work\Book Recommendation System\Clustering\dataset\\formatted_reviews.csv'
path_cluster_table = 'C:\\Users\pauli\Work\Book Recommendation System\Clustering\dataset\\cluster_table.json'
path_books = 'C:\\Users\pauli\Work\Book Recommendation System\Book-wp\\books_complete_rating_5.csv'


def truncate(number, digits) -> float:
    stepper = 10.0 ** digits
    return math.trunc(stepper * number) / stepper

unique_categories = ['Fiction',
                     'Juvenile Fiction',
                     'Biography & Autobiography',
                     'Humor',
                     'History',
                     'Religion',
                     'Juvenile Nonfiction',
                     'Social Science',
                     'Body, Mind & Spirit',
                     'Business & Economics',
                     'Family & Relationships',
                     'Self-Help',
                     'Health & Fitness',
                     'Cooking ',
                     'Travel']




def get_books_logged_user_no_reviews(age, country, category):

    reviews = pd.read_csv(path_reviews,usecols=['user_id', 'isbn'])
    books = pd.read_csv(path_books)
    ct = pd.read_json(path_cluster_table)
    # Get all users with the same country
    ct = ct[ct.country == country]

    # get top 100 users with most liked category = category
    ct = ct.sort_values(by=category, ascending=False)
    ct = ct[:100]
    
    ct = ct.iloc[(ct['age']-age).abs().argsort()[:5]]
    # get closest 5 based on age

    print(ct.user_id.values)

    # get the books that the users have read
    reviews = reviews[reviews.user_id.isin(ct.user_id.values)]

    print(reviews.isbn.unique())

    # get unique book information
    books = books[books.isbn.isin(reviews.isbn.unique())].sort_values(by='averageRating', ascending=False)[:5]

    print(books)
    
    return books



get_books_logged_user_no_reviews(40, 'canada', 'Humor')