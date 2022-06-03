import pandas as pd
import json
import math
def truncate(number, digits) -> float:
    stepper = 10.0 ** digits
    return math.trunc(stepper * number) / stepper


data = pd.read_json('C:\\Users\pauli\Work\Book Recommendation System\cosineSim_multiprocess\similarities.json')

data['similarity'] = data['similarity'].apply(lambda x: truncate(x, 4))
print(data)
data.to_csv('C:\\Users\pauli\Work\Book Recommendation System\cosineSim_multiprocess\similarities.csv',index=False)