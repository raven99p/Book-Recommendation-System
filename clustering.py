import pandas as pd


def clustering(user_id, users_df) -> pd.DataFrame():
    """! Given a user_id, find the group of other users that have similar tastes.

    @param user_id: The user_id of the usr we want to find the group he belongs in
    @param users_df: The dataframe containing the data of all users
    @return:
    """

    users = []

    return users


def main():
    users_data_dir = "dataset\\grouped.csv"

    users_data = pd.read_csv(users_data_dir)

    print(users_data)


if __name__ == "__main__":
    with pd.option_context('max_colwidth', 400,
                           'display.max_columns', 10,
                           ):
        main()
