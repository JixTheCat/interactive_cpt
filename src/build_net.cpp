// tutorial1.cpp
// Tutorial1 creates a simple network with three nodes,
// then saves it as XDSL file to disk.
#include <iostream>
#include <string>

#include "smile.h"
#include <cstdio>

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
    int y = 50
    CreateCptNode(net, id, name, 
        { "Ideal", "NotIdeal"}, x, y);
}

for (const json& link : links) {
    std::string sourceName = link["source"]
    int source = net.FindNode(sourceName);
    if (toa < 0)
    {
        printf("Outside air temperature node not found.\n");
        return toa;
    }
    std::string targetName = link["target"]
    int target = net.FindNode(targetName);

    auto sourceNode = net.GetNode(source)
    auto targetNode = net.GetNode(source)

    net.AddArc(sourceNode, targetNode);
}


    int res = net.GetNode(e)->Def()->SetDefinition({
        0.2, // P(Economy=U)
        0.7, // P(Economy=F)
        0.1  // P(Economy=D)
    });
    if (DSL_OKAY != res)
    {
        return res;
    }

    res = net.GetNode(s)->Def()->SetDefinition({
        0.3, // P(Success=S|Economy=U)
        0.7, // P(Success=F|Economy=U)
        0.2, // P(Success=S|Economy=F)
        0.8, // P(Success=F|Economy=F)
        0.1, // P(Success=S|Economy=D)
        0.9  // P(Success=F|Economy=D)
    });
    if (DSL_OKAY != res)
    {
        return res;
    }

    res = net.GetNode(f)->Def()->SetDefinition({
        0.70, // P(Forecast=G|Success=S,Economy=U)
        0.29, // P(Forecast=M|Success=S,Economy=U)
        0.01, // P(Forecast=P|Success=S,Economy=U)
        0.65, // P(Forecast=G|Success=S,Economy=F)
        0.30, // P(Forecast=M|Success=S,Economy=F)
        0.05, // P(Forecast=P|Success=S,Economy=F)
        0.60, // P(Forecast=G|Success=S,Economy=D)
        0.30, // P(Forecast=M|Success=S,Economy=D)
        0.10, // P(Forecast=P|Success=S,Economy=D)
        0.15, // P(Forecast=G|Success=F,Economy=U)
        0.30, // P(Forecast=M|Success=F,Economy=U)
        0.55, // P(Forecast=P|Success=F,Economy=U)
        0.10, // P(Forecast=G|Success=F,Economy=F)
        0.30, // P(Forecast=M|Success=F,Economy=F)
        0.60, // P(Forecast=P|Success=F,Economy=F)
        0.05, // P(Forecast=G|Success=F,Economy=D)
        0.25, // P(Forecast=G|Success=F,Economy=D)
        0.70  // P(Forecast=G|Success=F,Economy=D)
    });
    if (DSL_OKAY != res)
    {
        return res;
    }

    res = net.WriteFile("tutorial1.xdsl");
    if (DSL_OKAY != res)
    {
        return res;
    }

    printf("Tutorial1 complete: Network written to tutorial1.xdsl\n");
    return DSL_OKAY;
}


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