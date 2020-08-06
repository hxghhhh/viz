import React from "react";
import { Graph } from "@vx/network";
import { useTooltip, Tooltip, defaultStyles } from "@vx/tooltip";
import { localPoint } from "@vx/event";

export type NetworkProps = {
  width: number;
  height: number;
  user: string;
};

type TooltipData = {
  x: number;
  y: number;
  user: string;
};

let tooltipTimeout: number;

const nodes = [
  { x: 80, y: 20, user: "hugh" },
  { x: 200, y: 300, user: "Joel" },
  { x: 300, y: 40, user: "Matt" }
];

const links = [
  { source: nodes[0], target: nodes[1] },
  { source: nodes[1], target: nodes[2] },
  { source: nodes[2], target: nodes[0] }
];

const graph = {
  nodes,
  links
};

export const background = "#272b4d";

export default function Example({ width, height }: NetworkProps) {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip
  } = useTooltip<TooltipData>();

  return width < 10 ? null : (
    <>
      <svg width={width} height={height}>
        <rect width={width} height={height} rx={14} fill={background} />
        <Graph
          graph={graph}
          nodeComponent={() => (
            <circle
              r={15}
              fill="#24FD"
              onClick={() => hideTooltip()}
              onMouseOut={() => {
                tooltipTimeout = window.setTimeout(() => {
                  hideTooltip();
                }, 300);
              }}
              onMouseEnter={(event, datum) => {
                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                const coords = localPoint(event.target.ownerSVGElement, event);
                console.log(coords);
                showTooltip({
                  tooltipLeft: coords.x,
                  tooltipTop: coords.y,
                  tooltipData: { foo: "bar" }
                });
              }}
            />
          )}
          linkComponent={({ link }) => (
            <line
              x1={link.source.x}
              y1={link.source.y}
              x2={link.target.x}
              y2={link.target.y}
              strokeWidth={2}
              stroke="#999"
              strokeOpacity={0.6}
            />
          )}
        />
      </svg>
      {tooltipOpen && tooltipData && (
        <Tooltip left={tooltipLeft} top={tooltipTop}>
          <div>{JSON.stringify(tooltipData)}</div>
        </Tooltip>
      )}
    </>
  );
}
