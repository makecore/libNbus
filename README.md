# libNbus 중앙도서관 야간버스 웹앱 관리 설명서

이 저장소는 중앙도서관 야간버스의 **운행일, 운행시간, 노선, 정류장, 탑승 위치**를 안내하는 웹앱입니다.

이용자는 별도 설치 없이 아래와 같은 GitHub Pages 주소로 접속할 수 있습니다.

```text
https://깃허브아이디.github.io/libNbus/
```

예:

```text
https://makecore.github.io/libNbus/
```

---

# 1. 가장 중요한 원칙

이 웹앱은 역할이 나뉘어 있습니다.

```text
src
├── App.jsx       ← 화면 디자인, 버튼, 반응형 UI
├── busdata.js    ← 날짜, 시간, 노선, 정류장, 방면 정보
└── main.jsx      ← 앱 실행 파일
```

대부분의 운영 변경은 아래 파일만 수정하면 됩니다.

```text
src/busdata.js
```

## 수정 파일 구분

| 바꾸고 싶은 것 | 수정할 파일 |
|---|---|
| 운영 연도 | `src/busdata.js` |
| 운영 월 | `src/busdata.js` |
| 운행 날짜 | `src/busdata.js` |
| 출발 시간 | `src/busdata.js` |
| 운행 노선 번호 | `src/busdata.js` |
| 정류장 이름 | `src/busdata.js` |
| 정류장 순서 | `src/busdata.js` |
| 노선 방면명 | `src/busdata.js` |
| 노선 종점명 | `src/busdata.js` |
| 상단 제목 문구 | `src/busdata.js` |
| 검색창 예시 문구 | `src/busdata.js` |
| 색상, 글자 크기, 카드 모양 | `src/App.jsx` |

---

# 2. GitHub에서 파일 수정하는 기본 방법

1. GitHub에 로그인합니다.
2. `libNbus` 저장소로 들어갑니다.
3. 상단 메뉴에서 **Code**를 클릭합니다.
4. `src` 폴더를 클릭합니다.
5. 수정할 파일을 클릭합니다.
6. 오른쪽 위의 **연필 아이콘**을 클릭합니다.
7. 내용을 수정합니다.
8. 화면 아래의 **Commit changes** 버튼을 클릭합니다.
9. 다시 한 번 **Commit changes**를 클릭합니다.
10. 상단 메뉴의 **Actions**를 클릭합니다.
11. 가장 위 작업이 초록색 체크가 되는지 확인합니다.
12. 웹사이트를 새로고침합니다.

---

# 3. 수정 후 웹사이트 확인 방법

웹사이트 주소 예:

```text
https://makecore.github.io/libNbus/
```

수정했는데 바로 안 보이면, 브라우저가 이전 화면을 기억하고 있을 수 있습니다.

그럴 때는 주소 뒤에 `?v=숫자`를 붙여 확인합니다.

```text
https://makecore.github.io/libNbus/?v=7
```

숫자는 아무 숫자나 바꿔도 됩니다.

예:

```text
?v=8
?v=9
?v=10
```

---

# 4. `busdata.js` 전체 구조

`src/busdata.js`는 크게 5부분으로 나뉩니다.

```text
1. busInfo        ← 기본 안내 정보
2. routeList      ← 노선, 방면, 정류장
3. notesByDate    ← 특정 날짜 메모
4. scheduleRules  ← 운행일, 운행시간, 운행노선
5. 자동 변환 영역 ← 초보자는 수정하지 않음
```

일반적으로 수정하는 곳은 아래 2곳입니다.

```text
busInfo
scheduleRules
routeList
```

---

# 5. 기본 안내 정보 수정 방법

`src/busdata.js`에서 아래 부분을 찾습니다.

```javascript
export const busInfo = {
  title: "중앙도서관 야간버스",
  eventLabel: "시험기간 한정 운행",

  serviceYear: 2026,
  serviceMonth: 6,

  defaultDate: "2026-06-16",

  boardingPlace: "중앙도서관 정문 앞",

  heroTitleLine1: "공부를 마친 밤,",
  heroTitleLine2: "귀가길은 더 편하게.",
  heroDescription: "오늘 운행하는 시간과 노선을 빠르게 확인하세요.",

  searchPlaceholder: "정류장 검색  예: 노형, 터미널",
};
```

## 5-1. 웹앱 제목 바꾸기

현재:

```javascript
title: "중앙도서관 야간버스",
```

예:

```javascript
title: "도서관 야간 귀가버스",
```

---

## 5-2. 행사 문구 바꾸기

현재:

