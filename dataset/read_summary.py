import pandas as pd 

path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\Preprocessed_data.csv"
pd.options.display.max_colwidth = 400

df = pd.read_csv(path)


print(df.Summary[:1])




df.to_csv("C:\\Users\pauli\Work\Book Recommendation System\dataset\summaries.csv")