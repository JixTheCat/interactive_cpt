#include <iostream>
#include <fstream>
#include "json.hpp"
#include "rationalise_bn.h"

using json = nlohmann::json;

// We take a json input of just the scores
// Then we change the corresponding score with the same ID to match the new input
// The graph then rationalises itself.
json outputNodeById(std::string id, json& newWeight) {
    std::cout << "In outputNodeById" << std::endl;
    // Filename is constant in this case
    const std::string filePath = "./data.json";

    // Read the JSON file
    std::ifstream fileStream(filePath);

    if (!fileStream.is_open()) {
        std::cerr << "Error opening file: " << filePath << std::endl;
        return json();;
    }

    json jsonData;
    fileStream >> jsonData;

    std::vector<std::string> weightsToChange;
    for (auto link : jsonData["links"])
            {
                if (link["source"] == id) {
                    weightsToChange.push_back(link["target"]);
                    link["source"] = newWeight["id"];
                }
            }
    for (auto& weight : jsonData["weights"]) {
        for (std::string target : weightsToChange) {
            if (weight["id"] == target) {
                auto itr = weight["scores"].find(id); // try catch this, handle case when key is not found
                std::swap(weight["scores"][newWeight["id"]], itr.value());
                weight["scores"].erase(itr);
            }
        }
        if (weight.contains("id") && weight["id"] == id) {
            std::cout << "Node with ID '" << id << "':\n" << weight.dump(4) << std::endl;
            weight = newWeight;

            // Write the updated JSON back to the file (optional)
            std::ofstream outFileStream(filePath);
            if (outFileStream.is_open()) {
                outFileStream << std::setw(4) << jsonData; // Pretty-print with indentation
                std::cout << "Node updated successfully." << std::endl;
            } else {
                std::cerr << "Error writing to file: " << filePath << std::endl;
            }
            return jsonData.dump();
        }
    }
    // If the loop completes without finding the node
    // we purge the data of unknown nodes and throw an error
    std::ifstream file("data.json");
    json data;
    file >> data;
    // deleteEntriesByID(data);
    std::cerr << "outputNodeById: Node with ID '" << id << "' not found." << std::endl;
    std::cerr << "unknown entries purged." << std::endl;
    
    return json();;
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
    json newWeight = json::parse(jsonString);

    std::cout << "C++ json: " << newWeight << std::endl;
    // Get and output the ID from the JSON file
    outputNodeById(id, newWeight);

    // We call a header file to rationalise the BN.
    rationalise_bn();

    return 0;
}