```javascript
eventLabel: "시험기간 한정 운행",
```

예:

```javascript
eventLabel: "기말고사 기간 한정 운행",
```

---

## 5-3. 운영 연도 바꾸기

현재:

```javascript
serviceYear: 2026,
```

2027년으로 바꾸려면:

```javascript
serviceYear: 2027,
```

---

## 5-4. 운영 월 바꾸기

현재:

```javascript
serviceMonth: 6,
```

7월로 바꾸려면:

```javascript
serviceMonth: 7,
```

주의:

```javascript
// 좋은 예
serviceMonth: 7,

// 나쁜 예
serviceMonth: "7월",
```

숫자만 적습니다.

---

## 5-5. 기본 선택 날짜 바꾸기

`defaultDate`는 웹앱을 처음 열었을 때 자동으로 선택되는 날짜입니다.

현재:

```javascript
defaultDate: "2026-06-16",
```

7월 6일로 바꾸려면:

```javascript
defaultDate: "2026-07-06",
```

주의:

`defaultDate`는 반드시 실제 운행일이어야 합니다.

좋은 예:

```javascript
defaultDate: "2026-07-06",
```

나쁜 예:

```javascript
defaultDate: "2026.7.6",
defaultDate: "7월 6일",
defaultDate: "2026-7-6",
```

날짜는 반드시 아래 형식으로 씁니다.

```text
YYYY-MM-DD
```

---

## 5-6. 탑승 위치 바꾸기

현재:

```javascript
boardingPlace: "중앙도서관 정문 앞",
```

예:

```javascript
boardingPlace: "중앙도서관 1층 현관 앞",
```

---

## 5-7. 상단 큰 문구 바꾸기

현재:

```javascript
heroTitleLine1: "공부를 마친 밤,",
heroTitleLine2: "귀가길은 더 편하게.",
```

예:

```javascript
heroTitleLine1: "늦은 밤에도,",
heroTitleLine2: "안전하게 귀가하세요.",
```

---

## 5-8. 상단 설명 문구 바꾸기

현재:

```javascript
heroDescription: "오늘 운행하는 시간과 노선을 빠르게 확인하세요.",
```

예:

```javascript
heroDescription: "날짜와 노선을 선택하면 출발 시간을 바로 확인할 수 있습니다.",
```

---

## 5-9. 검색창 예시 문구 바꾸기

현재:

```javascript
searchPlaceholder: "정류장 검색  예: 노형, 터미널",
```

예:

```javascript
searchPlaceholder: "예: 시청, 법원, 한라대",
```

---

# 6. 날짜와 운행일 수정 방법

운행 날짜는 `scheduleRules`에서 수정합니다.

현재 구조는 다음과 같습니다.

```javascript
export const scheduleRules = [
  {
    name: "단축 운행",
    days: [
      ...daysFromTo(5, 9),
      ...daysFromTo(21, 23),
    ],
    departures: [
      { time: "12:05", routes: [1, 3, 5] },
    ],
  },

  {
    name: "전체 운행",
    days: daysFromTo(10, 20),
    departures: [
      { time: "12:05", routes: [1, 2, 3, 4, 5] },
      { time: "01:05", routes: [2, 4] },
      { time: "02:05", routes: [1] },
    ],
  },
];
```

현재 뜻은 다음과 같습니다.

| 날짜 | 운행 방식 |
|---|---|
| 6월 5일~9일 | 단축 운행 |
| 6월 10일~20일 | 전체 운행 |
| 6월 21일~23일 | 단축 운행 |

---

## 6-1. `daysFromTo()` 뜻

`daysFromTo()`는 연속 날짜를 쉽게 적기 위한 도구입니다.

```javascript
daysFromTo(5, 9)
```

뜻:

```text
5일, 6일, 7일, 8일, 9일
```

즉 아래 코드는:

```javascript
days: daysFromTo(10, 20),
```

아래 뜻입니다.

```text
10일부터 20일까지
```

---

## 6-2. 단축 운행 날짜 바꾸기

현재 단축 운행 날짜:

```javascript
days: [
  ...daysFromTo(5, 9),
  ...daysFromTo(21, 23),
],
```

뜻:

```text
5일~9일
21일~23일
```

예를 들어 단축 운행을 1일~5일, 13일~15일로 바꾸려면:

```javascript
days: [
  ...daysFromTo(1, 5),
  ...daysFromTo(13, 15),
],
```

---

## 6-3. 전체 운행 날짜 바꾸기

현재 전체 운행 날짜:

```javascript
days: daysFromTo(10, 20),
```

뜻:

```text
10일~20일
```

