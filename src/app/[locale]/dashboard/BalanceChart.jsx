import React, { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler,
  Tooltip
);

const tooltipPlugin = {
  id: "customTooltip",
  afterDraw: (chart) => {
    if (chart.tooltip?._active?.length) {
      const activePoint = chart.tooltip._active[0];
      const { ctx } = chart;
      const { x, y } = activePoint.element;
      const { top, bottom } = chart.chartArea;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#36C6E0";
      ctx.stroke();
      ctx.restore();
    }
  },
};

const BalanceChart = () => {
  const [timeframe, setTimeframe] = useState("1M");
  const [hoveredValue, setHoveredValue] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);

  // Hard-coded data
  const hardcodedData = {
    labels: [
      "2024-11-25",
      "2024-11-26",
      "2024-11-27",
      "2024-11-28",
      "2024-11-29",
      "2024-11-30",
      "2024-12-01",
      "2024-12-02",
      "2024-12-03",
      "2024-12-04",
      "2024-12-05",
      "2024-12-06",
      "2024-12-07",
      "2024-12-08",
      "2024-12-09",
      "2024-12-10",
      "2024-12-11",
      "2024-12-12",
      "2024-12-13",
      "2024-12-14",
      "2024-12-15",
      "2024-12-16",
      "2024-12-17",
      "2024-12-18",
      "2024-12-19",
      "2024-12-20",
      "2024-12-21",
      "2024-12-22",
      "2024-12-23",
      "2024-12-24",
    ],
    values: [
      10234.50, 10450.75, 10320.40, 10680.90, 10500.20, 10750.60, 10920.30,
      11050.80, 10850.40, 11200.75, 11380.20, 11150.90, 11500.40, 11680.75,
      11450.30, 11800.60, 11950.20, 12100.90, 12345.67, 12200.50, 12450.80,
      12350.40, 12600.75, 12800.20, 12650.90, 12900.40, 13050.80, 12950.30,
      13200.75, 13400.20,
    ],
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chartContainerRef.current &&
        !chartContainerRef.current.contains(event.target)
      ) {
        setHoveredValue(null);
      }
    };

    const handleMouseLeave = () => {
      setHoveredValue(null);
    };

    document.addEventListener("click", handleClickOutside);

    if (chartContainerRef.current) {
      chartContainerRef.current.addEventListener(
        "mouseleave",
        handleMouseLeave
      );
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      if (chartContainerRef.current) {
        chartContainerRef.current.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      }
    };
  }, []);

  useEffect(() => {
    setHoveredValue(null);
  }, [timeframe]);

  const createGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, "#36C6E03D");
    gradient.addColorStop(1, "#36C6E000");
    return gradient;
  };

  const chartData = {
    labels: hardcodedData.labels,
    datasets: [
      {
        data: hardcodedData.values,
        fill: true,
        tension: 0.4,
        cubicInterpolationMode: "monotone",
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: "#36C6E0",
        pointBorderColor: "#000",
        pointBorderWidth: 2,
        borderWidth: 2.5,
        backgroundColor: (context) => createGradient(context.chart.ctx),
        borderColor: "#36C6E0",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    onHover: (event, elements) => {
      if (elements && elements.length) {
        const pointIndex = elements[0].index;
        const chart = chartRef.current;

        if (chart) {
          const point = chart.getElementsAtEventForMode(
            event,
            "nearest",
            { intersect: false },
            true
          )[0];
          if (point) {
            const { x, y } = point.element;

            setHoveredValue({
              value: hardcodedData.values[pointIndex],
              date: hardcodedData.labels[pointIndex],
              pointY: y,
            });

            setTooltipPosition({ x, y });
          }
        }
      } else {
        setHoveredValue(null);
      }
    },
    layout: {
      padding: {
        top: 20,
        right: 10,
        bottom: 0,
        left: 10,
      },
    },
    scales: {
      x: {
        display: true,
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 6,
          callback: function (value, index) {
            const date = new Date(hardcodedData.labels[index]);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          },
          color: "#737982",
          font: {
            weight: "500",
            size: 11,
          },
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        display: false,
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-6 justify-center w-full">
      <div
        ref={chartContainerRef}
        className="relative w-full h-[280px] bg-black rounded-xl border border-[#36C6E0]/20 p-6"
      >
        <Line
          ref={chartRef}
          data={chartData}
          options={options}
          plugins={[tooltipPlugin]}
        />

        {/* Custom Tooltip */}
        {hoveredValue && (
          <div
            className="absolute pointer-events-none bg-black text-white px-4 py-3 rounded-lg text-sm font-medium border border-[#36C6E0]/50"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `20px`,
              transform: "translateX(-50%)",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(54, 198, 224, 0.2)",
            }}
          >
            <div className="font-bold text-white">
              ${parseFloat(hoveredValue.value).toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(hoveredValue.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div
              className="absolute bg-[#36C6E0]/60"
              style={{
                left: "50%",
                bottom: `-${hoveredValue.pointY ? tooltipPosition.y - 60 : 0}px`,
                width: "1px",
                height: `${hoveredValue.pointY ? tooltipPosition.y - 60 : 0}px`,
                transform: "translateX(-50%)",
              }}
            />
          </div>
        )}
      </div>

      {/* Timeframe Toggle */}
      <div className="flex items-center h-[40px] bg-black border border-[#36C6E0]/20 justify-between rounded-lg w-full max-w-[360px] p-1">
        {["1W", "1M", "3M", "6M", "1Y", "All"].map((tf) => (
          <button
            key={tf}
            className={`relative flex-1 h-full rounded-md text-sm transition-all font-semibold ${
              timeframe === tf
                ? "bg-[#36C6E0]/20 text-[#36C6E0] border border-[#36C6E0]/50"
                : "text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BalanceChart;