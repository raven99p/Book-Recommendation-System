import pandas as pd
import multiprocessing as mp
import ast
import math
import json
path = "C:\\Users\pauli\Work\Book Recommendation System\jaccard sim\clean_summaries.csv"

df = pd.read_csv(path, encoding='utf8')

df['Summary'] = df['Summary'].apply(lambda x: ast.literal_eval(x))

number_of_summaries = 1000
data = df.Summary.values[:number_of_summaries]
index_list = df.isbn.values[:number_of_summaries]

def truncate(number, digits) -> float:
    stepper = 10.0 ** digits
    return math.trunc(stepper * number) / stepper


def calculate_jaccard(word_tokens1, word_tokens2):
    # Combine both tokens to find union.
    both_tokens = word_tokens1 + word_tokens2
    union = set(both_tokens)

    # Calculate intersection.
    intersection = set()
    for w in word_tokens1:
        if w in word_tokens2:
            intersection.add(w)

    jaccard_score = len(intersection)/len(union)
    return jaccard_score



    
if __name__ == '__main__':    
    sim_list = []
    group = []
    grouped_by = []
    group_to_sort = []
    temp_sim_books = []
    group = []
    processes = []
    for x_index, x in enumerate(data):
        for y_index, y in enumerate(data):
            if x_index != y_index:
                sim = calculate_jaccard(x, y)
                # sim_list.append(sim)
                obj = {"pivot": x_index, "index": y_index, "similarity": sim}
                group_to_sort.append(obj)
        group_to_sort.sort(key=lambda x: x['similarity'], reverse=True)
        group.append(group_to_sort[:3])
        group_to_sort = []

    for book_index in group:
        
        pivot = book_index[0]["pivot"]
        for sim in book_index:
            temp_sim_books.append(
                {"index": index_list[sim["index"]], "similarity": truncate(sim["similarity"], 4)})
        grouped_by.append({"book_id": index_list[pivot], "most_similar": temp_sim_books})
        temp_sim_books = []
    with open("C:\\Users\pauli\Work\Book Recommendation System\jaccard sim\similarities.json", 'w') as f:
                        json.dump(grouped_by, f)
    