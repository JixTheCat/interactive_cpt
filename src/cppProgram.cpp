#include <iostream>
#include <fstream>
#include "json.hpp"

using json = nlohmann::json;

void updateJsonFile(const std::string& filePath, const std::string& selectedNodeId, const std::string& newId) {
    // Read the JSON file
    std::ifstream fileStream(filePath);
    
    if (!fileStream.is_open()) {
        std::cerr << "Error opening file: " << filePath << std::endl;
        return;
    }

    try {
        json jsonData;
        fileStream >> jsonData;

        // Iterate over the array or object to find and update the entry
        for (auto& entry : jsonData) {
            if (entry["selectedNodeId"] == selectedNodeId) {
                entry["selectedNodeId"] = newId;
                break; // Assuming there's only one matching entry
            }
        }

        // Write the updated JSON back to the file
        std::ofstream outFileStream(filePath);
        if (outFileStream.is_open()) {
            outFileStream << std::setw(4) << jsonData; // Pretty-print with indentation
            std::cout << "Entry updated successfully." << std::endl;
        } else {
            std::cerr << "Error writing to file: " << filePath << std::endl;
        }
    } catch (const std::exception& e) {
        std::cerr << "Error parsing or updating JSON: " << e.what() << std::endl;
    }
}

json parseJsonString(const std::string& jsonString) {
    try {
        return json::parse(jsonString);
    } catch (const std::exception& e) {
        std::cerr << "Error parsing JSON: " << e.what() << std::endl;
        // Return an empty JSON object in case of an error.
        return json();
    }
}

int main(int argc, char *argv[]) {
    // Check if there is at least one command-line argument
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <json_string>" << std::endl;
        return 1; // Return an error code
    }

    // The first command-line argument is assumed to be the JSON string
    std::string jsonString = argv[1];

    std::cout << jsonString << std::endl;

    // Parse the JSON string
    json parsedJson = parseJsonString(jsonString);

    // Check if parsing was successful
    if (!parsedJson.empty()) {
        // Access values by key
        std::string selectedNodeId = parsedJson["selectedNodeId"];
        std::string newId = parsedJson["newId"];

        // Use the values as needed
        std::cout << "Selected Node ID: " << selectedNodeId << std::endl;
        std::cout << "New ID: " << newId << std::endl;

    std::string filePath = "./data.json";

    updateJsonFile(filePath, selectedNodeId, newId);
    std::cout << "File updated..." << std::endl;
    }
    return 0;
}