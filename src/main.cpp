#include <iostream>
#include <fstream>
#include "json.hpp"
#include "rationalise_bn.h"

using json = nlohmann::json;

// We take a json input of just the scores
// Then we change the corresponding score with the same ID to match the new input
// The graph then rationalises itself.
json outputNodeById(json& newWeight) {
    // Filename is constant in this case
    const std::string filePath = "./data.json";

    // Read the JSON file
    std::ifstream fileStream(filePath);

    if (!fileStream.is_open()) {
        std::cerr << "Error opening file: " << filePath << std::endl;
        return json();;
    }

    try {
        json jsonData;
        fileStream >> jsonData;

        // Check if "nodes" array exists in the JSON object
        if (jsonData.contains("weights")) {
            // Search for the node with the specified ID
            for (auto& weight : jsonData["weights"]) {
                if (weight.contains("id") && weight["id"] == newWeight["id"]) {
                    std::cout << "Node with ID '" << newWeight["id"] << "':\n" << weight.dump(4) << std::endl;
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
            // If the loop completes without finding the node
            std::cerr << "Node with ID '" << newWeight["id"] << "' not found." << std::endl;
                }

        } else {
            std::cerr << "No 'nodes' array found in JSON." << std::endl;
        }
    } catch (const std::exception& e) {
        std::cerr << "Error parsing JSON: " << e.what() << std::endl;
    }
        return json();;
}

int main(int argc, char* argv[]) {
    // Check if there are enough command-line arguments
    if (argc < 1) {
        std::cerr << "Usage: " << argv[0] << " <json['weights']> as in data.json" << std::endl;
        return 1; // Return an error code
    }
    std::string jsonString = argv[1];

    json newWeight = json::parse(jsonString);

    // Get and output the ID from the JSON file
    outputNodeById(newWeight);

    // We call a header file to rationalise the BN.
    rationalise_bn();

    return 0;
}
