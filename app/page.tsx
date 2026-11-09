"use client";

import { useEffect, useRef, useState } from "react";

type Screen = "home" | "reservation" | "hunger" | "identity" | "confirmation" | "funeral" | "menu" | "finale";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const appetites = ["Forgiveness", "Desire", "Recognition", "Love", "Nothing"] as const;
const funeralSignatureLinesFrench = [
  "Sincèrement vôtre —",
  "celui qui implore votre Pardon,",
  "qui veut combler votre Désir,",
  "qui souhaite obtenir votre Reconnaissance",
  "et qui veut vous aimer,",
  "W. A. Mozart",
] as const;
const funeralSignatureLinesEnglish = [
  "Sincerely yours —",
  "the one who begs for your Forgiveness,",
  "who wants to satisfy your Desire,",
  "who longs for your Recognition,",
  "and who wants to love you,",
  "W. A. Mozart",
] as const;
const courses = [
  {
    id: "aperitif",
    number: "01",
    name: "Apéritif",
    ingredients: [
      "Basse-Autriche — Fleurs de tilleul",
      "Wachau — Miel",
      "Ceylan — Cannelle",
    ],
    description: "Une infusion douce et réconfortante, où le miel s’accorde à la chaleur délicate de la cannelle. Les fleurs de tilleul apportent une note florale légère et apaisante, pour une pause simple, chaleureuse et sereine.",
  },
  {
    id: "entree",
    number: "02",
    name: "Entrée",
    ingredients: [
      "Périgord — Foie gras",
      "Alsace — Pâte feuilletée",
      "Bourgogne — Groseilles rouges",
    ],
    description: "Un foie gras délicatement enveloppé dans une pâte feuilletée dorée, accompagné d’une confiture de groseilles rouges aux notes fraîches et acidulées. La richesse du foie gras se trouve ainsi équilibrée par la vivacité du fruit, dans un accord délicat et généreux.",
  },
  {
    id: "plat-principal",
    number: "03",
    name: "Plat Principal",
    ingredients: [
      "Basse-Autriche — Veau",
      "Styrie — Champignons",
      "Légumes-racines, herbes fraîches & crème",
    ],
    description: "Un tendre veau mijoté dans une crème délicatement parfumée aux herbes fraîches, accompagné de champignons des sous-bois et de légumes-racines. Une préparation douce et généreuse, où la richesse de la crème s’accorde à la fraîcheur des herbes et aux saveurs profondes de la terre.",
  },
  {
    id: "fromage",
    number: "04",
    name: "Fromage",
    ingredients: [
      "Île-de-France — Brie",
      "Pain de campagne",
      "Raisins & noix",
    ],
    description: "Un Brie doux et crémeux accompagné de pain de campagne, de raisins frais et de quelques noix. La douceur du fromage se mêle à la fraîcheur du fruit et au croquant délicat des noix, offrant une transition simple et élégante vers le dessert.",
  },
  {
    id: "dessert",
    number: "05",
    name: "Dessert",
    ingredients: [
      "Veneto — Yuzu & citron vert",
      "Cardamome verte & menthe",
    ],
    description: "Le yuzu éclatant rencontre la fraîcheur de la menthe et la chaleur délicatement épicée de la cardamome verte. Le citron vert apporte une pointe d’acidité, tandis que la douceur lactée et le sorbet prolongent les arômes dans une finale fraîche et légère.",
  },
  {
    id: "digestif",
    number: "06",
    name: "Digestif",
    ingredients: ["Trapani — Marsala Dolce"],
    description: "Un vin doux et généreux, aux notes de fruits secs, de caramel et d’épices délicates. Servi en fin de repas, il prolonge les dernières saveurs avec une chaleur douce et persistante.",
  },
] as const;

