import json
import math
import time
from pprint import pprint
import numpy as np
import pandas as pd
import helper as utils
from sklearn.cluster import KMeans


def truncate(number, digits_to_truncate) -> float:
    stepper = 10.0 ** digits_to_truncate
    return math.trunc(stepper * number) / stepper


def np_encoder(obj):
    if isinstance(obj, np.generic):
        return obj.item()


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
    users_data_dir = "../dataset/cluster_table.json"
    cluster_table = pd.read_json(users_data_dir)

    # Check if user exists in table
    if user_data["user_id"] in cluster_table["user_id"]:
        # If yes, update the average value
        # category_name = utils.get_substring_between_substrings(user_data['category'], 'avg_','_rating')
        old_average = cluster_table[f"{user_data['category']}"]
        old_size = cluster_table[f"num_of_{user_data['category']}_ratings"]
        new_average = old_average + ((user_data['category'] - old_average) / old_size)
        cluster_table[f"{user_data['category']}"] = new_average
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
        cluster_table.append(user_obj)


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
    users_data_dir = "../dataset/formatted_reviews_less_countries.csv"
    # Create the dataframe of the reviews
    reviews = pd.read_csv(users_data_dir)
    # Create a dataframe for the new review from the user data dictionary
    new_review = pd.DataFrame(user_data)
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
    users_data_dir = "../dataset/cluster_table.json"
    cluster_table = pd.read_json(users_data_dir)

    columns_to_cluster = [col for col in cluster_table.columns if "user_id" not in col or "num_of_" not in col]

    list_of_user_ids = []
    X = cluster_table[columns_to_cluster].values
    kmeans_1 = KMeans(n_clusters=num_of_clusters)
    predictions = kmeans_1.fit_predict(X)
    cluster_ids = range(num_of_clusters)
    clusters = {}
    for id in cluster_ids:
        clusters[id] = [index for index, elem in enumerate(predictions) if elem == id]

    with open(r'..\dataset\clusters.json', 'w') as f:
        json.dump(clusters, f, default=np_encoder, indent=4)

    # return list_of_user_ids


# TODO: Finish this
def get_user_cluster(user_id):

    clusters_path = r'..\dataset\clusters.json'
    clusters = pd.read_json(clusters_path)

    for column in clusters.columns:
        if user_id in clusters[column]:
            list_of_user_ids = clusters[id]


def is_user_in_table(user_id, clustering_table) -> bool:
    return user_id in clustering_table["user_id"]


def create_table(df, num_of_users=None):
    # Filter out to the columns we want
    ratings = df[['user_id', 'age', 'country', 'isbn', 'book_title', 'Category', 'rating']]
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
    for progress_idx, user_id in enumerate(unique_user_ids[:num_of_users]):  # [:num_of_users]
        print(f"{progress_idx} out of {length}")
        details = ratings[ratings["user_id"] == user_id]

        user_obj = {'user_id': int(user_id),
                    'age': int(details[:1]["age"].values[0]),
                    'country': details[:1]["country"].values[0]}

        for category in unique_categories:
            # Get the rows where this user has a review on this specific category
            temp_ratings = details[details["Category"] == category]
            if len(temp_ratings) != 0:  # if we have more than one entry
                user_obj[f"{category}"] = float(truncate(temp_ratings["rating"].mean(), 3))
                user_obj[f"num_of_{category}_ratings"] = int(len(temp_ratings["rating"]))
            else:  # if no review on category give -1.0
                user_obj[f'{category}'] = -1.0
                user_obj[f"num_of_{category}_ratings"] = 0

        # add the user dict to the big table
        clustering_table.append(user_obj)
    # pprint(clustering_table[0])
    with open(r'..\dataset\cluster_table.json', 'w') as f:
        json.dump(clustering_table, f, default=np_encoder, indent=4)


def main():

    users_data_dir = r"../dataset/formatted_reviews_less_countries.csv"
    users_data = pd.read_csv(users_data_dir)
    users_num = None
    create_table(users_data, users_num)
    print("Done")
    create_cluster(num_of_clusters=20)
    print("Done2")


if __name__ == "__main__":
    with pd.option_context('max_colwidth', 400,
                           'display.max_columns', 10,
                           ):
        main()
