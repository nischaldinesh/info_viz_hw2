"use client";

import { useState, useEffect } from "react";
import Scatterplot from "./components/Scatterplot";
import BarChart from "./components/BarChart";
import ScatterplotGroup from "./components/ScatterplotGroup";

const Home = () => {
  const [datasets, setDatasets] = useState<{ [key: string]: number[][] }>({});
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    fetch("/datasaurus.json")
      .then((res) => res.json())
      .then((json) => setDatasets(json));
  }, []);

  return (
    <div>
      <h1 className="text-center font-bold">
        Home Assignment 2: Same Stats, Different Graphs
      </h1>

      <div className="flex justify-center gap-20">
        {datasets.dino && (
          <Scatterplot
            data={datasets.dino}
            width={500}
            height={400}
            onBrush={(selectedData) => {
              const indices = new Set(
                selectedData.map((point) => datasets.dino.indexOf(point))
              );
              setSelectedIndices(indices);
            }}
          />
        )}
        <div className="pt-30">
          <BarChart
            data={
              selectedIndices.size > 0
                ? [...selectedIndices].map((i) => datasets.dino[i])
                : datasets.dino || []
            }
          />
        </div>
      </div>

      <h2 className="text-center font-bold">Scatterplot Group</h2>
      {Object.keys(datasets).length > 0 && (
        <ScatterplotGroup
          datasets={datasets}
          width={250}
          height={200}
          highlightedIndices={selectedIndices}
        />
      )}
    </div>
  );
};

export default Home;
