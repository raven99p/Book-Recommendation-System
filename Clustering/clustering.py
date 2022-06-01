import json
import math
import time
from pprint import pprint
import numpy as np
import pandas as pd
import helper as utils
# from sklearn.cluster import KMeans


def truncate(number, digits_to_truncate) -> float:
    stepper = 10.0 ** digits_to_truncate
    return math.trunc(stepper * number) / stepper


def np_encoder(obj):
    if isinstance(obj, np.generic):
        return obj.item()


def clustering(user_id, users_df) -> pd.DataFrame():
    """! Given a user_id, find the group of other users that have similar tastes.

    @param user_id: The user_id of the usr we want to find the group he belongs in
    @param users_df: The dataframe containing the data of all users
    @return:
    """

    users = []

    return users


def add_cluster_row(user_data):
    """! If user is not in the cluster table, create a new row for that user
         If user already exists, update row by recalculating averages
    @param user_data: The data of the user
            user_data = {"user_id": int,
                         "age": float,
                         "country": string,
                         "isbn": string,
                         "category": string,
                         "rating": float}
    @return:
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
    else:
        # Add intelligence
        pass


def add_review(user_data) -> None:
    """! Adds a row of the new review given as a dictionary.

    @param user_data: The data of the user
                user_data = {"user_id": int,
                             "age": float,
                             "country": string,
                             "isbn": string,
                             "category": string,
                             "rating": float}
    @return:
    """
    # Path to reviews csv
    users_data_dir = "../dataset/formatted_reviews.csv"
    # Create the dataframe of the reviews
    reviews = pd.read_csv(users_data_dir)
    # Create a dataframe for the new review from the user data dictionary
    new_review = pd.DataFrame(user_data)
    # Concatenate the two to add the new review
    reviews = pd.concat([reviews, new_review], ignore_index=True, axis=0)
    # Save the reviews csv back.
    reviews.to_csv(users_data_dir)




def update_tables(user_data):

    # Check if user is in cluster
    add_review(user_data)
    add_cluster_row(user_data)



def get_user_cluster(user_id):
    """! Given a new user, finds the cluster of users he belongs to.

    @param user_id: The id of the new user as an int
    @param age: The age of the user
    @param country: The country of the user
    @return: A list of the user_ids of the cluster
    """

    list_of_user_ids = []



    return list_of_user_ids


def is_user_in_table(user_id, clustering_table) -> bool:

    return user_id in clustering_table["user_id"]


def create_table(df, num_of_users=10):

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
    test_ids = [11400]
    clustering_table = []
    for progress_idx, user_id in enumerate(unique_user_ids[:num_of_users]):
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
                user_obj[f'{category}'] = np.nan
                user_obj[f"num_of_{category}_ratings"] = 0

        # add the user dict to the big table
        clustering_table.append(user_obj)
    # pprint(clustering_table[0])
    with open(r'..\dataset\cluster_table.json', 'w') as f:
        json.dump(clustering_table, f, default=np_encoder, indent=4)


def main():
    users_data_dir = "../dataset/formatted_reviews.csv"

    users_data = pd.read_csv(users_data_dir)
    create_table(users_data)


    # print(users_data)


if __name__ == "__main__":
    with pd.option_context('max_colwidth', 400,
                           'display.max_columns', 10,
                           ):
        main()
        start = time.time()

        print(f"Took {time.time() - start}")
