# My Campus Hotspots

A small homepage that introduces three campus places I visit when I need a short break from studying. Each place has its own detail page with a photo, a description, and a link to its location on Google Maps.

## GitHub Pages

- Repository URL: `https://github.com/583955636stmc-create/campus-hotspots`
- Pages URL: `https://583955636stmc-create.github.io/campus-hotspots/`

## Week 2 · My Campus Hotspots

The site is built with plain HTML only — no CSS or JavaScript yet. It has one front page (`index.html`) and three detail pages (`cafeteria.html`, `classroom.html`, `dormitory.html`). Every page uses a complete HTML5 structure, and the pages are linked to each other so a visitor can move between the front page and the previous/next place.

## Week 3 · Four pages, four moods

One shared `styles.css` file styles all four pages. Each page has a clearly different mood, set by a class on the `<body>` tag.

- GitHub Pages URL: (same as the Week 2 link above)

### Per-page styles

- **Front page (`page-home`) — travel magazine:** a bright white background, dark navy text, a very large title with a thick border, and pill-shaped navigation links for a clean, roomy magazine feel.
- **Cafeteria (`page-cafeteria`) — warm dining:** a soft orange background, white rounded panels, and an orange action button to feel warm and inviting like a meal space.
- **Classroom Building (`page-classroom`) — quiet study:** a cream paper background, a serif font, and square-edged panels with thin borders for a calm, bookish mood.
- **School Dormitory (`page-dormitory`) — night hideout:** a dark navy background, light text, and a bright blue accent on the title and panel borders to feel cozy and quiet like night.

### Mobile styles

- Applied `@media` condition: `max-width: 600px`.
- On mobile the page width and padding shrink, the main heading becomes smaller, navigation links stack vertically to become easy to tap, and the map button stretches to full width.
- I opened all four pages on a phone and confirmed the text fits and the links are comfortable to tap.

### Sources

- All photos were taken by me.
- Location information comes from Google Maps.

## 4주차: JavaScript 실습

이번 주에는 2·3주차에 만든 저장소에 `week4` 폴더를 추가했습니다. HTML·CSS·JavaScript를 파일로 분리하고, 클릭·입력에 반응해 화면이 바뀌는 세 개의 페이지를 만들었습니다.

- 장소 탐험 페이지: https://583955636stmc-create.github.io/campus-hotspots/week4/
- 통계 페이지: https://583955636stmc-create.github.io/campus-hotspots/week4/statistics.html
- 게임 페이지: https://583955636stmc-create.github.io/campus-hotspots/week4/game.html

### 실습 1 · 네 페이지를 하나의 탐험 화면으로

- **내가 수정한 부분:** 예제의 장소 데이터를 2주차에 만든 세 장소(학생식당·강의동·기숙사)로 바꾸고, 사진·설명·추천 이유를 `week4/index.html`의 `section` 세 개에 모두 넣었습니다. 지도 `iframe`의 `src`는 각 장소의 Google Maps 좌표로 교체했고, 색과 간격은 `styles.css`에서 조정했습니다.
- **버튼 클릭 → 내용 변경 → 지도 변경의 흐름:** `.place-btn`의 `click` 이벤트가 `app.js`의 `showPlace(placeId)`를 실행합니다. 이 함수가 (1) 세 버튼의 `aria-pressed`와 `is-active`를 갱신하고, (2) `section.hidden`을 `dataset.place !== placeId`로 지정해 선택한 장소 하나만 보이게 하고, (3) `PLACES[placeId].mapUrl`을 `#place-map`의 `src`에 넣고 지도 아래 좌표 문구도 함께 바꿉니다. 페이지는 새로고침되지 않습니다. 첫 접속에는 `showPlace("cafeteria")`가 실행되어 학생식당이 선택된 상태로 시작합니다.
- **휴대전화에서 확인한 결과:** `@media (max-width: 820px)`에서 버튼·설명·지도가 세로 한 줄로 쌓이고, 장소 버튼은 한 줄에 하나씩 커지며, 지도 높이는 300px로 줄어듭니다. 버튼을 누르면 손가락으로도 설명과 지도가 함께 바뀝니다.

### 실습 2 · 내가 발견한 데이터를 두 가지 시각화로

