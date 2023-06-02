import multiprocessing as mp
print("Number of processors: ", mp.cpu_count())



def print_numbers(x):
    print(x)


if __name__ == '__main__':
    pool = mp.Pool(mp.cpu_count())




    results = [pool.apply(print_numbers, args=(x)) for x in range(3)]