function calendarDays(year: number, month: number) {
  const count = new Date(year, month + 1, 0).getDate();
  const mondayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  return [
    ...Array.from({ length: mondayOffset }, () => null),
    ...Array.from({ length: count }, (_, index) => index + 1),
  ];
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [transition, setTransition] = useState<"idle" | "cover" | "reveal">("idle");
  const [wipeTone, setWipeTone] = useState<"green" | "red" | "paper">("green");
  const [calendarToday, setCalendarToday] = useState<Date | null>(null);
  const [visibleMonth, setVisibleMonth] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateState, setDateState] = useState<"choosing" | "checking" | "retained">("choosing");
  const [deathNoticeOpen, setDeathNoticeOpen] = useState(false);
  const [funeralCompleted, setFuneralCompleted] = useState(false);
  const [funeralPhase, setFuneralPhase] = useState<"confirmation" | "flicker" | "letter">("confirmation");
  const [funeralLetterLanguage, setFuneralLetterLanguage] = useState<"fr" | "en">("fr");
  const [signatureStarted, setSignatureStarted] = useState(false);
  const [signatureTyping, setSignatureTyping] = useState(true);
  const [letterSwitching, setLetterSwitching] = useState(false);
  const [funeralLetterReady, setFuneralLetterReady] = useState(false);
  const [funeralContinuationOpen, setFuneralContinuationOpen] = useState(false);
  const [appetite, setAppetite] = useState("");
  const [guestName, setGuestName] = useState("");
  const [identityState, setIdentityState] = useState<"typing" | "checking" | "crossing" | "recognised">("typing");
  const [submittedName, setSubmittedName] = useState("");
  const [nameNotice, setNameNotice] = useState<{ message: string; enterInvitation: boolean } | null>(null);
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const funeralSignatureRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    if (screen !== "reservation") return;

    const accessedAt = new Date();
    const today = new Date(accessedAt.getFullYear(), accessedAt.getMonth(), accessedAt.getDate());
    setCalendarToday(today);
    setVisibleMonth((current) => current ?? new Date(today.getFullYear(), today.getMonth(), 1));

    if (selectedDate && selectedDate < today) {
      setSelectedDate(null);
      setDateState("choosing");
    }
  }, [screen, selectedDate]);

  useEffect(() => {
    if (screen !== "funeral") return;

    setFuneralPhase("confirmation");
    setFuneralLetterLanguage("fr");
    setSignatureStarted(false);
    setSignatureTyping(true);
    setLetterSwitching(false);
    setFuneralLetterReady(false);
    setFuneralContinuationOpen(false);
    const flickerTimer = window.setTimeout(() => setFuneralPhase("flicker"), 2000);
    const letterTimer = window.setTimeout(() => setFuneralPhase("letter"), 3150);

    return () => {
      window.clearTimeout(flickerTimer);
      window.clearTimeout(letterTimer);
    };
  }, [screen]);

  useEffect(() => {
    if (funeralPhase !== "letter") return;
    if (!signatureTyping) return;
    const signature = funeralSignatureRef.current;
    if (!signature) return;

    if (!("IntersectionObserver" in window)) {
      setSignatureStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSignatureStarted(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(signature);
    return () => observer.disconnect();
  }, [funeralPhase, funeralLetterLanguage, signatureTyping]);

  function moveTo(nextScreen: Screen) {
    if (transition !== "idle") return;
    setWipeTone(nextScreen === "confirmation" || nextScreen === "funeral" || nextScreen === "finale" ? "red" : nextScreen === "menu" ? "paper" : "green");
    setTransition("cover");
    timers.current.push(
      window.setTimeout(() => {
        setScreen(nextScreen);
        setTransition("reveal");
      }, 720),
      window.setTimeout(() => setTransition("idle"), 1450),
    );
  }

  function changeMonth(direction: -1 | 1) {
    setVisibleMonth((current) => {
      if (!current) return current;
      const nextMonth = new Date(current.getFullYear(), current.getMonth() + direction, 1);
      if (direction === -1 && calendarToday) {
        const firstAvailableMonth = new Date(calendarToday.getFullYear(), calendarToday.getMonth(), 1);
        if (nextMonth < firstAvailableMonth) return current;
      }
      return nextMonth;
    });
  }

  function saveDate() {
    if (!selectedDate || dateState !== "choosing") return;
    setDateState("checking");
    timers.current.push(window.setTimeout(() => setDateState("retained"), 1050));
  }

  function selectDate(date: Date) {
    setSelectedDate(date);
    if (date.getMonth() === 11 && date.getDate() === 5) {
      setDeathNoticeOpen(true);
    }
  }

  function reserveFuneral() {
    setDeathNoticeOpen(false);
    moveTo("funeral");
  }

  function continueAfterFuneral() {
    setFuneralContinuationOpen(false);
    setFuneralCompleted(true);
    setSelectedDate(null);
    setDateState("choosing");
    moveTo("reservation");
  }

  function toggleFuneralTranslation() {
    if (letterSwitching) return;
    setLetterSwitching(true);

    const swapTimer = window.setTimeout(() => {
      setFuneralLetterLanguage((current) => current === "fr" ? "en" : "fr");
      setSignatureTyping(false);
      setSignatureStarted(true);

      const revealTimer = window.setTimeout(() => {
        setLetterSwitching(false);
        setFuneralLetterReady(true);
      }, 40);
      timers.current.push(revealTimer);
    }, 260);
    timers.current.push(swapTimer);
  }

  function identifyGuest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!guestName.trim() || identityState !== "typing") return;

    const normalizedName = guestName.trim().replace(/\s+/g, " ").normalize("NFC").toLowerCase();
    if (normalizedName === "yanis" || normalizedName === "yanis richard") {
      setNameNotice({
        message: "Indisponible pour vous-même, Monsieur Mozart.",
        enterInvitation: false,
      });
      return;
    }
    if (normalizedName === "laurent" || normalizedName === "laurent bán") {
      setNameNotice({
        message: "Vous avez déjà un rendez-vous, maestro Salieri.",
        enterInvitation: true,
      });
      return;
    }

    setSubmittedName(guestName);
    setIdentityState("checking");
    timers.current.push(
      window.setTimeout(() => setIdentityState("crossing"), 2000),
      window.setTimeout(
        () => {
          setGuestName("Antonio Salieri");
          setIdentityState("recognised");
        },
        2500,
      ),
    );
  }

  function closeNameNotice() {
    const enterInvitation = nameNotice?.enterInvitation;
    setNameNotice(null);
    if (enterInvitation) moveTo("confirmation");
  }

  const year = visibleMonth?.getFullYear() ?? 0;
  const month = visibleMonth?.getMonth() ?? 0;
  const days = visibleMonth ? calendarDays(year, month) : [];
  const atFirstMonth = Boolean(
    calendarToday
    && year === calendarToday.getFullYear()
    && month === calendarToday.getMonth(),
  );
  const funeralSignatureLines = funeralLetterLanguage === "fr" ? funeralSignatureLinesFrench : funeralSignatureLinesEnglish;
  const funeralSignatureWordCount = funeralSignatureLines.reduce((total, line) => total + line.split(" ").length, 0);
  let funeralSignatureWordIndex = 0;
  let funeralSignatureDelay = 0;

  return (
    <main className={`mobile-page ${screen === "confirmation" || screen === "funeral" || screen === "finale" ? "red" : screen !== "home" ? "green" : ""}`}>
      {screen === "home" ? (
        <section className="hero" aria-labelledby="restaurant-name">
          <header className="hero-header">
            <p>Private dining · Vienna</p>
            <span aria-hidden="true">M</span>
            <p>By invitation</p>
          </header>

          <div className="hero-rule" aria-hidden="true" />

          <div className="hero-copy">
            <p className="eyebrow">An intimate six-course experience</p>
            <h1 id="restaurant-name">
              <span>Mozart&apos;s</span>
              Private Dining
            </h1>
            <p className="location">
              Domgasse 5
              <br />
              1010 Wien, Austria
            </p>
          </div>

          <div className="hero-action">
            <button className="reserve-button" type="button" onClick={() => moveTo("reservation")}>
              <span>Reserve a table</span>
            </button>
            <p>Evening service · 20:15</p>
            <button className="about-trigger" type="button" onClick={() => setCreditsOpen(true)}>
              Learn more about us
            </button>
          </div>

          <div className="red-mark" aria-hidden="true">
            <span>Bon</span>
            <span>Appétit</span>
          </div>

          {creditsOpen && (
            <div
              className="credits-backdrop"
              onClick={() => setCreditsOpen(false)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setCreditsOpen(false);
              }}
            >
              <div
                className="credits-panel"
                role="dialog"
                aria-modal="true"
                aria-label="About us"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  className="credits-close"
                  type="button"
                  autoFocus
                  aria-label="Close"
                  onClick={() => setCreditsOpen(false)}
                >
                  ×
                </button>
                <p>
                  <span>Designed by <strong>AAA洛阳畚箕批发小王</strong></span>
                  <a
                    href="https://xhslink.cn/o/6UquAZFXWtR"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open AAA洛阳畚箕批发小王 on Xiaohongshu"
                  >
                    <span className="external-arrow" aria-hidden="true" />
                  </a>
                </p>
                <p>
                  <span>Written by <strong>sangshuishangshu</strong></span>
                  <a
                    href="https://archiveofourown.org/users/sanshuishangshu/pseuds/sanshuishangshu"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open sangshuishangshu on AO3"
                  >
                    <span className="external-arrow" aria-hidden="true" />
                  </a>
                </p>
              </div>
            </div>
          )}
        </section>
      ) : screen === "reservation" ? (
        <section className="reservation-screen" aria-labelledby="reservation-title">
          <header className="reservation-header">
            <button type="button" onClick={() => moveTo("home")} aria-label="Return to the welcome screen">
              Back
            </button>
            <span aria-hidden="true">M</span>
            <p>Reservation · 01</p>
          </header>

          <div className="reservation-intro">
            <p className="reservation-kicker">Your evening</p>
            <h2 id="reservation-title">Choose your evening.</h2>
            <p>Private service at Domgasse 5, Vienna.</p>
          </div>

          <div className="guest-card">
            <div>
              <p className="field-label">Party</p>
              <p className="field-value">1 guest</p>
            </div>
            <span className="guest-number">01</span>
          </div>

          <div className="seat-card">
            <p className="field-label">Seating</p>
            <p className="field-value">Chef&apos;s counter</p>
            <p className="seat-note">One seat facing the kitchen.</p>
          </div>

          <div className={`calendar-block ${dateState}`}>
            {dateState === "retained" ? (
              <div className="retained-date" aria-live="polite">
                <p className="field-label">Date retained</p>
                <p className="retained-value">12 June 1782</p>
                <p>The house has kept this evening for you.</p>
                <button className="continue-date" type="button" onClick={() => moveTo("identity")}>
                  Continue
                </button>
              </div>
            ) : !calendarToday || !visibleMonth ? (
              <p className="calendar-loading" aria-live="polite">Preparing today&apos;s calendar…</p>
            ) : (
              <>
                <div className="calendar-heading">
                  <button type="button" onClick={() => changeMonth(-1)} disabled={atFirstMonth} aria-label="Previous month">
                    ←
                  </button>
                  <p>{monthNames[month]} {year}</p>
                  <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">
                    →
                  </button>
                </div>

                <div className="weekdays" aria-hidden="true">
                  {weekdays.map((day) => <span key={day}>{day}</span>)}
                </div>

                <div className="calendar-grid" role="grid" aria-label={`${monthNames[month]} ${year}`}>
                  {days.map((day, index) => {
                    if (day === null) return <span key={`empty-${index}`} />;
                    const date = new Date(year, month, day);
                    const funeralDateLocked = funeralCompleted && month === 11 && day === 5;
                    const disabled = date < calendarToday || funeralDateLocked;
                    const selected = selectedDate?.getTime() === date.getTime();
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={disabled || dateState === "checking"}
                        className={selected ? "selected" : ""}
                        onClick={() => selectDate(date)}
                        aria-pressed={selected}
                        aria-label={funeralDateLocked ? `${day}, unavailable` : String(day)}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <button className="save-date" type="button" disabled={!selectedDate || dateState === "checking"} onClick={saveDate}>
                  {dateState === "checking" ? "Checking the house…" : "Save this date"}
                </button>
              </>
            )}
          </div>

          <p className="reservation-footnote">One sitting each evening · 20:15</p>

          {deathNoticeOpen && (
            <div
              className="death-notice-backdrop"
              onClick={() => setDeathNoticeOpen(false)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setDeathNoticeOpen(false);
              }}
            >
              <div
                className="death-notice"
                role="dialog"
                aria-modal="true"
                aria-labelledby="death-notice-title"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="death-notice-mark" aria-hidden="true">†</p>
                <p id="death-notice-title">
                  Sorry, our chef, Monsieur W.A.Mozart, will die today.
                </p>
                <p className="death-notice-rip">R.I.P</p>
                <button className="funeral-reserve-button" type="button" autoFocus onClick={reserveFuneral}>
                  Reserve a place at his funeral
                </button>
              </div>
            </div>
          )}
        </section>
      ) : screen === "hunger" ? (
        <section className="hunger-screen" aria-labelledby="hunger-title">
          <header className="reservation-header">
            <button type="button" onClick={() => moveTo("identity")} aria-label="Return to guest details">
              Back
            </button>
            <span aria-hidden="true">M</span>
            <p>Reservation · 03</p>
          </header>

          <div className="hunger-intro">
            <p className="reservation-kicker">Your appetite</p>
            <h2 id="hunger-title">What are you hungry for?</h2>
          </div>

          <fieldset className="appetite-options">
            <legend>Choose one</legend>
            {appetites.map((option, index) => (
              <label key={option}>
                <input
                  type="radio"
                  name="appetite"
                  value={option}
                  checked={appetite === option}
                  onChange={() => setAppetite(option)}
                />
                <span className="appetite-number">0{index + 1}</span>
                <span className="appetite-name">{option}</span>
                <span className="appetite-mark" aria-hidden="true">●</span>
              </label>
            ))}
          </fieldset>

          <p className="hunger-note">
            The chef prefers to know which appetite he is expected to satisfy.
          </p>

          <button
            className="hunger-continue"
            type="button"
            disabled={!appetite}
            onClick={() => moveTo("confirmation")}
          >
            Continue
          </button>
        </section>
      ) : screen === "identity" ? (
        <section className="identity-screen" aria-labelledby="identity-title">
          <header className="reservation-header">
            <button type="button" onClick={() => moveTo("reservation")} aria-label="Return to date selection">
              Back
            </button>
            <span aria-hidden="true">M</span>
            <p>Reservation · 02</p>
          </header>

          <div className="identity-intro">
            <p className="reservation-kicker">Guest details</p>
            <h2 id="identity-title">Who shall we expect?</h2>
          </div>

          <form className={`identity-form ${identityState}`} onSubmit={identifyGuest}>
            <label htmlFor="guest-name">Name of guest</label>
            <div className="name-input-shell">
              <input
                id="guest-name"
                name="guest-name"
                type="text"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                disabled={identityState !== "typing"}
                autoComplete="off"
                spellCheck="false"
              />
              {identityState === "checking" && <span className="name-loader" aria-label="Consulting the guest book" />}
              {(identityState === "crossing" || identityState === "recognised") && (
                <div className="name-overwrite" aria-hidden="true">
                  <span className="crossed-name">
                    {submittedName}
                    <svg className="name-scribble" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
                      <path pathLength="1" d="M3 23 C24 10 48 31 73 17 S128 10 159 23 L196 12 C176 16 160 33 133 26 S79 10 46 26 L8 31 Q27 17 60 20 T113 29 Q146 11 192 29 L173 33 Q144 19 121 22 T66 31 Q35 11 5 17 L28 9 Q59 30 93 13 T153 17 L197 22 Q167 7 146 12 T103 18 Q62 8 19 25 L4 11 Q41 18 64 13 T118 27 Q160 30 197 17 L178 9 Q143 34 103 24 T43 18 L7 28 Q50 35 84 23 T145 14 L195 31 Q153 23 124 31 T66 19 L9 14" />
                    </svg>
                  </span>
                  {identityState === "recognised" && <span className="replacement-name">Antonio Salieri</span>}
                </div>
              )}
            </div>
            <p className="name-note">The chef prefers to know whom he is serving.</p>

            <button className="identify-button" type="submit" disabled={!guestName.trim() || identityState !== "typing"}>
              {identityState === "typing" && "Continue"}
              {(identityState === "checking" || identityState === "crossing") && "Consulting the guest book…"}
              {identityState === "recognised" && "Guest recognised"}
            </button>
          </form>

          <div className={`recognition-message ${identityState === "recognised" ? "visible" : ""}`} aria-live="polite">
            <p>Guest recognised.</p>
            <p>The chef has been expecting you.</p>
            <button className="invitation-button" type="button" onClick={() => moveTo("hunger")}>
              Continue
            </button>
          </div>

          <p className="reservation-footnote">Domgasse 5 · One guest expected</p>

          {nameNotice && (
            <div
              className="death-notice-backdrop"
              onClick={closeNameNotice}
              onKeyDown={(event) => {
                if (event.key === "Escape") closeNameNotice();
              }}
            >
              <div
                className="death-notice name-notice"
                role="dialog"
                aria-modal="true"
                aria-labelledby="name-notice-title"
                onClick={(event) => event.stopPropagation()}
              >
                <p id="name-notice-title" className="name-notice-message">
                  {nameNotice.message}
                </p>
                <button type="button" autoFocus onClick={closeNameNotice}>
                  Close
                </button>
              </div>
            </div>
          )}
        </section>
      ) : screen === "funeral" ? funeralPhase === "letter" ? (
        <article className="funeral-letter" aria-labelledby="funeral-letter-title">
          <div className={`funeral-letter-inner ${letterSwitching ? "is-switching" : ""}`}>
          <header className="funeral-letter-header">
            <span>Domgasse 5 · {funeralLetterLanguage === "fr" ? "Vienne" : "Vienna"}</span>
            <span>{funeralLetterLanguage === "fr" ? "5 décembre 1791" : "5 December 1791"}</span>
          </header>

          <div className="funeral-letter-copy">
            {funeralLetterLanguage === "fr" ? (
              <>
                <h2 id="funeral-letter-title">Je le savais !</h2>
                <p>Vous voyiez déjà comment mon histoire finirait, n’est-ce pas ?</p>
                <p>
                  Je pouvais vous donner tout ce que vous vouliez. Je pouvais combler votre Désir,
                  vous accorder mon Pardon, vous offrir mon Amour, mon cœur. J’espérais qu’ils vous
                  parviendraient. Gardez-les bien pour moi — ces choses si précieuses dont je n’ai
                  peut-être jamais su faire bon usage.
                </p>
                <p>Il vous suffisait de réserver une place à mes funérailles.</p>
                <p>Alors venez, Maestro. Ne me faites pas attendre.</p>
              </>
            ) : (
              <>
                <h2 id="funeral-letter-title">I knew it!</h2>
                <p>You already saw how my story would end, didn’t you?</p>
                <p>
                  Everything you wanted was mine to give. It was in my power to satisfy your Desire,
                  grant you my Forgiveness, offer you my Love, my heart. All the while, I was hoping
                  they would find their way to you. Keep them safe for me — these precious things I may
                  never have known how to put to good use.
                </p>
                <p>All you ever had to do was reserve a place at my funeral.</p>
                <p>So come, Maestro. Do not keep me waiting.</p>
              </>
            )}
          </div>

          <p
            ref={funeralSignatureRef}
            className={`funeral-letter-signature ${signatureTyping ? (signatureStarted ? "typing" : "") : "static"}`}
            aria-label={funeralLetterLanguage === "fr"
              ? "Sincèrement vôtre — celui qui implore votre Pardon, qui veut combler votre Désir, qui souhaite obtenir votre Reconnaissance et qui veut vous aimer, W. A. Mozart"
              : "Sincerely yours — the one who begs for your Forgiveness, who wants to satisfy your Desire, who longs for your Recognition, and who wants to love you, W. A. Mozart"}
          >
            {funeralSignatureLines.map((line) => (
              <span className="funeral-signature-line" key={line} aria-hidden="true">
                {line.split(" ").map((word, wordInLine, words) => {
                  const delay = funeralSignatureDelay;
                  const wordIndex = funeralSignatureWordIndex;
                  const isNameLine = line === "W. A. Mozart";
                  const rhythm = [80, 145, 95, 210, 115, 70, 170];
                  const punctuationPause = /[,—]$/.test(word) ? 230 : /[.!?]$/.test(word) ? 310 : 0;
                  const linePause = wordInLine === words.length - 1 ? 260 : 0;
                  const cadence = isNameLine ? 340 : rhythm[funeralSignatureWordIndex % rhythm.length];
                  const duration = 125 + (funeralSignatureWordIndex % 4) * 35;
                  funeralSignatureDelay += cadence + punctuationPause + linePause;
                  funeralSignatureWordIndex += 1;
                  return (
                    <span
                      className="funeral-signature-word"
                      style={{ animationDelay: `${delay}ms`, animationDuration: `${duration}ms` }}
                      key={`${line}-${word}-${delay}`}
                      onAnimationEnd={wordIndex === funeralSignatureWordCount - 1 ? () => setFuneralLetterReady(true) : undefined}
                    >
                      {word}{" "}
                    </span>
                  );
                })}
              </span>
            ))}
          </p>
          <button className="funeral-translation-link" type="button" disabled={letterSwitching} onClick={toggleFuneralTranslation}>
            {funeralLetterLanguage === "fr" ? "maybe you need a translation" : "return to the original"}
          </button>
          {funeralLetterReady && (
            <button className="funeral-next-button" type="button" onClick={() => setFuneralContinuationOpen(true)}>
              NEXT
            </button>
          )}
          </div>
          {funeralContinuationOpen && (
            <div
              className="funeral-continuation-backdrop"
              onClick={() => setFuneralContinuationOpen(false)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setFuneralContinuationOpen(false);
              }}
            >
              <div
                className="funeral-continuation-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="funeral-continuation-title"
                onClick={(event) => event.stopPropagation()}
              >
                <p id="funeral-continuation-title">Would you like to continue with your dinner reservation?</p>
                <div className="funeral-continuation-actions">
                  <button type="button" autoFocus onClick={continueAfterFuneral}>
                    Yes, continue
                  </button>
                  <button type="button" onClick={() => setFuneralContinuationOpen(false)}>
                    Observe a moment of silence
                  </button>
                </div>
              </div>
            </div>
          )}
        </article>
      ) : (
        <section className={`confirmation-screen funeral-confirmation ${funeralPhase === "flicker" ? "is-flickering" : ""}`} aria-labelledby="funeral-title">
          <header className="confirmation-header">
            <button type="button" onClick={() => moveTo("reservation")} aria-label="Return to date selection">
              Back
            </button>
            <span aria-hidden="true">M</span>
            <p>Funeral</p>
          </header>

          <div className="confirmation-copy">
            <p className="confirmation-kicker">Reservation accepted</p>
            <div className="confirmation-title-wrap">
              <h2 id="funeral-title">Your place has been reserved.</h2>
            </div>
            <p>The deceased has been expecting you.</p>
          </div>

          <dl className="reservation-summary">
            <div>
              <dt>Guest</dt>
              <dd>Antonio Salieri</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>5 December 1791</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>Funeral of W. A. Mozart</dd>
            </div>
            <div>
              <dt>Attendance</dt>
              <dd>1 mourner</dd>
            </div>
          </dl>

          <div className="confirmation-address">
            <p>Vienna</p>
            <p>Austria</p>
          </div>

          <p className="arrival-note">Please arrive before the final note.</p>
          <div className="appetit-echo funeral-echo" aria-hidden="true">Requiem</div>
        </section>
      ) : screen === "confirmation" ? (
        <section className="confirmation-screen" aria-labelledby="confirmation-title">
          <header className="confirmation-header">
            <button type="button" onClick={() => moveTo("identity")} aria-label="Return to guest details">
              Back
            </button>
            <span aria-hidden="true">M</span>
            <p>Invitation</p>
          </header>

          <div className="confirmation-copy">
            <p className="confirmation-kicker">Reservation accepted</p>
            <div className="confirmation-title-wrap">
              <h2 id="confirmation-title">Your table is ready.</h2>
            </div>
            <p>No reservation was made.<br />Your place has always been kept.</p>
          </div>

          <dl className="reservation-summary">
            <div>
              <dt>Guest</dt>
              <dd>Antonio Salieri</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>12 June 1782</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>20:15</dd>
            </div>
            <div>
              <dt>Seat</dt>
              <dd>Chef&apos;s counter</dd>
            </div>
          </dl>

          <div className="confirmation-address">
            <p>Domgasse 5</p>
            <p>1010 Wien, Austria</p>
          </div>

          <button className="menu-button" type="button" onClick={() => moveTo("menu")}>
            View your menu
          </button>
          <p className="arrival-note">Please arrive hungry.</p>
          <div className="appetit-echo" aria-hidden="true">Appétit</div>
        </section>
      ) : screen === "menu" ? (
        <section className="menu-screen" aria-labelledby="menu-title">
          <header className="menu-header">
            <button type="button" onClick={() => moveTo("confirmation")} aria-label="Return to invitation">
              Back
            </button>
            <span aria-hidden="true">M</span>
            <p>Six courses</p>
          </header>

          <div className="menu-intro">
            <p className="menu-kicker">Prepared for Antonio Salieri</p>
            <h2 id="menu-title">Your Menu</h2>
            <p>Domgasse 5 · 12 June 1782 · 20:15</p>
          </div>

          <ol className="course-list">
            {courses.map((course) => {
              const isOpen = openCourse === course.id;

              return (
                <li className="available-course" key={course.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${course.id}-details`}
                    onClick={() => setOpenCourse((current) => current === course.id ? null : course.id)}
                  >
                    <span>{course.number}</span>
                    <p>{course.name}</p>
                    <span className="course-arrow" aria-hidden="true">↓</span>
                  </button>
                  <div
                    id={`${course.id}-details`}
                    className={`course-accordion ${isOpen ? "open" : ""}`}
                  >
                    <div className="course-accordion-inner">
                      <p className="accordion-label">Ingredients</p>
                      <p className="accordion-ingredients">
                        {course.ingredients.map((ingredient) => (
                          <span key={ingredient}>{ingredient}<br /></span>
                        ))}
                      </p>
                      <p className="accordion-description">{course.description}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <button className="menu-next" type="button" onClick={() => moveTo("finale")}>
            Next <span aria-hidden="true">→</span>
          </button>
          <p className="menu-footnote">Six courses · One appetite</p>
        </section>
      ) : (
        <section className="finale-screen" aria-labelledby="finale-title">
          <h2 id="finale-title">
            <span>Bon</span>
            <span>Appétit</span>
          </h2>
          <p className="chef-signature">
            <span>Your sincere chef,</span>
            <strong>Mozart</strong>
          </p>
        </section>
      )}

      <div className={`page-wipe ${transition} ${wipeTone}`} aria-hidden="true" />
    </main>
  );
}
