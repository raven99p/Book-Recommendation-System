from sklearn.feature_extraction.text import CountVectorizer
import pandas as pd
from sklearn.datasets import fetch_20newsgroups
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import math
import multiprocessing as mp


def loop(x, doc_term_matrix,cosine_similarity_matrix):
    print(x)
    listone = doc_term_matrix[x].tolist()
    res = 0
    for i in range(len(listone[0])):
            res += int(listone[0][i])**2
    set_list=[]
    for y in range(len(doc_term_matrix)):
        dot = doc_term_matrix[x].dot(doc_term_matrix[y].T)
        listtwo = doc_term_matrix[y].tolist()
        res2 = 0
        for i in range(len(listtwo[0])):
            res2 += int(listtwo[0][i])**2
            pass
        sim = int(dot)/(math.sqrt(int(res))*math.sqrt(int(res2)))
        set_list.append(sim)
    cosine_similarity_matrix.append(set_list)
    pass


if __name__ == '__main__':
    

    path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\summaries.csv"
    df = pd.read_csv(path)

    number_of_summaries = 200
    data = df.Summary.values[:number_of_summaries]
    index_list = df.isbn.values[:number_of_summaries]

    documents = data

    count_vectorizer = CountVectorizer(stop_words='english')
    count_vectorizer = CountVectorizer()
    sparse_matrix = count_vectorizer.fit_transform(documents)

    doc_term_matrix = sparse_matrix.todense()

    print('finished preprocess')
    cosine_similarity_matrix = []

    res = 0
    res2 = 0
    
    # pool = mp.Pool(mp.cpu_count())
    processes = []
    for x in range(len(doc_term_matrix)):
        p = mp.Process(target=loop, args = [x,doc_term_matrix,cosine_similarity_matrix])
        p.start()
        processes.append(p) 
    for p in processes:
        p.join()
    # results = [pool.apply(loop, args=(x,doc_term_matrix,cosine_similarity_matrix)) for x in range(len(doc_term_matrix))]
    # print(cosine_similarity(doc_term_matrix,doc_term_matrix))





    print(cosine_similarity(doc_term_matrix,doc_term_matrix))
    Sim = cosine_similarity(doc_term_matrix,doc_term_matrix)

    i = 1
    group = []
    grouped_by = []
    group_to_sort = []
    temp_sim_books = []
    for pivot_index, book in enumerate(Sim):
        print(book)
        # get first book as pivot
        # pivot = book[0]
        # books after the pivot
        for index, similarity in enumerate(book[i:]):
            print('pivot ::', pivot_index)
            print('index ::', index+1)
            print('similarity ::', similarity)
            obj = {"pivot": pivot_index, "index": index +
                    i, "similarity": similarity}
            group_to_sort.append(obj)
        # sorted list of similarities
        group_to_sort.sort(key=lambda x: x['similarity'], reverse=True)
        group.append(group_to_sort[:3])
        i += 1
        group_to_sort = []
    group = group[:len(group)-1]

    # for book_index in group:
    #     pivot = book_index[0]["pivot"]
    #     for sim in book_index:
    #         temp_sim_books.append(
    #             {"index": index_list[sim["index"]], "similarity": sim["similarity"]})
    #     grouped_by.append({"book_id": index_list[pivot], "most_similar": temp_sim_books})
    #     temp_sim_books = []
    print(group)