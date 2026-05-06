import React, { useMemo, useState } from "react";

/*
  중앙도서관 야간운행버스 안내 웹앱
  - 모바일 우선 UI
  - Pretendard 폰트 우선 적용
  - 외부 JS/CSS 라이브러리 의존성 없음
  - 날짜/시간/노선 데이터 검증 테스트 포함
*/

const routes = {
  1: [
    "중앙도서관",
    "아라주공아파트",
    "법원",
    "시청",
    "문예회관",
    "인화초등학교",
    "인화동(구행복예식장)",
    "일도이동 사무소",
    "여상",
    "동문로터리",
    "관덕정",
    "서문시장",
    "용담1동주민센터",
    "병문교",
    "중앙여중",
    "한국병원",
    "터미널",
    "오라5거리(명신마을)",
    "건설회관",
    "신제주로터리",
    "한라병원",
    "노형로타리",
    "부영아파트사거리(종점)",
  ],
  2: [
    "중앙도서관",
    "아라주공아파트",
    "제주여고",
    "중앙여고",
    "법원",
    "시청",
    "구신고",
    "한국병원",
    "터미널",
    "오라오거리",
    "용문로타리",
    "용담로타리",
    "서문시장",
    "전자랜드(병문교)",
    "중앙여중(종점)",
  ],
  3: [
    "중앙도서관",
    "영평초",
    "한일베라체",
    "한마음병원",
    "대림2차아파트",
    "농협하나로마트",
    "동광초",
    "제주은행",
    "서해아파트",
    "동광우체국",
    "교대",
    "화북남문",
    "동중",
    "화북주공",
    "삼양초",
    "삼화부영1차",
    "화북주공4단지(종점)",
  ],
  4: [
    "중앙도서관",
    "이도주공아파트",
    "수선화아파트",
    "도남아파트",
    "보건소",
    "세기아파트",
    "마리나사거리",
    "롯데시티호텔",
    "제원아파트",
    "그랜드사거리",
    "대림1차아파트",
    "한라초",
    "으뜸마을",
    "탐라도서관",
    "한라대(종점)",
  ],
  5: [
    "중앙도서관",
    "부영5차아파트",
    "노형로타리",
    "노형성당",
    "노형주공1단지",
    "본죽사거리",
    "도두동",
    "이호2동",
    "내도동",
    "외도초",
    "우령이마을",
    "외도부영(종점)",
  ],
};

const routeMeta = {
  1: { terminal: "부영아파트사거리", area: "시청 · 용담 · 신제주 · 노형", short: "노형", cta: "노형 방면" },
  2: { terminal: "중앙여중", area: "제주여고 · 중앙여고 · 터미널 · 용담", short: "용담", cta: "용담 방면" },
  3: { terminal: "화북주공4단지", area: "영평 · 한마음병원 · 화북 · 삼양", short: "화북", cta: "화북 방면" },
  4: { terminal: "한라대", area: "이도 · 도남 · 연동 · 탐라도서관", short: "한라대", cta: "한라대 방면" },
  5: { terminal: "외도부영", area: "노형 · 도두 · 이호 · 외도", short: "외도", cta: "외도 방면" },
};

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];
const compactDays = [10, 11, 12, 13, 14, 25, 26, 27];
const fullDays = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const schedule = {};

compactDays.forEach((day) => {
  schedule[`2026-04-${String(day).padStart(2, "0")}`] = [{ time: "12:05", routes: [1, 3, 5] }];
});

fullDays.forEach((day) => {
  schedule[`2026-04-${String(day).padStart(2, "0")}`] = [
    { time: "12:05", routes: [1, 2, 3, 4, 5] },
    { time: "01:05", routes: [2, 4] },
    { time: "02:05", routes: [1] },
  ];
});

const notesByDate = {};

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "").trim();
}

function toDateString(day) {
  return `2026-04-${String(day).padStart(2, "0")}`;
}

function toKoreanDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return `4월 ${date.getDate()}일 ${dayLabels[date.getDay()]}요일`;
}

function toShortDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return `${date.getDate()}일(${dayLabels[date.getDay()]})`;
}

