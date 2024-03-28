// When building this file it requires the smile API to be included. This was done using thebelow compile command where the API files downloaded from BayesFuse website were located in /usr/loca/include
// 
// sudo g++ -std=c++17 hello.cpp -I/usr/local/include -L/usr/local/include -lsmile

#include <iostream>
#include <fstream>
#include <string>
#include <smile.h>
#include "smile_license.h"
#include <cstdio>
#include <json.hpp>
#include <vector>
#include <iostream>
#include <numeric>
#include <cmath>
#include <algorithm>

using json = nlohmann::json;

// Calculate unit weight for the CPT given x_L, x_H, and weights
std::pair<double, double> calculate_LH(double x_L, double x_H, const std::vector<double>& weights) {
    double sumOfWeights = std::accumulate(weights.begin(), weights.end(), 0.0);
    return {x_L / sumOfWeights, x_H / sumOfWeights};
}

// Generate all combinations of boolean values given the number of weights
std::vector<std::vector<bool>> combinations(int num_weights) {
    std::vector<std::vector<bool>> result;
    int totalCombinations = std::pow(2, num_weights);
    for (int i = 0; i < totalCombinations; ++i) {
        std::vector<bool> combination;
        for (int j = 0; j < num_weights; ++j) {
            combination.push_back(i & (1 << j));
        }
        result.push_back(combination);
    }
    return result;
}

// Create a boolean matrix from combinations of True and False for given x_L, x_H, and num_weights
std::vector<std::vector<bool>> create_boolean_matrix(double x_L, double x_H, int num_weights) {
    auto all_combinations = combinations(num_weights);
    std::vector<std::vector<bool>> boolean_matrix;
    for (const auto& combination : all_combinations) {
        std::vector<bool> row;
        std::transform(combination.begin(), combination.end(), std::back_inserter(row),
                       [x_L, x_H](bool bit) { return bit ? x_L : x_H; });
        boolean_matrix.push_back(row);
    }
    return boolean_matrix;
}

// Calculate CPT given weights, x_L, and x_H
std::vector<double> calculate_CPT(const std::vector<double>& weights, double x_L, double x_H) {

    std::pair<double, double> lh = calculate_LH(x_L, x_H, weights);

    std::vector<std::vector<bool>> boolean_matrix = create_boolean_matrix(lh.first, lh.second, weights.size());

    std::vector<double> results;

    for (const std::vector<bool>& row : boolean_matrix) {
        double result = 0;
        for (size_t i = 0; i < row.size(); ++i) {
            result += weights[i] * row[i];
        }
        results.push_back(result);
    }

    return results;
}

/////////////////////////
// End of python code
// 

std::string replaceSpaces(std::string str) {
    for (size_t i = 0; i < str.length(); ++i) {
        if (str[i] == ' ') {
            str[i] = '_';
        }
    }
    return str;
}

static int CreateCptNode(
    DSL_network& net, const char* id, const char* name,
    std::initializer_list<const char*> outcomes, int xPos, int yPos);

static int CreateCptNode(
	DSL_network &net, const char *id, const char *name, 
    std::initializer_list<const char *> outcomes, int xPos, int yPos)
{
    int handle = net.AddNode(DSL_CPT, id);
    DSL_node *node = net.GetNode(handle);
    node->SetName(name);
    node->Def()->SetNumberOfOutcomes(outcomes);
    DSL_rectangle &position = node->Info().Screen().position;
    position.center_X = xPos;
    position.center_Y = yPos;
    position.width = 85;
    position.height = 55;
    return handle;
}

int main() {

    // We read in a json file:
    std::ifstream file("data.json");
    json data;
    file >> data;

    // We have three vectors that make up the graph
    json& nodes = data["nodes"];
    json& links = data["links"];
    json& weights = data["weights"];

    // show errors and warnings in the console
    DSL_errorH().RedirectToFile(stdout);

    // We declare the network
    DSL_network net;

    for (const json& node : nodes) {
        std::string id = replaceSpaces(node["id"]);
        std::string name = node["id"];
        // TODO: We need a way to layout the nodes.
        int x = 50;
        int y = 50;
        CreateCptNode(net, id.c_str(), name.c_str(), 
            { "Ideal", "NotIdeal"}, x, y);
    }

    for (const json& link : links) {
        std::string sourceName = link["source"];
        int source = net.FindNode(sourceName.c_str());
        if (source < 0)
        {
            std::cout << "Source node not found: " << sourceName  << std::endl;
            return source;
        }

        std::string targetName = link["target"];
        int target = net.FindNode(targetName.c_str());
        {
            std::cout << "Target node not found: " << targetName  << std::endl;
            return target;
        }

        // auto sourceNode = net.GetNode(source);
        // auto targetNode = net.GetNode(source);

        net.AddArc(source, target);
    }

    for (const json& weight : weights) {
        
        double x_L = weight["notideal"];
        double x_H = weight["ideal"];

        std::vector<double> values;

        // Iterate over JSON object and extract all values
        for (auto& element : weight.items()) {
            values.push_back(element.value());
        }

        std::vector<double> matrix = calculate_CPT(values, x_L, x_H);

        std::cout << "CPT output: \n" << std::endl;
        for(int i = 0; i < matrix.size(); ++i) {
            std::cout << matrix[i] << " ";
        }
        std::cout << std::endl;

        std::string nodeId = replaceSpaces(weight["id"]);
        int res = net.GetNode(nodeId.c_str())->Def()->SetDefinition(matrix);

        // Just cutting it short atm
        break;
    }

        // if (DSL_OKAY != res)
        // {
        //     return res;
        // }

        // res = net.WriteFile("test.xdsl");
        // if (DSL_OKAY != res)
        // {
        //     return res;
        // }

    return 0;
}