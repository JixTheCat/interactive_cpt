#include <iostream>
#include <fstream>
#include "json.hpp" // nlohmann/json library

using json = nlohmann::json;

// Seed the random number generator only once
void initializeRandomNumberGenerator() {
    std::srand(static_cast<unsigned int>(std::time(nullptr)));
}
// Function to generate a random number between 1 and 10
// This is used for colours in the graph
int generateRandomNumber() {
    // Seed the random number generator with the current time
    // Generate a random number between 1 and 10
    return (std::rand() % 10) + 1;
}

// Function to rationalize the structure of the network based on the weights section
void rationalizeNetwork(json& data) {
    // Extract nodes, links, and weights from the JSON data
    json& nodes = data["nodes"];
    json& links = data["links"];
    json& weights = data["weights"];

    // Iterate through each weight
    for (const json& weight : weights) {
        std::string weightId = weight["id"];
        json scores = weight["scores"];

        // Check if the weightId already exists as a node
        bool nodeExists = false;
        for (const json& node : nodes) {
            if (node["id"] == weightId) {
                nodeExists = true;
                break;
            }
        }

        // If weightId doesn't exist as a node, create a new node
        if (!nodeExists) {
            json newNode = {
                {"id", weightId},
                {"colour", generateRandomNumber()}};
            nodes.push_back(newNode);
        }

        // Iterate through scores to create/update links
        for (json::iterator score = scores.begin(); score != scores.end(); ++score) {
            std::string scoreId = score.key();
            auto scoreValue = score.value();
            // Check if the scoreKey already exists as a node
            bool keyExists = false;
            for (const json& node : nodes) {
                if (node["id"] == scoreId) {
                    keyExists = true;
                    break;
                }
            }

            // If scoreKey doesn't exist as a node, create a new node
            if (!keyExists) {
                json newKeyNode = {{"id", scoreId},
                {"colour", generateRandomNumber()}};
                nodes.push_back(newKeyNode);
            }

            // Create/update link between scoreKey and weightId
            bool linkExists = false;
            for (json& link : links) {
                if (link["source"] == scoreId && link["target"] == weightId) {
                    link["value"] = scoreValue; // Update value if link already exists
                    linkExists = true;
                    break;
                }
            }
            // If the link doesn't exist, create a new link
            if (!linkExists) {
                json newLink = {
                    {"source", scoreId},
                    {"target", weightId},
                    {"value", scoreValue}
                };
                links.push_back(newLink);
            }
        }
    }
}

int rationalise_bn() {
    initializeRandomNumberGenerator();
    // Read JSON data from file
    std::ifstream file("test.json");
    json data;
    file >> data;

    // Rationalize the structure of the network
    rationalizeNetwork(data);

    // Write the modified JSON data back to file or do whatever you want with it
    std::ofstream outFile("data.json");
    outFile << std::setw(4) << data << std::endl;

    return 0;
}