예를 들어 전체 운행을 6일~12일로 바꾸려면:

```javascript
days: daysFromTo(6, 12),
```

---

## 6-4. 하루만 추가하기

예를 들어 24일도 단축 운행에 추가하려면:

기존:

```javascript
days: [
  ...daysFromTo(5, 9),
  ...daysFromTo(21, 23),
],
```

변경:

```javascript
days: [
  ...daysFromTo(5, 9),
  ...daysFromTo(21, 23),
  24,
],
```

---

## 6-5. 연속 날짜를 늘리기

예를 들어 21일~23일을 21일~24일로 늘리려면:

기존:

```javascript
...daysFromTo(21, 23),
```

변경:

```javascript
...daysFromTo(21, 24),
```

---

## 6-6. 특정 날짜만 빼기

예를 들어 10일~20일 중 18일만 빼고 싶다면, 연속 날짜를 둘로 나눕니다.

기존:

```javascript
days: daysFromTo(10, 20),
```

변경:

```javascript
days: [
  ...daysFromTo(10, 17),
  ...daysFromTo(19, 20),
],
```

뜻:

```text
10일~17일
19일~20일
```

즉 18일은 빠집니다.

---

## 6-7. 운영 기간을 7월 1일~15일로 바꾸는 예시

운행 조건:

| 날짜 | 운행 방식 |
|---|---|
| 7월 1일~5일 | 단축 운행 |
| 7월 6일~12일 | 전체 운행 |
| 7월 13일~15일 | 단축 운행 |

먼저 `busInfo`를 수정합니다.

```javascript
serviceYear: 2026,
serviceMonth: 7,
defaultDate: "2026-07-06",
```

그다음 `scheduleRules`를 수정합니다.

```javascript
export const scheduleRules = [
  {
    name: "단축 운행",
    days: [
      ...daysFromTo(1, 5),
      ...daysFromTo(13, 15),
    ],
    departures: [
      { time: "12:05", routes: [1, 3, 5] },
    ],
  },

  {
    name: "전체 운행",
    days: daysFromTo(6, 12),
    departures: [
      { time: "12:05", routes: [1, 2, 3, 4, 5] },
      { time: "01:05", routes: [2, 4] },
      { time: "02:05", routes: [1] },
    ],
  },
];
```

---

# 7. 운행시간 수정 방법

운행시간은 `departures`에서 수정합니다.

현재 단축 운행:

```javascript
departures: [
  { time: "12:05", routes: [1, 3, 5] },
],
```

현재 전체 운행:

```javascript
departures: [
  { time: "12:05", routes: [1, 2, 3, 4, 5] },
  { time: "01:05", routes: [2, 4] },
  { time: "02:05", routes: [1] },
],
```

---

## 7-1. 출발 시간 바꾸기

기존:

```javascript
{ time: "12:05", routes: [1, 3, 5] },
```

변경:

```javascript
{ time: "12:10", routes: [1, 3, 5] },
```

---

## 7-2. 출발 시간을 하나 더 추가하기

기존:

```javascript
departures: [
  { time: "12:05", routes: [1, 3, 5] },
],
```

변경:

```javascript
departures: [
  { time: "12:05", routes: [1, 3, 5] },
  { time: "01:05", routes: [2, 4] },
],
```

주의: 항목 사이에는 쉼표 `,`가 필요합니다.

---

## 7-3. 특정 시간의 운행 노선 바꾸기

기존:

```javascript
{ time: "12:05", routes: [1, 3, 5] },
```

변경:

```javascript
{ time: "12:05", routes: [1, 2, 5] },
```

노선 번호는 숫자로 적습니다.

좋은 예:

```javascript
routes: [1, 2, 5]
```

나쁜 예:

```javascript
routes: ["1", "2", "5"]
```

---

# 8. 노선 수정 방법

노선 정보는 `routeList`에서 수정합니다.

현재 구조는 다음과 같습니다.

```javascript
export const routeList = [
  {
    id: 1,
    terminal: "부영아파트사거리",
    area: "시청 · 용담 · 신제주 · 노형",
    short: "노형",
    cta: "노형 방면",
    stops: [
      "중앙도서관",
      "아라주공아파트",
      "법원",
    ],
  },
];
```

---

## 8-1. 항목별 의미

| 항목 | 의미 | 화면 표시 위치 |
|---|---|---|
| `id` | 노선 번호 | 1노선, 2노선 |
| `terminal` | 종점 또는 대표 도착지 | 노선 상세 제목 |
| `area` | 주요 경유 지역 | 노선 설명 |
| `short` | 짧은 방면명 | `1노선 · 노형 방면` |
| `cta` | 선택 버튼 문구 | `노형 방면` 버튼 |
| `stops` | 정류장 목록 | 정류장 순서 |

