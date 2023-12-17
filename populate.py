import string

df = pd.read_excel('CPT.xlsx', sheet_name='CPT', header=None)

num_var = len(df) // 4


node_name = ' '.join([str(elem) for elem in df.iloc[1, 0].split()[:-1]])
parents = df.iloc[0, 3:]

ideal = df.iloc[1,1]
not_ideal = df.iloc[2,2]

def zero_string(element):
    if type(element) == str:
        return 0
    return element

def typesafe_isnan(element):
    return isinstance(element, float) and element != element

weights = list(df.iloc[1, 3:])
weights = [zero_string(weight) for weight in weights if not typesafe_isnan(weight)]

ideal_cpt = calculate_CPT(weights, ideal, 1-ideal)
not_ideal_cpt = calculate_CPT(weights, not_ideal, 1-not_ideal)