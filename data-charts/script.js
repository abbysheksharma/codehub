const ctx = document.getElementById("pollutionChart").getContext("2d");

const pollutionData = {
  labels: ["2010", "2012", "2014", "2016", "2018", "2020"],
  datasets: [
    {
      label: "CO₂ Emissions (Billion Metric Tons)",
      data: [31.5, 32.3, 33.1, 33.5, 34.2, 33.9],
      backgroundColor: [
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 99, 132, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
      ],
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

let currentChart = new Chart(ctx, {
  type: "bar",
  data: pollutionData,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

document.getElementById("chartType").addEventListener("change", function () {
  currentChart.destroy();
  currentChart = new Chart(ctx, {
    type: this.value,
    data: pollutionData,
    options: {
      responsive: true,
      scales:
        this.value === "bar" || this.value === "line"
          ? {
              y: {
                beginAtZero: true,
              },
            }
          : {},
    },
  });
});
