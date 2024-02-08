#include <iostream>
#include <fstream>
#include "json.hpp" // nlohmann/json library
#include <vector>

using json = nlohmann::json;

// template<typename T>

json removeFromVector(json list, const std::vector<std::size_t>& removelist) {
    // Sort the removelist in descending order
    std::vector<std::size_t> sortedRemovelist = removelist;
    std::sort(sortedRemovelist.begin(), sortedRemovelist.end(), std::greater<std::size_t>());

    // // Remove elements from the list in reverse order of indices
    for (auto i = sortedRemovelist.begin(); i != sortedRemovelist.end(); ++i) {
        std::cout << "\nId: " << *i << "\n" << (list[*i]) << std::endl;
        list.erase(*i);
        // std::cout << "\nId:" << *i << "is now" << "\n" << (list[*i]) << std::endl;
    }
    return list;
}

// Seed the random number generator only once
void initializeRandomNumberGenerator() {
    std::srand(static_cast<unsigned int>(std::time(nullptr)));
}
// Function to generate a random number between 1 and 10
// This is used for colours in the graph
int generateRandomNumber() {
    std::cout << "In generateRandomNumber" << std::endl;
    // Seed the random number generator with the current time
    // Generate a random number between 1 and 10
    \
    return (std::rand() % 10) + 1;
}

json newNode(std::string id) {
    std::cout << "In newNode" << std::endl;
    return {
                {"id", id},
                {"colour", generateRandomNumber()}};
}

json newWeight(std::string id) {
    std::cout << "In newWeight" << std::endl;
    return 
        {
            {"High", 0.5},
            {"Low", 0.5},
            {"id", id},
            {"scores", {}}
        };
}

// Function to rationalize the structure of the network based on the weights section
json rationaliseNetwork(json& data) {
    std::cout << "In rationliseNetwork" << std::endl;
    // Extract nodes, links, and weights from the JSON data
    json& nodes = data["nodes"];
    json& links = data["links"];
    json& weights = data["weights"];

    // // Iterate through each weight
    for (const json& weight : weights) {
        std::string weightId = weight["id"];
        json scores = weight["scores"];

    //     // Check if the weightId already exists as a node
        bool nodeExists = false;
        for (const json& node : nodes) {
            if (node["id"] == weightId) {
                nodeExists = true;
                break;
            }
        }

        // If weightId doesn't exist as a node, create a new node
        if (!nodeExists) {
            nodes.push_back(newNode(weightId));
        }

        // Iterate through scores to create/update links
        for (json::iterator score = scores.begin(); score != scores.end(); ++score) {
            std::string scoreId = score.key();
            float scoreValue = score.value();
    //         // Check if the scoreKey already exists as a node
            bool keyExists = false;
            for (const json& node : nodes) {
                if (node["id"] == scoreId) {
                    keyExists = true;
                    break;
                }
            }

            // If scoreKey doesn't exist as a node, create a new node
            if (!keyExists) {
                nodes.push_back(newNode(scoreId));
                weights.push_back(newWeight(scoreId));
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
    return {
        {"nodes", nodes},
        {"links", links},
        {"weights", weights}
    };
}

// We clean up after adding things - to removing entries that have been renamed.
json deleteNodeEntriesByID(json data) {
    std::cout << "In deleteNodeEntriesByID" << std::endl;
    json nodes = data["nodes"];
    json weights = data["weights"];
    // Iterate through each node
    std::vector<long unsigned int> nodesToRemove;
    for (int i = 0; i<nodes.size(); i++) {
        json node = nodes[i];
    // for (json node : nodes) {
        std::string nodeId = node["id"];

        // Check if the weightId exists
        bool nodeExists = false;
        for (const json& weight : weights) {
            if (weight["id"] == nodeId) {
                nodeExists = true;
            } 
        }
        if (!nodeExists) {
            nodesToRemove.push_back(i);
        }
    }
    return removeFromVector(nodes, nodesToRemove);
}

json deleteLinksByID(json data) {
    std::cout << "In deleteLinksByID" << std::endl;
    json links = data["links"];
    json weights = data["weights"];
    // Iterate through the array and remove entries with matching IDs

    // Iterate through the links and remove any link not in 
    std::vector<long unsigned int> linksToRemove;
    for (int i = 0; i<links.size(); i++) {
        json link = links[i];

        std::string source = link["source"];
        std::string target = link["target"];
        float value = link["value"];

        // Check if the link's source exists in scores
        bool linkInScores = false;
        for (json weight : weights) {
            if (
                weight["id"] == target
             ) {
                for (json::iterator score = weight["scores"].begin(); score != weight["scores"].end(); ++score) {
                    if (score.key() == source &&
                    score.value() == value) {
                        linkInScores = true;
                        break;
                    }
                }
            }
        }
            // If the link's source does not exist in scores, remove the link
        if (!linkInScores) {
            linksToRemove.push_back(i);
        }
    }
    return removeFromVector(links, linksToRemove);
}

int rationalise_bn() {
    std::cout << "rationalising json..." << std::endl;
    initializeRandomNumberGenerator();
    // Read JSON data from file
    std::ifstream file("data.json");
    json data;
    file >> data;

    // Rationalize the structure of the network
    json newData = rationaliseNetwork(data);

    newData["nodes"] = deleteNodeEntriesByID(newData);
    newData["links"] = deleteLinksByID(newData);

    // Write the modified JSON data back to file or do whatever you want with it
    std::ofstream outFile("data.json");
    outFile << std::setw(4) << newData << std::endl;

    return 0;
}
