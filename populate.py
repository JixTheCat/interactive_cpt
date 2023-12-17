import string

BN = BayesianNetwork()

df = pd.read_excel('CPT.xlsx', sheet_name='CPT', header=None)

def zero_string(element):
    if type(element) == str:
        return 0
    return element

def typesafe_isnan(element):
    return isinstance(element, float) and element != element

num_var = len(df) // 4
for i in range(0, num_var):
    node_name = ' '.join([str(elem) for elem in df.iloc[4*i+1, 0].split()[:-1]])
    BN.add_node(node_name)

    parents = [parent for parent in df.iloc[4*i, 3:] if not typesafe_isnan(parent)]
    for parent in parents:
        BN.add_edge(parent, node_name)

    ideal = df.iloc[4*i+1,1]
    not_ideal = df.iloc[4*i+2,2]
    if typesafe_isnan(not_ideal):
        not_ideal = 1-ideal

    weights = list(df.iloc[4*i+1, 3:])
    weights = [zero_string(weight) for weight in weights if not typesafe_isnan(weight)]

    if weights == []:
        ideal_cpt = [ideal]
        not_ideal_cpt = [not_ideal]
    elif sum(weights) == 0:
        ideal_cpt = calculate_CPT([1 for weight in weights], ideal, 1-ideal)
        not_ideal_cpt = calculate_CPT([1 for weight in weights], not_ideal, 1-not_ideal) 
    else:
        ideal_cpt = calculate_CPT(weights, ideal, 1-ideal)
        ideal_cpt = [0.5 if prob == 0 else prob for prob in ideal_cpt]
        not_ideal_cpt = calculate_CPT(weights, not_ideal, 1-not_ideal)
        not_ideal_cpt = [0.5 if prob == 0 else prob for prob in not_ideal_cpt]

    state_names = {node_name: ['ideal', 'not_ideal']}
    for parent in parents:
        state_names[parent] = ['ideal', 'not_ideal']

    if parents = []:
        cpds = TabularCPD(node_name
            , 2
            , [
                ideal_cpt
                , not_ideal_cpt
            ]
            , state_names =state_names
        )
    else:
        evidence = list(state_names.keys())[1:]
        cpds = TabularCPD(node_name
            , 2
            , [
                ideal_cpt
                , not_ideal_cpt
            ]
            , evidence=list(state_names.keys())[1:]
            , evidence_card=[2 for evidence in evidence]
            , state_names=state_names
        )
    BN.add_cpds(cpds)