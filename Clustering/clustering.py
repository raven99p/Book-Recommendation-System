import json
import math
import time
from pprint import pprint
import numpy as np
import pandas as pd
from pymongo import MongoClient
from sklearn.cluster import KMeans
import asyncio
from datetime import datetime
import hashlib


from bson.json_util import dumps


def truncate(number, digits_to_truncate) -> float:
    stepper = 10.0 ** digits_to_truncate
    return math.trunc(stepper * number) / stepper


def np_encoder(obj):
    if isinstance(obj, np.generic):
        return obj.item()


def parse_json(data):
    return json.loads(dumps(data))


def get_books_logged_user_no_reviews(reviews, age, country, category):
    country_path = r"..\dataset\country_encode.json"
    path_cluster_table = r"..\dataset\cluster_table.json"

    with open(country_path) as f:
        country_codes = json.load(f)

    # reviews = pd.read_csv(path_reviews,usecols=['user_id', 'isbn'])
    # books = pd.read_csv(path_books)
    ct = pd.read_json(path_cluster_table)
    # Get all users with the same country TODO ENCODE COUNTRY
    ct = ct[ct.country == country_codes[country]]

    # get top 100 users with most liked category = category

    ct = ct.sort_values(by=category, ascending=False)
    ct = ct[:100]

    ct = ct.iloc[(ct['age'] - age).abs().argsort()[:5]]
    # get closest 5 based on age

    print(ct.user_id.values)

    # get the books that the users have read
    reviews = reviews[reviews.user_id.isin(ct.user_id.values)]

    print(reviews.isbn.unique())

    # get unique book information
    # books = books[books.isbn.isin(reviews.isbn.unique())].sort_values(by='averageRating', ascending=False)[:5]
    client = MongoClient(
        'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false')
    db = client.ecommerce
    books = db.Books

    top_5_books = books.find({"isbn": {"$in": list(reviews.isbn.unique())}}).limit(
        3).sort("averageRating", -1)
    print(parse_json(top_5_books))

    return parse_json(top_5_books)


def add_cluster_row(user_data, categories) -> None:
    """! If user is not in the cluster table, create a new row for that user
         If user already exists, update row by recalculating averages
    @param categories: The list of categories that we care about
    @param user_data: The data of the user
            user_data = {"user_id": int,
                         "age": float,
                         "country": string,
                         "isbn": string,
                         "category": string,
                         "rating": float}
    @return: Nothing
    """
    # Open the cluster_table json in a dataframe
    users_data_dir = r"..\dataset\cluster_table.json"
    temp = r"..\dataset\cluster_table_tmp.json"
    cluster_table = pd.read_json(users_data_dir)

    # Check if user exists in table
    # user_data["user_id"] in cluster_table["user_id"]:
    if len(cluster_table[cluster_table.user_id == user_data["user_id"]]) != 0:
        # If yes, update the average value
        # category_name = utils.get_substring_between_substrings(user_data['category'], 'avg_','_rating')
        old_average = float(cluster_table.loc[cluster_table["user_id"] == user_data["user_id"],
                                        [f"{user_data['category']}"]].values[0])

        new_size = int(cluster_table.loc[cluster_table["user_id"] == user_data["user_id"],
                                     [f"num_of_{user_data['category']}_ratings"]].values[0]) + 1

        new_average = old_average + \
                      ((user_data['rating'] - old_average) / new_size)

        print(f"{old_average=}\n{new_size=}\n{new_average=}")

        cluster_table.loc[cluster_table["user_id"] == user_data["user_id"],
                          [f"{user_data['category']}"]] = new_average

        cluster_table.loc[cluster_table["user_id"] == user_data["user_id"],
                          [f"num_of_{user_data['category']}_ratings"]] = new_size

        cluster_table.to_json(temp, orient="records")
    # User does not exist in table
    else:

        user_obj = {'user_id': user_data["user_id"],
                    'age': user_data["age"],
                    'country': user_data["country"]}

        for category in categories:
            # For the category of the review
            if user_data["category"] == category:
                # Add the review
                user_obj[f"{category}"] = user_data["rating"]
                # It only has 1 review so num is 1
                user_obj[f"num_of_{category}_ratings"] = 1
            # For all other categories
            else:
                user_obj[f'{category}'] = -1.0
                user_obj[f"num_of_{category}_ratings"] = 0
        # add the user dict to the big table
        user_obj_df = pd.DataFrame(user_obj, index=[0])

        # cluster_table = pd.concat([cluster_table, user_obj_df], ignore_index = True)
        cluster_table = cluster_table.append(user_obj, ignore_index=True)
        cluster_table.to_json(users_data_dir, orient="records")


def add_review(user_data) -> None:
    """! Adds a row of the new review given as a dictionary.

    @param user_data: The data of the user
                user_data = {"user_id": int,
                             "age": float,
                             "country": string,
                             "isbn": string,
                             "category": string,
                             "rating": float}
    @return: Nothing
    """
    # Path to reviews csv
    users_data_dir = r"..\dataset\formatted_reviews_less_countries.csv"
    # Create the dataframe of the reviews
    reviews = pd.read_csv(users_data_dir, low_memory=False)
    # Create a dataframe for the new review from the user data dictionary
    new_review = pd.DataFrame(user_data, index=[0])
    # Concatenate the two to add the new review
    reviews = pd.concat([reviews, new_review], ignore_index=True, axis=0)
    # Save the reviews csv back.
    reviews.to_csv(users_data_dir)