---

## 8-2. 노선 종점 바꾸기

기존:

```javascript
terminal: "부영아파트사거리",
```

변경:

```javascript
terminal: "신제주로터리",
```

---

## 8-3. 노선 방면명 바꾸기

기존:

```javascript
short: "노형",
cta: "노형 방면",
```

변경:

```javascript
short: "신제주",
cta: "신제주 방면",
```

---

## 8-4. 주요 경유 지역 바꾸기

기존:

```javascript
area: "시청 · 용담 · 신제주 · 노형",
```

변경:

```javascript
area: "시청 · 용담 · 신제주",
```

---

## 8-5. 정류장 추가하기

기존:

```javascript
stops: [
  "중앙도서관",
  "아라주공아파트",
  "법원",
],
```

`시청`을 추가하려면:

```javascript
stops: [
  "중앙도서관",
  "아라주공아파트",
  "법원",
  "시청",
],
```

주의:

- 정류장 이름은 따옴표 `" "` 안에 적습니다.
- 각 줄 끝에는 쉼표 `,`를 붙입니다.
- 정류장 순서는 화면에 그대로 표시됩니다.

---

## 8-6. 정류장 이름 바꾸기

기존:

```javascript
"노형로타리",
```

변경:

```javascript
"노형오거리",
```

---

## 8-7. 정류장 삭제하기

기존:

```javascript
"법원",
"시청",
"문예회관",
```

`시청`을 삭제하려면:

```javascript
"법원",
"문예회관",
```

---

## 8-8. 정류장 순서 바꾸기

기존:

```javascript
stops: [
  "중앙도서관",
  "아라주공아파트",
  "법원",
  "시청",
],
```

`시청`을 `법원`보다 앞으로 옮기려면:

```javascript
stops: [
  "중앙도서관",
  "아라주공아파트",
  "시청",
  "법원",
],
```

---

## 8-9. 새 노선 추가하기

예를 들어 6노선을 추가하려면 `routeList` 마지막에 새 객체를 추가합니다.

```javascript
{
  id: 6,
  terminal: "새로운 종점",
  area: "주요지역1 · 주요지역2",
  short: "새노선",
  cta: "새노선 방면",
  stops: [
    "중앙도서관",
    "첫 번째 정류장",
    "두 번째 정류장",
    "새로운 종점(종점)",
  ],
},
```

주의:

새 노선을 추가했다면 `scheduleRules`의 `routes`에도 해당 노선 번호를 넣어야 운행시간에 표시됩니다.

예:

```javascript
{ time: "12:05", routes: [1, 2, 3, 4, 5, 6] },
```

---

## 8-10. 노선 삭제하기

예를 들어 5노선을 삭제하려면 `routeList`에서 `id: 5`인 묶음을 삭제합니다.

또한 `scheduleRules` 안의 `routes`에서도 `5`를 삭제해야 합니다.

기존:

```javascript
routes: [1, 3, 5]
```

변경:

```javascript
routes: [1, 3]
```

주의:

노선 데이터에서는 삭제했는데 운행시간에 번호가 남아 있으면 오류가 날 수 있습니다.

---

# 9. 특별 메모 추가 방법

특정 날짜에 짧은 메모를 표시하려면 `notesByDate`를 수정합니다.

현재:

```javascript
export const notesByDate = {};
```

예:

```javascript
export const notesByDate = {
  "2026-06-10": "시험 시작",
  "2026-06-23": "운행 종료",
};
```

주의:

날짜 형식은 반드시 `YYYY-MM-DD`입니다.

---

# 10. 디자인 수정 방법

디자인은 `src/App.jsx` 안의 `<style>` 영역에서 수정합니다.

초보자는 가능하면 디자인 파일은 건드리지 않는 것을 권장합니다.

대표 색상은 아래 부분에서 바꿀 수 있습니다.

```css
:root {
  --blue: #0066cc;
  --ink: #1d1d1f;
  --muted: #6e6e73;
  --soft: #f5f5f7;
}
```

## 10-1. 파란색 바꾸기

현재:

```css
--blue: #0066cc;
```

더 진한 파란색:

```css
--blue: #0047a0;
```

---

## 10-2. 배경색 바꾸기

현재:

```css
--soft: #f5f5f7;
```

더 밝은 배경:

```css
--soft: #fafafa;
```

---

## 10-3. 상단 큰 제목 크기 바꾸기

현재:

