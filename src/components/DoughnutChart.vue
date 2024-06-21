<template>
  <div id="doughnutBox">
    <canvas ref="chartCanvas"></canvas>
    <p>{{ percentage }}%</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, defineProps } from "vue";
import Chart from "chart.js/auto";

// 建立一個 ref 來引用 canvas 元素
const chartCanvas = ref(null);
let chartInstance = null;
// 將 props 定義為一個函數，返回一個物件
const props = defineProps({
  phase: String,
});
// 監聽 phase 變化
watch(props, (newValue, oldValue) => {
  updateChart(newValue.phase);
});

// 更新圖表函數
const updateChart = (phase) => {
  const data = [
    { complete: 2010, count: calculatePercentage(phase) },
    { incomplete: 2010, count: 100 - calculatePercentage(phase) },
  ];

  // 更新 Chart.js 圖表資料
  chartInstance.data.datasets[0].data = data.map((row) => row.count);
  chartInstance.update();
};

// 計算百分比函數
const calculatePercentage = (phase) => {
  switch (phase) {
    case "提案階段":
      return 25;
    case "設計階段":
      return 50;
    case "工程階段":
      return 75;
    default:
      return 0;
  }
};
const percentage = computed(() => calculatePercentage(props.phase));

// 創建圖表
onMounted(() => {
  chartInstance = new Chart(chartCanvas.value, {
    type: "doughnut", // 選擇圖表類型
    data: {
      labels: ["進度", "剩餘"], // 標籤
      datasets: [
        {
          label: "專案完成度",
          data: [0, 100],
          backgroundColor: ["#2466E2", "#E1E5EE"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: {
        legend: {
          position: "top",
          display: false,
        },
        title: {
          display: false,
          text: "專案完成度",
        },
      },
    },
  });
});

// 在組件卸載時銷毀圖表
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>