function getDefaultDate() {
  return "2026-04-21";
}

function getAvailableRoutesByDate(dateString) {
  return Array.from(new Set((schedule[dateString] || []).flatMap((item) => item.routes))).sort((a, b) => a - b);
}

function getTimesForRoute(dateString, routeNo) {
  return (schedule[dateString] || []).filter((item) => item.routes.includes(Number(routeNo)));
}

function getServiceSummary(dateString) {
  const items = schedule[dateString] || [];
  if (!items.length) return "운행 정보가 없습니다.";
  return items.map((item) => `${item.time} · ${item.routes.join("·")}노선`).join(" / ");
}

function runDataTests() {
  return [
    {
      name: "운영일은 총 18일이어야 합니다.",
      pass: Object.keys(schedule).length === 18,
      detail: `현재 ${Object.keys(schedule).length}일`,
    },
    {
      name: "4월 10일은 12:05에 1·3·5노선만 운행해야 합니다.",
      pass:
        schedule["2026-04-10"]?.length === 1 &&
        schedule["2026-04-10"]?.[0]?.time === "12:05" &&
        schedule["2026-04-10"]?.[0]?.routes.join(",") === "1,3,5",
      detail: getServiceSummary("2026-04-10"),
    },
    {
      name: "4월 21일은 12:05, 01:05, 02:05가 있어야 합니다.",
      pass: (schedule["2026-04-21"] || []).map((item) => item.time).join(",") === "12:05,01:05,02:05",
      detail: getServiceSummary("2026-04-21"),
    },
    {
      name: "4월 21일 02:05에는 1노선만 운행해야 합니다.",
      pass: schedule["2026-04-21"]?.find((item) => item.time === "02:05")?.routes.join(",") === "1",
      detail: "02:05 · 1노선",
    },
    {
      name: "노형로타리는 1노선과 5노선에 포함되어야 합니다.",
      pass: routes[1].some((stop) => stop.includes("노형로타리")) && routes[5].some((stop) => stop.includes("노형로타리")),
      detail: "1노선, 5노선",
    },
    {
      name: "탐라도서관은 4노선에 포함되어야 합니다.",
      pass: routes[4].some((stop) => stop.includes("탐라도서관")),
      detail: "4노선",
    },
    {
      name: "각 노선의 첫 정류장은 중앙도서관이어야 합니다.",
      pass: Object.values(routes).every((stops) => stops[0] === "중앙도서관"),
      detail: "전체 노선 출발지 확인",
    },
  ];
}

