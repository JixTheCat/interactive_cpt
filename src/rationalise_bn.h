#include <iostream>
#include <fstream>
#include "json.hpp" // nlohmann/json library
#include <vector>
#include <unordered_set>
#include <set>
#include <tuple>


using json = nlohmann::json;

// template<typename T>

json removeFromVector(json list, const std::vector<std::size_t>& removelist) {
    // Sort the removelist in descending order
    std::vector<std::size_t> sortedRemovelist = removelist;
    std::sort(sortedRemovelist.begin(), sortedRemovelist.end(), std::greater<std::size_t>());

    // // Remove elements from the list in reverse order of indices
    for (auto i = sortedRemovelist.begin(); i != sortedRemovelist.end(); ++i) {
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
    // std::cout << "In generateRandomNumber" << std::endl;
    // Seed the random number generator with the current time
    // Generate a random number between 1 and 10
    \
    return (std::rand() % 10) + 1;
}

json newNode(std::string id) {
    // std::cout << "In newNode" << std::endl;
    json newJson = {
                {"id", id},
                {"colour", generateRandomNumber()}};
    return newJson; 
}

json newWeight(std::string id) {
    std::cout << "In newWeight" << std::endl;
    return 
        {
            {"ideal", 0.5},
            {"notideal", 0.5},
            {"idealkey", "ideal",},
            {"notidealkey", "not ideal"},
            {"id", id},
            {"scores", {}}
        };
}

// Function to rationalize the nodes of the network based on the weights section
json rationaliseNodes(json& data) {
    std::cout << "In rationliseNodes" << std::endl;

    // // Extract nodes, links, and weights from the JSON data
    json& nodes = data["nodes"];
    std::unordered_set<std::string> existingNodeIds;
    // Populate the set with existing node IDs
    for (const json& node : nodes) {
        existingNodeIds.insert(node["id"].get<std::string>());
    }
    existingNodeIds.insert("");

    json& links = data["links"];

    json& weights = data["weights"];
    std::unordered_set<std::string> existingWeightIds;
    // Populate the set with existing node IDs
    for (const json& weight : weights) {
        existingWeightIds.insert(weight["id"].get<std::string>());
    }
    existingWeightIds.insert("");

    json newNodes;
    json newWeights;

    // Iterate through each weight
    for (const json& weight : weights) {
        std::string weightId = weight["id"];
        json scores = weight["scores"];

        // Check if the weightId already exists as a node
        if (existingNodeIds.find(weightId) == existingNodeIds.end()) {
            // If the weightId is not found in the set, it's safe to add the node
            newNodes.push_back(newNode(weightId));
            existingNodeIds.insert(weightId); // Add the new ID to the set
        }

        // Iterate through scores to create/update links
        for (json::iterator score = scores.begin(); score != scores.end(); ++score) {
            std::string scoreId = score.key();
            double scoreValue;
            if (!score.value().is_null() && score.value().is_number()) {
                scoreValue = score.value();
            } else {
                continue;
            }
            // Check if the scoreKey already exists as a node
            if (existingNodeIds.find(scoreId) == existingNodeIds.end()) {
                // If the weightId is not found in the set, it's safe to add the node
                newNodes.push_back(newNode(scoreId));
                existingNodeIds.insert(scoreId); // Add the new ID to the set
            }

                
            // Check if the scoreKey already exists as a weight
            if (existingWeightIds.find(scoreId) == existingWeightIds.end()) {
                // If the weightId is not found in the set, it's safe to add the weight
                newWeights.push_back(newWeight(scoreId));
                existingWeightIds.insert(scoreId); // Add the new ID to the set
            }
        }
    }
    for (json newNode : newNodes) {
        nodes.push_back(newNode);
    }
    for (json newWeight : newWeights) {
        weights.push_back(newWeight);
    }

    return {
        {"nodes", nodes},
        {"links", links},
        {"weights", weights}
    };
}

// Function to rationalize the nodes of the network based on the weights section
json rationaliseLinks(json& data) {
    std::cout << "In rationliseLinks" << std::endl;

    // // Extract nodes, links, and weights from the JSON data
    json& nodes = data["nodes"];
    json& links = data["links"];
    json& weights = data["weights"];

    json newLinks;

    for (json& weight : weights) {
        std::string weightId = weight["id"];
        json scores = weight["scores"];
        std::cout << "investigating weight for: " << weightId << std::endl;

        // Iterate through scores to create/update links
        for (json::iterator score = scores.begin(); score != scores.end(); ++score) {
            std::string scoreId = score.key();
            std::cout << "investigating score for: " << scoreId << std::endl;
            double scoreValue;
            if (!score.value().is_null() && score.value().is_number()) {
                scoreValue = score.value();
            }

            // Create/update link between scoreKey and weightId
            bool link_exists = false;
            for (json& link : links) {
                std::cout << "investigating links for: " << link << std::endl;

                if (link["source"] == scoreId && link["target"] == weightId && scoreId != weightId) {
                    std::cout << "Link exists: " << link["source"] << " to " << link["target"] << std::endl;
                    link_exists = true;

                    if (link["value"] != scoreValue) { // Update value if link already exists
                        json newLink = {
                            {"source", scoreId},
                            {"target", weightId},
                            {"value", scoreValue}
                        };
                        std::cout << "updating link score!: \n" << newLink << std::endl;
                        newLinks.push_back(newLink);
                    } else {
                        newLinks.push_back(link);
                    }

                    break;
                }
            }
            if (!link_exists && scoreId != weightId) {
                json newLink = {
                    {"source", scoreId},
                    {"target", weightId},
                    {"value", scoreValue}
                };
                std::cout << "Link doesnt exist adding: \n" << newLink << std::endl;
                newLinks.push_back(newLink);
            }
        }
    }
    return {
        {"nodes", nodes},
        {"links", newLinks},
        {"weights", weights}
    };
}

// We clean up after adding things - to removing entries that have been renamed.
json deleteNodeEntriesByID(json data) {
    std::cout << "In deleteNodeEntriesByID" << std::endl;
    json nodes = data["nodes"];
    json weights = data["weights"];

    json nodesToKeep;
    for (json& node : nodes) {
        std::string nodeId = node["id"];
        bool keep = false;
        for (json& weight : weights) {
            std::string weightId = weight["id"];
            if (nodeId == weightId) {
                keep = true;
                break; // No need to continue checking once a match is found
            }
        }
        if (keep) {
            nodesToKeep.push_back(node);
        }
    }
    return nodesToKeep;
}

// Define a structure for links and a custom hash function if using std::unordered_set
struct Link {
    std::string source;
    std::string target;
    double value;

    bool operator<(const Link& other) const {
        return std::tie(source, target, value) < std::tie(other.source, other.target, other.value);
    }
};

json deleteLinksByID(json data) {
    std::cout << "In deleteLinksByID" << std::endl;
    json links = data["links"];
    json weights = data["weights"];

    std::vector<size_t> linksToRemove;
    std::set<Link> uniqueLinks;

    for (size_t i = 0; i < links.size(); i++) {
        json link = links[i];

        std::string source = link["source"];
        std::string target = link["target"];
        double value = link["value"];

        Link currentLink = {source, target, value};
        // Check for uniqueness
        if (uniqueLinks.find(currentLink) != uniqueLinks.end() || source == target) {
            // Duplicate found, mark for removal
            linksToRemove.push_back(i);
            continue; // Skip further processing for duplicates
        } else {
            uniqueLinks.insert(currentLink);
        }

        // Existing logic to check if the link's source exists in scores
        bool linkInScores = false;
        for (json weight : weights) {
            if (weight["id"] == target) {
                for (json::iterator score = weight["scores"].begin(); score != weight["scores"].end(); ++score) {
                    if (score.key() == source && score.value() == value) {
                        linkInScores = true;
                        break;
                    }
                }
            }
        }
        if (!linkInScores) {
            linksToRemove.push_back(i);
        }
    }

    // Assuming removeFromVector removes elements from 'links' based on indices in 'linksToRemove'
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
    json newNodes = rationaliseNodes(data);
    // We look for missing links only after all the new nodes are added!
    json newLinks = rationaliseLinks(newNodes);

    newLinks["nodes"] = deleteNodeEntriesByID(newLinks);
    newLinks["links"] = deleteLinksByID(newLinks);

    // // Write the modified JSON data back to file or do whatever you want with it
    std::ofstream outFile("data.json");
    outFile << std::setw(4) << newLinks << std::endl;

    return 0;
}
