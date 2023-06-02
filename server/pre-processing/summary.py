import pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, wordpunct_tokenize
path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\Preprocessed_data.csv"
pd.options.display.max_colwidth = 400
stopWordsEnglish = stopwords.words('english')
punctuation = [".", ";", ":",  "?", "(", ")", "[", "]", "\"",
               "\'", "!", "...", "..", "-", "/", "*", "`", "``", "''",
               "_", "&", "--", "#", "quot", ',', " ", "&#", ";--", ".&", ";.", "),", ";,", ".......", ".&#", "!!", "!&", ";).", "!)", "!&#"]
stopWordsEnglish.extend(punctuation)

# nrows=1
df = pd.read_csv(path, dtype={'id': int})

# print(wordpunct_tokenize(df.Summary[:1][0]))
# sentence = sorted(df['Summary'].apply(wordpunct_tokenize).values[0])
# print(" ".join(sentence))

# print(sentence)
df['Summary'] = df['Summary'].apply(wordpunct_tokenize)

df['Summary'] = df['Summary'].apply(lambda x: [item.lower() for item in x if item.lower() not in stopWordsEnglish and not item.isnumeric()])

df['Summary'] = df['Summary'].apply(lambda x: sorted(x))

df['Summary'] = df['Summary'].apply(lambda x: ' '.join(x))

df = df.drop_duplicates()

df = df[df.Category != '9']

# df = df.sort_values(by=['isbn'])


df.to_csv(
    "C:\\Users\pauli\Work\Book Recommendation System\dataset\\ratings.csv")
