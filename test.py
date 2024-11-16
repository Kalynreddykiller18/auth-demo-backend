# from collections import Counter

# def solve(s, t):
#     if len(s) != len(t):    
#         return 0    
#     if s == t:   
#         return 1

#     combined_counts = Counter(s) + Counter(t)  

#     for char, count in combined_counts.items():
#         if count % 2 != 0:        
#             return 0 

#     return 1


# print(solve("bcc", "baa")) 
# print(solve("abcd", "abcs")) 
# print(solve("Kalyan", "layKna")) 
# print(solve("abc", "def")) 

def count_factors(x, factor):
    count = 0
    while x > 0 and x % factor == 0:
        x //= factor
        count += 1
    return count

def min_trailing_zeros_path(n,tiles):    
    dp2 = [[float('inf')]*n for _ in range(n)]
    dp5 = [[float('inf')]*n for _ in range(n)]

    def count_factors(x, factor):
        count = 0
        while x > 0 and x % factor == 0:
            x //= factor
            count += 1
        return count
    
    dp2[0][0] = count_factors(tiles[0][0], 2)
    dp5[0][0] = count_factors(tiles[0][0], 5)
    
    for i in range(n):
        for j in range(n):
            if i > 0:
                dp2[i][j] = min(dp2[i][j], dp2[i-1][j] + count_factors(tiles[i][j], 2))
                dp5[i][j] = min(dp5[i][j], dp5[i-1][j] + count_factors(tiles[i][j], 5))
            if j > 0:
                dp2[i][j] = min(dp2[i][j], dp2[i][j-1] + count_factors(tiles[i][j], 2))
                dp5[i][j] = min(dp5[i][j], dp5[i][j-1] + count_factors(tiles[i][j], 5))    

    return min(dp2[-1][-1], dp5[-1][-1])

tiles = [
    [2, 3, 10],
    [5, 10, 3],
    [4, 2, 5]
]
print(min_trailing_zeros_path(3,tiles)) 
