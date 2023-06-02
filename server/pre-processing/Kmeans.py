import pandas as pd
from kmodes.kmodes import KModes
path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\\KmeansReady.csv"
pd.options.display.max_colwidth = 400

df = pd.read_csv(path, dtype={'id': int})


kmodes = KModes(n_jobs=-1, n_clusters=9, init='Huang', random_state=0)
kmodes.fit_predict(df)

print(kmodes.cluster_centroids_)