import re


def get_substring_between_substrings(text, start, end) ->  str:

    m = re.search(f'{start}(.+?){end}', text)
    if m:
        return m.group(1)
    else:
        return "NOT FOUND"