- **데이터 출처 URL / 내려받은 날짜:** https://ourworldindata.org/grapher/share-of-the-population-with-access-to-electricity · 2026-09-28 내려받음 (Our World in Data, CC BY)
- **데이터 선택 이유 / 대상·기간·단위:** 전기를 쓸 수 있는 인구 비율은 나라의 소득 수준 차이를 한눈에 보여 주는 지표라고 생각해 골랐습니다. 대상은 소득 그룹별 전체 인구, 기간은 2000~2024년, 단위는 인구 비율(%)입니다.
- **그래프 1 (막대):** 질문은 "2024년에 소득 그룹별 전력 접근률은 얼마나 다른가"입니다. `Entity`·`Year`·`Share of the population with access to electricity` 열을 사용했습니다. 그룹 사이의 크기를 비교하는 것이 목적이라 막대 그래프를 골랐습니다. 저소득 국가 48.80%, 중하위 91.36%, 중상위 99.32%, 고소득 99.97%, 세계 평균 91.93%로, 소득 수준에 따라 격차가 뚜렷했습니다.
- **그래프 2 (선):** 질문은 "2000~2024년에 그 격차가 어떻게 변했는가"입니다. 같은 열을 연도별로 이어 보았습니다. 시간에 따른 변화를 보는 것이 목적이라 선 그래프를 골랐습니다. 저소득 국가는 15.87%→48.80%(+32.9%p), 중하위 국가는 56.52%→91.36%(+34.8%p)로 크게 올랐고, 고소득 국가는 99.44%→99.97%로 거의 변하지 않았습니다. 그 결과 두 그룹의 격차는 83.6%p에서 51.2%p로 줄었지만 여전히 큽니다. 이 자료는 모든 그룹이 개선되었다는 사실은 보여 주지만, 소득이 낮은 것이 전기 부족의 원인이라고 단정할 수는 없습니다.
- **필터링·집계·결측치 처리:** 소득 그룹 다섯 개(`Low-income`·`Lower-middle-income`·`Upper-middle-income`·`High-income`·`World`)와 2000~2024년만 사용했습니다. 값이 비어 있거나 숫자가 아닌 칸은 0으로 바꾸지 않고 `null`로 남겨 선 그래프에서 비워 두었습니다(`spanGaps`). 읽은 행 수와 비어 있는 칸 수를 페이지 위에 표시합니다.
- **두 탭 전환 방식:** `.tab-btn`을 누르면 `aria-selected`와 `tabIndex`를 갱신하고, 각 `[role="tabpanel"]`의 `hidden`을 바꿔 해당 그래프와 해석만 보이게 합니다. 숨겨져 있던 동안 크기를 재지 못한 그래프는 `chart.resize()`로 다시 그립니다. 첫 접속에는 첫 번째 탭만 보입니다.
- **휴대전화에서 두 탭을 확인한 결과:** 820px 이하에서 탭 버튼이 세로로 쌓이고 그래프 영역 높이가 280px로 줄어 화면 밖으로 넘치지 않습니다. 두 탭을 각각 눌러 막대·선 그래프가 모두 보이는 것을 확인했습니다.
- **빈 데이터·잘못된 CSV를 넣었을 때 결과:** 열 이름이 예상과 다르면 그래프를 그리지 않고 기대한 열 이름을 안내합니다. 파일을 읽지 못하면 `data` 폴더의 경로를 확인하라는 문구를 보여 줍니다. 값이 빈 칸은 0으로 만들지 않고 그래프에서 비워 둡니다.
- **Copilot 활용:** Copilot과 함께 CSV를 읽어 두 그래프로 나누는 뼈대를 만들고, 소득 그룹 이름과 열 이름이 실제 CSV와 정확히 같아야 한다는 점을 확인했습니다. 그래프 종류·색·축 단위와 해석 문장은 데이터 값을 직접 확인하며 수정했습니다.

### 실습 3 · 상상한 게임을 Copilot과 만들기

- **게임 이름 / 아이디어 / 조작과 규칙:** "캠퍼스 보물찾기"입니다. 밤의 캠퍼스에 숨은 보물 조각을 찾는 상상을 게임으로 만들었습니다. 5×5(25칸)에서 보물 5개(+10점, 연속으로 찾으면 두 번째부터 +2점)를 찾고 폭탄 4개(-8점, 콤보 초기화)를 피합니다. 제한 시간은 40초이고, 시간이 끝나거나 25칸을 모두 열면 게임이 끝납니다. 마우스 클릭과 휴대전화 터치 모두로 조작합니다.
- **Copilot에게 보낸 첫 질문:** "HTML Canvas로 5×5 격자에 보물과 폭탄을 숨기고, 클릭한 칸을 열어 점수를 계산하는 게임을 JavaScript로 만들어 줘. 점수·남은 시간·찾은 보물·콤보를 화면 위에 보여 주고, 다시 시작 버튼도 넣어 줘."
- **추가 수정 요청과 개선한 점:** 처음에는 캔버스가 `pointerdown`만 받아서, 이 이벤트를 보내지 않는 환경에서는 클릭이 동작하지 않았습니다. `click`도 함께 받되 같은 입력이 두 번 처리되지 않도록 직후의 `click`은 건너뛰게 고쳐, 어떤 환경에서도 한 번만 반응하도록 개선했습니다. 이 밖에 남은 시간이 10초 이하일 때 색을 바꾸고, 콤보 보너스와 팝업 애니메이션을 추가했습니다.
- **직접 확인한 동작:** 조작 — 캔버스의 칸을 누르면 해당 칸이 열립니다(25칸 좌표가 모두 정확히 한 칸씩으로 계산되는 것을 확인). 점수 — 보물 +10점·콤보 보너스, 폭탄 -8점이 반영됩니다. 종료 — 40초가 지나거나 25칸을 모두 열면 결과 문구와 최종 점수가 나옵니다. 재시작 — "다시 시작" 버튼을 누르면 보물 위치가 새로 배치되고 점수·시간이 초기화됩니다.
- **휴대전화에서 확인한 결과:** 820px 이하에서 게임 화면이 세로로 쌓이고, HUD가 2열로 바뀌며, 캔버스는 화면 너비에 맞춰 줄어듭니다. 터치로 칸을 눌러도 점수가 바뀌는 것을 확인했습니다.
- **이미지·소리 출처와 이용 조건:** 사용한 이미지 파일과 소리는 없습니다. 보물·폭탄·배경 그림과 글자는 모두 코드(Canvas API)로 직접 그렸습니다.