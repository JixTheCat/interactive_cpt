import dash
import visdcc
import pandas as pd
from dash import html
from dash import dcc
from dash.dependencies import Input, Output, State
from populate import populate

import networkx as nx
import matplotlib.pyplot as plt
from pgmpy.models import BayesianNetwork
from pgmpy.factors.discrete.CPD import TabularCPD

# # Define the Bayesian Network structure
# student = BayesianNetwork([('diff', 'grades'), ('aptitude', 'grades')])

# # Define the Conditional Probability Distribution for the 'grades' node
# grades_cpd = TabularCPD('grades'
#                         , 3
#                         , [
#                             [0.1, 0.2, 0.3, 0.8, 0.6, 0.4]
#                             , [0.1, 0.2, 0.3, 0.1, 0.2, 0.3]
#                             , [0.8, 0.6, 0.4, 0.1, 0.2, 0.3]]
#                             ,  evidence=['diff', 'aptitude']
#                             , evidence_card=[2, 3]
#                             , state_names={'grades': ['gradeA', 'gradeB', 'gradeC']
#                                 , 'diff': ['easy', 'hard']
#                                 , 'aptitude': ['low', 'medium', 'high']
#                                 })

# diff_cpd = TabularCPD('diff'
#                         , 2
#                         , [
#                             [0.9] # easy
#                             ,[0.1]] # hard
#                             , state_names={'diff': ['easy', 'hard']
#                                 })

# aptitude_cpd = TabularCPD('aptitude'
#                         , 3
#                         , [
#                             [0.2] # low
#                             ,[0.6] # medium
#                             ,[0.2]] # high
#                             , state_names={'aptitude': ['low', 'medium', 'high']
#                                 })
# # # Add the CPD to the Bayesian Network
# student.add_cpds(grades_cpd)
# student.add_cpds(diff_cpd)
# student.add_cpds(aptitude_cpd)

# # Print the Bayesian Network structure
# print(student)

# # Print the CPDs for each node
# for cpd in student.get_cpds():
#     print(f"\nCPD for Node {cpd.variable}:\n{cpd}")

# for state in grades_cpd.state_names['grades']:
#     print(student.get_state_probability({'grades': state}))

# # Plot the Bayesian Network with circular layout
# pos = nx.circular_layout(student)
# nx.draw(student, pos, with_labels=True, node_size=2000, node_color="skyblue", font_size=10, font_color="black", font_weight="bold", arrowsize=20)
# plt.show()

BN = populate()
# BN = student

app=dash.Dash()

node_list = BN.nodes
edge_list = BN.edges

nodes = [
    {
        'id': node_name
        , 'label': node_name
        , 'shape': 'dot'
        , 'size': 7
    } for i, node_name in enumerate(node_list)
]

edges = [
    {
        'id': edge[0] + '_' + edge[1]
        , 'from': edge[0]
        , 'to': edge[1]
        , 'width': 2
    } for i, edge in enumerate(edge_list)
]

app.layout = html.Div(
    [
        visdcc.Network(
            id = 'net'
            , data={'nodes': nodes, 'edges': edges}
            , selection = {'nodes': nodes
                      , 'edges': edges}
            , options = dict(height = '600px'
                             , width = '100%')
        )
                           , html.Div(id = 'nodes')
                           , html.Div(id = 'edges')
        , dcc.RadioItems(id = 'color'
                       , options=[
                           {'label': 'Red' 
                            , 'value': '#ff0000'}
                           , {'label': 'Green' , 'value': '#00ff00'}
                           , {'label': 'Blue' , 'value': '#0000ff'}]
                           , value='Red'
        )
    ])

@app.callback(
    Output('nodes', 'children'),
    [Input('net', 'selection')])
def myfun(x): 
    try:
        id = str(x['nodes'][0])

        # s = str(id) + ': '
        # for state in student.get_cpds(id).state_names[id]:
        #     s += str(state) + ': '
        #     s += str(student.get_state_probability({id: state}))

        s = [(html.B(str(id)))]
        s.append(html.Br())
        s.append(html.Br())

        # s.append(BN.get_cpds(id).state_names[id])
        s.append(' '.join(BN.get_cpds(id).state_names[id]))
        s.append(str(BN.get_state_probability({id: 'ideal'})))
        # s.append('hello')

        # for state in BN.get_cpds(id).state_names[id]:
        #     s.append(str(state) + ': ')
        #     s.append(str(BN.get_state_probability({id: state})))
        #     s.append(html.Br())
        s.append(html.Br())
        s.append(html.Br())
    except ValueError:
        return "No node selected"
    except IndexError:
        return "No node selected"
    return s

@app.callback(
    Output('net', 'options'),
    [Input('color', 'value')])
def myfun(x):
    return {'nodes': {'color': x}}

app.run_server(debug=True)
