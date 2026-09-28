// 4주차 실습 2 · 공개 CSV를 두 가지 시각화로
// CSV: Our World in Data, Share of the population with access to electricity

console.log("statistics.js 연결 성공!");

const CSV_PATH = "./data/electricity-access.csv";
const VALUE_COL = "Share of the population with access to electricity";
const BASE_YEAR = 2024;
const START_YEAR = 2000;
const END_YEAR = 2024;

// 그래프에 쓸 소득 그룹과 색입니다. (CSV의 Entity 이름과 정확히 같아야 합니다.)
const GROUPS = [
  { key: "Low-income countries", label: "저소득 국가", color: "#d94a4a" },
  { key: "Lower-middle-income countries", label: "중하위 소득 국가", color: "#e0a326" },
  { key: "Upper-middle-income countries", label: "중상위 소득 국가", color: "#2f6fed" },
  { key: "High-income countries", label: "고소득 국가", color: "#2f8f6b" },
  { key: "World", label: "세계 평균", color: "#8a7fd6" }
];

const statusEl = document.querySelector("#status");
const charts = {};

function setStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.classList.toggle("is-error", Boolean(isError));
}

// CSV의 Entity·Year·값을 표로 정리합니다.
// 값이 비어 있으면 0으로 바꾸지 않고 null로 남겨 그래프에서 비워 둡니다.
function buildTable(rows) {
  const table = {};
  let missing = 0;

  rows.forEach(function (row) {
    const entity = (row.Entity || "").trim();
    const year = Number.parseInt(row.Year, 10);
    if (!entity || Number.isNaN(year)) {
      return;
    }

    const raw = (row[VALUE_COL] || "").trim();
    let value = null;
    if (raw === "") {
      missing += 1;
    } else {
      value = Number(raw);
      if (Number.isNaN(value)) {
        missing += 1;
        return;
      }
    }

    if (!table[entity]) {
      table[entity] = {};
    }
    table[entity][year] = value;
  });

  return { table: table, missing: missing };
}

function makeBarChart(table) {
  const labels = [];
  const values = [];
  const colors = [];

  GROUPS.forEach(function (group) {
    const series = table[group.key];
    const value = series && series[BASE_YEAR] !== undefined ? series[BASE_YEAR] : null;
    labels.push(group.label);
    values.push(value);
    colors.push(group.color);
  });

  return new Chart(document.querySelector("#chart-1"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: BASE_YEAR + "년 전력 접근률",
          data: values,
          backgroundColor: colors,
          borderRadius: 6,
          maxBarThickness: 64
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (item) {
              return item.parsed.y === null ? "값 없음" : item.parsed.y.toFixed(2) + "%";
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: "소득 그룹" }
        },
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: "전력 접근률(%)" },
          ticks: {
            callback: function (value) {
              return value + "%";
            }
          }
        }
      }
    }
  });
}

function makeLineChart(table) {
  const years = [];
  for (let year = START_YEAR; year <= END_YEAR; year += 1) {
    years.push(year);
  }

  const datasets = GROUPS.map(function (group) {
    const series = table[group.key] || {};
    return {
      label: group.label,
      data: years.map(function (year) {
        return series[year] === undefined ? null : series[year];
      }),
      borderColor: group.color,
      backgroundColor: group.color,
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.25,
      spanGaps: true
    };
  });

  return new Chart(document.querySelector("#chart-2"), {
    type: "line",
    data: { labels: years, datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: function (item) {
              return item.dataset.label + ": " + (item.parsed.y === null ? "값 없음" : item.parsed.y.toFixed(2) + "%");
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: "연도" }
        },
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: "전력 접근률(%)" },
          ticks: {
            callback: function (value) {
              return value + "%";
            }
          }
        }
      }
    }
  });
}

function handleData(results) {
  const rows = results.data || [];
  const fields = (results.meta && results.meta.fields) || [];

  // 열 이름이 다르면 그래프를 그리지 않고 무엇이 다른지 알려 줍니다.
  if (rows.length === 0 || fields.indexOf(VALUE_COL) === -1) {
    setStatus("CSV의 열 이름이 예상과 다릅니다. 기대한 열: " + VALUE_COL, true);
    return;
  }

  const built = buildTable(rows);
  charts.bar = makeBarChart(built.table);
  charts.line = makeLineChart(built.table);

  setStatus(
    "CSV " + rows.length.toLocaleString("ko-KR") + "행을 읽었습니다. 값이 비어 있거나 숫자가 아닌 칸 " +
      built.missing.toLocaleString("ko-KR") + "개는 0으로 바꾸지 않고 비워 두었습니다."
  );
}

// CSV를 읽습니다. 경로가 틀리거나 네트워크가 막히면 안내 문구를 보여 줍니다.
Papa.parse(CSV_PATH, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: handleData,
  error: function () {
    setStatus("CSV 파일을 읽지 못했습니다. data 폴더의 파일 이름과 경로를 확인하세요.", true);
  }
});

// 탭 전환: 선택한 탭의 그래프와 해석만 보이게 합니다.
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll('[role="tabpanel"]');

tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    tabButtons.forEach(function (other) {
      const selected = other === button;
      other.setAttribute("aria-selected", String(selected));
      other.tabIndex = selected ? 0 : -1;
    });

    const targetId = button.getAttribute("aria-controls");
    tabPanels.forEach(function (panel) {
      panel.hidden = panel.id !== targetId;
    });

    // 숨겨져 있던 동안 크기를 재지 못한 그래프를 다시 그립니다.
    const shown = document.querySelector("#" + targetId + " canvas");
    const chart = shown && shown.id === "chart-1" ? charts.bar : charts.line;
    if (chart) {
      chart.resize();
    }
  });
});
