// 4주차 실습 1 · 장소 탐험 화면
// 버튼 클릭을 받아 설명(section)과 지도(iframe)를 함께 바꿉니다.

console.log("JavaScript 연결 성공!");

// 장소별 지도 주소와 설명 문구입니다.
// 지도는 Google Maps 공유 지도의 좌표를 그대로 사용했습니다.
const PLACES = {
  cafeteria: {
    mapUrl: "https://maps.google.com/maps?q=37.4864303,126.8011835&z=17&hl=ko&output=embed",
    caption: "학생식당 · 위도 37.4864, 경도 126.8012"
  },
  classroom: {
    mapUrl: "https://maps.google.com/maps?q=37.4854131,126.8035082&z=17&hl=ko&output=embed",
    caption: "강의동 · 위도 37.4854, 경도 126.8035"
  },
  dormitory: {
    mapUrl: "https://maps.google.com/maps?q=37.4877704,126.8060242&z=17&hl=ko&output=embed",
    caption: "기숙사 · 위도 37.4878, 경도 126.8060"
  }
};

const buttons = document.querySelectorAll(".place-btn");
const sections = document.querySelectorAll(".place");
const mapFrame = document.querySelector("#place-map");
const mapCaption = document.querySelector("#map-caption");

// 선택한 장소 하나만 보이게 하고, 나머지는 hidden으로 숨깁니다.
function showPlace(placeId) {
  const place = PLACES[placeId];
  if (!place) {
    return;
  }

  buttons.forEach(function (button) {
    const isSelected = button.dataset.place === placeId;
    button.setAttribute("aria-pressed", String(isSelected));
    button.classList.toggle("is-active", isSelected);
  });

  sections.forEach(function (section) {
    section.hidden = section.dataset.place !== placeId;
  });

  if (mapFrame.getAttribute("src") !== place.mapUrl) {
    mapFrame.setAttribute("src", place.mapUrl);
  }
  mapCaption.textContent = place.caption;
}

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    showPlace(button.dataset.place);
  });
});

// 첫 접속에도 한 장소가 선택되어 있게 합니다.
showPlace("cafeteria");
