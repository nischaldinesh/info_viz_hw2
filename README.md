# HomeWork Assignemnt 2: Same Stats, Different Graphs

This project uses the famous dinosaur dataset from the Datasaurus Dozen to illustrate a datasets with identical statistical summaries can look dramatically different when visualized. The interactivity allows users to brush over the scatterplots to reveal subtle variations, while the bar chart updates to reflect the changes, providing a dynamic exploration of data visualization.

## Technologies Used

- **React** & **Next.js**: For building the UI and handling client-side rendering.
- **D3.js**: For dynamic, data-driven visualizations.

## Live Website

Check out the live website [here](https://info-viz-hw2.vercel.app).

## page.tsx

- Fetches the dataset from the JSON file, from the public folder.
- Manages state, including the entire datasets and the indices of data points selected via brushing.
- Passes the selected data to the BarChart component and updates the state.
- Also renders the ScatterplotGroup component, which displays multiple scatterplots for other datasets, using the same selection state to highlight points.

## Scatterplot.tsx

- Implements an interactive scatterplot using D3.js
- Allows users to brush over data points, triggering an onBrush callback.
- This callback sends the selected data back to page.tsx, which updates the selection state.

## BarChart.tsx

- Receives data from page.tsx
- Computes the mean values and displays them as bars.

## ScatterplotGroup.tsx

- Uses the Scatterplot component to render a group of scatterplots for various datasets.
