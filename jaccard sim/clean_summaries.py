import pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()

pd.options.display.max_colwidth = 500

path = "C:\\Users\pauli\Work\Book Recommendation System\dataset\summaries.csv"

stopWordsEnglish = stopwords.words('english')
punctuation = [".", ";", ":",  "?", "(", ")", "[", "]", "\"", "%", "@", "~"
            "\'", "!", "...", "..", "-", "/", "*", "`", "``", "''",
            "_", "&", "--", "#", "quot", ',', " ", "&#", ";--", ".&", ";.", "),", ";,",
             ".......", ".&#", "!!", "!&", ";).", "!)", "!&#", "&#39", "1-2", '$']
stopWordsEnglish.extend(punctuation)



df = pd.read_csv(path, encoding='utf8')

df['Summary'] = df['Summary'].apply(word_tokenize)


df['Summary'] = df['Summary'].apply(lambda x: [item.lower(
) for item in x if item.lower() not in stopWordsEnglish and not item.isnumeric()])

df['Summary'] = df['Summary'].apply(lambda x: [lemmatizer.lemmatize(item) for item in x ])

df.to_csv("C:\\Users\pauli\Work\Book Recommendation System\jaccard sim\clean_summaries.csv",index=False)
