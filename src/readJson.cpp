#include <iostream>
#include <fstream>
#include "json.hpp"

using json = nlohmann::json;

json outputNodeById(const std::string& newId, const std::string& targetId) {
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
        if (jsonData.contains("nodes")) {
            // Search for the node with the specified ID
            for (auto& node : jsonData["nodes"]) {
                if (node.contains("id") && node["id"] == targetId) {
                    std::cout << "Node with ID '" << targetId << "':\n" << node.dump(4) << std::endl;
                    node["id"] = newId;
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
            std::cerr << "Node with ID '" << targetId << "' not found." << std::endl;
                }

        } else {
            std::cerr << "No 'nodes' array found in JSON." << std::endl;
        }
    } catch (const std::exception& e) {
        std::cerr << "Error parsing JSON: " << e.what() << std::endl;
    }
        return json();;
}

int main(int argc, char *argv[]) {
    // Check if there are enough command-line arguments
    if (argc < 3) {
        std::cerr << "Usage: " << argv[0] << " <json_file_path> <key>" << std::endl;
        return 1; // Return an error code
    }

    std::string filePath = argv[1];
    std::string key = argv[2];

    // Get and output the ID from the JSON file
    std::string nodeId = outputNodeById(filePath, key);

    if (!nodeId.empty()) {
        std::cout << "Value associated with key '" << key << "': " << nodeId << std::endl;
    }

    return 0;
}
