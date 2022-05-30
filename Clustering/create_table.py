import pandas as pd
import json
import math
path_ratings = 'C:\\Users\pauli\Work\Book Recommendation System\Clustering\dataset\\original_ratings_wo_9_category_format.csv'

ratings = pd.read_csv(path_ratings, usecols=[
                      'user_id', 'age', 'country', 'isbn', 'book_title', 'Category', 'rating'])

def truncate(number, digits) -> float:
    stepper = 10.0 ** digits
    return math.trunc(stepper * number) / stepper


# get unique user ids
unique_user_ids = ratings.user_id.unique()
print(len(unique_user_ids))
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

clustering_table = []
for user_id in unique_user_ids[:100]:
    details = ratings[ratings.user_id == user_id]
    
    user_obj = {'user_id': user_id, 'age': int(details[:1].age.values[0]), 'country':details[:1].country.values[0]}
    print('user :: ', user_id)
    # print('-------------')
    for category in unique_categories:
        # print('+++++++++++')
        # print('user :: ', user_id)
        # print('category :: ', category)
        
        temp_ratings = ratings[(ratings.user_id == user_id) & (ratings.Category == category)]
        # print('number of ratings :: ', len(temp_ratings))
        if len(temp_ratings) != 0:
            # print(temp_ratings)
            user_obj[category] =  float(truncate(temp_ratings["rating"].mean(), 3))
            
        else: # if no review on category give -1
            user_obj['avg_'+category+'_rating'] = -1
            

    # print(user_obj)
    clustering_table.append(user_obj)
    user_obj = {}
print(clustering_table)

with open('C:\\Users\pauli\Work\Book Recommendation System\Clustering\dataset\\cluster_table.json', 'w') as f:
    json.dump(clustering_table, f)
