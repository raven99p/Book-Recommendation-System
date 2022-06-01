from pprint import pprint
import pandas as pd
import numpy as np
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, wordpunct_tokenize


def clustering(df) -> pd.DataFrame():
    # user_id, ageGroup, location, isbn, categories of user,

    # categorise based on what they like

    #

    return clustered_df


def summary(df):
    """

    @param df: The original dataframe generated from the unprocessed csv
    @return:
    """
    path_original_ratings = df
    # books.csv should be in the relative path specified.
    path_books = "\dataset\\books.csv"

    # from original ratings get caregoty and summary
    ratings = path_original_ratings[['isbn', 'Summary', 'Category']].copy()
    ratings = ratings.drop_duplicates()
    ratings['Category'] = ratings['Category'].apply(lambda x: x.split('\'')[1])

    average_ratings = path_original_ratings[['isbn', 'rating']]
    average_ratings = average_ratings.groupby('isbn').mean()

    books = pd.read_csv(path_books, sep=';', dtype={'isbn': str}, encoding="ISO-8859-1")

    # add to books summary and category
    merged = pd.merge(books, ratings, on='isbn', how='left')

    #  add to books average rating
    merged = pd.merge(merged, average_ratings, on='isbn', how='left')

    merged['price'] = np.random.randint(5, 15, merged.shape[0])
    merged['stock'] = np.random.randint(0, 5, merged.shape[0])

    return merged


def summary_tokenize(df) -> pd.DataFrame():
    stopWordsEnglish = stopwords.words('english')
    punctuation = [".", ";", ":", "?", "(", ")", "[", "]", "\"",
                   "\'", "!", "...", "..", "-", "/", "*", "`", "``", "''",
                   "_", "&", "--", "#", "quot", ',', " ", "&#", ";--", ".&", ";.", "),", ";,", ".......", ".&#", "!!",
                   "!&", ";).", "!)", "!&#"]
    stopWordsEnglish.extend(punctuation)

    # print(wordpunct_tokenize(df.Summary[:1][0]))
    # sentence = sorted(df['Summary'].apply(wordpunct_tokenize).values[0])
    # print(" ".join(sentence))

    # print(sentence)
    df['Summary'] = df['Summary'].apply(wordpunct_tokenize)

    df['Summary'] = df['Summary'].apply(lambda x: [item.lower(
    ) for item in x if item.lower() not in stopWordsEnglish and not item.isnumeric()])

    df['Summary'] = df['Summary'].apply(lambda x: sorted(x))

    df['Summary'] = df['Summary'].apply(lambda x: ' '.join(x))

    df = df.drop_duplicates()


def pre_process(df) -> pd.DataFrame():
    """! Processes the original csv file to prepare for clustering

    @param df : The dataframe generated from the csv file to work on
    @return : The processed data as a dataframe

    """
    # Remove rows that contain 9 in some cells (probably error code)
    df = df[(df['Language'] != '9') & (df['Category'] != '9')]
    # drop rows that contain NaN
    df.dropna(inplace=True)

    df.age = df['age'].apply(pd.to_numeric)  # TODO : Make age integer
    # Normalise age
    bins = [0, 22, 35, 42, 52, 62, 100]
    labels = ['teen', 'young_aduts', 'adults', 'middle_aged', 'older_udults', 'elderly']
    df['AgeGroup'] = pd.cut(df['age'], bins=bins, labels=labels, right=False)

    ratings = df.groupby('isbn').mean()
    #
    df["Category"] = df["Category"].apply(lambda x: x.split('\'')[1])


    # # Group the different categories every user has reviewed by user id
    # df_category_group = df.groupby('user_id')['Category'].apply(lambda x: list(set(list(x)))).to_frame()
    # # make the user id a column of the dataframe
    # df_category_group["user_id"] = df_category_group.index
    # # change the name to id so that there is not a conflict in the merging below
    # df_category_group.index.name = 'id'
    # # do a left join with the table of users we have
    # merged = pd.merge(df_category_group, df, on='user_id', how='left')
    #
    # # remove the duplicate column
    # merged = merged.drop(columns=['Category_y'])
    # # rename one of the columns
    # merged = merged.rename(columns={"Category_x": "category"})
    #
    # merged = merged.drop_duplicates(subset=['user_id'], ignore_index=True)

    print(df)
    df.to_csv(r"..\dataset\formatted_reviews.csv")
    return df


def main():
    #
    path = r"C:\Users\k\Desktop\CEID\10th Semester\Book-Recommendation-System\dataset\preprocessed_data.csv"
    # Load the file
    df = pd.read_csv(path, usecols=['user_id',
                                    'location',
                                    'age',
                                    'isbn',
                                    'rating',
                                    'book_title',
                                    'book_author',
                                    'year_of_publication',
                                    'publisher',
                                    'img_s',
                                    'img_m',
                                    'img_l',
                                    'Summary',
                                    'Language',
                                    'Category',
                                    'city',
                                    'state',
                                    'country', ])

    pre_processed_df = pre_process(df)
    # get the books that each person has rated
    #
    pprint(pre_processed_df)


if __name__ == '__main__':
    # Add options to display as needed
    print("test")
    with pd.option_context('max_colwidth', 400,
                           'display.max_columns', 10,
                           ):
        main()
