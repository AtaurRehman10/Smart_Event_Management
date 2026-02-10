import React, { useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function NetworkGraph({ graph }) {
     const data = useMemo(() => ({
          nodes: graph.nodes.map(n => ({ ...n })),
          links: graph.links.map(l => ({ ...l }))
     }), [graph]);

     return (
          <div style={{ border: "1px solid #ddd", height: 500 }}>
               <ForceGraph2D
                    graphData={data}
                    nodeLabel={(node) => `${node.name} (${node.company})`}
                    linkLabel={(link) => `Similarity: ${link.value}`}
                    nodeAutoColorBy="industry"
               />
          </div>
     );
}
