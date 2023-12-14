import networkx as nx
import matplotlib.pyplot as plt
from pgmpy.models import BayesianNetwork
from pgmpy.factors.discrete.CPD import TabularCPD

# Define the Bayesian Network structure
student = BayesianNetwork([('diff', 'grades'), ('aptitude', 'grades')])

# Define the Conditional Probability Distribution for the 'grades' node
grades_cpd = TabularCPD('grades', 3, [[0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
                                      [0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
                                      [0.8, 0.8, 0.8, 0.8, 0.8, 0.8]],
                         evidence=['diff', 'aptitude'], evidence_card=[2, 3],
                         state_names={'grades': ['gradeA', 'gradeB', 'gradeC'],
                                      'diff': ['easy', 'hard'],
                                      'aptitude': ['low', 'medium', 'high']})

# # Add the CPD to the Bayesian Network
# student.add_cpds(grades_cpd)

# # Print the Bayesian Network structure
# print(student)

# # Print the CPDs for each node
# for cpd in student.get_cpds():
#     print(f"\nCPD for Node {cpd.variable}:\n{cpd}")
    
# # Plot the Bayesian Network with circular layout
# pos = nx.circular_layout(student)
# nx.draw(student, pos, with_labels=True, node_size=2000, node_color="skyblue", font_size=10, font_color="black", font_weight="bold", arrowsize=20)
# plt.show()

import dash
import visdcc
import pandas as pd
from dash import html
from dash import dcc
from dash.dependencies import Input, Output, State

app=dash.Dash()

# df = pd.read_csv("data.csv")
node_list = student.nodes
edge_list = student.edges

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
    s = 'Selected nodes : '
    if len(x['nodes']) > 0 : s += str(x['nodes'][0])
    return s

@app.callback(
    Output('edges', 'children'),
    [Input('net', 'selection')])
def myfun(x): 
    s = 'Selected edges : '
    if len(x['edges']) > 0 : s = [s] + [html.Div(i) for i in x['edges']]
    return s

@app.callback(
    Output('net', 'options'),
    [Input('color', 'value')])
def myfun(x):
    return {'nodes': {'color': x}}

app.run_server(debug=True)