function DateScroller({ selectedDate, setSelectedDate }) {
  const serviceDates = Object.keys(schedule).sort();

  return (
    <section className="date-strip" aria-label="운행일 빠른 선택">
      <div className="section-head compact">
        <div>
          <p>운행일</p>
          <h2>날짜 선택</h2>
        </div>
      </div>
      <div className="date-scroll">
        {serviceDates.map((dateString) => {
          const selected = selectedDate === dateString;
          const day = Number(dateString.slice(-2));
          const dayIndex = new Date(`${dateString}T00:00:00`).getDay();
          return (
            <button
              key={dateString}
              type="button"
              onClick={() => setSelectedDate(dateString)}
              className={`date-pill ${selected ? "selected" : ""}`}
              aria-label={`${toKoreanDate(dateString)} 선택`}
            >
              <span className={`date-week ${dayIndex === 0 ? "sun" : dayIndex === 6 ? "sat" : ""}`}>{dayLabels[dayIndex]}</span>
              <strong>{day}</strong>
              {notesByDate[dateString] ? <em>{notesByDate[dateString]}</em> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MonthMiniCalendar({ selectedDate, setSelectedDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const leadingBlankCount = 3;

  return (
    <details className="month-calendar" open={isOpen} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
      <summary>{isOpen ? "4월 전체 달력 닫기" : "4월 전체 달력 열기"}</summary>
      <div className="weekday-grid">
        {dayLabels.map((day, index) => (
          <div key={day} className={index === 0 ? "sun" : index === 6 ? "sat" : ""}>{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {Array.from({ length: leadingBlankCount }).map((_, index) => <div key={`blank-${index}`} />)}
        {days.map((day) => {
          const dateString = toDateString(day);
          const hasService = Boolean(schedule[dateString]);
          const selected = selectedDate === dateString;
          return (
            <button
              key={dateString}
              type="button"
              onClick={() => setSelectedDate(dateString)}
              className={`calendar-day ${hasService ? "service" : ""} ${selected ? "selected" : ""}`}
              aria-label={`${toKoreanDate(dateString)} ${hasService ? "운행 있음" : "운행 없음"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="calendar-legend">
        <span><i className="legend-service" />운행일</span>
        <span><i className="legend-selected" />선택일</span>
      </div>
    </details>
  );
}

function SearchBox({ stopQuery, setStopQuery, routeSearchResults, setSelectedRoute }) {
  return (
    <section className="search-section" aria-label="정류장 검색">
      <label className="search-box">
        <span>⌕</span>
        <input
          value={stopQuery}
          onChange={(event) => setStopQuery(event.target.value)}
          placeholder="정류장 검색  예: 노형, 터미널"
        />
        {stopQuery ? <button type="button" onClick={() => setStopQuery("")} aria-label="검색어 지우기">×</button> : null}
      </label>

      {normalizeText(stopQuery) ? (
        <div className="search-results">
          {routeSearchResults.length ? (
            routeSearchResults.map((item) => (
              <button key={item.routeNo} type="button" className="search-result" onClick={() => setSelectedRoute(String(item.routeNo))}>
                <strong>{item.routeNo}노선</strong>
                <span>{item.stops.join(", ")}</span>
              </button>
            ))
          ) : (
            <div className="empty-box">검색 결과가 없습니다. 정류장명의 일부만 입력해 보세요.</div>
          )}
        </div>
      ) : null}
    </section>
  );
}

function TodaySummary({ selectedDate, selectedRoute, setSelectedRoute, visibleTimes, availableRoutes }) {
  return (
    <section className="summary-card" aria-label="선택 날짜 운행 요약">
      <div className="summary-top">
        <div>
          <p className="eyebrow">오늘 선택</p>
          <h1>{toShortDate(selectedDate)}</h1>
          {notesByDate[selectedDate] ? <span className="note-chip">{notesByDate[selectedDate]}</span> : null}
        </div>
        <div className="boarding-point">
          <span>탑승</span>
          <strong>중앙도서관<br />정문 앞</strong>
        </div>
      </div>

      <div className="route-tabs" aria-label="노선 선택">
        <button type="button" onClick={() => setSelectedRoute("all")} className={selectedRoute === "all" ? "active" : ""}>전체</button>
        {[1, 2, 3, 4, 5].map((routeNo) => (
          <button
            key={routeNo}
            type="button"
            disabled={!availableRoutes.includes(routeNo)}
            onClick={() => setSelectedRoute(String(routeNo))}
            className={selectedRoute === String(routeNo) ? "active" : ""}
          >
            {routeNo}
          </button>
        ))}
      </div>

      <div className="time-list">
        {visibleTimes.length ? (
          visibleTimes.map((item) => (
            <article key={`${item.time}-${item.routes.join("-")}`} className="time-card">
              <div>
                <p>출발</p>
                <strong>{item.time}</strong>
              </div>
              <div className="time-route-chips">
                {item.routes.map((routeNo) => <span key={routeNo}>{routeNo}노선</span>)}
              </div>
            </article>
          ))
        ) : (
          <div className="empty-box">선택한 노선은 이날 운행하지 않습니다.</div>
        )}
      </div>
    </section>
  );
}

function RouteDetail({ selectedRoute, selectedDate, setSelectedRoute, availableRoutes }) {
  if (selectedRoute === "all") {
    return (
      <section className="route-card placeholder">
        <p className="eyebrow">정류장 순서</p>
        <h2>도착 방면을 선택해 주세요.</h2>
        <p>아래 버튼을 누르면 해당 노선의 정류장 순서를 바로 보여드립니다.</p>
        <div className="route-choice-grid" aria-label="정류장 순서를 볼 노선 선택">
          {[1, 2, 3, 4, 5].map((routeNo) => (
            <button
              key={routeNo}
              type="button"
              disabled={!availableRoutes.includes(routeNo)}
              onClick={() => setSelectedRoute(String(routeNo))}
            >
              <strong>{routeNo}노선</strong>
              <span>{routeMeta[routeNo].cta}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  const routeNo = Number(selectedRoute);
  const stops = routes[routeNo] || [];
  const times = getTimesForRoute(selectedDate, routeNo);

  return (
    <section className="route-card" aria-label={`${routeNo}노선 정류장 목록`}>
      <div className="route-head">
        <div>
          <p className="eyebrow">{routeNo}노선 · {routeMeta[routeNo].short} 방면</p>
          <h2>{routeMeta[routeNo].terminal}</h2>
          <p>{routeMeta[routeNo].area}</p>
        </div>
        <div className="route-time-mini">
          <span>출발</span>
          <strong>{times.length ? times.map((item) => item.time).join(" · ") : "없음"}</strong>
        </div>
      </div>

      <ol className="stop-list">
        {stops.map((stop, index) => (
          <li key={`${stop}-${index}`}>
            <span>{index + 1}</span>
            <strong>{stop}</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TestPanel({ tests }) {
  const passedCount = tests.filter((test) => test.pass).length;
  const failedCount = tests.length - passedCount;

  return (
    <details className="test-panel">
      <summary>데이터 검증 · {failedCount ? `${failedCount}개 확인 필요` : `${passedCount}/${tests.length} 통과`}</summary>
      <div>
        {tests.map((test) => (
          <p key={test.name} className={test.pass ? "pass" : "fail"}>
            <strong>{test.pass ? "✓" : "!"} {test.name}</strong>
            <span>{test.detail}</span>
          </p>
        ))}
      </div>
    </details>
  );
}

export default function LibraryNightBusApp() {
  const [selectedDate, setSelectedDate] = useState(getDefaultDate());
  const [selectedRoute, setSelectedRoute] = useState("all");
  const [stopQuery, setStopQuery] = useState("");

  const selectedDaySchedule = schedule[selectedDate] || [];
  const availableRoutes = getAvailableRoutesByDate(selectedDate);
  const tests = useMemo(() => runDataTests(), []);

  const routeSearchResults = useMemo(() => {
    const query = normalizeText(stopQuery);
    if (!query) return [];

    return Object.entries(routes)
      .map(([routeNo, stops]) => ({
        routeNo: Number(routeNo),
        stops: stops.filter((stop) => normalizeText(stop).includes(query)),
      }))
      .filter((item) => item.stops.length > 0);
  }, [stopQuery]);

  const visibleTimes = useMemo(() => {
    if (selectedRoute === "all") return selectedDaySchedule;
    return selectedDaySchedule
      .filter((item) => item.routes.includes(Number(selectedRoute)))
      .map((item) => ({ ...item, routes: item.routes.filter((routeNo) => routeNo === Number(selectedRoute)) }));
  }, [selectedDate, selectedRoute, selectedDaySchedule]);

  return (
    <main className="app">
      <style>{`
        :root {
          --blue: #0066cc;
          --blue-press: #0071e3;
          --ink: #1d1d1f;
          --muted: #6e6e73;
          --soft: #f5f5f7;
          --card: #ffffff;
          --line: #e5e5ea;
          --dark: #111113;
          --green: #0a7f3f;
          --red: #b42318;
          --shadow: 0 10px 30px rgba(0,0,0,.06);
        }

        * { box-sizing: border-box; }
        body { margin: 0; background: var(--soft); }
        button, input { font: inherit; }
        button { -webkit-tap-highlight-color: transparent; }

        .app {
          min-height: 100vh;
          background: var(--soft);
          color: var(--ink);
          font-family: "Pretendard", "Pretendard Variable", -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", sans-serif;
          letter-spacing: -0.02em;
          padding-bottom: 40px;
          overflow-x: hidden;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          background: rgba(255,255,255,.82);
          backdrop-filter: saturate(180%) blur(18px);
          border-bottom: 1px solid rgba(0,0,0,.08);
        }

        .topbar-inner {
          max-width: 760px;
          margin: 0 auto;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .brand {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand strong {
          font-size: 15px;
          line-height: 1.2;
          font-weight: 800;
        }

        .brand span {
          color: var(--muted);
          font-size: 12px;
          line-height: 1.2;
          font-weight: 500;
        }

        .top-reset {
          border: 0;
          border-radius: 999px;
          background: var(--blue);
          color: #fff;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 700;
        }

        .top-reset:active, .date-pill:active, .route-tabs button:active, .search-result:active { transform: scale(.96); }
        .top-reset:focus-visible, .date-pill:focus-visible, .route-tabs button:focus-visible, .calendar-day:focus-visible, .search-box:focus-within {
          outline: 2px solid var(--blue-press);
          outline-offset: 2px;
        }

        .container {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          padding: 18px 16px 0;
        }

        .hero {
          position: relative;
          margin: 10px -2px 18px;
          padding: 22px 18px 24px;
          border-radius: 30px;
          background: radial-gradient(circle at 85% 8%, rgba(0,102,204,.16), transparent 34%), #ffffff;
          border: 1px solid rgba(0,0,0,.06);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .hero::after {
          content: "";
          position: absolute;
          right: -44px;
          bottom: -52px;
          width: 150px;
          height: 150px;
          border-radius: 999px;
          background: rgba(0,102,204,.08);
          pointer-events: none;
        }

        .hero-kicker {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          background: #eef5ff;
          border: 1px solid #cfe1ff;
          padding: 7px 11px;
          color: var(--blue);
          font-size: 13px;
          font-weight: 800;
        }

        .hero h1 {
          position: relative;
          z-index: 1;
          margin: 14px 0 0;
          font-size: clamp(34px, 9vw, 50px);
          line-height: 1.05;
          font-weight: 950;
          letter-spacing: -0.055em;
        }

        .hero p {
          position: relative;
          z-index: 1;
          margin: 12px 0 0;
          max-width: 520px;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.5;
          font-weight: 650;
        }

        .date-strip {
          margin-top: 8px;
          overflow: hidden;
        }

        .date-strip::after {
          content: "옆으로 밀어 날짜를 더 볼 수 있어요";
          display: block;
          margin-top: -2px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 12px;
          margin-bottom: 10px;
        }

        .section-head p, .eyebrow {
          margin: 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.25;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0;
        }

        .section-head h2 {
          margin: 3px 0 0;
          font-size: 20px;
          line-height: 1.2;
          font-weight: 900;
        }

        .count-badge {
          border-radius: 999px;
          background: var(--dark);
          color: #fff;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .date-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          overflow-y: hidden;
          width: 100%;
          max-width: 100%;
          padding: 2px 0 10px;
          scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          touch-action: pan-x;
          scrollbar-width: thin;
          scrollbar-color: #b7cfff transparent;
        }

        .date-scroll::-webkit-scrollbar { height: 6px; }

        .date-scroll::-webkit-scrollbar-track { background: transparent; }

        .date-scroll::-webkit-scrollbar-thumb {
          background: #b7cfff;
          border-radius: 999px;
        }

        .date-pill {
          flex: 0 0 66px;
          min-width: 66px;
          min-height: 82px;
          border: 2px solid #c7d7ff;
          border-radius: 20px;
          background: #eaf1ff;
          color: var(--blue);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          scroll-snap-align: start;
          transition: transform .12s ease, background .12s ease, color .12s ease, border-color .12s ease;
        }

        .date-pill .date-week {
          font-size: 12px;
          font-weight: 800;
          color: #335fbd;
        }

        .date-pill .date-week.sun { color: var(--red); }
        .date-pill .date-week.sat { color: var(--blue); }

        .date-pill strong {
          font-size: 24px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .date-pill em {
          margin-top: 2px;
          font-style: normal;
          font-size: 9px;
          font-weight: 800;
          color: inherit;
        }

        .date-pill.selected {
          background: var(--blue);
          border-color: var(--blue);
          color: #fff;
          box-shadow: 0 8px 22px rgba(0,102,204,.28);
        }

        .date-pill.selected .date-week { color: rgba(255,255,255,.82); }
        .date-pill.selected .date-week.sun, .date-pill.selected .date-week.sat { color: rgba(255,255,255,.82); }

        .month-calendar {
          margin-top: 4px;
          border-radius: 20px;
          background: #fff;
          border: 1px solid var(--line);
          overflow: hidden;
        }

        .month-calendar summary {
          list-style: none;
          cursor: pointer;
          padding: 14px 16px;
          color: var(--blue);
          font-size: 14px;
          font-weight: 800;
        }

        .month-calendar summary::-webkit-details-marker { display: none; }
        .weekday-grid, .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
          padding: 0 14px;
        }

        .weekday-grid {
          color: var(--muted);
          text-align: center;
          font-size: 12px;
          font-weight: 800;
        }

        .weekday-grid .sun { color: var(--red); }
        .weekday-grid .sat { color: var(--blue); }

        .calendar-grid { padding-top: 8px; padding-bottom: 12px; }

        .calendar-day {
          aspect-ratio: 1;
          border-radius: 999px;
          border: 1px solid transparent;
          background: transparent;
          color: #c2c2c7;
          font-size: 13px;
          font-weight: 800;
        }

        .calendar-day.service {
          background: #eaf1ff;
          border-color: #a9c4ff;
          color: var(--blue);
        }

        .calendar-day.selected {
          background: var(--blue);
          border-color: var(--blue);
          color: #fff;
        }

        .calendar-legend {
          border-top: 1px solid var(--line);
          padding: 10px 14px 14px;
          display: flex;
          gap: 14px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
        }

        .calendar-legend span { display: inline-flex; align-items: center; gap: 6px; }
        .calendar-legend i { width: 10px; height: 10px; border-radius: 999px; display: inline-block; }
        .legend-service { background: #eaf1ff; border: 1px solid #a9c4ff; }
        .legend-selected { background: var(--blue); }

        .search-section {
          margin-top: 12px;
        }

        .search-box {
          height: 50px;
          border-radius: 999px;
          background: #fff;
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 15px;
          box-shadow: var(--shadow);
        }

        .search-box span {
          color: var(--muted);
          font-size: 20px;
          line-height: 1;
        }

        .search-box input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--ink);
          font-size: 16px;
          font-weight: 600;
        }

        .search-box input::placeholder { color: #9a9aa0; }

        .search-box button {
          width: 28px;
          height: 28px;
          border: 0;
          border-radius: 999px;
          background: #eeeeef;
          color: var(--muted);
          font-size: 18px;
          font-weight: 800;
          line-height: 1;
        }

        .search-results {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .search-result {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: #fff;
          padding: 13px 14px;
          text-align: left;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 10px;
          align-items: center;
        }

        .search-result strong {
          color: var(--blue);
          font-size: 14px;
          font-weight: 900;
          white-space: nowrap;
        }

        .search-result span {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .summary-card, .route-card {
          margin-top: 14px;
          border-radius: 26px;
          background: #fff;
          border: 1px solid var(--line);
          box-shadow: var(--shadow);
          padding: 18px;
        }

        .summary-top {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: start;
          gap: 14px;
        }

        .summary-top h1 {
          margin: 4px 0 0;
          font-size: 34px;
          line-height: 1.05;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .note-chip {
          display: inline-flex;
          margin-top: 9px;
          border-radius: 999px;
          background: #fff5d9;
          color: #8a5a00;
          padding: 6px 9px;
          font-size: 12px;
          font-weight: 900;
        }

        .boarding-point {
          min-width: 104px;
          border-radius: 18px;
          background: var(--dark);
          color: #fff;
          padding: 10px 12px;
          text-align: center;
        }

        .boarding-point span {
          display: block;
          color: rgba(255,255,255,.64);
          font-size: 11px;
          font-weight: 800;
        }

        .boarding-point strong {
          display: block;
          margin-top: 3px;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.2;
        }

        .route-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          margin: 16px -18px 0;
          padding: 0 18px 2px;
          -webkit-overflow-scrolling: touch;
        }

        .route-tabs::-webkit-scrollbar { display: none; }

        .route-tabs button {
          flex: 0 0 auto;
          min-width: 48px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: #fff;
          color: var(--ink);
          font-size: 14px;
          font-weight: 900;
        }

        .route-tabs button.active {
          background: var(--blue);
          border-color: var(--blue);
          color: #fff;
        }

        .route-tabs button:disabled {
          color: #c0c0c6;
          background: #f3f3f5;
        }

        .time-list {
          margin-top: 14px;
          display: grid;
          gap: 10px;
        }

        .time-card {
          border-radius: 22px;
          background: var(--soft);
          padding: 15px;
          display: grid;
          grid-template-columns: 96px 1fr;
          gap: 12px;
          align-items: center;
        }

        .time-card p {
          margin: 0;
          color: var(--muted);
          font-size: 12px;
          font-weight: 900;
        }

        .time-card strong {
          display: block;
          margin-top: 1px;
          font-size: 28px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .time-route-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: flex-end;
        }

        .time-route-chips span {
          border-radius: 999px;
          background: var(--blue);
          border: 1px solid var(--blue);
          color: #fff;
          padding: 8px 11px;
          font-size: 15px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.03em;
          box-shadow: 0 5px 14px rgba(0,102,204,.18);
        }

        .route-card.placeholder {
          background: var(--dark);
          color: #fff;
          box-shadow: none;
        }

        .route-card.placeholder .eyebrow, .route-card.placeholder p { color: rgba(255,255,255,.66); }

        .route-choice-grid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .route-choice-grid button {
          width: 100%;
          min-height: 58px;
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 18px;
          background: rgba(255,255,255,.08);
          color: #fff;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          text-align: left;
        }

        .route-choice-grid button:disabled {
          opacity: .35;
        }

        .route-choice-grid button:active {
          transform: scale(.98);
        }

        .route-choice-grid button strong {
          font-size: 17px;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .route-choice-grid button span {
          border-radius: 999px;
          background: var(--blue);
          color: #fff;
          padding: 7px 10px;
          font-size: 13px;
          font-weight: 900;
          white-space: nowrap;
        }

        .route-card h2 {
          margin: 4px 0 0;
          font-size: 24px;
          line-height: 1.2;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .route-card p {
          margin: 7px 0 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.45;
          font-weight: 600;
        }

        .route-head {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .route-time-mini {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border-radius: 18px;
          background: var(--soft);
          padding: 11px 13px;
        }

        .route-time-mini span {
          color: var(--muted);
          font-size: 12px;
          font-weight: 900;
        }

        .route-time-mini strong {
          color: var(--blue);
          font-size: 16px;
          font-weight: 950;
        }

        .stop-list {
          margin: 14px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 8px;
          max-height: 380px;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }

        .stop-list li {
          display: grid;
          grid-template-columns: 32px 1fr;
          align-items: center;
          gap: 10px;
          border-radius: 16px;
          background: var(--soft);
          padding: 10px 12px;
        }

        .stop-list li span {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #fff;
          color: var(--blue);
          font-size: 12px;
          font-weight: 950;
        }

        .stop-list li strong {
          font-size: 15px;
          font-weight: 800;
          line-height: 1.35;
        }

        .guide {
          margin: 14px 0 0;
          color: var(--muted);
          text-align: center;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 600;
          padding: 0 12px;
        }

        .empty-box {
          border-radius: 18px;
          background: var(--soft);
          color: var(--muted);
          padding: 14px;
          font-size: 14px;
          line-height: 1.45;
          font-weight: 700;
        }

        .test-panel {
          max-width: 760px;
          margin: 18px auto 0;
          padding: 0 16px;
          color: var(--muted);
          font-size: 12px;
        }

        .test-panel summary {
          cursor: pointer;
          font-weight: 800;
        }

        .test-panel div {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .test-panel p {
          margin: 0;
          display: grid;
          gap: 2px;
          border-radius: 14px;
          background: #fff;
          border: 1px solid var(--line);
          padding: 10px;
        }

        .test-panel strong { color: var(--ink); }
        .test-panel span { color: var(--muted); }
        .test-panel .pass strong { color: var(--green); }
        .test-panel .fail strong { color: var(--red); }

        @media (max-width: 380px) {
          .time-card {
            grid-template-columns: 1fr;
          }

          .time-route-chips {
            justify-content: flex-start;
          }
        }

        @media (min-width: 760px) {
          .topbar-inner {
            max-width: 920px;
            padding-left: 24px;
            padding-right: 24px;
          }

          .container {
            max-width: 920px;
            padding: 28px 24px 0;
          }

          .hero {
            padding: 34px 34px 36px;
          }

          .hero h1 {
            max-width: 720px;
          }

          .date-strip::after {
            display: block;
          }

          .date-pill {
            flex-basis: 72px;
            min-width: 72px;
          }

          .mobile-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            align-items: start;
          }

          .summary-card { margin-top: 14px; }
          .route-card { grid-column: 1 / -1; }
          .route-choice-grid { grid-template-columns: repeat(2, 1fr); }
          .stop-list { grid-template-columns: 1fr 1fr; max-height: none; }
        }

        @media (min-width: 1024px) {
          .topbar-inner {
            max-width: 1120px;
          }

          .container {
            max-width: 1120px;
            padding-top: 34px;
          }

          .hero {
            min-height: 280px;
            padding: 44px 48px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .hero h1 {
            font-size: 52px;
          }

          .hero p {
            font-size: 17px;
          }

          .date-strip,
          .month-calendar,
          .search-section {
            max-width: 860px;
          }

          .mobile-grid {
            grid-template-columns: minmax(420px, .92fr) minmax(460px, 1.08fr);
            gap: 18px;
            align-items: start;
          }

          .summary-card,
          .route-card {
            margin-top: 18px;
            padding: 22px;
          }

          .route-card {
            grid-column: auto;
          }

          .route-choice-grid {
            grid-template-columns: 1fr;
          }

          .stop-list {
            grid-template-columns: 1fr 1fr;
            max-height: 560px;
          }

          .time-card {
            grid-template-columns: 112px 1fr;
            padding: 18px;
          }
        }

        @media (min-width: 1280px) {
          .topbar-inner,
          .container {
            max-width: 1180px;
          }

          .hero {
            min-height: 320px;
          }
        }
      `}</style>

      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <strong>중앙도서관 야간버스</strong>
            <span>2026.4.10. - 4.27. · 중앙도서관 정문 앞 탑승</span>
          </div>
          <button
            type="button"
            className="top-reset"
            onClick={() => {
              setSelectedDate(getDefaultDate());
              setSelectedRoute("all");
              setStopQuery("");
            }}
          >
            초기화
          </button>
        </div>
      </header>

      <div className="container">
        <section className="hero">
          <span className="hero-kicker">중간고사 기간 한정 운행</span>
          <h1>공부를 마친 밤,<br />귀가길은 더 편하게.</h1>
          <p>오늘 운행하는 시간과 노선을 빠르게 확인하세요.</p>
        </section>

        <DateScroller selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <MonthMiniCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <SearchBox
          stopQuery={stopQuery}
          setStopQuery={setStopQuery}
          routeSearchResults={routeSearchResults}
          setSelectedRoute={setSelectedRoute}
        />

        <div className="mobile-grid">
          <TodaySummary
            selectedDate={selectedDate}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            visibleTimes={visibleTimes}
            availableRoutes={availableRoutes}
          />
          <RouteDetail
            selectedRoute={selectedRoute}
            selectedDate={selectedDate}
            setSelectedRoute={setSelectedRoute}
            availableRoutes={availableRoutes}
          />
        </div>

        <p className="guide">탑승 위치는 중앙도서관 정문 앞입니다. 출발 시간은 중앙도서관 기준이며, 교통 상황에 따라 정류장 도착 시간은 달라질 수 있습니다.</p>
      </div>

      <TestPanel tests={tests} />
    </main>
  );
}
