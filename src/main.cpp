#include <iostream>
#include <fstream>
#include "json.hpp"
#include "rationalise_bn.h"

using json = nlohmann::json;

// We take a json input of just the scores
// Then we change the corresponding score with the same ID to match the new input
// The graph then rationalises itself.
void writeNewWeight(std::string id, json newWeight) {
    std::cout << "In outputNodeById" << std::endl;

    // Filename is constant in this case
    const std::string filePath = "./data.json";

    // Read the JSON file
    std::ifstream fileStream(filePath);
    if (!fileStream.is_open()) {
        std::cerr << "Error opening file: " << filePath << std::endl;
        return;
    }

    json jsonData;
    fileStream >> jsonData;

    json newNodes;
    for (json node : jsonData["nodes"]) {
        if (node["id"] == id) {
            json newNode = node;
            newNode["id"] = id;
            newNodes.push_back(newNode);
            continue;
        }
        newNodes.push_back(node);
    }

    std::vector<std::string> weightsToChange;
    json newLinks;
    for (json link : jsonData["links"])
            {
                if (link["source"] == id) {
                    weightsToChange.push_back(link["target"]);
                    json newLink = link;
                    newLink["source"] = newWeight["id"];
                    newLinks.push_back(newLink);
                    continue;
                }
                if (link["target"] == id) {
                    json newLink = link;
                    newLink["target"] = newWeight["id"];
                    newLinks.push_back(newLink);
                    continue;
                }
                newLinks.push_back(link);
            }

    json newWeights;
    for (json weight : jsonData["weights"]) {
        // We check if we need to change the weights id:
        std::cout << "At: '" << weight["id"] << "':\n" << newWeight.dump(4) << std::endl;
        bool idFoundInScores = false;
        if (weight["id"] == id) {
            // std::cout << "Node with ID '" << id << "':\n" << weight.dump(4) << std::endl;
            // std::cout << "Replaced with: '" << id << "':\n" << newWeight.dump(4) << std::endl;
            newWeights.push_back(newWeight);
            continue;
        }
        for (auto score : weight["scores"].items()) {
            if (score.key() == id) {
                // Assuming newWeight contains a new score for the id, and you want to update it directly
                weight["scores"][id] = newWeight["scores"][id]; // Update the score with the new value
                std::cout << weight["scores"][id] << "Replaced with: '" << newWeight["scores"][id] << std::endl;
            }
        }
        newWeights.push_back(weight);
    }
    // Write the updated JSON back to the file (optional)
    std::ofstream outFileStream(filePath);
    if (outFileStream.is_open()) {

        json newData;
        newData["nodes"] = newNodes;
        newData["links"] = newLinks;
        newData["weights"] = newWeights;

        outFileStream << std::setw(4) << newData; // Pretty-print with indentation
        std::cout << "Node updated successfully." << std::endl;
    } else {
        std::cerr << "Error writing to file: " << filePath << std::endl;
    return;
    }
}

json parseJson(json data) {
    // Here is an example of what the json should look like:
        // {
        //     "id": "vineyard floor management",
        //     "ideal": 0.9,
        //     "idealkey": null,
        //     "notideal": null,
        //     "notidealkey": null,
        //     "scores": {
        //         "tractor passes": 5
        //     }
        // }
    json newData;
    std::string str;
    if (data["ideal"].is_string()) {
        str = data["ideal"];
        newData["ideal"] = std::stod(str);
    } else {
        newData["ideal"] = data["ideal"];
    }

    if (data["notideal"].is_string()) {
        str = data["notideal"];
        newData["notideal"] = std::stod(str);
    } else {
        newData["notideal"] = data["notideal"];
    }

    json scores;
    std::string key;
    for (json::iterator score = data["scores"].begin(); score != data["scores"].end(); ++score) {
        if (score.value().is_string()) {
            str = score.value();
            float val = std::stod(str);
            if (val && score.value()>0) {
                key = score.key();
                scores[key] = val;
            }
        }
    }

    newData["scores"] = scores;
    newData["id"] = data["id"];
    newData["idealkey"] = data["idealkey"];
    newData["notidealkey"] = data["notidealkey"];

    return newData;
}

int main(int argc, char* argv[]) {
    std::cout << "In main" << std::endl;
    // Check if there are enough command-line arguments
    if (argc < 3) {
        std::cerr << "Usage: " << argv[0] << " <json['weights']> as in data.json" << std::endl;
        return 1; // Return an error code
    }
    std::string id = argv[1];
    std::string jsonString = argv[2];

    std::cout << "C++ Input: " << id << " " << jsonString << std::endl;
    // json inputJson = json::parse(jsonString);

    //we fix floats that are strings
    json newWeight = parseJson(json::parse(jsonString));

    std::cout << "C++ json: " << newWeight << std::endl;
    // Get and output the ID from the JSON file
    writeNewWeight(id, newWeight);

    // We call a header file to rationalise the BN.
    rationalise_bn();

    return 0;
}
