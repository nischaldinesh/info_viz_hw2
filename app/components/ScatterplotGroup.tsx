"use client";

import Scatterplot from "./Scatterplot";

type ScatterplotGroupProps = {
  datasets: { [key: string]: number[][] };
  width: number;
  height: number;
  highlightedIndices: Set<number>;
};

const ScatterplotGroup: React.FC<ScatterplotGroupProps> = ({
  datasets,
  width,
  height,
  highlightedIndices,
}) => {
  return (
    <div className="mx-auto grid grid-cols-4 gap-2.5 justify-items-center">
      {Object.keys(datasets)
        .filter((key) => key !== "dino")
        .map((key) => (
          <div key={key}>
            <h4 className="text-center">{key}</h4>
            <Scatterplot
              data={datasets[key]}
              width={width}
              height={height}
              onBrush={() => {}}
              highlightedIndices={highlightedIndices}
            />
          </div>
        ))}
    </div>
  );
};

export default ScatterplotGroup;