def update_tables(user_data) -> None:
    """! It updates the review and the cluster_table files with the new review

        @param user_data: The data of the user
                user_data = {"user_id": int,
                             "age": float,
                             "country": string,
                             "isbn": string,
                             "category": string,
                             "rating": float}
    @return: Nothing
    """

    top_15_categories = ['Fiction',
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
    # Check if user is in cluster
    add_review(user_data)
    if user_data["category"] in top_15_categories:
        add_cluster_row(user_data, top_15_categories)


# TODO : Correspond user_ids to cluster indices
def create_cluster(num_of_clusters=5):
    """! Given a user, finds the cluster of users he belongs to.

    @param user_id: The id of the new user as an int
    @return: A list of the user_ids of the cluster
    """
    # Load the cluster table
    users_data_dir = r"..\dataset\cluster_table.json"
    cluster_table = pd.read_json(users_data_dir)

    columns_to_cluster = [
        col for col in cluster_table.columns if "user_id" not in col or "num_of_" not in col]

    list_of_user_ids = []
    X = cluster_table[columns_to_cluster].values
    kmeans_1 = KMeans(n_clusters=num_of_clusters)
    predictions = kmeans_1.fit_predict(X)
    cluster_ids = range(num_of_clusters)
    clusters = []
    # made json file a list of lists
    for id in cluster_ids:
        clusters.append([cluster_table[index:index + 1].user_id.values[0]
                         for index, elem in enumerate(predictions) if elem == id])

    with open(r"..\dataset\clusters.json", 'w') as f:
        json.dump(clusters, f, default=np_encoder, indent=4)

    # return list_of_user_ids


# TODO: Finish this
def get_user_cluster(user_id=56193):
    clusters_path = r"..\dataset\clusters.json"

    list_of_user_ids = []
    # Read json file as list of lists
    with open(clusters_path) as f:
        clusters = json.load(f)

    for C in clusters:
        if user_id in C:
            list_of_user_ids = C

    return list_of_user_ids


def is_user_in_table(user_id, clustering_table) -> bool:
    if len(clustering_table[clustering_table.user_id == user_id]) != 0:
        return True
    else:
        return False

        # return user_id in clustering_table.user_id


def get_cluster_books(reviews, user_id=56193, age=40, country='canada', category='Humor'):
    cluster_table_dir = r"..\dataset\cluster_table.json"
    cluster_table = pd.read_json(cluster_table_dir)

    # print('user id :: ', user_id)
    # print(cluster_table[cluster_table.user_id == user_id])
    # print(is_user_in_table(user_id, cluster_table))
    books = []
    if is_user_in_table(user_id, cluster_table):
        print('user has reviews')
        group = get_user_cluster(user_id)
        # get all reviews from the cluster
        reviews_of_cluster = reviews[reviews.user_id.isin(group)].isbn.unique()
        my_reviews = reviews[reviews.user_id == user_id].isbn.unique()

        books_that_i_havent_read = [x for x in reviews_of_cluster if x not in my_reviews]
        # print(books_that_i_havent_read)
        client = MongoClient(
            'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false')
        db = client.ecommerce
        books = db.Books

        top_5_books = books.find({"isbn": {"$in": books_that_i_havent_read}}).limit(
            3).sort("averageRating", -1)
        # print(parse_json(top_5_books))
        return parse_json(top_5_books)

    else:
        books = get_books_logged_user_no_reviews(reviews, age, country, category)

    return books


def create_table(df, num_of_users=None):
    # Filter out to the columns we want
    ratings = df[['user_id', 'age', 'country',
                  'isbn', 'book_title', 'Category', 'rating']]
    # Get top 15 categories to use below

    # df = ratings.groupby('Category').size().sort_values(ascending=False)
    # print(df.head(15))

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

    # remove all entries that have categories other than the above 15 most frequent
    ratings = ratings[ratings["Category"].isin(unique_categories)]
    # Get user ids after cleanup because some users may have only reviewed in categories not in the top 15
    unique_user_ids = ratings.user_id.unique()
    clustering_table = []
    length = len(unique_user_ids)
    # [:num_of_users]
    for progress_idx, user_id in enumerate(unique_user_ids[:num_of_users]):
        print(f"{progress_idx} out of {length}")
        details = ratings[ratings["user_id"] == user_id]

        user_obj = {'user_id': int(user_id),
                    'age': int(details[:1]["age"].values[0]),
                    'country': details[:1]["country"].values[0]}

        for category in unique_categories:
            # Get the rows where this user has a review on this specific category
            temp_ratings = details[details["Category"] == category]
            if len(temp_ratings) != 0:  # if we have more than one entry
                user_obj[f"{category}"] = float(
                    truncate(temp_ratings["rating"].mean(), 3))
                user_obj[f"num_of_{category}_ratings"] = int(
                    len(temp_ratings["rating"]))
            else:  # if no review on category give -1.0
                user_obj[f'{category}'] = -1.0
                user_obj[f"num_of_{category}_ratings"] = 0

        # add the user dict to the big table
        clustering_table.append(user_obj)
    # pprint(clustering_table[0])
    with open(r"..\dataset\cluster_table.json", 'w') as f:
        json.dump(clustering_table, f, default=np_encoder, indent=4)


def main():
    users_data_dir = r"..\dataset\formatted_reviews_less_countries.csv"
    # users_data = pd.read_csv(users_data_dir, low_memory=False)
    # users_num = None
    # create_table(users_data, users_num)

    user_data = {
        "user_id": 999999,
        "age": 40,
        "country": 0,
        "isbn": "0609804618",
        "category": "Humor",
        "rating": 10
    }
    update_tables(user_data)
    create_cluster()

    # print("Done")
    # # create_cluster()
    # # num_of_clusters=20
    # # print("Done2")
    # # get_user_cluster()
    # # print("Done3")
    # get_cluster_books(users_data)
    print("Done4")


if __name__ == "__main__":
    with pd.option_context('max_colwidth', 400,
                           'display.max_columns', 10,
                           ):
        main()