```css
.hero h1 {
  font-size: clamp(34px, 9vw, 50px);
}
```

조금 작게:

```css
.hero h1 {
  font-size: clamp(30px, 8vw, 44px);
}
```

---

# 11. 수정 후 배포 확인

수정 후에는 반드시 아래 순서로 확인합니다.

1. **Commit changes** 클릭
2. 저장소 상단의 **Actions** 클릭
3. 가장 위 작업 확인
4. 노란색이면 배포 중
5. 초록색 체크면 성공
6. 빨간색 X면 오류
7. 웹사이트 새로고침

---

# 12. 자주 생기는 문제

## 12-1. 예전 빨간불이 계속 보이는 경우

GitHub Actions의 빨간불은 과거 기록입니다.

중요한 것은 **가장 위에 있는 최신 실행 결과**입니다.

| 상태 | 의미 |
|---|---|
| 최신 실행이 초록 체크 | 성공 |
| 최신 실행이 노란색 | 진행 중 |
| 최신 실행이 빨간 X | 수정 필요 |
| 예전 실행만 빨간 X | 무시 가능 |

---

## 12-2. 화면이 하얗게 나오는 경우

대부분 아래 실수 때문입니다.

- 따옴표가 빠짐
- 쉼표가 빠짐
- 괄호가 안 닫힘
- 노선 번호를 잘못 씀
- 삭제한 노선 번호가 `scheduleRules`에 남아 있음

---

## 12-3. 날짜가 안 보이는 경우

확인할 것:

1. `serviceYear`가 맞는지
2. `serviceMonth`가 맞는지
3. `defaultDate`가 실제 운행일인지
4. `scheduleRules`의 `days`에 날짜가 들어 있는지

---

## 12-4. 특정 노선이 운행시간에 안 보이는 경우

`scheduleRules`의 `routes`를 확인합니다.

예:

```javascript
{ time: "12:05", routes: [1, 3, 5] },
```

여기에 없는 노선은 해당 시간에 표시되지 않습니다.

---

# 13. 꼭 지켜야 할 규칙

## 13-1. 날짜 형식

좋은 예:

```javascript
"2026-06-16"
```

나쁜 예:

```javascript
"2026.6.16"
"6월 16일"
"2026-6-16"
```

---

## 13-2. 정류장 이름

좋은 예:

```javascript
"중앙도서관",
```

나쁜 예:

```javascript
중앙도서관,
```

문자는 반드시 따옴표 안에 적습니다.

---

## 13-3. 노선 번호

좋은 예:

```javascript
routes: [1, 3, 5]
```

나쁜 예:

```javascript
routes: ["1", "3", "5"]
```

노선 번호는 숫자로 적습니다.

---

## 13-4. 쉼표

좋은 예:

```javascript
{ time: "12:05", routes: [1, 3, 5] },
{ time: "01:05", routes: [2, 4] },
```

나쁜 예:

```javascript
{ time: "12:05", routes: [1, 3, 5] }
{ time: "01:05", routes: [2, 4] }
```

각 항목 사이에는 쉼표가 필요합니다.

---

# 14. 초보자용 빠른 수정 예시

## 날짜만 7월로 바꾸기

```javascript
serviceYear: 2026,
serviceMonth: 7,
defaultDate: "2026-07-06",
```

```javascript
export const scheduleRules = [
  {
    name: "단축 운행",
    days: [
      ...daysFromTo(1, 5),
      ...daysFromTo(13, 15),
    ],
    departures: [
      { time: "12:05", routes: [1, 3, 5] },
    ],
  },

  {
    name: "전체 운행",
    days: daysFromTo(6, 12),
    departures: [
      { time: "12:05", routes: [1, 2, 3, 4, 5] },
      { time: "01:05", routes: [2, 4] },
      { time: "02:05", routes: [1] },
    ],
  },
];
```

---

## 1노선 정류장 하나 추가하기

```javascript
stops: [
  "중앙도서관",
  "아라주공아파트",
  "법원",
  "새로운정류장",
],
```

---

## 12:05 운행 노선을 바꾸기

기존:

```javascript
{ time: "12:05", routes: [1, 3, 5] },
```

변경:

```javascript
{ time: "12:05", routes: [1, 2, 5] },
```

---

# 15. 한 줄 요약

운영 담당자는 대부분 **`src/busdata.js`만 수정**하면 됩니다.  
날짜는 `busInfo`와 `scheduleRules`, 노선과 정류장은 `routeList`, 시간은 `departures`에서 수정합니다.  
수정 후에는 **Commit changes → Actions 초록 체크 → 웹사이트 새로고침** 순서로 확인합니다.
