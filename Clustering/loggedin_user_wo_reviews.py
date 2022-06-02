
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