const $ = (e) => document.querySelector(e),
  R = matchMedia("(prefers-reduced-motion:reduce)").matches,
  fine = matchMedia("(hover:hover) and (pointer:fine)").matches,
  H = document.documentElement,
  S = { name: "", accent: "#E15B0F", theme: "", cur: !0 };
try {
  Object.assign(S, JSON.parse(localStorage.getItem("io_s") || "{}"));
} catch (e) {}
const save = () => {
    try {
      localStorage.setItem("io_s", JSON.stringify(S));
    } catch (e) {}
  },
  lum = (e) => {
    const t = parseInt(e.slice(1), 16),
      s = (e) =>
        (e /= 255) <= 0.03928 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
    return (
      0.2126 * s(t >> 16) + 0.7152 * s((t >> 8) & 255) + 0.0722 * s(255 & t)
    );
  },
  pop = $("#pop"),
  pb = $("#profB"),
  tp = (e) => {
    (pop.classList.toggle("open", e),
      pb.setAttribute("aria-expanded", e),
      e || openTool(null));
  };
((pb.onclick = () => tp(!pop.classList.contains("open"))),
  ($("#edit").onclick = () => {
    (tp(!0), openTool("you", 1), setTimeout(() => $("#nameI").focus(), 250));
  }),
  addEventListener("keydown", (e) => {
    "Escape" === e.key && tp(!1);
  }),
  document.addEventListener("click", (e) => {
    e.target.closest("#pop,#profB,#edit") || tp(!1);
  }));
const nI = $("#nameI");
((nI.oninput = () => {
  ((S.name = nI.value.replace(/^\s+/, "")), save(), apply());
}),
  (nI.onblur = () => {
    ((S.name = S.name.trim()), save(), apply());
  }),
  (nI.onkeydown = (e) => {
    "Enter" === e.key && nI.blur();
  }));
const sw = $("#sw");
[
  ["#E15B0F", "Orange"],
  ["#2F6BFF", "Blue"],
  ["#1F9D55", "Green"],
  ["#8A4DFF", "Violet"],
  ["#E5368C", "Pink"],
  ["#F5C518", "Yellow"],
].forEach(([e, t]) => {
  const s = document.createElement("button");
  ((s.dataset.sw = e),
    (s.style.background = e),
    s.setAttribute("aria-label", t),
    (s.onclick = () => jackpot(e)),
    sw.appendChild(s));
});
const PAL = ["#E15B0F", "#2F6BFF", "#1F9D55", "#8A4DFF", "#E5368C", "#F5C518"];
let jpT = 0;
const setAcc = (e) => {
    (H.style.setProperty("--or", e),
      H.style.setProperty("--onor", lum(e) > 0.4 ? "#1C160E" : "#fff"),
      (window.__acc = e),
      document.dispatchEvent(new Event("px:accent")));
  },
  mark = (e) =>
    document
      .querySelectorAll("[data-sw]")
      .forEach((t) =>
        t.setAttribute(
          "aria-pressed",
          t.dataset.sw.toLowerCase() === e.toLowerCase(),
        ),
      );
function jackpot(e) {
  if ((clearTimeout(jpT), R || e.toLowerCase() === S.accent.toLowerCase()))
    return ((S.accent = e), save(), void apply());
  H.classList.add("jp");
  let t = 0,
    s = "";
  const a = () => {
    if (t < 10) {
      let n;
      do {
        n = PAL[Math.floor(Math.random() * PAL.length)];
      } while (n === s || n.toLowerCase() === e.toLowerCase());
      ((s = n),
        t++,
        setAcc(n),
        mark(n),
        (jpT = setTimeout(a, 40 + t * t * 1.6)));
    } else
      ((S.accent = e),
        save(),
        apply(),
        requestAnimationFrame(() =>
          requestAnimationFrame(() => H.classList.remove("jp")),
        ));
  };
  a();
}
const cp = document.createElement("input");
((cp.type = "color"),
  cp.setAttribute("aria-label", "Custom colour"),
  (cp.oninput = () => {
    ((S.accent = cp.value), save(), apply());
  }),
  document.querySelectorAll("[data-th]").forEach(
    (e) =>
      (e.onclick = () => {
        ((S.theme = e.dataset.th), save(), apply());
      }),
  ));
const cc = $("#curC");
function apply() {
  ((window.__acc = S.accent),
    document.dispatchEvent(new Event("px:accent")),
    H.style.setProperty("--or", S.accent),
    H.style.setProperty("--onor", lum(S.accent) > 0.4 ? "#1C160E" : "#fff"),
    S.theme ? (H.dataset.theme = S.theme) : H.removeAttribute("data-theme"));
  const e = S.name || "you";
  (($("#nm").textContent = e),
    ($("#meL").textContent = S.name || "You"),
    ($("#ini").textContent = e[0].toUpperCase()),
    document.activeElement !== $("#nameI") && ($("#nameI").value = S.name),
    ($("#nameR").hidden = !S.name),
    (cp.value = S.accent),
    (cc.checked = S.cur),
    H.classList.toggle("cc", fine && S.cur),
    H2(...hsv).toLowerCase() !== S.accent.toLowerCase() &&
      (hsv = toHSV(S.accent)),
    sv.style.setProperty("--h", hsv[0]),
    ($("#svh").style.left = 100 * hsv[1] + "%"),
    ($("#svh").style.top = 100 * (1 - hsv[2]) + "%"),
    ($("#hue").value = hsv[0]),
    ($("#hex").value = S.accent.toUpperCase()),
    ($("#thN").textContent = (TH.find((e) => e[0] === S.theme) || TH[0])[1]),
    document
      .querySelectorAll("#tg2 button")
      .forEach((e) => e.setAttribute("aria-pressed", e.dataset.id === S.theme)),
    (document.querySelector("meta[name=theme-color]").content =
      getComputedStyle(H).getPropertyValue("--canvas").trim() || S.accent),
    fav(),
    document
      .querySelectorAll("[data-sw]")
      .forEach((e) =>
        e.setAttribute(
          "aria-pressed",
          e.dataset.sw.toLowerCase() === S.accent.toLowerCase(),
        ),
      ),
    document
      .querySelectorAll("[data-th]")
      .forEach((e) =>
        e.setAttribute("aria-pressed", e.dataset.th === S.theme),
      ));
}
((cc.onchange = () => {
  ((S.cur = cc.checked), save(), apply());
}),
  fine || ($("#tCur").hidden = !0));
const TH = [
  ["studio", "Studio", "#E15B0F"],
  ["paper", "Paper", "#D9541E"],
  ["midnight", "Midnight", "#FF7A2F"],
  ["blueprint", "Blueprint", "#7DD3FC"],
  ["mono", "Grayscale", "#1F1F23"],
];
TH.some((e) => e[0] === S.theme) ||
  (S.theme = matchMedia("(prefers-color-scheme:dark)").matches
    ? "midnight"
    : "studio");
const cyc = (e) => {
    let t = TH.findIndex((e) => e[0] === S.theme);
    ((t = (t + e + TH.length) % TH.length),
      (S.theme = TH[t][0]),
      (S.accent = TH[t][2]),
      save(),
      apply());
  },
  PV = {
    studio: ["#E8E8E5", "#fff", "#1C160E"],
    paper: ["#F1E6D6", "#FBF4E9", "#2B1B0E"],
    midnight: ["#141414", "#1E1E1E", "#F2F0EA"],
    blueprint: ["#0E2A5C", "#12326E", "#EAF1FF"],
    mono: ["#EDEDEE", "#FAFAFA", "#111"],
  };
function openTool(e, t) {
  const s = [...document.querySelectorAll(".tabs button")],
    a = s.find((t) => t.dataset.t === e);
  (e && !t && "true" === a.getAttribute("aria-selected") && (e = null),
    s.forEach((t) => t.setAttribute("aria-selected", t.dataset.t === e)),
    document.querySelectorAll(".tp").forEach((t) => {
      const s = t.dataset.p === e;
      if ((t.classList.toggle("on", s), s)) {
        const e = Math.min(284, innerWidth - 24),
          s = (innerWidth - pop.offsetWidth) / 2,
          n = s + a.offsetLeft + a.offsetWidth / 2,
          o = Math.min(innerWidth - 12 - e / 2, Math.max(12 + e / 2, n));
        (t.style.setProperty("--ax", o - s + "px"),
          t.style.setProperty("--cx", n - (o - e / 2) + "px"));
      }
    }));
}
(TH.forEach(([e, t, s]) => {
  const a = document.createElement("button"),
    n = PV[e];
  ((a.dataset.id = e),
    a.setAttribute("aria-label", t + " theme"),
    (a.innerHTML =
      '<span class="pv" style="background:' +
      n[0] +
      '"><span style="background:' +
      n[1] +
      '"><i style="background:' +
      n[2] +
      '"></i><i style="background:' +
      n[2] +
      ';width:60%"></i><em style="background:' +
      s +
      '"></em></span></span><b>' +
      t +
      "</b>"),
    (a.onclick = () => {
      ((S.theme = e), (S.accent = s), save(), apply());
    }),
    $("#tg2").appendChild(a));
}),
  document
    .querySelectorAll(".tabs button")
    .forEach((e) => (e.onclick = () => openTool(e.dataset.t))));
const H2 = (e, t, s) => {
    const a = (a) => {
      const n = (a + e / 60) % 6;
      return s - s * t * Math.max(0, Math.min(n, 4 - n, 1));
    };
    return (
      "#" +
      [a(5), a(3), a(1)]
        .map((e) =>
          Math.round(255 * e)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")
    );
  },
  toHSV = (e) => {
    const t = parseInt(e.slice(1), 16),
      s = (t >> 16) / 255,
      a = ((t >> 8) & 255) / 255,
      n = (255 & t) / 255,
      o = Math.max(s, a, n),
      i = o - Math.min(s, a, n);
    let c = 0;
    return (
      i &&
        ((c =
          o === s
            ? ((a - n) / i) % 6
            : o === a
              ? (n - s) / i + 2
              : (s - a) / i + 4),
        (c *= 60),
        c < 0 && (c += 360)),
      [c, o ? i / o : 0, o]
    );
  };
let hsv = toHSV(S.accent);
const sv = $("#sv"),
  setC = (e, t, s) => {
    ((hsv = [e, t, s]), (S.accent = H2(e, t, s)), save(), apply());
  },
  pk = (e) => {
    const t = sv.getBoundingClientRect(),
      s = (e) => Math.min(1, Math.max(0, e));
    setC(
      hsv[0],
      s((e.clientX - t.left) / t.width),
      1 - s((e.clientY - t.top) / t.height),
    );
  };
function fav() {
  const e = document.createElement("canvas");
  e.width = e.height = 64;
  const t = e.getContext("2d");
  ((t.fillStyle = S.accent),
    t.beginPath(),
    t.roundRect(0, 0, 64, 64, 16),
    t.fill(),
    (t.fillStyle = lum(S.accent) > 0.4 ? "#1C160E" : "#fff"),
    (t.font = "700 30px Lexend, system-ui, sans-serif"),
    (t.textAlign = "center"),
    (t.textBaseline = "middle"),
    t.fillText("IO", 32, 35));
  const s = document.querySelector("link[rel=icon]");
  ((s.type = "image/png"), (s.href = e.toDataURL("image/png")));
}
((sv.onpointerdown = (e) => {
  (sv.setPointerCapture(e.pointerId), pk(e), (sv.onpointermove = pk));
}),
  (sv.onpointerup = () => (sv.onpointermove = null)),
  ($("#hue").oninput = (e) => setC(+e.target.value, hsv[1], hsv[2])),
  ($("#hex").onchange = (e) => {
    const t = e.target.value.trim();
    /^#?[0-9a-f]{6}$/i.test(t) &&
      ((S.accent = "#" === t[0] ? t : "#" + t), save(), apply());
  }),
  document.fonts && document.fonts.ready.then(fav),
  apply());
const me = $("#me");
if (fine) {
  addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") return;
    me.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    me.style.opacity = 1;
  }, { passive: true });
  document.addEventListener("mouseleave", () => me.style.opacity = 0);
  addEventListener("blur", () => me.style.opacity = 0);
}
const cur = $("#cur"),
  curT = $("#curT"),
  lift = () => {
    ((cur.style.transform = "translateY(-100%)"),
      setTimeout(() => {
        ((cur.style.transition = "none"),
          (cur.style.transform = ""),
          cur.offsetHeight,
          (cur.style.transition = ""));
      }, 1e3));
  };
function wipe(e, t) {
  R
    ? t()
    : ((curT.textContent = e),
      (cur.style.transition = "none"),
      (cur.style.transform = "translateY(100%)"),
      cur.offsetHeight,
      (cur.style.transition = ""),
      (cur.style.transform = "none"),
      setTimeout(() => {
        (t(), lift());
      }, 900));
}
if (H.classList.contains("pl")) {
  const e = $("#lx"),
    t = "Israel Olurotimi",
    s = $("#ld");
  (setTimeout(() => {
    let s = 0;
    const a = setInterval(() => {
      ((e.textContent = t.slice(0, ++s)), s >= t.length && clearInterval(a));
    }, 45);
  }, 800),
    setTimeout(() => s.classList.add("out"), 1850),
    setTimeout(() => s.classList.add("big"), 1950),
    setTimeout(() => H.classList.add("go"), 2500),
    setTimeout(() => H.classList.remove("pl"), 2700));
} else H.classList.add("go");
(document.querySelectorAll('a[href^="#"]').forEach((e) =>
  e.addEventListener("click", (t) => {
    const s = document.querySelector(e.getAttribute("href"));
    s &&
      (t.preventDefault(),
      wipe(
        "Opening " +
          ({
            hero: "home",
            about: "about me",
            work: "my work",
            contact: "let's talk",
            "pl-music": "mario's playground",
          }[s.id] || s.id),
        () => {
          ("DETAILS" === s.tagName && (s.open = !0),
            (H.style.scrollBehavior = "auto"),
            s.scrollIntoView(),
            (H.style.scrollBehavior = ""));
        },
      ));
  }),
),
  ($("#nameR").onclick = () => {
    ((S.name = ""),
      ($("#nameI").value = ""),
      save(),
      apply(),
      $("#nameI").focus());
  }),
  ($("#copy").onclick = async () => {
    const e = $("#tip");
    try {
      (await navigator.clipboard.writeText("israelolurotimi.com@gmail.com"),
        (e.textContent = "Email copied"));
    } catch (t) {
      e.textContent = "Copy failed";
    }
    (e.classList.add("on"), setTimeout(() => e.classList.remove("on"), 1800));
  }));
const MUSIC_LIST = "PLPS3vdyg1Av5nMUKppoWP3N-F6QJDvkso",
  mp = $("#mp"),
  mb = $("#musB");
let yp = null,
  ready = !1,
  want = !1;
function mkYT() {
  const e = {
    listType: "playlist",
    list: MUSIC_LIST,
    autoplay: 1,
    playsinline: 1,
    controls: 0,
    disablekb: 1,
    rel: 0,
    modestbranding: 1,
  };
  (0 === location.protocol.indexOf("http") && (e.origin = location.origin),
    (yp = new YT.Player("ytp", {
      width: "100%",
      height: "100%",
      playerVars: e,
      events: {
        onReady: () => {
          ((ready = !0), want && yp.playVideo());
        },
        onStateChange: (e) => {
          const t = 1 === e.data,
            s = $("#mplay");
          ((s.dataset.p = t ? 1 : 0),
            s.setAttribute("aria-label", t ? "Pause" : "Play"),
            mb.classList.toggle("live", t));
          try {
            $("#mtitle").textContent = yp.getVideoData().title || "Playlist";
          } catch (e) {}
        },
        onError: () => {
          $("#mtitle").textContent =
            "Could not play here. Use Open in YouTube Music.";
        },
      },
    })));
}
function loadYT() {
  if (window.YT && YT.Player) return mkYT();
  const e = document.createElement("script");
  ((e.src = "https://www.youtube.com/iframe_api"),
    document.head.appendChild(e),
    (window.onYouTubeIframeAPIReady = mkYT));
}
function music(e) {
  ((want = e),
    mp.classList.toggle("open", e),
    mb.setAttribute("aria-pressed", e),
    e
      ? (mp.classList.remove("mini"), yp ? ready && yp.playVideo() : loadYT())
      : (mb.classList.remove("live"), yp && ready && yp.pauseVideo()));
}
((mb.onclick = () => music(!mp.classList.contains("open"))),
  ($("#mcl").onclick = () => music(!1)),
  ($("#mmin").onclick = () => {
    const e = mp.classList.toggle("mini");
    $("#mmin").setAttribute("aria-label", e ? "Expand" : "Minimise");
  }),
  ($("#mplay").onclick = () => {
    ready && (1 === yp.getPlayerState() ? yp.pauseVideo() : yp.playVideo());
  }),
  ($("#mprev").onclick = () => ready && yp.previousVideo()),
  ($("#mnext").onclick = () => ready && yp.nextVideo()),
  ($("#moreB").onclick = () => {
    ($("#more").classList.add("open"),
      ($("#moreB").hidden = !0),
      $("#moreB").setAttribute("aria-expanded", "true"));
  }),
  ($("#lessB").onclick = () => {
    ($("#more").classList.remove("open"),
      ($("#moreB").hidden = !1),
      $("#moreB").setAttribute("aria-expanded", "false"),
      $("#moreB").focus());
  }));
const wd = [...document.querySelectorAll("#work details")];
if (
  (wd.forEach((e) =>
    e.addEventListener("toggle", () => {
      e.open &&
        wd.forEach((t) => {
          t !== e && (t.open = !1);
        });
    }),
  ),
  !R)
) {
  const e = [...document.querySelectorAll("#work details,.xi,.tools")];
  (e.forEach((e, t) => {
    (e.classList.add("rv"), e.style.setProperty("--d", t % 4));
  }),
    document
      .querySelectorAll(".tags,.xc")
      .forEach((e) =>
        [...e.children].forEach((e, t) => e.style.setProperty("--k", t)),
      ));
  const t = new IntersectionObserver(
    (e) =>
      e.forEach((e) => {
        e.isIntersecting &&
          (e.target.classList.add("in"), t.unobserve(e.target));
      }),
    { threshold: 0.1 },
  );
  e.forEach((e) => t.observe(e));
}
const rt = document.querySelector(".rt");
if (rt) {
  const e = (t) => {
    if (3 === t.nodeType) {
      const e = document.createDocumentFragment();
      (t.textContent.split(/(\s+)/).forEach((t) => {
        if (t)
          if (/^\s+$/.test(t)) e.append(t);
          else {
            const s = document.createElement("span");
            ((s.className = "w"), (s.textContent = t), e.append(s));
          }
      }),
        t.replaceWith(e));
    } else [...t.childNodes].forEach(e);
  };
  [...rt.childNodes].forEach(e);
  const t = [...rt.querySelectorAll(".w")],
    s = () => {
      const e = rt.getBoundingClientRect(),
        s = innerHeight,
        a = R
          ? 1
          : Math.min(1, Math.max(0, (0.9 * s - e.top) / (e.height + 0.35 * s)));
      t.forEach((e, s) => {
        const n = Math.min(1, Math.max(0, a * (t.length + 8) - s) / 8);
        e.style.color =
          "color-mix(in srgb,var(--ink) " +
          Math.round(100 * n) +
          "%,var(--fade))";
      });
    };
  let a = 0;
  const n = () => {
    a ||
      (a = requestAnimationFrame(() => {
        ((a = 0), s());
      }));
  };
  (addEventListener("scroll", n, { passive: !0 }),
    addEventListener("resize", n),
    s());
}
const hn = document.querySelector("h1.sel");
if (hn) {
  const e = [...hn.childNodes].find((e) => 3 === e.nodeType);
  if (e) {
    const t = e.textContent.trim();
    hn.setAttribute("aria-label", t);
    let s = 0;
    const a = document.createDocumentFragment();
    (t.split(" ").forEach((e, t) => {
      const n = document.createElement("span");
      ((n.className = "wd"),
        n.setAttribute("aria-hidden", "true"),
        [...e].forEach((e) => {
          const t = document.createElement("span");
          ((t.className = "ch"),
            t.style.setProperty("--k", s++),
            (t.textContent = e),
            n.append(t));
        }),
        a.append(n),
        t || a.append(" "));
    }),
      e.replaceWith(a));
  }
  const t = () => {
    (hn.classList.remove("hit"),
      hn.offsetWidth,
      hn.classList.add("hit"),
      clearTimeout(t.t),
      (t.t = setTimeout(() => hn.classList.remove("hit"), 1100)));
  };
  fine ? hn.addEventListener("mouseenter", t) : hn.addEventListener("click", t);
}
const links = [...document.querySelectorAll('.dock a[href^="#"]')],
  io = new IntersectionObserver(
    (e) =>
      e.forEach((e) => {
        e.isIntersecting &&
          links.forEach((t) =>
            t.classList.toggle(
              "on",
              t.getAttribute("href") === "#" + e.target.id,
            ),
          );
      }),
    { rootMargin: "-40% 0px -55% 0px" },
  );
document
  .querySelectorAll(
    "#hero,#about,#work,#contact,#pl-music,#pl-ig,#pl-journal,#pl-char,#pl-game,#pl-story,#pl-arch,#pl-reads,#work details",
  )
  .forEach((e) => io.observe(e));
const stage = $("#stage"),
  cv = $("#cv"),
  zmn = $("#zmn"),
  secs = [
    ...document.querySelectorAll(
      "#hero,#about,#work,#contact,#pl-music,#pl-ig,#pl-journal,#pl-char,#pl-game,#pl-story,#pl-arch,#pl-reads,#cs,#pl-igp,#pl-dl",
    ),
  ],
  mq = matchMedia("(min-width:1024px) and (hover:hover) and (pointer:fine)"),
  pos = new Map();
let Z = 1,
  PNX = 0;
const fit = () => {
    stage.style.height = H.classList.contains("cv")
      ? cv.offsetHeight * Z + "px"
      : "";
  },
  sync = () => {
    (($("#zv").textContent = Math.round(100 * Z) + "%"),
      ($("#zr").hidden = !(
        1 !== Z ||
        0 !== PNX ||
        (window.__lay && __lay.on) ||
        [...pos.values()].some((e) => e[0] || e[1])
      )));
  };
function setZ(e) {
  const t = Z;
  if (((Z = Math.min(2, Math.max(0.25, Math.round(100 * e) / 100))), Z === t))
    return;
  const s = (scrollY + innerHeight / 2) / t;
  (cv.style.setProperty("--z", Z),
    fit(),
    scrollTo({ top: s * Z - innerHeight / 2, behavior: "instant" }),
    sync());
}
addEventListener(
  "keydown",
  (e) => {
    if (
      !H.classList.contains("cv") ||
      !(e.ctrlKey || e.metaKey) ||
      e.altKey ||
      e.target.closest?.(
        "input,textarea,select,[contenteditable]:not([contenteditable=false]),[role=textbox]",
      )
    )
      return;
    const k = e.key;
    if (!["+", "=", "-", "_", "0"].includes(k)) return;
    e.preventDefault();
    setZ(k === "0" ? 1 : Z + (k === "+" || k === "=" ? 0.1 : -0.1));
  },
  true,
);
const mvT = (e, t, s) => {
  (pos.set(e, [t, s]),
    (e.style.transform = t || s ? "translate(" + t + "px," + s + "px)" : ""));
};
function reset() {
  ((PNX = 0),
    cv.style.removeProperty("--px"),
    window.__lay && __lay.clear(),
    secs.forEach((e) => {
      (e.classList.add("rs"),
        mvT(e, 0, 0),
        setTimeout(() => e.classList.remove("rs"), 800));
    }),
    setZ(1),
    sync());
}
(secs.forEach((e) => {
  const t = e.querySelector(".lab");
  t &&
    t.addEventListener("pointerdown", (s) => {
      if (!H.classList.contains("cv") || s.button) return;
      (s.preventDefault(), t.setPointerCapture(s.pointerId));
      const a = pos.get(e) || [0, 0],
        n = s.clientX,
        o = s.clientY,
        i = cv.offsetWidth,
        c = (i / 2) * (1 - 1 / Z),
        l = (i / 2) * (1 + 1 / Z),
        r = e.offsetLeft,
        d = e.offsetTop,
        p = e.offsetWidth,
        h = e.offsetHeight,
        u = cv.offsetHeight;
      (e.classList.remove("rs"),
        secs.forEach((e) => e.classList.remove("up")),
        e.classList.add("dg", "up"),
        H.classList.add("drag"));
      const m = (t) => {
          let s = a[0] + (t.clientX - n) / Z,
            i = a[1] + (t.clientY - o) / Z;
          ((s = Math.max(c - r, Math.min(l - r - p, s))),
            (i = Math.max(-d, Math.min(u - d - h, i))),
            mvT(e, s, i),
            sync());
        },
        f = () => {
          (t.removeEventListener("pointermove", m),
            t.removeEventListener("pointerup", f),
            t.removeEventListener("pointercancel", f),
            t.removeEventListener("lostpointercapture", f),
            removeEventListener("blur", f),
            e.classList.remove("dg"),
            H.classList.remove("drag"));
        };
      (t.addEventListener("pointermove", m),
        t.addEventListener("pointerup", f),
        t.addEventListener("pointercancel", f),
        t.addEventListener("lostpointercapture", f),
        addEventListener("blur", f, { once: true }));
    });
}),
  ($("#zr").onclick = reset),
  ($("#zi").onclick = () => setZ(Z + 0.1)),
  ($("#zo").onclick = () => setZ(Z - 0.1)),
  ($("#zv").onclick = () => (zmn.hidden = !zmn.hidden)),
  (zmn.onclick = (e) => {
    const t = e.target.closest("button");
    t && ((zmn.hidden = !0), t.dataset.z ? setZ(+t.dataset.z) : reset());
  }),
  document.addEventListener("click", (e) => {
    e.target.closest("#zm") || (zmn.hidden = !0);
  }),
  addEventListener(
    "wheel",
    (e) => {
      if (!H.classList.contains("cv") || !(e.ctrlKey || e.metaKey) ||
          e.target.closest("input,textarea,select,[contenteditable]") ||
          document.querySelector(".cszv.show,.axs:not([hidden])")) return;
      e.preventDefault();
      const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
      if (delta) setZ(Z * Math.exp(-Math.max(-100, Math.min(100, delta)) * .002));
    },
    { passive: !1 },
  ));
const onMq = () => {
  (H.classList.toggle("cv", mq.matches),
    mq.matches ||
      (window.__lay && __lay.clear(),
      secs.forEach((e) => mvT(e, 0, 0)),
      (Z = 1),
      (PNX = 0),
      cv.style.removeProperty("--z"),
      cv.style.removeProperty("--px")),
    fit(),
    sync());
};
(mq.addEventListener("change", onMq),
  new ResizeObserver(fit).observe(cv),
  onMq());
{
  let e = !1,
    t = null;
  const s = () => H.classList.contains("cv"),
    a = (e) =>
      e &&
      e.closest &&
      e.closest(
        'input,textarea,select,button,summary,a,[contenteditable="true"],[role=button]',
      );
  (addEventListener(
    "keydown",
    (t) => {
      "Space" === t.code &&
        s() &&
        ((!e && a(t.target)) ||
          (t.preventDefault(), e || ((e = !0), H.classList.add("hand"))));
    },
    !0,
  ),
    addEventListener("keyup", (s) => {
      "Space" === s.code && ((e = !1), t || H.classList.remove("hand"));
    }),
    addEventListener("blur", () => {
      ((e = !1), (t = null), H.classList.remove("hand", "pan"));
    }),
    addEventListener(
      "mousedown",
      (t) => {
        s() && (1 === t.button || (e && 0 === t.button)) && t.preventDefault();
      },
      !0,
    ),
    addEventListener(
      "auxclick",
      (e) => {
        s() && 1 === e.button && e.preventDefault();
      },
      !0,
    ),
    addEventListener(
      "pointerdown",
      (a) => {
        if (!s() || !(1 === a.button || (0 === a.button && e))) return;
        (a.preventDefault(), a.stopPropagation());
        const n = a.clientX,
          o = a.clientY,
          i = scrollY,
          c = PNX,
          l = cv.offsetWidth;
        ((t = 1), H.classList.add("pan"));
        const r = (e) => {
            (scrollTo({ top: i - (e.clientY - o), behavior: "instant" }),
              (PNX = Math.max(
                0.75 * -l,
                Math.min(0.75 * l, c + e.clientX - n),
              )),
              cv.style.setProperty("--px", PNX + "px"),
              sync());
          },
          d = () => {
            (removeEventListener("pointermove", r),
              removeEventListener("pointerup", d),
              removeEventListener("pointercancel", d),
              removeEventListener("blur", d),
              (t = null),
              H.classList.remove("pan"),
              e || H.classList.remove("hand"));
          };
        (addEventListener("pointermove", r),
          addEventListener("pointerup", d),
          addEventListener("pointercancel", d),
          addEventListener("blur", d, { once: true }));
      },
      !0,
    ));
}
const CS = [
    {
      id: "soma",
      t: "SOMA",
      l: "An offline-first school operating system for Nigerian secondary schools.",
      m: [
        "Product Design & Strategy Lead",
        "2026",
        "Product, UX strategy, architecture, brand",
        "In beta",
      ],
      u: "https://checksoma.com",
      ul: "Visit checksoma.com",
      c: "Attendance, results, fees and announcements in one place, working without reliable internet. I lead product design, UX strategy and product architecture, alongside the brand identity and go-to-market strategy.",
    },
    {
      id: "lykluk",
      t: "Lykluk",
      l: "Social commerce and video platform.",
      m: [
        "UI/UX designer",
        "2025",
        "Mobile app, creator and ad tools, admin, design system",
        "Live on Google Play, 1k+ downloads",
      ],
      u: "https://lykluk.com",
      ul: "Visit lykluk.com",
      c: "",
    },
    {
      id: "revolve",
      t: "Revolve",
      l: "Flagship brand identity for a gold-backed digital asset platform.",
      m: [
        "Creative director",
        "2026",
        "Brand identity system (RXUT)",
        "Delivered",
      ],
      u: "https://revolveinc.org",
      ul: "Visit revolveinc.org",
      c: "I directed the flagship brand identity system for Revolve (RXUT), a gold-backed digital asset platform.",
    },
    {
      id: "yadsale",
      t: "Yadsale",
      l: "Brand and creative direction.",
      m: [
        "Brand and creative director",
        "2026",
        "Brand identity, social campaigns, motion",
        "Live",
      ],
      u: "https://yadsale.com",
      ul: "Visit yadsale.com",
      c: "",
    },
  ],
  phi = (e, t) =>
    '<figure class="phi" style="--p:' +
    { "16:9": 56.25, "4:3": 75, "1:1": 100 }[e] +
    '%"><span>Image · ' +
    e +
    "<small>" +
    t +
    "</small></span></figure>",
  dt = (e, t, s) =>
    '<details name="csd" class="csd"' +
    (t ? " open" : "") +
    "><summary><h3>" +
    e +
    '</h3></summary><div class="csb">' +
    s +
    "</div></details>";
window._MK = {
  "t-head": "assets/embedded/t-head.webp",
  "t-abc": "assets/embedded/t-abc.webp",
  wordmark: "assets/embedded/wordmark.webp",
};
const mk = (e, t) => {
  window._csA = e;
  const s = (t, s, a, n, o) =>
      "<figure" +
      (n ? ' class="' + n + '"' : "") +
      (o ? ' style="--r:' + o + '"' : "") +
      '><div class="sxi"><img src="' +
      e(t) +
      '" alt="' +
      s +
      '" loading="lazy" decoding="async"></div><figcaption>' +
      a +
      "</figcaption></figure>",
    a = (e, t) => '<p class="nt" style="--r:' + t + 'deg">' + e + "</p>",
    n = (e, t) => '<section class="sxs ' + e + '">' + t + "</section>",
    o = ["Role", "Year", "Scope", "Status"],
    i = (e, t) =>
      '<header class="sxh"><h2>' +
      e.t +
      '</h2><p class="csl">' +
      e.l +
      '</p><div class="csm">' +
      e.m
        .map((e, t) => "<div><span>" + o[t] + "</span>" + e + "</div>")
        .join("") +
      "</div><p>" +
      t +
      "</p></header>",
    c = (e, t, s) =>
      '<a class="btn' +
      (s ? " p" : "") +
      '" href="' +
      e +
      '" target="_blank" rel="noopener">' +
      t +
      "</a>",
    l = (e, t, s, a) =>
      '<button class="sw" data-hex="' +
      e +
      '" style="--c:' +
      e +
      ";--t:" +
      (s || "#fff") +
      ";" +
      (a || "") +
      '"><b>' +
      t +
      "</b><span>" +
      e +
      "</span></button>",
    r = (e, t, s, a, n) =>
      '<div class="rw"><i>' +
      e +
      '</i><span style="font-size:' +
      t +
      (a ? ";font-family:" + a : "") +
      (n ? ";font-weight:" + n : "") +
      '">' +
      s +
      "</span></div>",
    d = {
      a: ".03,-1.3 -1.3,-1.3 -1.3,-.265 .03,.52",
      b: ".03,.52 -1.3,-.265 -1.3,1.3 .03,1.3",
      c: ".03,-1.3 1.3,-1.3 1.3,-.862 .03,-.1",
      d: ".03,-.1 1.3,-.862 1.3,1.3 .03,1.3",
    };
  return {
    soma: (t) =>
      i(t, c(t.u, t.ul, 1)) +
      '<div class="sx">' +
      n(
        "k",
        '<div class="nm rv" data-st="logo"><div class="icw"><svg class="ico" viewBox="-1.16 -1.16 2.32 2.32" role="img" aria-label="The SOMA icon: a tree of knowledge cut like a pie chart"><defs>' +
          Object.keys(d)
            .map(
              (e) =>
                '<clipPath id="ck' +
                e +
                '"><polygon points="' +
                d[e] +
                '"/></clipPath>',
            )
            .join("") +
          '<clipPath id="ckz"><circle r="1"/></clipPath></defs>' +
          Object.keys(d)
            .map(
              (e) =>
                '<g class="pc ' +
                e +
                '" clip-path="url(#ck' +
                e +
                ')"><circle r="1"/></g>',
            )
            .join("") +
          '<g class="ln" clip-path="url(#ckz)" fill="none" stroke-linecap="round"><path pathLength="1" d="M.03-1.2V1.2"/><path pathLength="1" d="M.03-.1L1.2-.802"/><path pathLength="1" d="M.03.52L-1.2-.206"/></g></svg><span class="bl r">Academic growth</span><span class="bl l">Seamless administrative operations</span><span class="bl b">A robust framework</span></div><div class="story"><p class="eb">The creative process</p><div class="cs-process"><button data-go="logo" class="on"><b>01</b><span><strong>The name</strong>In Swahili, <em>soma</em> means “to learn”. For the product, it reinforces the promise of accessible, easy learning experiences.</span></button><button data-go="tree"><b>02</b><span><strong>The tree</strong>The space inside the mark acts as a tree: the Tree of Knowledge. The branches represent academic growth, seamless administrative operations and a robust framework that keeps everyone happy.</span></button><button data-go="pie"><b>03</b><span><strong>The pie chart</strong>The icon also pulls apart into a pie chart. It reflects a school’s need for structured data, and how SOMA provides it all in one solution.</span></button></div><p class="lk"><a class="go" href="https://checksoma.com" target="_blank" rel="noopener">Visit checksoma.com</a></p></div></div>',
      ) +
      n(
        "bl",
        a(
          "The numbers a principal asks about most sit on one screen, whether for mobile or desktop.",
          -1.2,
        ) +
          '<div class="ov">' +
          s(
            "dash",
            "The SOMA dashboard on desktop with enrolment and tuition figures",
            "Home dashboard, desktop and mobile",
          ) +
          s("mobile", "The SOMA dashboard on a phone", "", "pho") +
          "</div>",
      ) +
      n(
        "l",
        a(
          "Offline-first, so school keeps moving even when the internet doesn’t.",
          1.1,
        ) +
          s(
            "hero",
            "The SOMA website: Your school’s work, all in one place",
            "Landing page",
            "bw",
          ),
      ) +
      n(
        "k",
        s(
          "students",
          "The SOMA student cards with avatars and class tags",
          "Students",
        ),
      ) +
      n(
        "",
        '<div class="ov2">' +
          s(
            "login",
            "SOMA log in screen beside a dark product carousel",
            "Log in",
          ) +
          s("setup", "SOMA setup profile form", "Set up profile") +
          "</div>",
      ) +
      n(
        "k",
        '<div class="jg">' +
          s("icon", "The SOMA icon", "The icon", "", 1.07) +
          s("id", "SOMA staff ID cards on lanyards", "ID cards", "", 0.8) +
          '</div><div class="jg">' +
          s("cup", "A SOMA coffee cup", "Cup", "", 1.34) +
          s("tee", "A black SOMA t-shirt", "Tee", "", 1.22) +
          "</div>",
      ) +
      n(
        "",
        `<div class="wmw"><img class="wmz big" alt="The SOMA wordmark" src="${e("wordmark")}"><div class="wpls">${["a", "b", "c"].map(style => `<span class="wpl ${style}"><img class="wmz" alt="SOMA" src="${e("wordmark")}"></span>`).join("")}</div></div>`,
      ) +
      n(
        "l",
        '<div class="pal rv">' +
          l("#0D0D0D", "Obsidian", "#fff", "--w:6;--h:190px;--hm:110px") +
          l("#EDEDED", "Off-white", "#0a0a0a", "--w:3;--h:190px;--hm:84px") +
          l("#1D4ED8", "Electric blue", "#fff", "--w:1.5;--h:190px;--hm:76px") +
          '</div><div class="ty rv" style="--ff:\'Geist\',\'Lexend\',system-ui,sans-serif"><div><p class="aa">Aa</p><small>Geist, by Vercel and Basement Studio</small></div><div>' +
          r("Display", "min(38px,8vw)", "Your school’s work,", 0, 700) +
          r("Title", "min(24px,6vw)", "Know every student, clearly.", 0, 600) +
          r(
            "Body",
            "16px",
            "Attendance, results, fees and announcements in one place.",
          ) +
          r("Data", "12px", "Total Enrolled Students · 2,500", 0, 500) +
          "</div></div>",
      ) +
      "</div>",
    revolve: (t) => {
      const a =
          '<div class="cn" style="--img:url(' +
          e("c-gold") +
          ')"><div class="cw"><i class="coin-back"></i>' +
          [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
            .map((e) => '<i class="coin-edge" style="--z:' + e + 'px"></i>')
            .join("") +
          '<i class="coin-front"></i></div></div>',
        o = (t, s, a) =>
          '<span class="mk" role="img" aria-label="' +
          a +
          '" style="--m:url(' +
          e(t) +
          ");--c:" +
          s +
          '"></span>',
        c = (e, t, a, n) => s(e, t, a, "", n),
        d = (t) => '<img src="' + e("tile" + t) + '" alt="" loading="lazy">';
      return (
        i(
          t,
          '<a class="btn p" href="' +
            t.u +
            '" target="_blank" rel="noopener">' +
            t.ul +
            "</a>",
        ) +
        '<div class="sx">' +
        n(
          "cs",
          '<div class="rv">' +
            a +
            '</div><div class="cc rv">' +
            [
              ["c-gold", "Gold"],
              ["c-blue", "Revolve"],
              ["c-aurora", "Aurora"],
              ["c-night", "Night"],
              ["c-silver", "Silver"],
            ]
              .map(
                (t, s) =>
                  '<button data-k="' +
                  t[0] +
                  '"' +
                  (s ? "" : ' class="on"') +
                  '><img src="' +
                  e(t[0]) +
                  '" alt="" width="22" height="22">' +
                  t[1] +
                  "</button>",
              )
              .join("") +
            '</div><p class="hint rv">Drag the coin to spin it</p>',
        ) +
        n(
          "l",
          '<div class="fw"><div class="rv">' +
            o(
              "t-head",
              "#0D1B37",
              "Where real-world assets meet tokenization",
            ) +
            '<p class="sub">Revolve turns real-world assets, like gold, into tokens you can verify, hold and redeem.</p></div><div class="fl"><img class="f1" src="' +
            e("o-pie") +
            '" alt="" loading="lazy"><img class="f2" src="' +
            e("o-vault") +
            '" alt="" loading="lazy"><img class="f4" src="' +
            e("o-arrow") +
            '" alt="" loading="lazy"></div></div>',
        ) +
        n(
          "k",
          '<div class="jg st">' +
            c("mk-apps", "Revolve app screens on phones", "", 1.778) +
            '</div><div class="jg st">' +
            c(
              "mk-bill",
              "Revolve billboard: Own a verified piece of the global economy",
              "",
              1.778,
            ) +
            c(
              "mk-fence",
              "Revolve billboard on a fence: Reach your financial goals",
              "",
              1.778,
            ) +
            '</div><div class="jg st">' +
            c("mk-tote", "Revolve tote bag", "", 1.778) +
            c("mk-tee", "Revolve t-shirt", "", 1.778) +
            '</div><div class="jg st">' +
            c("mk-lan", "Revolve staff ID on a lanyard", "", 1.778) +
            c("mk-cards", "Revolve business cards", "", 1.778) +
            "</div>",
        ) +
        n(
          "l",
          '<p class="gl rv">Banner</p><div class="jg">' +
            c(
              "ad-wide",
              "Revolve banner: Own a verified piece of the global economy",
              "",
              2.07,
            ) +
            '</div><div class="jg">' +
            c(
              "ad-wide2",
              "Revolve banner: Reach your financial goals",
              "",
              2.02,
            ) +
            '</div><p class="gl rv">Social</p><div class="jg">' +
            c("ad-sq1", "Revolve social: Reach your financial goals", "", 1) +
            c("ad-sq2", "Revolve social: Your assets, your vault", "", 1) +
            c("ad-sq3", "Revolve social: Growth, backed by real value", "", 1) +
            "</div>",
        ) +
        n(
          "",
          '<p class="gl rv">Wordmark</p><div class="mq"><div>' +
            [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map(d).join("") +
            '</div></div><div class="mq r"><div>' +
            [7, 8, 9, 10, 11, 7, 8, 9, 10, 11].map(d).join("") +
            "</div></div>",
        ) +
        n(
          "l",
          '<div class="lbn rv">' +
            l("#0D1B37", "Navy", "#fff") +
            l("#988FF7", "Periwinkle", "#0D1B37") +
            l("#E0B8F6", "Lavender", "#0D1B37") +
            l("#E5FB72", "Lime", "#0D1B37") +
            '</div><div class="chips rv">' +
            l("#617EE9", "Blue") +
            l("#FF9125", "Gold", "#0D1B37") +
            l("#F8F9F5", "Off-white", "#0D1B37") +
            '</div><div class="ty d rv" style="--ff:\'Helvetica Neue\',Helvetica,Arial,sans-serif"><div>' +
            o("t-abc", "#E5FB72", "ABC 123") +
            "<small>Restore W00 Black for display, Helvetica Neue for text</small></div><div>" +
            o("t-head", "#fff", "Where real-world assets meet tokenization") +
            r(
              "Body",
              "16px",
              "Every share is backed, verifiable, and yours to own.",
            ) +
            r("Caption", "12px", "www.checkrevolve.com") +
            "</div></div>",
        ) +
        "</div>"
      );
    },
    yadsale: (a) => {
      const o = (e, t, a, n) => s(e, t, a, "", n),
        d = (s, a, n, o) =>
          '<figure style="--r:' +
          o +
          '"><div class="sxi"><video src="' +
          t(s) +
          '" poster="' +
          e("v-" + s) +
          '" muted loop playsinline preload="metadata" aria-label="' +
          a +
          '"></video></div><figcaption>' +
          n +
          "</figcaption></figure>";
      return (
        i(a, c(a.u, a.ul, 1)).replace(
          "<h2>" + a.t + "</h2>",
          '<h2 class="gt">' + a.t + "</h2>",
        ) +
        '<div class="sx">' +
        n(
          "",
          '<div class="ab">' +
            o(
              "about",
              "Yadsale is an informal marketplace where anybody can buy and sell items safely, securely and with ease",
              "The idea",
              0.8,
            ) +
            "</div>",
        ) +
        n(
          "k",
          '<div class="dg" data-rp tabindex="0" role="group" aria-label="The Yadsale mark. Tap to replay."><p class="dt1">The soft, rounded curves of the lowercase <b>y</b> move away from corporate rigidity. They carry the informal, friendly feel of a neighbourhood yard sale, not a sterile e-commerce platform.</p><svg class="dgs" viewBox="-30 -52 247 308" role="img" aria-label="The yadsale y and its smile"><path class="y1" fill-rule="evenodd" fill="#FFF9E3" d="M45.7262 3.13189C42.5434 4.16763 38.3537 6.04893 36.4172 7.31391C33.1747 9.43123 32.9555 10.1622 33.6647 16.5478C34.0869 20.363 35.4185 26.7068 36.6215 30.6462L37.1477 32.3674C38.1205 35.5496 41.1667 37.6344 44.4852 37.3892V37.3892V37.3892C47.5923 37.1594 50.2756 39.5411 50.4163 42.6535L50.8603 52.4787C51.6127 69.1595 53.0067 73.568 60.3263 82.4162C70.9912 95.3115 97.2917 98.7465 110.552 88.9772C113.983 86.45 114.585 86.3528 115.303 88.218C115.755 89.3925 115.835 93.3683 115.479 97.0527C114.41 108.143 107.024 113.681 93.4634 113.561C83.6442 113.474 75.5923 110.703 65.8557 104.059V104.059C61.6714 101.203 56.0199 101.883 52.6328 105.65L51.3015 107.131C47.3162 111.562 43.703 116.281 43.274 117.615C42.1617 121.066 45.5882 125.613 52.9687 130.486C63.7677 137.613 73.009 140.356 88.7269 141.099C117.799 142.473 136.678 133.391 146.6 113.257L148.28 109.848C149.609 107.15 150.313 104.186 150.339 101.179L150.715 56.9385C151.216 -1.98336 152.769 2.58033 132.214 2.58033C120.757 2.58033 118.358 2.97681 115.298 5.37598V5.37598C113.047 7.13991 111.732 9.84076 111.732 12.7005L111.729 29.3137C111.728 46.7457 111.313 51.281 109.361 55.161C106.449 60.956 101.408 63.0112 95.795 60.6957C90.3995 58.4678 88.7284 54.2022 88.7189 42.6378C88.7025 21.6415 84.2125 9.25994 74.8615 4.42386C69.0263 1.40434 53.1947 0.703067 45.7262 3.13189Z"/><g class="sg"><path fill="#009834" d="M88.9452 174.847C68.6608 175.144 52.2986 167.472 42.561 160.677C37.3031 157.009 31.1826 151.709 25.1131 154.177C23.5511 154.812 22.5008 155.849 21.828 157.078C19.2524 161.788 23.1181 167.099 27.4834 170.594C50.8443 189.297 84.8208 191.962 100.047 190.751C129.519 188.944 151.129 175.499 160.376 167.219C162.035 165.733 163.582 164.014 163.913 161.934C164.276 159.641 163.431 157.779 162.774 156.955C157.445 150.593 151.302 153.31 148.896 155.464C137.239 164.907 122.806 174.35 88.9452 174.847Z"/></g><g class="ld"><circle cx="10.4" cy="-40" r="4.5"/><path pathLength="1" d="M10.4 -35.5L36.4 7.3"/><circle cx="181.9" cy="246" r="4.5"/><path pathLength="1" d="M181.9 241.5L163.9 161.9"/></g></svg><p class="dt2">The smile acts as a supportive <b>cradle</b>, reinforcing a safe and transparent place to trade. It turns the letterform into a friendly face.</p></div><p class="hint">Tap to replay</p>',
        ) +
        n(
          "l",
          '<div class="wmw2" data-rp tabindex="0" role="group" aria-label="The Yadsale wordmark. Tap to replay."><p class="eb">The wordmark</p><svg viewBox="0 0 483 140" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_56_69)"><path class="wa" fill-rule="evenodd" clip-rule="evenodd" d="M389.682 1.86784C379.582 3.82682 380.344 0.747963 380.344 39.5982C380.344 75.4214 380.467 76.6384 384.576 81.5047C388.222 85.8232 392.456 87.4383 400.237 87.4803C405.587 87.5095 407.856 87.1534 410.33 85.8992C415.167 83.4467 415.42 82.5428 413.305 75.2571C411.077 67.5831 409.846 65.9801 406.669 66.6137L404.352 67.0749L404.121 35.5063C403.904 5.77771 403.801 3.83815 402.344 2.2352C400.537 0.246281 398.369 0.183166 389.682 1.86784ZM257.276 25.1045C251.239 26.7269 246.248 30.1108 243.831 34.2197C239.826 41.0312 240.419 48.8421 245.367 54.4593C248.408 57.9103 252.12 59.8798 262.612 63.6068C269.212 65.951 270.731 66.7925 270.731 68.1034C270.731 69.4927 270.113 69.7451 266.265 69.9288C262.509 70.1068 260.728 69.6391 255.049 66.9835C251.068 65.1216 247.625 64.0017 246.656 64.2542C244.217 64.8894 238.659 72.2859 238.659 74.8971C238.659 82.949 261.888 90.3909 275.859 86.8144C286.918 83.9823 292.349 78.5359 292.914 69.7104C293.644 58.2688 288.837 52.7843 273.473 47.5345C263.869 44.2517 263.83 44.2307 263.83 42.4287C263.83 40.9382 264.255 40.8289 268.927 41.1259C272.066 41.325 275.35 42.1382 277.478 43.2427C282.154 45.6718 284.974 45.5504 287.506 42.8114C292.439 37.475 293.567 33.4971 290.827 31.0955C284.274 25.3554 267.496 22.359 257.276 25.1045ZM322.696 24.759C318.138 25.8732 312.084 29.508 308.708 33.1581C294.121 48.9295 298.341 75.6156 316.852 84.6564C326.158 89.2006 335.999 88.788 344.032 83.5155L348.104 80.8428L348.964 82.7233C350.647 86.4042 361.89 87.3768 365.467 84.1515C366.845 82.9086 366.946 80.9051 366.935 55.228C366.928 40.0546 366.654 27.2391 366.326 26.7495C365.164 25.0155 362.131 23.9984 358.122 23.9984C352.657 23.9984 349.926 25.1644 348.871 27.9495L347.994 30.2662L344.128 27.9948C342.002 26.7447 338.867 25.3367 337.162 24.865C333.698 23.9061 326.406 23.8527 322.696 24.759ZM441.666 25.2405C432.528 27.8006 425.994 33.2649 421.863 41.7999C419.485 46.7148 419.318 47.6437 419.318 55.9603C419.318 64.4759 419.438 65.0997 422.09 70.3674C427.255 80.6276 436.96 86.7052 449.652 87.6292C462.836 88.5881 479.808 82.0897 479.808 76.0825C479.808 73.6477 472.956 66.0748 470.753 66.0748C469.914 66.0748 467.286 67.1672 464.912 68.5023C455.795 73.6299 444.01 70.6085 442.025 62.6358L441.47 60.4107H461.352C478.074 60.4107 481.394 60.2173 482.249 59.1912C482.949 58.3505 483.149 55.9918 482.893 51.5948C482.249 40.5142 476.312 31.734 466.309 27.0692C459.868 24.0647 448.795 23.2434 441.666 25.2405ZM456.997 42.4068C458.309 43.6311 459.618 45.4517 459.906 46.4526C460.428 48.266 460.393 48.2732 451.038 48.2732C440.289 48.2732 439.603 47.7206 444.407 42.9328C446.744 40.604 447.739 40.1816 450.89 40.1816C453.83 40.1816 455.113 40.6485 456.997 42.4068ZM339.098 45.8134C344.551 49.1261 346.056 57.1497 342.289 62.8236C338.462 68.5864 330.963 69.1642 326.452 64.0438C321.815 58.7818 322.309 51.3642 327.606 46.7302C331.026 43.7379 335.143 43.4094 339.098 45.8134Z" fill="#009834"/><path class="wb" fill-rule="evenodd" clip-rule="evenodd" d="M217.955 0.119098C217.508 0.284976 214.434 0.853008 211.124 1.38139C201.838 2.86296 201.31 3.66485 201.31 16.2748C201.31 21.858 201.156 26.4257 200.969 26.4257C200.782 26.4257 198.316 25.8351 195.489 25.1125C191.989 24.2184 188.617 23.9432 184.922 24.2515C163.332 26.0519 150.855 51.6675 161.696 71.9387C170.01 87.4827 190.158 92.6483 203.344 82.6164L207.109 79.7535L210.257 82.9861C212.248 85.0317 214.687 86.5634 216.897 87.1574C221.292 88.3371 228.038 87.5919 232.224 85.4638C234.969 84.0688 235.403 83.4805 235.352 81.2303C235.32 79.7924 234.497 76.2499 233.525 73.3571C231.792 68.1987 231.695 68.0895 228.51 67.693L225.262 67.2884L224.856 34.7593C224.606 14.6937 224.139 1.92677 223.638 1.43884C222.687 0.510732 219.125 -0.315422 217.955 0.119098ZM7.43587 25.1384C5.52617 25.7598 3.01238 26.8886 1.85048 27.6476C-0.0949507 28.918 -0.226486 29.3565 0.198975 33.1879C0.452303 35.477 1.25126 39.2833 1.97308 41.6469L3.28681 45.9443L6.69131 45.6927L10.0958 45.441L10.5164 54.7464C10.9678 64.7549 11.8042 67.4001 16.196 72.709C22.5949 80.4462 38.3752 82.5071 46.3315 76.6456C48.3897 75.1292 48.7511 75.0709 49.1822 76.19C49.4534 76.8948 49.5013 79.2802 49.2878 81.4908C48.6463 88.1454 44.2147 91.4678 36.0782 91.3958C30.1867 91.344 25.3556 89.6811 19.5136 85.6944L15.1291 82.7021L10.7811 87.5377C8.38991 90.1966 6.22201 93.0278 5.96462 93.8281C5.2972 95.8987 7.35305 98.6272 11.7814 101.551C18.2608 105.827 23.8056 107.473 33.2363 107.919C50.6794 108.743 62.0069 103.294 67.9601 91.2137L70.18 86.7083L70.4293 57.4223C70.7297 22.0692 71.6618 24.8074 59.3283 24.8074C52.4544 24.8074 51.0148 25.0453 49.179 26.4848L47.0395 28.1614L47.0378 40.8474C47.037 51.3067 46.7878 54.0279 45.6169 56.3558C43.8696 59.8328 40.8451 61.066 37.4772 59.6766C34.2399 58.3399 33.2372 55.7805 33.2315 48.842C33.2217 36.2441 30.5277 28.8152 24.9171 25.9136C21.416 24.1018 11.917 23.6811 7.43587 25.1384ZM102.252 25.0591C87.671 29.2384 78.3718 45.1781 81.0577 61.3864C83.4521 75.834 93.9847 86.192 107.739 87.6243C113.994 88.2764 119.615 86.9227 124.806 83.5153L128.878 80.8427L129.72 82.6835C130.857 85.1693 135.594 86.6185 140.637 86.0237C148.078 85.145 147.721 86.705 147.721 55.0846V27.3522L145.582 25.6757C144.028 24.4579 142.263 23.9983 139.139 23.9983C133.46 23.9983 130.712 25.1327 129.659 27.9138L128.795 30.1948L123.297 27.383C118.809 25.0882 116.706 24.5202 111.852 24.292C108.51 24.1342 104.305 24.47 102.252 25.0591ZM119.961 45.8667C126.926 50.0986 126.501 62.3404 119.253 66.2146C113.866 69.0936 107.901 67.1411 105.415 61.6858C103.559 57.6141 103.498 54.9107 105.169 50.7491C107.572 44.7654 114.425 42.503 119.961 45.8667ZM196.514 45.4807C200.055 47.3054 202.115 51.1618 202.118 55.9747C202.126 66.4121 190.93 71.5001 184.361 64.0437C181.419 60.7059 180.461 56.4812 181.73 52.4435C183.99 45.246 190.296 42.2756 196.514 45.4807Z" fill="#013335"/><path class="sm" d="M397.5 123C379.229 123.299 364.491 115.581 355.72 108.745C350.984 105.054 345.471 99.7222 340.004 102.205C338.597 102.844 337.651 103.887 337.045 105.124C334.725 109.862 338.207 115.205 342.139 118.721C363.181 137.537 393.785 140.219 407.5 139C434.046 137.182 453.511 123.656 461.84 115.326C463.335 113.831 464.728 112.102 465.026 110.009C465.353 107.702 464.592 105.829 464 105C459.2 98.6001 453.667 101.333 451.5 103.5C441 113 428 122.5 397.5 123Z" fill="#009834"/></g><defs><clipPath id="clip0_56_69"><rect width="483" height="140" fill="white"/></clipPath></defs></svg></div><p class="hint">Tap to replay</p>',
        ) +
        n(
          "",
          '<div class="pw rv">' +
            [
              "Yadsale post: Buy this, with the sticker frame",
              "Yadsale post: Some things just become part of your story",
              "Yadsale post: And suddenly the person asking is you",
            ]
              .map(
                (t, s) =>
                  '<figure><div class="sxi"><img src="' +
                  e("pq" + s) +
                  '" alt="' +
                  t +
                  '" loading="lazy" decoding="async"></div></figure>',
              )
              .join("") +
            "</div>",
        ) +
        n(
          "k",
          '<div class="jg">' +
            o(
              "w-prof",
              "The Yadsale social profile with its sticker pills",
              "",
              0.8,
            ) +
            o(
              "w-key",
              "Yadsale key visual: Move your business to Yadsale",
              "",
              1.224,
            ) +
            "</div>",
        ) +
        n(
          "",
          '<div class="jg vids">' +
            d("reel", "Yadsale logo reel", "Reel", 0.5625) +
            d("launch", "Yadsale marketplace launch post", "Launch", 0.5625) +
            d("post", "Yadsale animated post", "Post", 0.75) +
            "</div>",
        ) +
        n(
          "l",
          '<div class="lbn rv">' +
            l("#009834", "Kelly Green", "#fff") +
            l("#013335", "Deep", "#fff") +
            l("#FFF9E3", "Cream", "#013335") +
            l("#B8DD58", "Lime", "#013335") +
            '</div><div class="chips rv">' +
            l("#6339C3", "Purple") +
            l("#EDC345", "Yellow", "#013335") +
            l("#DB3A3A", "Red") +
            '</div><div class="ty rv" style="--ff:\'Goldplay\',\'Lexend\',system-ui,sans-serif"><div><p class="aa">Aa</p><small>Goldplay</small></div><div>' +
            r("Display", "min(40px,8vw)", "Evict the extra,", 0, 900) +
            r("Title", "min(26px,6vw)", "Pocket the profit.", 0, 700) +
            r(
              "Body",
              "16px",
              "Connecting real people, real deals and real trust.",
              0,
              400,
            ) +
            r("Tag", "13px", "#makespace #makesale", 0, 600) +
            "</div></div>",
        ) +
        "</div>"
      );
    },
    lykluk: (e) =>
      i(
        e,
        c(e.u, e.ul, 1) +
          c("https://apps.apple.com/app/id6444111490", "App Store") +
          c(
            "https://play.google.com/store/search?q=lykluk&c=apps",
            "Google Play",
          ),
      ) +
      '<div class="sx">' +
      n(
        "",
        a(
          "You swipe between Luks, Connections and Live without leaving the screen.",
          -1.2,
        ) +
          '<div class="t3 fan ph3">' +
          s("ly-feed", "The Lykluk feed", "Feed") +
          s("ly-market", "The Lykluk market", "Market") +
          s("ly-profile", "The Lykluk profile", "Profile") +
          "</div>",
      ) +
      n(
        "l",
        '<div class="t3 ph3 wv">' +
          s("ly-splash", "Lykluk splash screen", "Splash") +
          s("ly-interests", "Interest picker", "Interests") +
          s("ly-dark", "Dark theme sign up", "Dark theme") +
          "</div>",
      ) +
      n(
        "k",
        '<div class="t3 ph3 wv up">' +
          s("ly-studio", "Creator studio", "Studio") +
          s("ly-audience", "Audience", "Audience") +
          s("ly-withdraw", "Withdraw", "Withdraw") +
          "</div>",
      ) +
      n(
        "",
        a("Watching, buying and getting paid all happen in one app.", 1.1) +
          '<div class="t3 ph3 flow">' +
          s("ly-live", "Live selling", "Live selling") +
          s("ly-logistics", "Logistics", "Logistics") +
          s("ly-order", "Order details", "Order details") +
          "</div>",
      ) +
      n(
        "l",
        '<div class="lbn rv">' +
          l("#8B35C0", "Lyk purple", "#fff") +
          l("#FF5A0B", "Ember", "#fff") +
          l("#FFD400", "Sun", "#0a0a0a") +
          l("#1B1B1B", "Ink", "#fff") +
          '</div><div class="chips rv">' +
          l("#E34149", "Red") +
          l("#2CB864", "Green") +
          l("#2680EB", "Blue") +
          l("#2F2D2B", "Charcoal") +
          l("#89867C", "Stone") +
          l("#CDCBC4", "Sand", "#0a0a0a") +
          l("#E1DED7", "Paper", "#0a0a0a") +
          '</div><div class="ty d rv" style="--ff:\'Figtree\',\'Lexend\',system-ui,sans-serif"><div><p class="aa">Aa</p><small>Figtree, throughout</small></div><div>' +
          r("Display", "min(80px,12vw)", "Culture", 0, 800) +
          r("Heading", "min(48px,9vw)", "Your Stage.", 0, 700) +
          r("Title", "min(24px,6vw)", "Luks · Connections · Live", 0, 600) +
          r(
            "Body",
            "16px",
            "Dive into a vibrant community where we bring cultural stories to life.",
            0,
            400,
          ) +
          r("Caption", "12px", "10 mins ago", 0, 500) +
          "</div></div>",
      ) +
      '<p class="lk">' +
      c("https://www.instagram.com/reel/DVN2NpxiJfX/", "Launch reel").replace(
        ' class="btn"',
        "",
      ) +
      c(
        "https://www.instagram.com/reel/DVRHP9oCG8i/",
        "Explainer reel",
      ).replace(' class="btn"', "") +
      "</p></div>",
  };
};
function csSt(e, t, s) {
  ((e.dataset.st = t),
    s && (e.dataset.u = 1),
    e
      .querySelectorAll("[data-go]")
      .forEach((e) => e.classList.toggle("on", e.dataset.go === t)));
}
const csDispose = [];
function csLater(fn, delay) {
  const id = setTimeout(fn, delay);
  csDispose.push(() => clearTimeout(id));
}
function csCleanup() { csDispose.splice(0).forEach(dispose => dispose()); }
function csFx(e) {
  if (
    matchMedia("(prefers-reduced-motion:reduce)").matches ||
    !("IntersectionObserver" in window)
  )
    return;
  const t = new IntersectionObserver(
    (e) =>
      e.forEach((e) => {
        if (e.isIntersecting) {
          const s = e.target,
            a = s.querySelector(".nm");
          (s.classList.add("in"),
            t.unobserve(s),
            a &&
              (csLater(() => {
                a.dataset.u || csSt(a, "tree");
              }, 2400),
              csLater(() => {
                a.dataset.u || csSt(a, "pie");
              }, 5800)));
        }
      }),
    { rootMargin: "0px 0px -8% 0px" },
  );
  csDispose.push(() => t.disconnect());
  e.querySelectorAll(".sxs").forEach((e) => {
    (e.classList.add("fx"),
      e
        .querySelectorAll("figure,.nt,.rv")
        .forEach((e, t) => e.style.setProperty("--i", t)),
      t.observe(e));
  });
}
function csCoin(e) {
  const t = e.querySelector(".cn");
  if (!t) return;
  const s = t.querySelector(".cw"),
    a = matchMedia("(prefers-reduced-motion:reduce)").matches;
  let n = -28,
    o = 0.6,
    i = 0,
    c = 0,
    l = 1;
  const r = () => s.style.setProperty("--ry", n + "deg");
  let frame = 0, disposed = false;
  const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    l = entries[0].isIntersecting;
  }) : null;
  if (observer) observer.observe(t);
  const d = () => {
    if (disposed) return;
    if (l && !a && !document.hidden && document.getElementById("cs").classList.contains("show")) {
      if (!i) { o += .025 * (.6 - o); n += o; r(); }
    }
    frame = requestAnimationFrame(d);
  };
  const release = () => { i = 0; };
  addEventListener("blur", release);
  csDispose.push(() => {
    disposed = true;
    cancelAnimationFrame(frame);
    if (observer) observer.disconnect();
    removeEventListener("blur", release);
  });
  (r(),
    a || d(),
    t.addEventListener("pointerdown", (e) => {
      ((i = 1), (c = e.clientX));
      try {
        t.setPointerCapture(e.pointerId);
      } catch (e) {}
    }),
    t.addEventListener("pointermove", (e) => {
      if (i) {
        const t = e.clientX - c;
        ((c = e.clientX), (n += 0.35 * t), (o = Math.max(-12, Math.min(12, 0.35 * t))), r());
      }
    }),
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((e) =>
      t.addEventListener(e, () => {
        i = 0;
      }),
    ),
    e.querySelectorAll(".cc button").forEach((s) =>
      s.addEventListener("click", () => {
        (t.style.setProperty("--img", "url(" + window._csA(s.dataset.k) + ")"),
          t.style.setProperty(
            "--rim",
            {
              "c-gold": "#b98521",
              "c-blue": "#435abd",
              "c-aurora": "#67a5a0",
              "c-night": "#34374a",
              "c-silver": "#8b929c",
            }[s.dataset.k],
          ),
          e
            .querySelectorAll(".cc button")
            .forEach((e) => e.classList.toggle("on", e === s)),
          (o = 4));
      }),
    ));
}
if (
  (window._csh ||
    ((window._csh = 1),
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-hex]");
      if (t) {
        try {
          navigator.clipboard.writeText(t.dataset.hex).catch(() => {});
        } catch (e) {}
        (t.classList.add("cp"),
          setTimeout(() => t.classList.remove("cp"), 1400));
      }
      const s = e.target.closest("[data-go]");
      s && csSt(s.closest(".nm"), s.dataset.go, 1);
    })),
  !window._csp)
) {
  window._csp = 1;
  const e = (e) => e.target.closest && e.target.closest(".ty");
  (document.addEventListener("pointerover", (t) => {
    if ("mouse" === t.pointerType) {
      const s = e(t);
      s && s.classList.add("on");
    }
  }),
    document.addEventListener("pointerout", (t) => {
      if ("mouse" === t.pointerType) {
        const s = e(t);
        s && !s.contains(t.relatedTarget) && s.classList.remove("on");
      }
    }),
    document.addEventListener("pointerup", (t) => {
      if ("mouse" !== t.pointerType) {
        const s = e(t);
        s && s.classList.toggle("on");
      }
    }));
}
function csVid(e) {
  const t = [...e.querySelectorAll("video")];
  if (!t.length) return;
  if (
    matchMedia("(prefers-reduced-motion:reduce)").matches ||
    !("IntersectionObserver" in window)
  )
    return void t.forEach((e) => (e.controls = !0));
  const s = new IntersectionObserver(
    (e) =>
      e.forEach((e) => {
        const t = e.target;
        if (e.isIntersecting) {
          const e = t.play();
          e && e.catch && e.catch(() => {});
        } else t.pause();
      }),
    { threshold: 0.35 },
  );
  t.forEach((e) => s.observe(e));
  csDispose.push(() => { s.disconnect(); t.forEach(video => video.pause()); });
}
function csBody(e) {
  const t = mk(
    (t) => (window._MK && _MK[t]) || "assets/" + e.id + "/" + t + ".webp",
    (t) => "assets/" + e.id + "/" + t + ".mp4",
  );
  if (t[e.id]) return t[e.id](e);
  const s = ["Role", "Year", "Scope", "Status"];
  return (
    "<h2>" +
    e.t +
    '</h2><p class="csl">' +
    e.l +
    '</p><div class="csm">' +
    e.m
      .map((e, t) => "<div><span>" + s[t] + "</span>" + e + "</div>")
      .join("") +
    "</div>" +
    (e.u
      ? '<p><a class="btn p" href="' +
        e.u +
        '" target="_blank" rel="noopener">' +
        e.ul +
        "</a></p>"
      : "") +
    '<div class="cover">' +
    phi("16:9", "Cover image for " + e.t) +
    "</div>" +
    dt(
      "Context",
      1,
      (e.c ? "<p>" + e.c + "</p>" : "") +
        '<p class="todo">Add: who ' +
        e.t +
        " is for, where it started and why it was needed.</p>" +
        phi("16:9", "Wide shot: " + e.t + " overview"),
    ) +
    dt(
      "The challenge",
      0,
      '<p class="todo">Add: the core problem in two or three sentences.</p><div class="g2">' +
        phi("4:3", "Before or research") +
        phi("4:3", "Field notes or audit") +
        "</div>",
    ) +
    dt(
      "Process",
      0,
      '<p class="todo">Add: your steps in order, one line each.</p><div class="g2">' +
        phi("4:3", "Mapping or exploration") +
        phi("4:3", "Wireframes or testing") +
        "</div>",
    ) +
    dt(
      "Design and identity",
      0,
      '<p class="todo">Add: the key design decisions and how they show up.</p>' +
        phi("16:9", "Key screens or identity overview") +
        '<div class="g2">' +
        phi("1:1", "Detail one") +
        phi("1:1", "Detail two") +
        "</div>",
    ) +
    dt(
      "Outcome",
      0,
      '<div class="kpi"><div><b>[00]</b><span>Add a metric</span></div><div><b>[00]</b><span>Add a metric</span></div><div><b>[00]</b><span>Add a metric</span></div></div><p class="todo">Add: what you learned and what came next.</p>',
    )
  );
}
window._csr ||
  ((window._csr = 1),
  document.addEventListener("click", (e) => {
    const t = e.target.closest && e.target.closest("[data-rp]");
    if (!t) return;
    const s = t.closest(".sxs");
    (s.classList.remove("in"),
      s.offsetWidth,
      requestAnimationFrame(() => s.classList.add("in")));
  }),
  document.addEventListener("keydown", (e) => {
    ("Enter" === e.key || " " === e.key) &&
      e.target.matches &&
      e.target.matches("[data-rp]") &&
      (e.preventDefault(), e.target.click());
  }));
const csS = $("#cs"),
  csF = $("#csf"),
  csL = csS.querySelector(".lab");
csL.addEventListener("pointerdown", () => (csS.dataset.moved = 1), !0);
let ci = 0,
  csLast = null;
function csShow(e) {
  csCleanup();
  ci = e;
  const t = CS[e];
  ((csL.textContent = "Case study · " + t.t),
    ($("#cst").textContent = t.t),
    ($("#csb").innerHTML = csBody(t)),
    (csF.dataset.p = t.id));
  {
    const e = $("#csb");
    (csFx(e), csCoin(e), csVid(e));
  }
  (($("#csn").textContent = "View next: " + CS[(e + 1) % CS.length].t),
    ($("#csp").textContent =
      "← Previous: " + CS[(e + CS.length - 1) % CS.length].t),
    (csF.scrollTop = 0),
    (csS.scrollTop = 0));
}
function csOpen(e) {
  delete csS.dataset.moved;
  const t = CS.findIndex((t) => t.id === e);
  t < 0 ||
    ((csLast = document.activeElement),
    csShow(t),
    H.classList.contains("cv")
      ? (mvT(csS, 0, 0),
        csS.style.setProperty("--ct", Math.max(70, (scrollY + 96) / Z) + "px"),
        H.classList.add("cso"))
      : (document.body.style.overflow = "hidden"),
    csS.classList.add("show"),
    csPlace(),
    requestAnimationFrame(csPlace),
    setTimeout(csPlace, 350),
    sync(),
    $("#csx").focus({ preventScroll: !0 }));
}
function csPlace() {
  if (
    csS.classList.contains("show") &&
    H.classList.contains("cv") &&
    !csS.dataset.moved
  )
    for (let e = 0; e < 3; e++) {
      const e = (64 - csS.getBoundingClientRect().top) / Z;
      if (Math.abs(e) < 0.5) break;
      csS.style.setProperty(
        "--ct",
        parseFloat(csS.style.getPropertyValue("--ct") || 0) + e + "px",
      );
    }
}
function csClose() {
  csCleanup();
  (csS.classList.remove("show"),
    H.classList.remove("cso"),
    (document.body.style.overflow = ""),
    mvT(csS, 0, 0),
    sync(),
    csLast && csLast.focus({ preventScroll: !0 }));
}
(document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-cs]");
  t && (e.preventDefault(), csOpen(t.dataset.cs));
}),
  ($("#csx").onclick = csClose),
  ($("#csn").onclick = () => csShow((ci + 1) % CS.length)),
  ($("#csp").onclick = () => csShow((ci + CS.length - 1) % CS.length)),
  addEventListener("keydown", (e) => {
    "Escape" === e.key && csS.classList.contains("show") && csClose();
  }),
  (function () {
    const e = document.getElementById("cszv"),
      t = document.getElementById("czi"),
      s = document.getElementById("czc"),
      a = document.getElementById("czn"),
      n = document.getElementById("csb");
    let o = [],
      i = 0, back = null, overflow = "";
    const c = () => {
        const n = o[i];
        if (!n) return;
        const c = n.querySelector("img"),
          l = n.querySelector("figcaption");
        ((t.src = c.currentSrc || c.src),
          (t.alt = c.alt),
          (s.textContent =
            (l ? l.textContent : c.alt) +
            (o.length > 1 ? "  (" + (i + 1) + "/" + o.length + ")" : "")),
          (a.hidden = o.length < 2),
          e.classList.remove("z"),
          document.getElementById("czs").scrollTo(0, 0));
      },
      l = () => {
        (e.classList.remove("show", "z"), t.removeAttribute("src"));
        document.body.style.overflow = overflow;
        if (back && back.isConnected) back.focus({ preventScroll: true });
      },
      r = (e) => {
        o.length && ((i = (i + e + o.length) % o.length), c());
      };
    (n.addEventListener("click", (t) => {
      const s = t.target.closest("img");
      if (!s || s.closest(".sxs,.sxh")) return;
      const a = s.closest("figure");
      a &&
        (t.preventDefault(),
        ((t) => {
          back = document.activeElement;
          overflow = document.body.style.overflow;
          document.body.style.overflow = "hidden";
          ((o = [...n.querySelectorAll("figure")].filter((e) =>
            e.querySelector("img"),
          )),
            (i = Math.max(0, o.indexOf(t))),
            c(),
            e.classList.add("show"),
            document.getElementById("czx").focus({ preventScroll: !0 }));
        })(a));
    }),
      (document.getElementById("czx").onclick = l),
      (document.getElementById("czp").onclick = () => r(-1)),
      (document.getElementById("czq").onclick = () => r(1)),
      (t.onclick = (t) => {
        (t.stopPropagation(), e.classList.toggle("z"));
      }),
      (document.getElementById("czs").onclick = (e) => {
        e.target === e.currentTarget && l();
      }),
      addEventListener(
        "keydown",
        (t) => {
          if (e.classList.contains("show") && t.key === "Tab") {
            const buttons = [...e.querySelectorAll("button")].filter(button => !button.closest("[hidden]"));
            const first = buttons[0], last = buttons[buttons.length - 1];
            if (!e.contains(document.activeElement) || (!t.shiftKey && document.activeElement === last)) {
              t.preventDefault(); first.focus();
            } else if (t.shiftKey && document.activeElement === first) {
              t.preventDefault(); last.focus();
            }
            return;
          }
          e.classList.contains("show") &&
            ("Escape" === t.key
              ? (t.stopImmediatePropagation(), l())
              : "ArrowRight" === t.key
                ? r(1)
                : "ArrowLeft" === t.key && r(-1));
        },
        !0,
      ));
  })(),
  mq.addEventListener("change", () => {
    csS.classList.contains("show") &&
      (document.body.style.overflow = mq.matches ? "" : "hidden");
  }),
  (function () {
    const e = (e) => document.getElementById(e),
      t = e("lyp"),
      s = e("zl"),
      a = [
        "hero",
        "about",
        "work",
        "contact",
        "pl-music",
        "pl-ig",
        "pl-journal",
        "pl-char",
        "pl-game",
        "pl-story",
        "pl-arch",
        "pl-reads",
      ],
      n = [
        "pl-music",
        "pl-ig",
        "pl-journal",
        "pl-char",
        "pl-game",
        "pl-story",
        "pl-arch",
        "pl-reads",
      ],
      o = {
        hero: 300,
        about: 360,
        work: 620,
        contact: 240,
        "pl-music": 220,
        "pl-ig": 300,
        "pl-journal": 380,
        "pl-char": 420,
        "pl-game": 520,
        "pl-story": 460,
        "pl-arch": 640,
        "pl-reads": 320,
      },
      i = 24,
      c = (e) =>
        e.rows
          ? e.w
          : e.cols.reduce((e, t) => e + t.w, 0) + i * (e.cols.length - 1),
      l = {
        default: { n: "Default", cols: [{ w: 880, i: a }] },
        recruiter: {
          n: "Recruiter",
          w: 1400,
          rows: [
            ["hero", "about"],
            ["work", "contact"],
            ["pl-music", "pl-ig"],
            ["pl-journal", "pl-char"],
            ["pl-game", "pl-story"],
            ["pl-arch", "pl-reads"],
          ],
        },
        split: {
          n: "Split",
          cols: [
            {
              w: 720,
              i: [
                "hero",
                "about",
                "work",
                "contact",
                "pl-music",
                "pl-ig",
                "pl-reads",
              ],
            },
            {
              w: 720,
              i: ["pl-journal", "pl-char", "pl-game", "pl-story", "pl-arch"],
            },
          ],
        },
        desk: {
          n: "Desk",
          cols: [
            {
              w: 560,
              i: ["hero", "about", "contact", "pl-music", "pl-ig", "pl-reads"],
            },
            { w: 560, i: ["work", "pl-journal", "pl-char"] },
            { w: 560, i: ["pl-game", "pl-story", "pl-arch"] },
          ],
        },
        room: {
          n: "Playroom",
          cols: [
            {
              w: 560,
              i: ["pl-music", "pl-ig", "pl-journal", "pl-char", "pl-reads"],
            },
            { w: 560, i: ["hero", "about", "work", "contact"] },
            { w: 560, i: ["pl-game", "pl-story", "pl-arch"] },
          ],
        },
      },
      r = {
        default: { n: "Default", cols: [{ w: 600, i: a }] },
        woven: {
          n: "Woven",
          cols: [
            {
              w: 600,
              i: [
                "hero",
                "pl-music",
                "about",
                "pl-ig",
                "work",
                "pl-journal",
                "pl-char",
                "pl-game",
                "pl-story",
                "pl-arch",
                "pl-reads",
                "contact",
              ],
            },
          ],
        },
        room: {
          n: "Playroom",
          cols: [
            {
              w: 600,
              i: [
                "pl-music",
                "pl-ig",
                "pl-journal",
                "pl-char",
                "pl-game",
                "pl-story",
                "pl-arch",
                "pl-reads",
                "hero",
                "about",
                "work",
                "contact",
              ],
            },
          ],
        },
      };
    let d = "default";
    const p = () => document.documentElement.classList.contains("cv"),
      h = (window.__lay = {
        on: !1,
        clear() {
          (a.forEach((t) => {
            const s = e(t);
            (["position", "left", "top", "width", "maxWidth", "order"].forEach(
              (e) => (s.style[e] = ""),
            ),
              s.classList.remove("lx"));
          }),
            cv.classList.remove("ord"),
            (cv.style.minHeight = ""),
            (h.on = !1),
            (d = "default"),
            m());
        },
      });
    function u() {
      const e = p() ? l : r,
        s = Object.keys(e);
      t.innerHTML =
        '<div class="lyg' +
        (s.length > 3 ? "" : " f3") +
        '">' +
        s
          .map(
            (t) =>
              '<button class="lyt" type="button" data-l="' +
              t +
              '" aria-pressed="' +
              (t === d) +
              '">' +
              (function (e) {
                const t = [];
                let s, a;
                if (e.rows) {
                  s = e.w;
                  let n = 0;
                  (e.rows.forEach((e) => {
                    const a = s / e.length;
                    (e.forEach((e, s) => t.push([e, s * a, n, a])),
                      (n += Math.max(...e.map((e) => o[e]))));
                  }),
                    (a = n));
                } else {
                  ((s = e.cols.reduce((e, t) => e + t.w, 0)),
                    (a = Math.max(
                      ...e.cols.map((e) => e.i.reduce((e, t) => e + o[t], 0)),
                    )));
                  let n = 0;
                  e.cols.forEach((e) => {
                    let s = 0;
                    (e.i.forEach((a) => {
                      (t.push([a, n, s, e.w]), (s += o[a]));
                    }),
                      (n += e.w));
                  });
                }
                const i = Math.min(110 / s, 62 / a),
                  c = (120 - s * i) / 2,
                  l = (72 - a * i) / 2;
                return (
                  '<svg viewBox="0 0 120 72" aria-hidden="true">' +
                  t
                    .map(
                      ([e, t, s, a]) =>
                        '<rect x="' +
                        (c + t * i + 1).toFixed(1) +
                        '" y="' +
                        (l + s * i + 1).toFixed(1) +
                        '" width="' +
                        (a * i - 2).toFixed(1) +
                        '" height="' +
                        (o[e] * i - 2).toFixed(1) +
                        '" rx="1.5" fill="' +
                        (n.includes(e) ? "var(--or)" : "var(--ink)") +
                        '"' +
                        (n.includes(e) ? "" : ' opacity=".85"') +
                        "/>",
                    )
                    .join("") +
                  "</svg>"
                );
              })(e[t]) +
              e[t].n +
              "</button>",
          )
          .join("") +
        '</div><div class="lyk"><span><i style="background:var(--ink)"></i>Portfolio</span><span><i style="background:var(--or)"></i>Playground widgets</span></div>';
    }
    function m() {
      t.querySelectorAll(".lyt").forEach((e) =>
        e.setAttribute("aria-pressed", e.dataset.l === d),
      );
    }
    let f = 1;
    function v(t) {
      const s = cv.offsetWidth,
        a = c(t),
        n = 44 + Math.max(0, 56 / f - 56);
      let o = s / 2 - a / 2,
        l = 0;
      const r = [];
      if (t.rows) {
        let s = n;
        (t.rows.forEach((t) => {
          const n = (a - i * (t.length - 1)) / t.length;
          let c = 0;
          (t.forEach((t, a) => {
            const l = e(t);
            (r.push([l, o + a * (n + i), s]),
              (c = Math.max(c, l.offsetHeight)));
          }),
            (s += c + i));
        }),
          (l = s));
      } else
        t.cols.forEach((t) => {
          let s = n;
          (t.i.forEach((t) => {
            const a = e(t);
            (r.push([a, o, s]), (s += a.offsetHeight + i));
          }),
            (l = Math.max(l, s)),
            (o += t.w + i));
        });
      return { tg: r, bot: l, Wt: a, vw: s };
    }
    function g(t) {
      if (!p())
        return (function (t) {
          const s = r[t].cols[0].i;
          (a.forEach(
            (a) => (e(a).style.order = "default" === t ? "" : s.indexOf(a)),
          ),
            cv.classList.toggle("ord", "default" !== t),
            (d = t),
            m(),
            scrollTo({ top: 0, behavior: "smooth" }));
        })(t);
      if ("default" === t) return void reset();
      const s = l[t],
        n = a.map(e);
      cv.style.minHeight = cv.offsetHeight + "px";
      const o = n.map((e) => {
        const t = pos.get(e) || [0, 0];
        return [e.offsetLeft + t[0], e.offsetTop + t[1], e.offsetWidth];
      });
      (n.forEach((e, t) => {
        (mvT(e, 0, 0),
          e.classList.remove("lx", "rs"),
          (e.style.position = "absolute"),
          (e.style.maxWidth = "none"),
          (e.style.left = o[t][0] + "px"),
          (e.style.top = o[t][1] + "px"),
          (e.style.width = o[t][2] + "px"));
      }),
        s.rows
          ? s.rows.forEach((t) =>
              t.forEach(
                (a) =>
                  (e(a).style.width =
                    (s.w - i * (t.length - 1)) / t.length + "px"),
              ),
            )
          : s.cols.forEach((t) =>
              t.i.forEach((s) => (e(s).style.width = t.w + "px")),
            ));
      const u = cv.offsetWidth,
        g = c(s),
        y = Math.max(
          0.25,
          Math.min(1, Math.floor(((0.92 * u) / g) * 100) / 100),
        );
      ((f = y), (h.on = !0), (d = t));
      const w = v(s);
      (n.forEach((e) => e.classList.add("lx")),
        w.tg.forEach(([e, t, s]) => {
          ((e.style.left = t + "px"), (e.style.top = s + "px"));
        }),
        (cv.style.minHeight = w.bot + 160 + "px"),
        setZ(y),
        fit(),
        scrollTo({ top: 0, behavior: "smooth" }),
        setTimeout(() => n.forEach((e) => e.classList.remove("lx")), 800),
        m(),
        sync());
    }
    let y = 0;
    function w() {
      if (((y = 0), !h.on || !p())) return;
      const e = l[d];
      if (!e) return;
      const t = v(e);
      (t.tg.forEach(([e, t, s]) => {
        (Math.abs((parseFloat(e.style.left) || 0) - t) < 1 &&
          Math.abs((parseFloat(e.style.top) || 0) - s) < 1) ||
          (e.classList.add("rl"),
          clearTimeout(e._rl),
          (e._rl = setTimeout(() => e.classList.remove("rl"), 500)),
          (e.style.left = t + "px"),
          (e.style.top = s + "px"));
      }),
        (cv.style.minHeight = t.bot + 160 + "px"),
        fit());
    }
    const b = () => {
      h.on && !y && (y = requestAnimationFrame(w));
    };
    if (window.ResizeObserver) {
      const t = new ResizeObserver(b);
      a.forEach((s) => t.observe(e(s)));
    }
    (addEventListener("resize", b),
      t.addEventListener("click", (e) => {
        const t = e.target.closest(".lyt");
        t && g(t.dataset.l);
      }));
    const E = () => {
      (tp(!0), openTool("layout", 1));
    };
    (s &&
      (s.onclick = (e) => {
        (e.stopPropagation(), E());
      }),
      document
        .querySelector(".tabs button[data-t=layout]")
        .addEventListener("click", u),
      u(),
      mq.addEventListener("change", () => {
        (h.clear(), u());
      }),
      addEventListener("keydown", (e) => {
        e.metaKey ||
          e.ctrlKey ||
          e.altKey ||
          /INPUT|TEXTAREA/.test(document.activeElement.tagName) ||
          ("l" === e.key.toLowerCase() && E());
      }));
  })(),
  (function () {
    const e = (e) => document.getElementById(e),
      t = e("nw"),
      s = e("nwm"),
      a = e("nwt");
    function n(s) {
      ((window.__np = s),
        document.dispatchEvent(new CustomEvent("np:update", { detail: s })));
      const n = a.firstElementChild;
      if ((a.classList.remove("mq"), !s))
        return (
          (t.dataset.s = "off"),
          (e("nwk").textContent = "Standby"),
          (n.textContent = "Waiting for a signal"),
          (e("nwa").innerHTML = "&nbsp;"),
          (e("nwc").hidden = !0),
          void (e("nwo").href = "https://music.youtube.com")
        );
      ((t.dataset.s = s.playing ? "on" : "last"),
        (e("nwk").textContent = s.playing
          ? "Now playing"
          : "Last played · " +
            ((e) => {
              const t = Date.now() / 1e3 - e,
                s = t / 3600;
              return s < 1
                ? Math.max(1, Math.round(t / 60)) + " min ago"
                : s < 24
                  ? Math.round(s) + " h ago"
                  : Math.round(s / 24) + " d ago";
            })(s.at)),
        (n.textContent = s.title),
        (e("nwa").textContent = s.artist || " "));
      const o = e("nwc");
      ((o.hidden = !s.art),
        (o.innerHTML = s.art
          ? '<img src="' +
            ((e) =>
              String(e).replace(
                /[&<>"]/g,
                (e) =>
                  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[
                    e
                  ],
              ))(s.art) +
            '" alt="">'
          : ""),
        (e("nwo").href =
          "https://music.youtube.com/search?q=" +
          encodeURIComponent(s.title + " " + (s.artist || ""))),
        !R &&
          n.scrollWidth > a.clientWidth &&
          ((n.textContent = s.title + "   ·   " + s.title + "   ·   "),
          a.style.setProperty("--d", Math.max(10, 0.55 * s.title.length) + "s"),
          a.classList.add("mq")));
    }
    s.innerHTML = Array.from(
      { length: 16 },
      (e, t) => '<i style="--k:' + (t % 7) + '"></i>',
    ).join("");
    const o = () =>
      fetch("/api/nowplaying")
        .then((e) => e.json())
        .then((e) => {
          if (!e.title) throw 0;
          n(e);
        })
        .catch(() => n(null));
    ((e("nwd").onclick = () => {
      const t = e("nwd"),
        s = (+t.dataset.r || 0) + 45;
      ((t.dataset.r = s),
        t.firstElementChild.style.setProperty("--r", s + "deg"));
    }),
      o(),
      setInterval(() => {
        document.hidden || o();
      }, 3e4),
      addEventListener("keydown", (e) => {
        "p" !== e.key.toLowerCase() ||
          e.metaKey ||
          e.ctrlKey ||
          e.altKey ||
          /INPUT|TEXTAREA/.test(document.activeElement.tagName) ||
          t.scrollIntoView({ behavior: R ? "auto" : "smooth", block: "start" });
      }));
  })(),
  document.querySelectorAll(".dock a").forEach((e) => {
    const t = document.createElement("span");
    ((t.className = "dl"),
      (t.textContent = (e.getAttribute("aria-label") || "").replace(
        / \(.*\)/,
        "",
      )),
      e.appendChild(t));
  }),
  (function () {
    const e = [
        { x: 30, y: 34, s: 7, p: "Frames", t: "🚨 name your frames bro" },
        {
          x: 78,
          y: 52,
          s: 3,
          p: "Layers",
          t: "yes, it's a hidden layer, don't ask what's in it 👀",
        },
        { x: 18, y: 66, s: 1, p: "Polish", t: "let's make this pop 🎆" },
        {
          x: 62,
          y: 82,
          s: 6,
          p: "Handoff",
          t: "upload final_final_final_design.zip file",
        },
        {
          x: 88,
          y: 20,
          s: 0,
          p: "Access",
          t: "v1 was better but we don't talk about that 🤫",
        },
      ],
      t = [
        [
          "heart",
          "#FF4D6D",
          [
            ".11..11.",
            "11111111",
            "11111111",
            "11111111",
            ".111111.",
            "..1111..",
            "...11...",
            "........",
          ],
        ],
        [
          "star",
          "#F2B04B",
          [
            "...11...",
            "...11...",
            "11111111",
            ".111111.",
            "..1111..",
            ".111111.",
            ".11..11.",
            "........",
          ],
        ],
        [
          "bolt",
          "#3B6BFF",
          [
            "....111.",
            "...111..",
            "..111...",
            ".111111.",
            "..1111..",
            "..11....",
            ".11.....",
            "1.......",
          ],
        ],
        [
          "ghost",
          "#F4F1EA",
          [
            "..1111..",
            ".111111.",
            "11211211",
            "11211211",
            "11111111",
            "11111111",
            "11111111",
            "1.11.11.",
          ],
        ],
        [
          "smile",
          "#FFD23F",
          [
            ".111111.",
            "11111111",
            "12111121",
            "11111111",
            "12111121",
            "11222211",
            ".111111.",
            "........",
          ],
        ],
        [
          "cursor",
          "#2DA44E",
          [
            "1.......",
            "11......",
            "111.....",
            "1111....",
            "11111...",
            "111111..",
            "1111....",
            ".11.....",
          ],
        ],
        [
          "gem",
          "#B8379A",
          [
            "..1111..",
            ".111111.",
            "11111111",
            ".111111.",
            "..1111..",
            "...11...",
            "........",
            "........",
          ],
        ],
        [
          "chat",
          "#E15B0F",
          [
            ".111111.",
            "11111111",
            "11111111",
            "11111111",
            ".111111.",
            "..11....",
            ".1......",
            "........",
          ],
        ],
      ],
      s = (e) => document.getElementById(e),
      a = s("mnp"),
      n = s("mnd"),
      o = s("mnb"),
      i = new Set(),
      c = matchMedia("(min-width:701px)");
    let l = -1;
    a.innerHTML = e
      .map(
        (e, s) =>
          '<button class="pin" type="button" data-i="' +
          s +
          '" aria-expanded="false" aria-label="Open note: ' +
          e.p +
          '" style="left:' +
          e.x +
          "%;top:" +
          e.y +
          "%;--i:" +
          s +
          '">' +
          (function (e, t) {
            const s = Array.from({ length: 10 }, () => Array(10).fill(0));
            e.forEach((e, t) =>
              [...e].forEach((e, a) => {
                "." !== e && (s[t + 1][a + 1] = "2" === e ? 2 : 1);
              }),
            );
            let a = "";
            for (let e = 0; e < 10; e++)
              for (let n = 0; n < 10; n++) {
                let o = s[e][n];
                (!o &&
                  [
                    [1, 0],
                    [-1, 0],
                    [0, 1],
                    [0, -1],
                  ].some(([t, a]) => s[e + a] && s[e + a][n + t]) &&
                  (o = 3),
                  o &&
                    (a +=
                      '<rect x="' +
                      n +
                      '" y="' +
                      e +
                      '" width="1" height="1" fill="' +
                      (1 === o ? t : "#1C160E") +
                      '"/>'));
              }
            return (
              '<svg viewBox="0 0 10 10" aria-hidden="true">' + a + "</svg>"
            );
          })(t[e.s][2], t[e.s][1]) +
          "</button>",
      )
      .join("");
    const r = [...a.children],
      d = () =>
        (s("mnc").textContent =
          String(i.size).padStart(2, "0") +
          " / " +
          String(e.length).padStart(2, "0") +
          " RESOLVED");
    function p() {
      ((n.hidden = !0),
        (l = -1),
        r.forEach((e) => e.setAttribute("aria-expanded", "false")));
    }
    function h(t) {
      const s = e[t],
        a = r[t];
      ((l = t),
        r.forEach((e) => e.setAttribute("aria-expanded", e === a)),
        (n.innerHTML =
          '<p class="cmt">' +
          s.p.toUpperCase() +
          " · NOTE " +
          String(t + 1).padStart(2, "0") +
          '</p><div class="cmh"><span class="av">' +
          PX.thumb(PX.MARIO) +
          '</span><b>Mario</b><span>just now</span><button class="x" type="button" aria-label="Close">×</button></div><p class="cm"></p><div class="cmf"><button class="ib2 p" type="button" data-a="r" aria-label="Resolve note" title="Resolve note"><svg class="pxi" viewBox="0 0 10 10" aria-hidden="true"><path d="M8 1h2v1h-2zM7 2h3v1h-3zM6 3h3v1h-3zM0 4h1v1h-1zM5 4h3v1h-3zM0 5h2v1h-2zM4 5h3v1h-3zM1 6h6v1h-6zM2 7h4v1h-4zM3 8h2v1h-2z"/></svg></button><button class="ib2" type="button" data-a="n" aria-label="Next note" title="Next note"><svg class="pxi" viewBox="0 0 10 10" aria-hidden="true"><path d="M6 1h1v1h-1zM6 2h2v1h-2zM0 3h9v1h-9zM0 4h10v1h-10zM0 5h9v1h-9zM6 6h2v1h-2zM6 7h1v1h-1z"/></svg></button></div>'),
        (n.querySelector(".cm").textContent = s.t),
        (n.hidden = !1),
        (n.style.animation = "none"),
        n.offsetWidth,
        (n.style.animation = ""),
        (function (e) {
          if (!c.matches) return;
          n.style.left = n.style.top = "";
          const t = o.offsetWidth,
            s = o.offsetHeight,
            a = n.offsetWidth,
            i = n.offsetHeight;
          let l = Math.min(t - a - 8, Math.max(8, e.offsetLeft - 20)),
            r = e.offsetTop + 28;
          (r + i > s + 40 && (r = Math.max(8, e.offsetTop - i - 28)),
            (n.style.left = l + "px"),
            (n.style.top = r + "px"));
        })(a));
    }
    function u() {
      const e = document.getElementById("mmar");
      (e && e.classList.add("away"),
        (l = -1),
        r.forEach((e) => e.setAttribute("aria-expanded", "false")),
        (n.style.left = n.style.top = ""),
        (n.innerHTML =
          '<p class="cmt">ALL CLEAR</p><p class="cm">every thread resolved.<br><b>current status:</b> going outside to touch grass.</p><div class="cmf"><button class="mini p" type="button" data-a="o">Reopen all</button></div>'),
        (n.hidden = !1),
        c.matches &&
          ((n.style.left = "50%"),
          (n.style.top = "40%"),
          (n.style.translate = "-50% 0")));
    }
    (d(),
      a.addEventListener("click", (e) => {
        const t = e.target.closest(".pin");
        if (t) {
          const e = +t.dataset.i;
          l !== e || n.hidden ? h(e) : p();
        }
      }),
      n.addEventListener("click", (t) => {
        const s = t.target.closest("button");
        if (!s) return;
        if (s.classList.contains("x")) return p();
        const a = s.dataset.a;
        if ("r" === a) {
          const t = l;
          (i.add(t),
            r[t].classList.add("rs"),
            d(),
            p(),
            i.size === e.length && u());
        } else if ("n" === a)
          !(function () {
            for (let t = 1; t <= e.length; t++) {
              const s = (l + t + e.length) % e.length;
              if (!i.has(s)) return void h(s);
            }
            u();
          })();
        else if ("o" === a) {
          const e = document.getElementById("mmar");
          (e && e.classList.remove("away"),
            i.clear(),
            r.forEach((e) => e.classList.remove("rs")),
            (n.style.translate = ""),
            d(),
            p());
        }
      }),
      addEventListener("keydown", (e) => {
        "Escape" !== e.key || n.hidden || p();
      }));
  })(),
  (function () {
    const e = [
        "#FFDBB4",
        "#E8B98A",
        "#C68642",
        "#8D5524",
        "#5C3A21",
        "#3B2416",
        "#A8693A",
      ],
      t = [
        "#1B1410",
        "#4A2C17",
        "#8A3B12",
        "#E1B44C",
        "#3B6BFF",
        "#E15B0F",
        "#B8379A",
      ],
      s = [
        "#E15B0F",
        "#3B6BFF",
        "#2DA44E",
        "#F4F1EA",
        "#B8379A",
        "#1C160E",
        "theme",
      ],
      a = {
        bald: [],
        fade: [
          [4, 2, 8, 2],
          [4, 4, 1, 1],
          [11, 4, 1, 1],
        ],
        afro: [
          [3, 0, 10, 5],
          [2, 1, 12, 3],
          [3, 5, 1, 2],
          [12, 5, 1, 2],
        ],
        puffs: [
          [4, 2, 8, 2],
          [2, 0, 4, 3],
          [10, 0, 4, 3],
        ],
        locs: [
          [5, 1, 6, 1],
          [4, 2, 8, 2],
          [3, 3, 10, 1],
          [2, 4, 2, 4],
          [3, 8, 1, 2],
          [2, 8, 1, 1],
          [12, 4, 2, 4],
          [12, 8, 1, 2],
          [13, 8, 1, 1],
          [5, 4, 1, 1],
          [10, 4, 1, 1],
        ],
        cap: [
          [4, 2, 8, 2],
          [3, 4, 10, 1],
        ],
      },
      n = [
        [4, 8, 2, 1],
        [10, 8, 2, 1],
        [4, 9, 8, 1],
      ],
      o = {
        none: [],
        both: [
          [5, 4, 2, 1],
          [9, 4, 2, 1],
          [4, 5, 1, 2],
          [11, 5, 1, 2],
          [7, 5, 2, 1],
        ],
        glasses: [
          [4, 4, 4, 1],
          [4, 7, 4, 1],
          [4, 5, 1, 2],
          [7, 5, 1, 2],
          [8, 4, 4, 1],
          [8, 7, 4, 1],
          [8, 5, 1, 2],
          [11, 5, 1, 2],
        ],
        phones: [
          [3, 1, 10, 1],
          [3, 2, 1, 4],
          [12, 2, 1, 4],
          [2, 5, 2, 3],
          [12, 5, 2, 3],
        ],
        chain: [
          [6, 10, 4, 1],
          [7, 11, 2, 1],
        ],
      },
      i = [
        ["Skin", "sk", e],
        ["Hair", "hs", Object.keys(a)],
        ["Hair colour", "hc", t],
        ["Outfit", "oc", s],
        ["Extra", "ac", Object.keys(o)],
      ],
      c = (e) => document.getElementById(e),
      l = c("chv"),
      r = c("chs"),
      d = matchMedia("(prefers-reduced-motion:reduce)"),
      p = (e) => Math.floor(Math.random() * e),
      h = { sk: 6, hs: "fade", hc: 0, oc: 1, ac: "phones" };
    let u = { sk: 2, hs: "afro", hc: 0, oc: 0, ac: "glasses" },
      m = 0;
    try {
      ((m = !localStorage.io_ch),
        Object.assign(u, JSON.parse(localStorage.io_ch || "{}")));
    } catch (e) {}
    const f = [
      Object.assign({ n: "Mario" }, h),
      { n: "Ada", sk: 3, hs: "afro", hc: 0, oc: 0, ac: "glasses" },
      { n: "Tunde", sk: 4, hs: "fade", hc: 0, oc: 1, ac: "chain" },
      { n: "Zee", sk: 2, hs: "puffs", hc: 1, oc: 4, ac: "phones" },
      { n: "Kay", sk: 5, hs: "locs", hc: 0, oc: 2, ac: "none" },
      { n: "Moss", sk: 0, hs: "bald", hc: 0, oc: 3, ac: "phones" },
    ];
    (m && Object.assign(u, h), (window.PRE = f));
    const v = (e, t) =>
      e
        .map(
          ([e, s, a, n]) =>
            '<rect x="' +
            e +
            '" y="' +
            s +
            '" width="' +
            a +
            '" height="' +
            n +
            '" fill="' +
            t +
            '"/>',
        )
        .join("");
    function g(i, c, l) {
      const r = e[u.sk] || e[2],
        d = ("theme" === s[u.oc] ? window.__acc || "#E15B0F" : s[u.oc]) || s[0],
        p = "#1C160E",
        h = ((i[0] || 0) + 1) / 2,
        m = ((i[1] || 0) + 1) / 2,
        f = c
          ? v(
              [
                [5, 6, 2, 1],
                [9, 6, 2, 1],
              ],
              p,
            )
          : v(
              [
                [5, 5, 2, 2],
                [9, 5, 2, 2],
              ],
              "#fff",
            ) +
            v(
              [
                [5 + h, 5 + m, 1, 1],
                [9 + h, 5 + m, 1, 1],
              ],
              p,
            );
      return (
        v(
          [
            [4, 4, 8, 5],
            [5, 3, 6, 1],
            [5, 9, 6, 1],
            [3, 6, 1, 2],
            [12, 6, 1, 2],
          ],
          r,
        ) +
        v(
          l
            ? [
                [4, 10, 8, 4],
                [3, 10, 1, 3],
              ]
            : [
                [4, 10, 8, 4],
                [3, 10, 1, 3],
                [12, 10, 1, 3],
              ],
          d,
        ) +
        v(
          l
            ? [
                [3, 13, 1, 1],
                [7, 10, 2, 1],
              ]
            : [
                [3, 13, 1, 1],
                [12, 13, 1, 1],
                [7, 10, 2, 1],
              ],
          r,
        ) +
        (l
          ? '<g class="wv">' +
            v([[12, 7, 1, 4]], d) +
            v([[12, 5, 2, 2]], r) +
            "</g>"
          : "") +
        v(
          [
            [5, 14, 2, 2],
            [9, 14, 2, 2],
          ],
          p,
        ) +
        f +
        v([[7, 8, 2, 1]], p) +
        v(a[u.hs] || [], "cap" === u.hs ? d : t[u.hc]) +
        ("locs" === u.hs
          ? v(
              [
                [2, 5, 1, 1],
                [3, 6, 1, 1],
                [3, 9, 1, 1],
                [13, 5, 1, 1],
                [12, 6, 1, 1],
                [12, 9, 1, 1],
                [6, 2, 1, 1],
                [9, 2, 1, 1],
              ],
              "rgba(255,255,255,.22)",
            )
          : "") +
        ("both" === u.ac ? v(n, t[u.hc]) : "") +
        v(
          o[
            "phones" !== u.ac ||
            6 !== u.sk ||
            "fade" !== u.hs ||
            0 !== u.hc ||
            1 !== u.oc ||
            (window.__np && window.__np.playing)
              ? u.ac
              : "none"
          ] || [],
          "glasses" === u.ac
            ? p
            : "both" === u.ac
              ? "#3B3B42"
              : "chain" === u.ac
                ? "#F2B04B"
                : "#E15B0F",
        )
      );
    }
    let y = [0, 0],
      w = 0;
    window.PX = {
      MARIO: h,
      reset: () => {
        ((u = Object.assign({}, u, h)), E(), x(r));
      },
      mario: (e, t) => {
        const s = u;
        u = Object.assign({}, s, h);
        const a = g(e || [0, 0], t ? 1 : 0, 0);
        return ((u = s), a);
      },
      bl: () => w,
      inner: (e, t) => g(e || [1, 0], t ? 1 : 0),
      thumb: (e) => {
        const t = u;
        u = Object.assign({}, t, e);
        const s =
          '<svg viewBox="2 0 12 12" aria-hidden="true">' +
          g([1, 0], 0) +
          "</svg>";
        return ((u = t), s);
      },
      set: (e) => {
        ((u = Object.assign({}, u, e)), E());
      },
      cur: () => u,
      svg: () =>
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">' +
        g([1, 0], 0) +
        "</svg>",
    };
    const b = () => {
      l.innerHTML = g(y, w);
    };
    function E(e) {
      (b(),
        (c("chp").innerHTML = i
          .map(
            ([e, t, s]) =>
              '<div class="cg"><span class="px">' +
              e +
              "</span>" +
              ("#" === s[0][0]
                ? '<div class="chps">' +
                  s
                    .map(
                      (s, a) =>
                        '<button class="chip" type="button" data-k="' +
                        t +
                        '" data-v="' +
                        a +
                        '" style="--c:' +
                        ("theme" === s ? "var(--or)" : s) +
                        '"' +
                        ("theme" === s
                          ? ' data-tm="1" title="Matches your theme colour"'
                          : "") +
                        ' aria-label="' +
                        e +
                        " " +
                        ("theme" === s ? "theme colour" : a + 1) +
                        '" aria-pressed="' +
                        (u[t] === a) +
                        '"></button>',
                    )
                    .join("") +
                  "</div>"
                : '<div class="stp"><button type="button" data-k="' +
                  t +
                  '" data-d="-1" aria-label="Previous ' +
                  e +
                  '">◀</button><b class="px">' +
                  u[t] +
                  '</b><button type="button" data-k="' +
                  t +
                  '" data-d="1" aria-label="Next ' +
                  e +
                  '">▶</button></div>') +
              "</div>",
          )
          .join("")),
        e ||
          (function () {
            try {
              localStorage.io_ch = JSON.stringify(u);
            } catch (e) {}
          })(),
        document.dispatchEvent(
          new CustomEvent("px:update", { detail: { spin: !!e } }),
        ),
        T && (T.innerHTML = O()));
    }
    c("chp").addEventListener("click", (e) => {
      const t = e.target.closest("button");
      if (!t) return;
      const s = t.dataset.k;
      if (t.dataset.d) {
        const e = i.find((e) => e[1] === s)[2],
          a = e.indexOf(u[s]);
        u[s] = e[(a + +t.dataset.d + e.length) % e.length];
      } else u[s] = +t.dataset.v;
      E();
    });
    let L = !1;
    const k = () => {
      if (L) return;
      const n = {
        sk: p(e.length),
        hs: Object.keys(a)[p(Object.keys(a).length)],
        hc: p(t.length),
        oc: p(s.length),
        ac: Object.keys(o)[p(Object.keys(o).length)],
      };
      if (d.matches) return ((u = n), E(), void x(r));
      const i = ["sk", "hs", "hc", "oc", "ac"],
        c = {
          sk: e.map((e, t) => t),
          hs: Object.keys(a),
          hc: t.map((e, t) => t),
          oc: s.map((e, t) => t),
          ac: Object.keys(o),
        },
        l = r.querySelector(".chn"),
        h = l.textContent,
        m = performance.now(),
        f = 700 + 380 * i.length;
      ((L = !0),
        r.classList.add("rolling"),
        (l.textContent = "SPINNING..."),
        document.querySelectorAll("#chr,#avs").forEach((e) => {
          (e.classList.remove("pull"), e.offsetWidth, e.classList.add("pull"));
        }));
      const v = () => {
        const e = performance.now() - m;
        (i.forEach((t, s) => {
          u[t] = e >= 700 + 380 * s ? n[t] : c[t][p(c[t].length)];
        }),
          e < f
            ? (E(!0), setTimeout(v, 60 + 0.12 * Math.max(0, e - 900)))
            : ((u = Object.assign({}, n)),
              E(),
              (L = !1),
              r.classList.remove("rolling"),
              x(r),
              (l.textContent = "JACKPOT!"),
              l.classList.add("jp"),
              setTimeout(() => {
                ((l.textContent = h), l.classList.remove("jp"));
              }, 1100),
              document
                .querySelectorAll("#chr,#avs")
                .forEach((e) => e.classList.remove("pull"))));
      };
      v();
    };
    function x(e) {
      (e.classList.remove("hop"), e.offsetWidth, e.classList.add("hop"));
    }
    ((c("chr").onclick = k),
      (window.PX.shuffle = k),
      r.addEventListener("click", () => x(r)),
      setInterval(() => {
        ((w = 1),
          b(),
          document.dispatchEvent(new Event("px:blink")),
          setTimeout(() => {
            ((w = 0), b(), document.dispatchEvent(new Event("px:blink")));
          }, 130));
      }, 3400));
    const C = (e, t) => (Math.abs(e) < t ? 0 : e > 0 ? 1 : -1),
      S = (e) =>
        document.dispatchEvent(
          new CustomEvent("px:ptr", {
            detail: {
              x: e.clientX,
              y: e.clientY,
              touch: "touch" === e.pointerType || "pen" === e.pointerType,
            },
          }),
        );
    (document.addEventListener("pointermove", S, { passive: !0 }),
      document.addEventListener("pointerdown", S, !0));
    let A = 0;
    document.addEventListener("px:ptr", (e) => {
      const t = e.detail,
        s = l.getBoundingClientRect(),
        a = [
          C(t.x - (s.left + s.width / 2), 24),
          C(t.y - (s.top + s.height / 2), 24),
        ];
      ((a[0] === y[0] && a[1] === y[1]) || ((y = a), b()),
        T && !t.touch && ((F = t.x + 22), (D = t.y + 8)),
        clearTimeout(A),
        t.touch &&
          (A = setTimeout(() => {
            ((y = [0, 0]), b());
          }, 3e3)));
    });
    let T = null,
      M = 0,
      B = 0,
      F = 0,
      D = 0,
      P = 1,
      I = 0,
      j = "0";
    const O = () =>
      '<svg viewBox="0 0 16 16" aria-hidden="true">' +
      g((T && T.look) || [0, 0], 0) +
      "</svg>";
    function H(e) {
      const t = F - M;
      ((M += 0.075 * t),
        (B += 0.075 * (D - B)),
        Math.abs(t) > 5 && (P = t < 0 ? -1 : 1));
      const s =
          Math.abs(t) > 6 && !d.matches ? -5 * Math.abs(Math.sin(e / 110)) : 0,
        a = C(t, 8) + "";
      (a !== j && ((j = a), (T.look = [+a, 0]), (T.innerHTML = O())),
        (T.style.transform =
          "translate(" + (M - 26) + "px," + (B + s) + "px) scaleX(" + P + ")"),
        (I = requestAnimationFrame(H)));
    }
    ((c("chf").onclick = function () {
      const e = !T;
      if (
        (this.setAttribute("aria-pressed", e),
        (this.textContent = e ? "Put it back" : "Take it with you"),
        e)
      ) {
        ((T = document.createElement("div")),
          (T.className = "chm in"),
          (T.look = [0, 0]),
          (T.innerHTML = O()),
          document.body.appendChild(T));
        const e = r.getBoundingClientRect();
        ((M = F = e.left + e.width / 2),
          (B = D = e.top + e.height / 2 - 20),
          r.classList.add("out"),
          (I = requestAnimationFrame(H)));
        const t = T;
        setTimeout(() => t.classList.remove("in"), 760);
      } else {
        const e = T,
          t = r.getBoundingClientRect();
        ((F = t.left + t.width / 2),
          (D = t.top + t.height / 2 - 20),
          e.classList.remove("in"),
          e.classList.add("bk"),
          setTimeout(() => {
            (r.classList.remove("out"), x(r));
          }, 380),
          setTimeout(() => {
            T === e && (cancelAnimationFrame(I), e.remove(), (T = null));
          }, 560));
      }
    }),
      document.addEventListener("pointerdown", (e) => {
        T && ((F = e.clientX + 22), (D = e.clientY + 8), x(T));
      }));
    let R = "";
    (document.addEventListener("px:accent", () => {
      window.__acc !== R && ((R = window.__acc), "theme" === s[u.oc] && E(!0));
    }),
      document.addEventListener("np:update", () => E(!0)),
      E());
  })(),
  (function () {
    const e = "olurotimii",
      t = (e) => document.getElementById(e),
      s = (e) =>
        String(e).replace(
          /[&<>"]/g,
          (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e],
        ),
      a = t("igg"),
      n = t("igl"),
      o = t("igs"),
      i = (e) => "<i>IG·" + String(e + 1).padStart(2, "0") + "</i>",
      c = [
        {
          u: "https://www.instagram.com/reel/DKOYQynKzPR/",
          i: "assets/gram/post-0.webp",
          a: "Guess what just dropped?! 🎉 \n\nOur brand-spanking-new REBRAND 3D Wallpapers are officially ",
          c: "Guess what just dropped?! 🎉 \n\nOur brand-spanking-new REBRAND 3D Wallpapers are officially here, and they're going to make your phone and computer screens look absolutely incredible.\n\nThese wallpapers are more than just decorative - they're ",
          id: "18052666592358779",
        },
        {
          u: "https://www.instagram.com/reel/DKOWpZuqZZc/",
          i: "assets/gram/post-1.webp",
          a: "A truly effective brand strategy resonates with its audience, it doesn't just state its mi",
          c: "A truly effective brand strategy resonates with its audience, it doesn't just state its mission.\n\nWant a brand that connects with your target audience? Reach out ↙️ @rebrandthebrand and let's build something truly amazing together. 💥✨",
          id: "18068320807966635",
        },
        {
          u: "https://www.instagram.com/reel/C6vRMNXo_WY/",
          i: "assets/gram/post-2.webp",
          a: "Sometimes, we forget to live a little.. even when the essence of life in itself is about l",
          c: "Sometimes, we forget to live a little.. even when the essence of life in itself is about living.\n\n#fun #reels #sunset #live #pool #garden #nature #shoot #edit #monologue #viral #explore #life #lifestyle #monologue",
          id: "17928789938855051",
        },
        {
          u: "https://www.instagram.com/p/C6bCofKinBi/",
          i: "assets/gram/post-3.webp",
          a: "Happy May 🌤️",
          c: "Happy May 🌤️",
          id: "17902633721971074",
        },
        {
          u: "https://www.instagram.com/reel/C5atc9Cokvc/",
          i: "assets/gram/post-4.webp",
          a: "Designing at night just hits different 💆🏾‍♂️\n\nI had fun making this and I hope you have ju",
          c: "Designing at night just hits different 💆🏾‍♂️\n\nI had fun making this and I hope you have just as much fun watching✨\n\n#design #branding #logo #edit #film #reels #viral",
          id: "17980068266665860",
        },
      ];
    let l = c.slice(),
      r = c.slice(0, 6),
      d = 0,
      p = null,
      h = 0;
    ((a.innerHTML = Array.from(
      { length: 6 },
      (e, t) => '<div class="ph" aria-hidden="true">' + i(t) + "</div>",
    ).join("")),
      (n.href = "https://www.instagram.com/" + e),
      (n.textContent = "Follow @" + e + " ↗"),
      (n.hidden = !1));
    const u = () => {
      a.innerHTML = r
        .map(
          (e, t) =>
            '<a draggable="true" href="' +
            s(e.u) +
            '" data-i="' +
            t +
            '" target="_blank" rel="noopener" aria-label="View post: ' +
            s(e.a) +
            '">' +
            i(t) +
            '<img src="' +
            s(e.i) +
            '" alt="' +
            s(e.a) +
            '" loading="lazy" decoding="async" draggable="false"></a>',
        )
        .join("");
    };
    (u(), (o.hidden = l.length < 2));
    const m = document.createElement("p");
    ((m.className = "igstatus"),
      m.setAttribute("role", "status"),
      (m.textContent = "Saved posts. Open Instagram for the latest."),
      a.parentNode.insertBefore(m, a),
      a.addEventListener(
        "error",
        (e) => {
          const t = e.target;
          if ("IMG" !== t.tagName) return;
          const s = r[+t.closest("a[data-i]").dataset.i],
            a = c.find((e) => e.u === s.u);
          a && !t.src.endsWith(a.i)
            ? ((t.src = a.i), (s.i = a.i))
            : ((t.hidden = !0),
              t.parentNode.appendChild(
                Object.assign(document.createElement("span"), {
                  textContent: "Open post on Instagram",
                }),
              ));
        },
        !0,
      ));
    let f = -1;
    (a.addEventListener("dragstart", (e) => {
      const t = e.target.closest("a[data-i]");
      if (t) {
        ((f = +t.dataset.i),
          t.classList.add("dg"),
          a.parentNode.classList.add("swp"),
          (e.dataTransfer.effectAllowed = "move"));
        try {
          e.dataTransfer.setData("text/plain", String(f));
        } catch (e) {}
      }
    }),
      a.addEventListener("dragover", (e) => {
        const t = e.target.closest("a[data-i]");
        t &&
          f >= 0 &&
          (e.preventDefault(),
          a
            .querySelectorAll(".ov")
            .forEach((e) => e !== t && e.classList.remove("ov")),
          t.classList.add("ov"));
      }),
      a.addEventListener("dragend", () => {
        ((f = -1),
          a
            .querySelectorAll(".dg,.ov")
            .forEach((e) => e.classList.remove("dg", "ov")),
          a.parentNode.classList.remove("swp"));
      }),
      a.addEventListener("drop", (e) => {
        const t = e.target.closest("a[data-i]");
        if (!t || f < 0) return;
        e.preventDefault();
        const s = +t.dataset.i;
        (s !== f &&
          (([r[f], r[s]] = [r[s], r[f]]),
          u(),
          a.classList.remove("sh"),
          a.offsetWidth,
          a.classList.add("sh")),
          (f = -1));
      }));
    const v = t("pl-igp"),
      g = v.querySelector("img"),
      y = v.querySelector("figcaption"),
      w = v.querySelector(".igp a"),
      b = v.querySelector(".igx"),
      E = v.querySelector(".lab"),
      L = () => v.classList.contains("show");
    function k(e, t) {
      if (!r.length) return;
      d = (e + r.length) % r.length;
      const s = r[d];
      ((g.src = s.i),
        (g.alt = s.a),
        (y.textContent = s.c),
        (w.href = s.u),
        (E.textContent = "Polaroid · IG·" + String(d + 1).padStart(2, "0")),
        L() ||
          ((p = document.activeElement),
          H.classList.contains("cv")
            ? (mvT(v, 0, 0),
              (function (e) {
                const t = cv.getBoundingClientRect(),
                  s = cv.offsetWidth,
                  a = (e.closest(".frame") || e).getBoundingClientRect(),
                  n = e.getBoundingClientRect();
                let o = (a.right - t.left) / Z + 28;
                (o + 400 > s - 12 &&
                  ((o = (a.left - t.left) / Z - 400 - 28),
                  o < 12 && (o = (n.left + n.width / 2 - t.left) / Z - 200)),
                  (o = Math.max(12, Math.min(s - 400 - 12, o))));
                let i =
                  (Math.max(
                    72,
                    Math.min(n.top - 40, innerHeight - 560 * Z - 24),
                  ) -
                    t.top) /
                  Z;
                ((i = Math.max(8, Math.min(i, cv.offsetHeight - 560 - 8))),
                  v.style.setProperty("--ix", o + "px"),
                  v.style.setProperty("--iy", i + "px"));
              })(t || a))
            : (document.body.style.overflow = "hidden"),
          v.classList.add("show"),
          sync(),
          b.focus({ preventScroll: !0 })));
    }
    function x() {
      L() &&
        (v.classList.remove("show"),
        (document.body.style.overflow = ""),
        mvT(v, 0, 0),
        sync(),
        p && p.focus && p.focus({ preventScroll: !0 }));
    }
    (a.addEventListener("click", (e) => {
      const t = e.target.closest("a[data-i]");
      t && (e.preventDefault(), k(+t.dataset.i, t));
    }),
      v.addEventListener("click", (e) => {
        if (e.target.closest("[data-x]")) return x();
        const t = e.target.closest("[data-n]");
        t && k(d + +t.dataset.n);
      }),
      v.addEventListener(
        "touchstart",
        (e) => {
          h = e.changedTouches[0].clientX;
        },
        { passive: !0 },
      ),
      v.addEventListener(
        "touchend",
        (e) => {
          const t = e.changedTouches[0].clientX - h;
          Math.abs(t) > 50 && k(d + (t < 0 ? 1 : -1));
        },
        { passive: !0 },
      ),
      document.addEventListener("keydown", (e) => {
        L() &&
          !/INPUT|TEXTAREA/.test(document.activeElement.tagName) &&
          ("Escape" === e.key
            ? x()
            : "ArrowRight" === e.key
              ? k(d + 1)
              : "ArrowLeft" === e.key && k(d - 1));
      }),
      mq.addEventListener("change", x),
      o.addEventListener("click", () => {
        if (l.length < 2) return;
        const e = l.slice();
        for (let t = e.length - 1; t > 0; t--) {
          const s = Math.floor(Math.random() * (t + 1));
          [e[t], e[s]] = [e[s], e[t]];
        }
        ((r = e.slice(0, 6)),
          a.classList.remove("sh"),
          a.offsetWidth,
          a.classList.add("sh"),
          u(),
          a
            .querySelectorAll("a")
            .forEach((e) =>
              e.style.setProperty(
                "--t",
                (6 * Math.random() - 3).toFixed(1) + "deg",
              ),
            ),
          (a.scrollLeft = 0));
      }),
      fetch("https://feeds.behold.so/VJFSIcsBoPsWxsIx0r47", {
        signal: AbortSignal.timeout(8e3),
      })
        .then((e) => (e.ok ? e.json() : Promise.reject()))
        .then((e) => {
          const t = e.posts || e;
          if (!Array.isArray(t)) throw new Error("Unavailable feed");
          const s = t
            .map((e) => ({
              u: e.permalink || e.url,
              i:
                (e.sizes && e.sizes.medium && e.sizes.medium.mediaUrl) ||
                e.thumbnailUrl ||
                e.mediaUrl ||
                e.img,
              a: (e.caption || e.alt || "Instagram post").slice(0, 90),
              c: (e.caption || e.alt || "").slice(0, 240),
            }))
            .filter((e) => e.u && e.i)
            .slice(0, 12);
          if (!s.length) throw new Error("Empty feed");
          ((l = s),
            (r = l.slice(0, 6)),
            u(),
            (o.hidden = l.length < 2),
            (m.hidden = !0));
        })
        .catch(() => {}));
  })(),
  (function () {
    const e = (e) => document.getElementById(e),
      t = e("pgc"),
      s = t.getContext("2d"),
      a = 640,
      n = 400,
      o = matchMedia("(prefers-reduced-motion:reduce)");
    ((t.width = a), (t.height = n));
    const i = (e) => {
        const t = new Image();
        return (
          (t.src = "data:image/svg+xml;utf8," + encodeURIComponent(e)),
          t
        );
      },
      c = (e, t) =>
        e
          .map(
            ([e, s, a, n]) =>
              '<rect x="' +
              e +
              '" y="' +
              s +
              '" width="' +
              a +
              '" height="' +
              n +
              '" fill="' +
              t +
              '"/>',
          )
          .join(""),
      l = i(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">' +
          c(
            [
              [5, 2, 6, 1],
              [4, 3, 8, 10],
              [3, 5, 10, 7],
              [3, 12, 2, 2],
              [7, 12, 2, 2],
              [11, 12, 2, 2],
            ],
            "#F4F1EA",
          ) +
          c(
            [
              [5, 6, 2, 3],
              [9, 6, 2, 3],
              [6, 11, 4, 1],
            ],
            "#1C160E",
          ) +
          "</svg>",
      );
    let r = i(PX.svg());
    document.addEventListener("px:update", () => (r = i(PX.svg())));
    let d,
      p,
      h,
      u,
      m = !1,
      f = 0,
      v = 0,
      g = 0,
      y = "idle",
      w = {},
      b = null,
      E = 0,
      L = 0,
      k = [],
      x = [],
      C = !0,
      S = null,
      A = 0,
      T = "";
    const M = (e, t, s) => Math.max(t, Math.min(s, e)),
      B = (e, t) =>
        document.querySelectorAll("#ctl kbd[data-k]").forEach((s) => {
          (void 0 !== e && s.dataset.k !== e) || s.classList.toggle("dn", !!t);
        });
    function F(e) {
      ((d = 200),
        (p = 200),
        e && (u = [0, 0]),
        (h = { x: 320, y: 200, vx: 0, vy: 0, sp: 300 }),
        (k = []));
    }
    function D(e) {
      const s = 0.8 * (Math.random() - 0.5),
        a = f ? 380 : 300;
      ((h = {
        x: 320,
        y: 200,
        sp: a,
        vx: Math.cos(s) * a * e,
        vy: Math.sin(s) * a,
      }),
        (y = "play"),
        (A = 0),
        (T = ""),
        (t.style.touchAction = "none"));
    }
    function P(e, t) {
      if (S)
        try {
          const s = S.createOscillator(),
            a = S.createGain();
          ((s.type = "square"),
            (s.frequency.value = e),
            (a.gain.value = 0.05),
            s.connect(a),
            a.connect(S.destination),
            s.start(),
            a.gain.exponentialRampToValueAtTime(0.001, S.currentTime + t),
            s.stop(S.currentTime + t));
        } catch (e) {}
    }
    function I(e, t, s) {
      if (!o.matches)
        for (let a = 0; a < 10; a++) {
          const a = 6.28 * Math.random(),
            n = 80 + 180 * Math.random();
          x.push({
            x: e,
            y: t,
            vx: Math.cos(a) * n,
            vy: Math.sin(a) * n,
            l: 0.5,
            c: s,
          });
        }
    }
    function j(e) {
      const t = e < 0 ? d : p,
        s = 0.95 * M((h.y - t) / 30, -1, 1);
      ((h.sp = Math.min(h.sp * (f ? 1.09 : 1.07), f ? 880 : 720)),
        (h.vx = Math.cos(s) * h.sp * -e),
        (h.vy = Math.sin(s) * h.sp),
        (h.x = e < 0 ? 122 : 518),
        A++,
        A > v && (v = A),
        (E = (Math.random() - 0.5) * (f ? 22 : 56)),
        I(h.x, h.y, "#E15B0F"),
        P(e < 0 ? 520 : 380, 0.07),
        (L = 3));
    }
    function O(s) {
      (u[s]++,
        (L = 9),
        P(s ? 160 : 760, 0.25),
        I(h.x < 0 ? 8 : 632, h.y, s ? "#F4F1EA" : "#2DA44E"),
        u[s] >= 7
          ? ((y = "over"),
            (T = s ? "THE CLIENT WINS.|Revision 2?" : "YOU WIN!|Ship it."),
            (t.style.touchAction = "pan-y"),
            (function () {
              const t = V(u[0], u[1], v, f);
              if (((J = t), !(t <= 0))) {
                e("subs").textContent = "SCORE " + t;
                try {
                  e("subi").value = localStorage.io_in || "";
                } catch (e) {}
                ((Z.hidden = !1), setTimeout(() => e("subi").focus(), 50));
              }
            })())
          : ((y = "wait"),
            (T = ""),
            F(0),
            setTimeout(() => {
              "wait" === y && D(s ? 1 : -1);
            }, 800)));
    }
    F(1);
    let H = 0;
    function R() {
      ("idle" !== y && "over" !== y) ||
        (F(1),
        (v = 0),
        (g = performance.now()),
        (Z.hidden = !0),
        D(Math.random() < 0.5 ? -1 : 1));
    }
    (requestAnimationFrame(function e(t) {
      const i = Math.min(0.033, (t - H) / 1e3 || 0);
      ((H = t),
        C &&
          m &&
          ((function (e) {
            let t = w.d || 0;
            if (
              (t
                ? ((d += 360 * t * e), (b = null))
                : null !== b && (d += M(b - d, -640 * e, 640 * e)),
              (d = M(d, 30, 370)),
              "play" === y)
            ) {
              const t = h.vx > 0 ? h.y + E : 200,
                s = (f ? 320 : 230) + u[0] * (f ? 30 : 22);
              ((p += M(t - p, -s * e, s * e)),
                (p = M(p, 30, 370)),
                (h.x += h.vx * e),
                (h.y += h.vy * e),
                k.push([h.x, h.y]),
                k.length > 7 && k.shift(),
                h.y < 7 && ((h.y = 7), (h.vy = Math.abs(h.vy)), P(300, 0.04)),
                h.y > 393 &&
                  ((h.y = 393), (h.vy = -Math.abs(h.vy)), P(300, 0.04)),
                h.vx < 0 &&
                h.x <= 122 &&
                h.x >= 100 &&
                Math.abs(h.y - d) <= 6 + (f ? 22 : 30)
                  ? j(-1)
                  : h.vx > 0 &&
                    h.x >= 518 &&
                    h.x <= 540 &&
                    Math.abs(h.y - p) <= 36 &&
                    j(1),
                h.x < -12 ? O(1) : h.x > 652 && O(0));
            }
            (x.forEach((t) => {
              ((t.x += t.vx * e), (t.y += t.vy * e), (t.l -= e));
            }),
              (x = x.filter((e) => e.l > 0)),
              (L = Math.max(0, L - 30 * e)));
          })(i),
          (function (e) {
            (s.save(),
              (s.fillStyle = "#141414"),
              s.fillRect(0, 0, a, n),
              L &&
                !o.matches &&
                s.translate(
                  (Math.random() - 0.5) * L,
                  (Math.random() - 0.5) * L,
                ),
              (s.fillStyle = "#ffffff10"));
            for (let e = 0; e < a; e += 16)
              for (let t = 0; t < n; t += 16) s.fillRect(e, t, 2, 2);
            s.fillStyle = "#ffffff30";
            for (let e = 8; e < n; e += 24) s.fillRect(318, e, 4, 12);
            ((s.fillStyle = "#ffffff"),
              (s.font = "32px Silkscreen,monospace"),
              (s.textAlign = "center"),
              s.fillText(u[0], 260, 50),
              s.fillText(u[1], 380, 50),
              (s.font = "10px Silkscreen,monospace"),
              (s.fillStyle = "#ffffff77"),
              s.fillText("YOU", 260, 68),
              s.fillText("THE CLIENT", 380, 68),
              (s.imageSmoothingEnabled = !1),
              s.drawImage(r, 34, d - 32, 64, 64),
              s.drawImage(l, 542, p - 32, 64, 64),
              (s.fillStyle = "#E15B0F"));
            const t = f ? 22 : 30;
            if (
              (s.fillRect(104, d - t, 8, 2 * t),
              (s.fillStyle = "#FFB37A"),
              s.fillRect(104, d - t, 3, 2 * t),
              (s.fillStyle = "#F4F1EA"),
              s.fillRect(528, p - 36, 8, 72),
              k.forEach((e, t) => {
                ((s.fillStyle = "rgba(225,91,15," + (t / k.length) * 0.5 + ")"),
                  s.fillRect(e[0] - 4, e[1] - 4, 8, 8));
              }),
              (s.fillStyle = "#fff"),
              s.fillRect(h.x - 6, h.y - 6, 12, 12),
              (s.fillStyle = "#E15B0F"),
              s.fillRect(h.x - 3, h.y - 3, 6, 6),
              x.forEach((e) => {
                ((s.fillStyle = e.c), s.fillRect(e.x, e.y, 4, 4));
              }),
              s.restore(),
              f &&
                ((s.font = "10px Silkscreen,monospace"),
                (s.textAlign = "left"),
                (s.fillStyle = "#FF4D6D"),
                s.fillText("HARD x2", 12, 20)),
              (s.textAlign = "center"),
              (s.fillStyle = "#fff"),
              "idle" === y || "over" === y)
            ) {
              ((s.fillStyle = "#14141499"),
                s.fillRect(0, 148, a, 104),
                (s.fillStyle = "#fff"),
                (s.font = "22px Silkscreen,monospace"));
              const t = (T || "PIXEL PONG").split("|");
              (s.fillText(t[0], 320, 188),
                (s.font = "11px Silkscreen,monospace"),
                (s.fillStyle = "#E15B0F"),
                (Math.floor(e / 500) % 2 || o.matches) &&
                  s.fillText(
                    (t[1] ? t[1] + "  ·  " : "") + "TAP OR PRESS SPACE",
                    320,
                    222,
                  ));
            }
          })(t)),
        requestAnimationFrame(e));
    }),
      new IntersectionObserver((e) => {
        ((C = e[0].isIntersecting), C && !Q && re());
      }).observe(t),
      t.addEventListener("pointerdown", (e) => {
        (R(), q(e));
      }));
    const q = (e) => {
      const s = t.getBoundingClientRect();
      b = ((e.clientY - s.top) / s.height) * n;
    };
    (t.addEventListener("pointermove", q),
      addEventListener("keydown", (e) => {
        if (!m) return;
        const s = e.key.toLowerCase();
        if (
          /INPUT|TEXTAREA/.test(document.activeElement.tagName) ||
          ("BUTTON" === document.activeElement.tagName && " " === s)
        )
          return;
        const a = t.getBoundingClientRect();
        a.bottom < 0 ||
          a.top > innerHeight ||
          (B(s, 1),
          ("w" !== s && "arrowup" !== s) || ((w.d = -1), e.preventDefault()),
          ("s" !== s && "arrowdown" !== s) || ((w.d = 1), e.preventDefault()),
          " " === s && (R(), e.preventDefault()));
      }),
      addEventListener("keyup", (e) => {
        if (!m) return;
        const t = e.key.toLowerCase();
        (B(t, 0), ["w", "s", "arrowup", "arrowdown"].includes(t) && (w.d = 0));
      }));
    const N =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/></svg>',
      z = e("pgs");
    ((z.innerHTML = N),
      (z.onclick = () => {
        const e = "true" !== z.getAttribute("aria-pressed");
        (z.setAttribute("aria-pressed", e),
          z.setAttribute("aria-label", e ? "Sound on" : "Sound off"),
          (z.innerHTML = e
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>'
            : N),
          e
            ? ((S =
                S || new (window.AudioContext || window.webkitAudioContext)()),
              P(600, 0.08))
            : (S = null));
      }));
    const _ = e("pgo"),
      $ = e("pgx");
    ((e("pgp").onclick = function () {
      ((m = !0),
        (_.hidden = !0),
        ($.hidden = !1),
        (Z.hidden = !0),
        F(1),
        (y = "wait"),
        (T = ""),
        (v = 0),
        Q || re(),
        setTimeout(() => {
          m &&
            "wait" === y &&
            ((g = performance.now()), D(Math.random() < 0.5 ? -1 : 1));
        }, 900));
    }),
      ($.onclick = function () {
        ((m = !1),
          (y = "idle"),
          (w.d = 0),
          B(),
          (b = null),
          (T = ""),
          (Z.hidden = !0),
          F(1),
          (t.style.touchAction = ""),
          (_.hidden = !1),
          ($.hidden = !0));
      }),
      e("pgm").addEventListener("click", (t) => {
        const s = t.target.closest("button");
        var a;
        s &&
          ((a = +s.dataset.m),
          (f = a ? 1 : 0),
          e("pgm")
            .querySelectorAll("button")
            .forEach((e) => e.setAttribute("aria-pressed", +e.dataset.m === f)),
          (y = "idle"),
          (T = ""),
          (Z.hidden = !0),
          F(1));
      }));
    const W = "/api/scores",
      Y = "io_lb",
      X = "io_mine",
      Z = e("sub"),
      V = (e, t, s, a) =>
        Math.max(
          0,
          100 * e - 35 * t + 15 * Math.min(s, 30) + (e >= 7 ? 500 : 0),
        ) * (a ? 2 : 1);
    let U = [],
      G = !1,
      K = "",
      J = 0,
      Q = !1,
      ee = {},
      te = null,
      se = 0,
      ae = "";
    try {
      ee = JSON.parse(localStorage[X] || "{}");
    } catch (e) {}
    const ne = () => {
        try {
          localStorage[X] = JSON.stringify(ee);
        } catch (e) {}
      },
      oe = (e) => String(e).replace(/[^A-Za-z0-9]/g, ""),
      ie = () => {
        const t = U.slice(0, 10);
        ((e("lbs").textContent = Q && G ? "ONLINE" : ""),
          (e("lbe").hidden = t.length > 0),
          (e("lbl").hidden = !t.length),
          (e("lbl").innerHTML = t
            .map((e) => {
              const t = e.id && Object.prototype.hasOwnProperty.call(ee, e.id);
              return (
                '<li class="' +
                (t ? "mine" : "") +
                (e.id && e.id === ae ? " lbnew" : "") +
                '"><span>' +
                oe(e.n) +
                "</span><span>" +
                String(e.s).padStart(5, "0") +
                "</span>" +
                (t
                  ? '<button type="button" class="lbx' +
                    (te === e.id ? " arm" : "") +
                    '" data-id="' +
                    oe(e.id) +
                    '" aria-label="Delete my score ' +
                    oe(e.n) +
                    " " +
                    e.s +
                    '">' +
                    (te === e.id ? "SURE?" : "✕") +
                    "</button>"
                  : "<i></i>") +
                "</li>"
              );
            })
            .join("")),
          (ae = ""));
      },
      ce = (t) => {
        ((e("lbs").textContent = t), setTimeout(ie, 2200));
      },
      le = () => {
        try {
          return JSON.parse(localStorage[Y] || "[]");
        } catch (e) {
          return [];
        }
      };
    async function re() {
      Q = !0;
      try {
        const e = await fetch(W);
        if (!e.ok) throw 0;
        const t = await e.json();
        if (!Array.isArray(t.scores)) throw 0;
        ((U = t.scores), (G = !0));
      } catch (e) {
        ((G = !1), (U = le()));
      }
      ie();
    }
    (Z.addEventListener("submit", async (t) => {
      t.preventDefault();
      const s = e("subi")
        .value.toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 3);
      if (s.length < 2) return;
      K = s;
      try {
        localStorage.io_in = s;
      } catch (e) {}
      Z.hidden = !0;
      const a = {
        n: s,
        you: u[0],
        cl: u[1],
        r: v,
        h: f,
        ms: Math.round(performance.now() - g),
      };
      if (G) {
        try {
          const e = await fetch(W, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(a),
          });
          if (!e.ok) throw 0;
          const t = await e.json();
          ((U = t.scores || U),
            (J = t.score || J),
            t.id && ((ee[t.id] = t.tok), ne(), (ae = t.id)),
            ie());
        } catch (e) {
          ce("NOT SAVED, RETRY");
        }
        return;
      }
      const n = le(),
        o = "l" + Date.now().toString(36);
      (n.push({ n: s, s: J, id: o }),
        n.sort((e, t) => t.s - e.s),
        (n.length = Math.min(n.length, 50)),
        (ee[o] = ""),
        ne(),
        (ae = o));
      try {
        localStorage[Y] = JSON.stringify(n);
      } catch (e) {}
      ((U = n), ie());
    }),
      (e("subx").onclick = () => (Z.hidden = !0)),
      ie(),
      e("lbl").addEventListener("click", async (e) => {
        const t = e.target.closest(".lbx");
        if (!t) return;
        const s = t.dataset.id;
        if (te !== s)
          return (
            (te = s),
            clearTimeout(se),
            (se = setTimeout(() => {
              ((te = null), ie());
            }, 2500)),
            void ie()
          );
        ((te = null), clearTimeout(se));
        const a = U.find((e) => e.id === s);
        if (G)
          try {
            const e = await fetch(W, {
              method: "DELETE",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ id: s, n: a && a.n, tok: ee[s] }),
            });
            if (!e.ok) throw 0;
            const t = await e.json();
            U = t.scores || U.filter((e) => e.id !== s);
          } catch (e) {
            return (ie(), void ce("NOT DELETED"));
          }
        else {
          const t = le().filter((e) => e.id !== s);
          try {
            localStorage[Y] = JSON.stringify(t);
          } catch (e) {}
          U = t;
        }
        (delete ee[s], ne(), ie());
      }));
  })(),
  (function () {
    const e = [
        {
          y: "Oct 21",
          k: "LEVEL 1",
          d: "Oct 2021 to Mar 2024",
          t: "SoftStructures",
          h: "UI/UX & Product Designer · Lagos",
          b: "first real job, first real deadlines, first time strangers actually used something i designed 😭 led design on <a class='ext' href='https://scout4job.com' target='_blank' rel='noopener'>Scout4Job</a>, then built <a class='ext' href='https://neurms.com' target='_blank' rel='noopener'>NeüRMS</a> for Nigerian SMEs. then came the NeüRMS launch at Radisson Blu, Lagos, where i did a live demo of the app and spoke on stage in front of an audience. learnt that users will always find the one button you forgot to test, lol, and that is a very different feeling when the demo is live 😅 also found my first work friends here, the kind you debug life with 🤝",
          p: "Scout4Job and NeüRMS: product design, end to end, plus a live demo on stage",
        },
        {
          y: "Nov 23",
          k: "LEVEL 2",
          d: "Nov 2023 to Present",
          t: "Freelance",
          h: "Independent Brand & Product Designer",
          b: "went solo, and it carried me through a series of projects that stretched my range, my patience and my calendar 💻 i designed a gym membership app, a car, driver & yacht rental app and a lifestyle application. met new local and foreign clients along the way. those 2am phone calls were the most interesting part of the journey 🙃",
          p: "A gym membership app, a car, driver & yacht rental app and a lifestyle app",
        },
        {
          y: "Jan 24",
          k: "LEVEL 3",
          d: "Jan 2024 to Present",
          t: "TheBrand™",
          h: "Product Design & Creative Lead",
          b: "designed the new <a href=\"#\" class=\"cl\" data-cs=\"lykluk\">Lykluk</a> interface and design system, plus new brand systems for <a href=\"#\" class=\"cl\" data-cs=\"yadsale\">Yadsale</a>, <a href=\"#\" class=\"cl\" data-cs=\"revolve\">Revolve</a>, <a class='ext' href='https://www.instagram.com/p/DYWjhXXCNnu/' target='_blank' rel='noopener'>Project I-Q</a>, <a class='ext' href='https://www.instagram.com/reel/DTSPCxsiCz7/' target='_blank' rel='noopener'>Buk-Maris</a>, <a class='ext' href='https://www.instagram.com/barofjams/' target='_blank' rel='noopener'>JamBar</a>, <a class='ext' href='https://www.instagram.com/wellanin_psych/' target='_blank' rel='noopener'>Wellanin</a> Psychiatry & Journeys, among other brands and businesses across several industries. led, managed and collaborated with some of the most hardworking and motivated people, and saw first-hand how good, structured design and products help a business scale. met some amazing clients and partners who turned into family ❤️",
          p: "a handful of brands, one very full calendar 🙃",
        },
        {
          y: "Sep 24",
          k: "LEVEL 4",
          d: "Sep 2024 to Oct 2025",
          t: "Reboot Monkey",
          h: "UI/UX Designer & IT Project Lead · Haarlem, NL (Remote)",
          b: "got a call to help refine <a class='ext' href='https://rebootmonkey.com' target='_blank' rel='noopener'>Reboot Monkey</a>'s website and design system, then owned an internal project management and HR tool from research to final testing. made new friends across new time zones. hoping we plan a little meet-up someday 🌍",
          p: "One design system, one internal tool, end to end",
        },
        {
          y: "2026",
          k: "LEVEL 5",
          d: "2026 to Present",
          t: "SOMA",
          h: "Product Design & Strategy Lead",
          b: 'partnered to help build the brand, product strategy and market direction for an offline-first school operating system, where teachers can now take attendance without stress and guardians can follow up on their child\'s progress without the usual hassle. currently in beta, so please be patient with us 🙏 and yes, the <a href="#" class="cl" data-cs="soma">logo</a> is a tree that\'s secretly a pie chart.',
          p: "Offline-first, built for Nigerian schools",
          cta: 1,
        },
      ],
      t = (e) => document.getElementById(e),
      s = t("trk"),
      a = t("stpn");
    matchMedia("(prefers-reduced-motion:reduce)");
    let n = 0,
      o = null;
    const i = new Set([0]);
    s.innerHTML =
      e
        .map(
          (t, s) =>
            '<button class="nd" type="button" data-i="' +
            s +
            '" style="left:' +
            (s / (e.length - 1)) * 100 +
            '%" aria-label="' +
            t.k +
            ": " +
            t.t +
            '"><span>' +
            t.y +
            "</span></button>",
        )
        .join("") + '<div class="stc" id="stc"></div>';
    const c = t("stc"),
      l = [...s.querySelectorAll(".nd")],
      r = () => {
        c.innerHTML = PX.svg().replace(
          'xmlns="http://www.w3.org/2000/svg" ',
          "",
        );
      };
    (document.addEventListener("px:update", r), r());
    const d = () => {
      o && (clearInterval(o), (o = null));
    };
    function p(o) {
      const r = e[o];
      ((n = o), i.add(o));
      const d = (o / (e.length - 1)) * 100 + "%";
      ((c.style.left = d),
        s.style.setProperty("--p", d),
        c.classList.remove("w"),
        c.offsetWidth,
        c.classList.add("w"),
        l.forEach((e, t) => {
          (e.classList.toggle("v", i.has(t)),
            t === o
              ? e.setAttribute("aria-current", "step")
              : e.removeAttribute("aria-current"));
        }),
        (t("stk").textContent = "COINS " + i.size + " / " + e.length),
        (a.innerHTML =
          '<div class="lvl"><div><p class="k">' +
          r.k +
          " · " +
          r.d.toUpperCase() +
          "</p><h3>" +
          r.t +
          "</h3><h4>" +
          r.h +
          "</h4><p>" +
          r.b +
          '</p><div class="lvb">' +
          (o > 0
            ? '<button class="pill2" data-s="-1" type="button">◀ Back</button>'
            : "") +
          (r.cta
            ? '<a class="btn p" href="#contact">Press start: let\'s talk</a>'
            : '<button class="pill2" data-s="1" type="button">Next level ▶</button>') +
          '</div></div><div class="pu pj">' +
          ((e) => {
            const t = (e, t, s, a, n, o, i) =>
                '<rect x="' +
                e +
                '" y="' +
                t +
                '" width="' +
                s +
                '" height="' +
                a +
                '" fill="' +
                n +
                '"' +
                (o ? ' class="' + o + '"' : "") +
                (i ? ' style="' + i + '"' : "") +
                "/>",
              s = (e, t, s, a, n) =>
                '<text x="' +
                e +
                '" y="' +
                t +
                '" font-family="Silkscreen,monospace" font-size="2.6" fill="' +
                (n || "#fff") +
                '" textLength="' +
                a +
                '" lengthAdjust="spacingAndGlyphs">' +
                s +
                "</text>",
              a = (e, t, s) =>
                "<g" +
                (s ? ' class="' + s + '"' : "") +
                '><svg x="' +
                e +
                '" y="' +
                t +
                '" width="16" height="16" viewBox="0 0 16 16">' +
                PX.mario([1, 0], 0) +
                "</svg></g>";
            let n = "";
            if (0 === e) {
              n =
                t(0, 0, 64, 40, "#2B1B54") +
                t(0, 0, 7, 29, "#B02A2A") +
                t(2, 0, 1, 29, "#8A1E1E") +
                t(4, 0, 1, 29, "#8A1E1E") +
                t(57, 0, 7, 29, "#B02A2A") +
                t(59, 0, 1, 29, "#8A1E1E") +
                t(61, 0, 1, 29, "#8A1E1E") +
                '<polygon class="pjs" points="29,0 35,0 52,29 12,29" fill="#FFF3B0" opacity=".17"/>' +
                t(0, 29, 64, 3, "#C98B4B") +
                t(0, 32, 64, 1, "#8A5A2B") +
                a(18, 13, "pjh") +
                t(38, 17, 1, 12, "#D9D9D9") +
                t(37, 14, 3, 3, "#222") +
                t(37, 14, 1, 1, "#fff") +
                t(36, 29, 5, 1, "#999") +
                t(50, 26, 10, 3, "#E15B0F") +
                t(50, 25, 10, 1, "#F6A06A") +
                '<g class="pjb1">' +
                t(8, 1, 42, 7, "#fff") +
                t(24, 8, 3, 2, "#fff") +
                s(10, 6, "TESTED IT. PROMISE.", 38, "#2B1B54") +
                '</g><g class="pjb2">' +
                t(8, 1, 42, 7, "#fff") +
                t(24, 8, 3, 2, "#fff") +
                s(10, 6, "NOT THAT BUTTON!", 38, "#E15B0F") +
                '</g><g class="pjw">' +
                t(6, 30, 3, 2, "#D33") +
                t(7, 29, 1, 1, "#D33") +
                t(5, 31, 1, 1, "#333") +
                t(9, 31, 1, 1, "#333") +
                "</g>";
              const e = ["#120A24", "#1B1036", "#0D0719"];
              for (let s = 0; s < 8; s++) {
                const a = 1 + 8 * s;
                n +=
                  '<g class="pjb' +
                  (s % 2 ? " pjb2d" : "") +
                  '">' +
                  t(a, 33, 5, 4, e[s % 3]) +
                  t(a - 1, 37, 7, 3, e[s % 3]) +
                  (s % 3 == 0 ? t(a + 5, 31, 1, 3, e[s % 3]) : "") +
                  "</g>";
              }
            } else if (1 === e)
              n =
                t(0, 0, 64, 40, "#0E1330") +
                t(6, 4, 1, 1, "#fff", "pjt") +
                t(20, 8, 1, 1, "#fff", "pjt pjt2") +
                t(44, 3, 1, 1, "#fff", "pjt") +
                t(36, 6, 1, 1, "#fff", "pjt pjt2") +
                t(58, 12, 1, 1, "#fff", "pjt") +
                t(53, 4, 5, 5, "#F5E6A8") +
                s(4, 7, "2:00 AM", 14, "#9FD3FF") +
                '<g class="pjb">' +
                t(5, 14, 2, 6, "#F2B04B") +
                t(7, 16, 6, 2, "#F2B04B") +
                t(13, 14, 2, 6, "#F2B04B") +
                '</g><g class="pjb pjb2d">' +
                t(19, 17, 12, 3, "#E15B0F") +
                t(21, 15, 8, 2, "#E15B0F") +
                t(22, 15, 2, 2, "#9FD3FF") +
                t(25, 15, 3, 2, "#9FD3FF") +
                t(21, 20, 3, 2, "#222") +
                t(27, 20, 3, 2, "#222") +
                '</g><g class="pjb">' +
                t(41, 10, 1, 9, "#ddd") +
                t(42, 11, 5, 1, "#fff") +
                t(42, 12, 4, 1, "#fff") +
                t(42, 13, 3, 1, "#fff") +
                t(42, 14, 2, 1, "#fff") +
                t(36, 19, 12, 2, "#fff") +
                t(37, 21, 10, 1, "#9FD3FF") +
                '</g><g class="pjb pjb2d">' +
                t(53, 13, 2, 1, "#FF4D6D") +
                t(56, 13, 2, 1, "#FF4D6D") +
                t(52, 14, 7, 2, "#FF4D6D") +
                t(53, 16, 5, 1, "#FF4D6D") +
                t(54, 17, 3, 1, "#FF4D6D") +
                t(55, 18, 1, 1, "#FF4D6D") +
                "</g>" +
                a(14, 19) +
                t(4, 30, 56, 3, "#8A5A2B") +
                t(8, 33, 3, 7, "#6B4220") +
                t(53, 33, 3, 7, "#6B4220") +
                t(30, 24, 14, 6, "#2A2A2A") +
                t(31, 25, 12, 4, "#9FD3FF") +
                t(28, 30, 18, 1, "#bbb") +
                '<g class="pjk">' +
                t(49, 26, 5, 4, "#222") +
                t(50, 27, 3, 2, "#7CFF9A") +
                "</g>" +
                t(55, 25, 1, 1, "#fff", "pjt") +
                t(56, 24, 1, 1, "#fff", "pjt pjt2") +
                s(44, 23, "RING RING", 16, "#7CFF9A");
            else if (2 === e)
              ((n =
                t(0, 0, 64, 40, "#FBE9CC") +
                t(0, 34, 64, 6, "#C98B4B") +
                t(0, 34, 64, 1, "#8A5A2B") +
                s(4, 6, "AND MORE...", 20, "#6B4220")),
                [
                  ["LYKLUK", "#8B35C0", 30, 11, "#fff"],
                  ["YADSALE", "#009834", 26, 13, "#fff"],
                  ["REVOLVE", "#0D1B47", 22, 13, "#fff"],
                  ["BUK-MARIS", "#D63A3A", 18, 17, "#fff"],
                  ["JAMBAR", "#EDC345", 14, 11, "#2B1B54"],
                  ["WELLANIN", "#2A9D8F", 10, 15, "#fff"],
                ].forEach((e, a) => {
                  n +=
                    '<g class="pjd" style="--k:' +
                    a +
                    '">' +
                    t(34, e[2], 24, 4, e[1]) +
                    t(34, e[2], 24, 1, "#ffffff44") +
                    s(36, e[2] + 3, e[0], e[3], e[4]) +
                    "</g>";
                }),
                (n +=
                  '<g class="pjb">' +
                  t(45, 2, 1, 5, "#F2B04B") +
                  t(43, 4, 5, 1, "#F2B04B") +
                  t(44, 3, 3, 3, "#F2B04B") +
                  "</g>" +
                  a(12, 18, "pjh")));
            else if (3 === e) {
              n =
                t(0, 0, 32, 40, "#BFE3FF") +
                t(32, 0, 32, 40, "#14204A") +
                t(9, 5, 5, 5, "#FFD34D") +
                t(11, 3, 1, 1, "#FFD34D") +
                t(11, 12, 1, 1, "#FFD34D") +
                t(7, 7, 1, 1, "#FFD34D") +
                t(16, 7, 1, 1, "#FFD34D") +
                t(48, 5, 4, 4, "#F5E6A8") +
                t(40, 4, 1, 1, "#fff", "pjt") +
                t(57, 8, 1, 1, "#fff", "pjt pjt2") +
                t(36, 10, 1, 1, "#fff", "pjt") +
                t(0, 35, 32, 5, "#7FA35A") +
                t(32, 35, 32, 5, "#0A1230") +
                s(3, 3, "DAY", 6, "#14204A") +
                s(52, 3, "NIGHT", 9, "#fff") +
                '<g class="pjh">' +
                t(4, 22, 3, 3, "#8A5A2B") +
                t(17, 22, 3, 3, "#8A5A2B") +
                t(5, 23, 1, 1, "#E9C79B") +
                t(18, 23, 1, 1, "#E9C79B") +
                t(7, 20, 10, 10, "#8A5A2B") +
                t(9, 23, 6, 6, "#E9C79B") +
                t(10, 24, 1, 2, "#222") +
                t(13, 24, 1, 2, "#222") +
                t(11, 27, 3, 1, "#8A5A2B") +
                t(8, 30, 8, 5, "#8A5A2B") +
                "</g>" +
                t(18, 32, 8, 3, "#444") +
                t(19, 32, 6, 2, "#9FD3FF") +
                t(34, 32, 8, 3, "#444") +
                t(35, 32, 6, 2, "#9FD3FF") +
                a(44, 19, "pjh pjb2d");
              for (let e = 27; e <= 38; e += 2) n += t(e, 29, 1, 1, "#fff");
              n +=
                '<g class="pjp1">' +
                t(26, 27, 3, 2, "#E15B0F") +
                '</g><g class="pjp2">' +
                t(38, 27, 3, 2, "#7CFF9A") +
                "</g>";
            } else {
              n =
                t(0, 0, 64, 40, "#0B0F24") +
                t(0, 35, 64, 5, "#142046") +
                t(2, 5, 22, 28, "#fff") +
                t(2, 5, 22, 4, "#1C4FD8") +
                s(4, 8, "ATTENDANCE", 17, "#fff");
              for (let e = 0; e < 4; e++) {
                const s = 11 + 5 * e;
                n +=
                  t(4, s + 1, 10, 1, "#CFD8F3") +
                  t(4, s + 3, 6, 1, "#E3E8F8") +
                  t(17, s, 6, 5, "#fff") +
                  t(17, s, 6, 1, "#1C4FD8") +
                  t(17, s + 4, 6, 1, "#1C4FD8") +
                  t(17, s, 1, 5, "#1C4FD8") +
                  t(22, s, 1, 5, "#1C4FD8") +
                  '<g class="ck" style="--k:' +
                  e +
                  '">' +
                  t(18, s + 2, 1, 1, "#1C9C4E") +
                  t(19, s + 3, 1, 1, "#1C9C4E") +
                  t(20, s + 2, 1, 1, "#1C9C4E") +
                  t(21, s + 1, 1, 1, "#1C9C4E") +
                  "</g>";
              }
              n += t(35, 20, 2, 15, "#5A3A1A");
              const e = [8, 12, 14, 14, 12, 8],
                o = [8, 10, 12, 14, 16, 18];
              ([
                ["q1", "#1C4FD8", 0],
                ["q2", "#EDEDED", 0],
                ["q3", "#fff", 3],
                ["q4", "#5A82EE", 3],
              ].forEach((s, a) => {
                n += '<g class="' + s[0] + '">';
                for (let i = s[2]; i < s[2] + 3; i++) {
                  const c = e[i] / 2;
                  n += t(a % 2 ? 36 : 36 - c, o[i], c, 2, s[1]);
                }
                n += "</g>";
              }),
                (n += a(46, 19, "pjh")));
            }
            return (
              '<svg viewBox="0 0 64 40" role="img" aria-label="' +
              [
                "Pixel Mario on a stage with a microphone, speaking to an audience while a bug walks toward a button",
                "Pixel Mario at a desk at 2am with a phone ringing, and a gym, car, yacht and heart icon floating above",
                "Pixel Mario beside a tower of brand blocks stacking up one by one",
                "A pixel monkey in daylight and pixel Mario at night, passing messages across time zones",
                "A pixel attendance sheet ticking off names next to a tree that splits into a pie chart, with pixel Mario waving",
              ][e] +
              '">' +
              n +
              "</svg>"
            );
          })(o) +
          '<div class="pc"><b>POWER-UP</b>' +
          r.p +
          "</div></div></div>"));
    }
    (a.addEventListener("click", (e) => {
      const t = e.target.closest("a[data-cs]");
      if (!t) return;
      e.preventDefault();
      const s = document.querySelector('.cso[data-cs="' + t.dataset.cs + '"]');
      s && s.click();
    }),
      s.addEventListener("click", (e) => {
        const t = e.target.closest(".nd");
        t && (d(), p(+t.dataset.i));
      }),
      a.addEventListener("click", (e) => {
        const t = e.target.closest("[data-s]");
        t && (d(), p(h(n + +t.dataset.s)));
      }));
    const h = (t) => Math.max(0, Math.min(e.length - 1, t));
    p(0);
  })(),
  (function () {
    const e = [
        {
          k: "in",
          n: "yadsale feed, fueled by coffee",
          a: "567/1008",
          c: "#E15B0F",
          d: "Laptop, iced coffee, Yadsale posts open on screen.",
          y: "2026",
          r: "Brand, creative direction",
          t: "Phone photo",
          img: "assets/archive/a0.webp",
          note: "the posts did not design themselves. this cup helped a lot ☕",
        },
        {
          k: "in",
          n: "revolve, but huge",
          a: "567/1008",
          c: "#B8379A",
          d: "Revolve guidelines on a curved monitor.",
          y: "2026",
          r: "Brand identity",
          t: "Phone photo",
          img: "assets/archive/a1.webp",
          note: "checking the R on a curved monitor. it still holds up. i am as surprised as you are.",
        },
        {
          k: "out",
          n: "jambar, game on",
          a: "640/427",
          c: "#EDC345",
          d: "A checkers board, an orange cup and a black bucket on a table.",
          y: "2025",
          r: "Photo",
          t: "Phone photo",
          img: "assets/archive/a2.webp",
          note: "checkers on the table, a very orange cup. nobody is working. everybody is losing.",
        },
        {
          k: "out",
          n: "the whole chips range",
          a: "640/1138",
          c: "#2DA44E",
          d: "The packaging line-up in the design file.",
          y: "2026",
          r: "Packaging",
          t: "Phone photo",
          img: "assets/archive/a3.webp",
          note: 'every pouch on one screen. the calm before "can we see another colourway?"',
        },
        {
          k: "out",
          n: "jam cards",
          a: "640/960",
          c: "#3B6BFF",
          d: "Conversation cards, one question each.",
          y: "2025",
          r: "Print design",
          t: "Phone photo",
          img: "assets/archive/a4.webp",
          note: 'one question per card. "what is one thing you expect from a friendship?" dinner just got serious 👀',
        },
        {
          k: "out",
          n: "pouch vs. screen",
          a: "567/1008",
          c: "#F2B04B",
          d: "A printed pouch held up against its artwork.",
          y: "2026",
          r: "Packaging",
          t: "Phone photo",
          img: "assets/archive/a5.webp",
          note: 'print never looks like the screen. we held them side by side and agreed it is "close enough" 🤫',
        },
        {
          k: "out",
          n: "office with a view",
          a: "567/1008",
          c: "#3B6BFF",
          d: "A laptop corner with iced tea and a view.",
          y: "2026",
          r: "Photo",
          t: "Phone photo",
          img: "assets/archive/a6.webp",
          note: "iced tea, laptop, breeze. productivity: allegedly.",
        },
        {
          k: "out",
          n: "wellanin, tea station",
          a: "640/1025",
          c: "#2A9D8F",
          d: "Flowers, a tea cart and a bottle of hand sanitizer.",
          y: "2026",
          r: "Screenshot",
          t: "Phone screenshot",
          img: "assets/archive/a7.webp",
          note: "flowers, tea blends and a sanitizer bottle. peak wellness aesthetic.",
        },
        {
          k: "out",
          n: "end of shift",
          a: "567/1008",
          c: "#F2B04B",
          d: "A long stretch of beach at golden hour.",
          y: "2026",
          r: "Photo",
          t: "Phone photo",
          img: "assets/archive/a8.webp",
          note: "no export button for this one.",
        },
        {
          k: "in",
          n: "wellanin, the tea card",
          a: "640/1038",
          c: "#2A9D8F",
          d: 'A tea card: "Intentional blend for intentional moments".',
          y: "2026",
          r: "Screenshot",
          t: "Phone screenshot",
          img: "assets/archive/a9.webp",
          note: '"intentional blend for intentional moments." even the tea has a brand voice 🍵',
        },
        {
          k: "out",
          n: "breakfast bowl",
          a: "640/1138",
          c: "#2DA44E",
          d: "Granola, strawberry and kiwi.",
          y: "2025",
          r: "Photo",
          t: "Phone photo",
          img: "assets/archive/a10.webp",
          note: "best colour palette i saw all week. i ate it.",
        },
        {
          k: "out",
          n: "lunch, with keyframes",
          a: "640/853",
          c: "#B8379A",
          d: "Food in front, a motion timeline open on the laptop behind it.",
          y: "2025",
          r: "Photo",
          t: "Phone photo",
          img: "assets/archive/a11.webp",
          note: "lunch on the left, a motion timeline on the right. both going cold.",
        },
      ],
      t = (e) => document.getElementById(e);
    let s = "all",
      a = -1;
    function n() {
      ((t("awl").innerHTML = e
        .map((e, t) =>
          e.k === s || "all" === s
            ? '<button class="tl' +
              (e.img ? " im" + (t % 3 == 1 ? " t" : "") : "") +
              '" type="button" data-i="' +
              t +
              '" style="--c:' +
              e.c +
              (e.img
                ? ";--rt:" + [-2.2, 1.6, -1.1, 2.4, -1.8, 1.2][t % 6] + "deg"
                : ";aspect-ratio:" + e.a) +
              '">' +
              (e.img
                ? (t % 3 == 1 ? '<i class="plt"></i>' : "") +
                  '<span class="plp" style="aspect-ratio:' +
                  e.a +
                  '" data-bg="' +
                  e.img +
                  '"><span class="tg">' +
                  ("in" === e.k ? "PORTFOLIO" : "BEYOND") +
                  '</span></span><span class="plc"><b>' +
                  e.n +
                  "</b></span>"
                : '<span class="tg">' +
                  ("in" === e.k ? "PORTFOLIO" : "BEYOND") +
                  "</span><span><b>" +
                  e.n +
                  "</b><em>" +
                  e.d +
                  "</em></span>") +
              "</button>"
            : "",
        )
        .join("")),
        t("axf")
          .querySelectorAll("button")
          .forEach((e) => e.setAttribute("aria-pressed", e.dataset.f === s)),
        a >= 0 && o());
    }
    function o() {
      const e = t("awl").querySelector('[data-i="' + a + '"]');
      e &&
        (e.classList.add("on"),
        (e.dataset.dim =
          Math.round(e.offsetWidth) + " × " + Math.round(e.offsetHeight)));
    }
    function i() {
      const s = e[a];
      t("ins").innerHTML = s
        ? '<div class="w"><button type="button" class="pill2" data-archive-close aria-label="Close archive preview">Close ×</button></div>' +
          (s.img
            ? '<div class="w ip"><img src="' +
              s.img +
              '" alt="' +
              s.n +
              '"></div>'
            : "") +
          [
            ["NAME", s.n],
            [
              "SHELF",
              "in" === s.k ? "In the portfolio" : "Beyond the portfolio",
            ],
            ["YEAR", s.y],
            ["ROLE", s.r],
            ["TOOLS", s.t],
          ]
            .map(([e, t]) => "<div><span>" + e + "</span>" + t + "</div>")
            .join("") +
          '<div class="w"><span>NOTE</span>' +
          (s.note || "") +
          "</div>"
        : '<div class="w"><span>INSPECTOR</span>Select a frame to inspect it.</div>';
    }
    ((t("axf").innerHTML = [
      ["all", "All"],
      ["in", "In the portfolio"],
      ["out", "Beyond it"],
    ]
      .map(
        ([e, t]) =>
          '<button type="button" data-f="' +
          e +
          '" aria-pressed="' +
          ("all" === e) +
          '">' +
          t +
          "</button>",
      )
      .join("")),
      t("axf").addEventListener("click", (e) => {
        const t = e.target.closest("button");
        t && ((s = t.dataset.f), (a = -1), n(), i(), p());
      }),
      t("awl").addEventListener("click", (e) => {
        const s = e.target.closest(".tl");
        s &&
          ((a = +s.dataset.i),
          t("awl")
            .querySelectorAll(".tl")
            .forEach((e) => e.classList.remove("on")),
          o(),
          i(),
          c.matches && d());
      }));
    const c = matchMedia("(max-width:820px)"),
      l = document.createElement("div");
    ((l.className = "axs"), (l.hidden = !0), document.body.appendChild(l));
    const r = () =>
      e.map((e, t) => t).filter((t) => "all" === s || e[t].k === s);
    function d() {
      const t = e[a],
        s = r(),
        n = s.indexOf(a) + 1,
        o = "in" === t.k ? "PORTFOLIO" : "BEYOND";
      ((l.innerHTML =
        '<div class="axb" data-x="1"></div><div class="axc" role="dialog" aria-modal="true" aria-label="' +
        t.n +
        '"><div class="axh px"><span>FRAME ' +
        String(n).padStart(2, "0") +
        " / " +
        String(s.length).padStart(2, "0") +
        '</span><button type="button" class="axx" data-x="1" aria-label="Close archive preview">Close ×</button></div><div class="axp' +
        (t.img ? " pi" : "") +
        '" style="--c:' +
        t.c +
        '">' +
        (t.img
          ? '<img src="' + t.img + '" alt="' + t.n + ": " + t.d + '">'
          : "") +
        '<span class="tg">' +
        o +
        '</span></div><div class="axt"><h3>' +
        t.n +
        "</h3><p>" +
        t.d +
        '</p></div><div class="axg"><div><span>YEAR</span>' +
        t.y +
        "</div><div><span>ROLE</span>" +
        t.r +
        "</div><div><span>TOOLS</span>" +
        t.t +
        '</div></div><div class="axn"><span>NOTE</span>' +
        (t.note || "") +
        '</div><div class="axf"><button type="button" class="pill2" data-n="-1">◀ Prev</button><button type="button" class="pill2" data-n="1">Next ▶</button></div></div>'),
        (l.hidden = !1),
        (document.body.style.overflow = "hidden"),
        l.querySelector(".axx").focus({ preventScroll: !0 }));
    }
    function p() {
      ((l.hidden = !0),
        (l.innerHTML = ""),
        (document.body.style.overflow = ""));
      const e = t("awl").querySelector('[data-i="' + a + '"]');
      e && e.focus({ preventScroll: !0 });
    }
    (l.addEventListener("click", (e) => {
      if (e.target.closest("[data-x]")) return p();
      const s = e.target.closest("[data-n]");
      if (!s) return;
      const n = r();
      ((a = n[(n.indexOf(a) + +s.dataset.n + n.length) % n.length]),
        t("awl")
          .querySelectorAll(".tl")
          .forEach((e) => e.classList.remove("on")),
        o(),
        i(),
        d());
    }),
      addEventListener("keydown", (e) => {
        "Escape" !== e.key || l.hidden || p();
      }),
      t("ins").addEventListener("click", (e) => {
        if (!e.target.closest("[data-archive-close]")) return;
        const s = t("awl").querySelector('[data-i="' + a + '"]');
        (p(),
          (a = -1),
          t("awl")
            .querySelectorAll(".tl.on")
            .forEach((e) => e.classList.remove("on")),
          i(),
          s && s.focus({ preventScroll: !0 }));
      }),
      n(),
      i());
    {
      const e = t("awl");
      let s = 0;
      const a = () =>
        e.querySelectorAll(".plp[data-bg]").forEach((e) => {
          ((e.style.backgroundImage = "url(" + e.dataset.bg + ")"),
            e.removeAttribute("data-bg"));
        });
      (new MutationObserver(() => {
        s && a();
      }).observe(e, { childList: !0 }),
        "IntersectionObserver" in window
          ? new IntersectionObserver(
              (e, t) => {
                e.some((e) => e.isIntersecting) &&
                  ((s = 1), a(), t.disconnect());
              },
              { rootMargin: "900px" },
            ).observe(e)
          : ((s = 1), a()));
    }
  })(),
  (function () {
    const e = (e) => document.getElementById(e),
      t = (e) =>
        String(e).replace(
          /[&<>"]/g,
          (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e],
        ),
      s = e("rdb"),
      a = (e, s) =>
        e && e.cover
          ? '<div class="bk"><img src="' +
            t(e.cover) +
            '" alt="' +
            t(e.title) +
            ' cover" loading="lazy"></div>'
          : '<div class="bk">' +
            (s || t((e && e.title) || "[Cover]")) +
            "</div>";
    function n(e) {
      const n = (e.current || [])[0],
        o = (e.read || []).slice(0, 8);
      var i;
      n || o.length
        ? (s.innerHTML =
            (n
              ? '<div class="rdc">' +
                a(n) +
                '<div><p class="px" style="font-size:10px;color:var(--or);margin:0">NOW READING</p><h3>' +
                t(n.title) +
                "</h3><p>" +
                t(n.author || "") +
                "</p>" +
                ((i = n.progress || 0),
                '<div class="seg10" role="img" aria-label="' +
                  Math.round(i) +
                  ' percent read">' +
                  Array.from(
                    { length: 10 },
                    (e, t) => '<i class="' + (t < i / 10 ? "f" : "") + '"></i>',
                  ).join("") +
                  "</div></div></div>")
              : "") +
            (o.length
              ? '<div class="sp">' + o.map((e) => a(e)).join("") + "</div>"
              : ""))
        : (s.innerHTML =
            '<p class="sub" role="status">Reading shelf is being updated.</p>');
    }
    (n({}),
      fetch("/api/reads")
        .then((e) => (e.ok ? e.json() : Promise.reject()))
        .then((e) => {
          ((e.current && e.current.length) || (e.read && e.read.length)) &&
            n(e);
        })
        .catch(() => {}));
  })(),
  (function () {
    const e = (e) => document.getElementById(e),
      t = e("profB"),
      s = e("avg"),
      a = document.createElement("div");
    ((a.className = "pw"), t.appendChild(a));
    let n = [0, 0],
      o = 0;
    const i = () => {
        a.innerHTML =
          '<svg class="pav" viewBox="2 0 12 16" aria-hidden="true">' +
          PX.inner(n, PX.bl()) +
          "</svg>";
      },
      c = (e, t) => (Math.abs(e) < t ? 0 : e > 0 ? 1 : -1);
    (document.addEventListener("px:ptr", (e) => {
      const t = e.detail,
        s = a.getBoundingClientRect(),
        l = [
          c(t.x - (s.left + s.width / 2), 14),
          c(t.y - (s.top + 0.3 * s.height), 14),
        ];
      ((l[0] === n[0] && l[1] === n[1]) || ((n = l), i()),
        clearTimeout(o),
        t.touch &&
          (o = setTimeout(() => {
            ((n = [0, 0]), i());
          }, 3e3)));
    }),
      document.addEventListener("px:blink", i));
    const l = () => {
      (a.classList.remove("hop"), a.offsetWidth, a.classList.add("hop"));
    };
    function r() {
      const e = PX.cur();
      s.innerHTML = PRE.map(
        (t, s) =>
          '<button type="button" data-p="' +
          s +
          '" aria-label="Avatar ' +
          t.n +
          '" aria-pressed="' +
          (t.hs === e.hs &&
            t.sk === e.sk &&
            t.oc === e.oc &&
            t.ac === e.ac &&
            t.hc === e.hc) +
          '">' +
          PX.thumb(t) +
          "</button>",
      ).join("");
    }
    (a.addEventListener("animationend", () => a.classList.remove("hop")),
      document.addEventListener("px:update", (e) => {
        (i(), r(), (e.detail && e.detail.spin) || l());
      }),
      i(),
      r(),
      t.addEventListener("click", l));
    const d = e("avs");
    d && (d.onclick = () => PX.shuffle());
    const p = e("mmar");
    if (p) {
      let e = [0, 0],
        t = 0;
      const s = (e, t) => (Math.abs(e) < t ? 0 : e > 0 ? 1 : -1),
        a = () => {
          p.innerHTML =
            '<svg viewBox="1 0 14 16" aria-hidden="true">' +
            PX.mario(e, PX.bl()) +
            "</svg>";
        };
      (a(),
        document.addEventListener("np:update", a),
        document.addEventListener("px:ptr", (n) => {
          const o = n.detail,
            i = p.getBoundingClientRect(),
            c = [
              s(o.x - (i.left + 0.5 * i.width), 10),
              s(o.y - (i.top + 0.35 * i.height), 10),
            ];
          ((c[0] === e[0] && c[1] === e[1]) || ((e = c), a()),
            clearTimeout(t),
            o.touch &&
              (t = setTimeout(() => {
                ((e = [0, 0]), a());
              }, 3e3)));
        }),
        document.addEventListener("px:blink", a),
        document.addEventListener("px:accent", a),
        p.addEventListener("click", () => {
          (p.classList.remove("hop"), p.offsetWidth, p.classList.add("hop"));
        }));
    }
    ["avm", "chm"].forEach((t) => {
      const s = e(t);
      s &&
        (s.onclick = (e) => {
          (e.stopPropagation(), PX.reset());
        });
    });
    const h = e("rstAll");
    let u = 0;
    (h &&
      (h.onclick = (e) => {
        if ((e.stopPropagation(), !u))
          return (
            h.setAttribute("aria-label", "Tap again to reset"),
            h.classList.add("arm"),
            void (u = setTimeout(() => {
              ((u = 0),
                h.setAttribute("aria-label", "Reset all settings"),
                h.classList.remove("arm"));
            }, 3e3))
          );
        (clearTimeout(u),
          (u = 0),
          h.classList.remove("arm"),
          h.setAttribute("aria-label", "Reset all settings"),
          (S.name = ""),
          (S.cur = !0),
          (S.theme = matchMedia("(prefers-color-scheme:dark)").matches
            ? "midnight"
            : "studio"),
          (S.accent = (TH.find((e) => e[0] === S.theme) || TH[0])[2]),
          save(),
          apply(),
          PX.reset());
        const t = document.getElementById("zr");
        t && !t.hidden ? t.click() : window.__lay && __lay.clear();
      }),
      s.addEventListener("click", (e) => {
        const t = e.target.closest("[data-p]");
        t && (e.stopPropagation(), PX.set(PRE[+t.dataset.p]));
      }),
      e("pop").addEventListener("click", (s) => {
        s.target.closest("a") &&
          e("pop").classList.contains("open") &&
          setTimeout(() => t.click(), 0);
      }));
  })(),
  (function () {
    if (
      ("serviceWorker" in navigator &&
        /^https?:/.test(location.protocol) &&
        navigator.serviceWorker.register("/sw.js").catch(() => {}),
      matchMedia("(display-mode:standalone)").matches || navigator.standalone)
    )
      return;
    const e = navigator.userAgent,
      t =
        /iphone|ipad|ipod/i.test(e) ||
        ("MacIntel" === navigator.platform && navigator.maxTouchPoints > 1),
      s = /^((?!chrome|chromium|android|crios|fxios|edg).)*safari/i.test(e),
      a = "io_app",
      n = matchMedia("(max-width:820px)");
    let o = null,
      i = null,
      c = !1,
      l = 0,
      r = !1;
    const d = () => !!o || t || s || r;
    function p() {
      c ||
        (() => {
          if (/[?&]app\b/.test(location.search)) return !1;
          try {
            return Date.now() - (+localStorage.getItem(a) || 0) < 864e6;
          } catch (e) {
            return !1;
          }
        })() ||
        !d() ||
        ((function () {
          if (i) return;
          ((i = document.createElement("div")),
            (i.className = "app"),
            (i.hidden = !0),
            (i.innerHTML =
              '<div class="app-m" aria-hidden="true"></div><button class="app-b" type="button"><span class="px">' +
              (n.matches ? "ADD TO HOME SCREEN" : "GET THE APP") +
              '</span><small>Revisit offline after loading. One tap away.</small></button><button class="app-x" type="button" aria-label="Dismiss">×</button><div class="app-s" role="dialog" aria-label="How to install" hidden></div>'),
            document.body.appendChild(i),
            (i.querySelector(".app-m").innerHTML =
              '<svg viewBox="0 0 8 14"><rect width="8" height="14" style="fill:var(--ink)"/><rect x="1" y="2" width="6" height="9" style="fill:var(--frame)"/><g style="fill:var(--or)"><rect x="3" y="3" width="2" height="3"/><rect x="2" y="6" width="4" height="1"/><rect x="3" y="7" width="2" height="1"/><rect x="2" y="9" width="4" height="1"/></g><rect x="3" y="12" width="2" height="1" style="fill:var(--frame)"/></svg>'));
          const e = i.querySelector(".app-s");
          ((i.querySelector(".app-b").onclick = async () => {
            if (o) {
              o.prompt();
              try {
                await o.userChoice;
              } catch (e) {}
              return ((o = null), void h(!0));
            }
            ((e.innerHTML =
              "<b>INSTALL</b>" +
              (t
                ? "Tap the Share icon, then <u>Add to Home Screen</u>."
                : s
                  ? "In the menu bar choose File, then <u>Add to Dock</u>."
                  : "Open your browser menu, then choose <u>Install app</u> or <u>Add to Home screen</u>.")),
              (e.innerHTML +=
                '<button type="button" class="app-help-close" aria-label="Close install instructions">Close</button>'),
              (e.querySelector(".app-help-close").onclick = () =>
                (e.hidden = !0)),
              (e.hidden = !e.hidden));
          }),
            (i.querySelector(".app-x").onclick = () => h(!0)),
            addEventListener("keydown", (t) => {
              "Escape" === t.key && (e.hidden = !0);
            }),
            document.addEventListener("pointerdown", (t) => {
              i.contains(t.target) || (e.hidden = !0);
            }));
        })(),
        (c = !0),
        (i.hidden = !1),
        i.offsetWidth,
        i.classList.add("on"),
        clearTimeout(l),
        (l = setTimeout(
          () => {
            n.matches ? i.classList.remove("on") : i.classList.add("mini");
          },
          n.matches ? 14e3 : 9e3,
        )));
    }
    function h(e) {
      if (
        i &&
        (i.classList.remove("on"),
        (i.querySelector(".app-s").hidden = !0),
        setTimeout(() => {
          i.hidden = !0;
        }, 650),
        (c = !1),
        e)
      )
        try {
          localStorage.setItem(a, Date.now());
        } catch (e) {}
    }
    (addEventListener("beforeinstallprompt", (e) => {
      (e.preventDefault(), (o = e), m());
    }),
      addEventListener("appinstalled", () => h(!0)));
    let u = !1;
    function m() {
      if (!u && d())
        if (((u = !0), n.matches)) {
          const e = () => {
            const t = document.documentElement;
            (scrollY + innerHeight) / t.scrollHeight > 0.55 &&
              (removeEventListener("scroll", e), p());
          };
          (addEventListener("scroll", e, { passive: !0 }), e());
        } else setTimeout(p, 4e3);
    }
    t || s
      ? m()
      : setTimeout(() => {
          !o && /chrome|crios|edg|android/i.test(e) && ((r = !0), m());
        }, 7e3);
  })(),
  (function () {
    const e = document.getElementById("nmar");
    if (e && "undefined" != typeof PX) {
      let t = [0, 0],
        s = 0,
        a = 0;
      const n = () => {
        e.innerHTML =
          '<svg viewBox="1 0 14 16" aria-hidden="true">' +
          PX.mario(t, PX.bl()) +
          "</svg>";
      };
      (n(),
        document.addEventListener("np:update", function () {
          const t = !(!window.__np || !window.__np.playing);
          (clearTimeout(s),
            clearTimeout(a),
            n(),
            t
              ? (e.classList.remove("away"),
                e.classList.add("walk", "bop"),
                (a = setTimeout(() => e.classList.remove("walk"), 900)))
              : (e.classList.remove("bop"),
                e.classList.contains("away") ||
                  (e.classList.add("walk"),
                  (s = setTimeout(() => e.classList.add("away"), 450)),
                  (a = setTimeout(() => e.classList.remove("walk"), 1500)))));
        }),
        ["px:blink", "px:accent", "px:update"].forEach((e) =>
          document.addEventListener(e, n),
        ),
        e.addEventListener("click", () => {
          (e.classList.remove("hop"), e.offsetWidth, e.classList.add("hop"));
        }));
    }
    const t = document.getElementById("gcam");
    t &&
      t.addEventListener("click", () => {
        (t.classList.remove("snap"), t.offsetWidth, t.classList.add("snap"));
      });
  })(),
  (function () {
    const e = matchMedia("(prefers-reduced-motion:reduce)").matches,
      t = document.getElementById("pl-dl"),
      s = t.querySelector("#dlc"),
      a = t.querySelector("#dlt"),
      n = [...t.querySelectorAll("#dlb i")],
      o = t.querySelector("#dla");
    let i = 0;
    const c = [
        "Folding the pixels",
        "Packing my profile",
        "Flying it over",
        "Landing on your device",
      ],
      l = () => t.classList.contains("show");
    let r = null;
    const d = () => {
      l() &&
        (clearInterval(i),
        t.classList.remove("show"),
        s.classList.remove("run", "ok"),
        (document.body.style.overflow = ""),
        mvT(t, 0, 0),
        sync(),
        r && r.focus && r.focus({ preventScroll: !0 }));
    };
    function p() {
      (clearInterval(i),
        l() ||
          ((r = document.activeElement),
          document.documentElement.classList.contains("cv")
            ? (mvT(t, 0, 0),
              (function () {
                const e = cv.getBoundingClientRect(),
                  s = cv.offsetWidth;
                let a = (innerWidth / 2 - e.left) / Z - 210;
                a = Math.max(12, Math.min(s - 420 - 12, a));
                let n = (innerHeight / 2 - e.top) / Z - 170;
                ((n = Math.max(8, Math.min(cv.offsetHeight - 360, n))),
                  t.style.setProperty("--ix", a + "px"),
                  t.style.setProperty("--iy", n + "px"));
              })())
            : (document.body.style.overflow = "hidden"),
          t.classList.add("show"),
          sync()),
        (o.hidden = !0),
        s.classList.remove("ok"),
        n.forEach((e) => e.classList.remove("on")),
        "undefined" != typeof PX &&
          (t.querySelector("#dlm").innerHTML =
            '<svg viewBox="1 0 14 16" aria-hidden="true">' +
            PX.mario([1, 0], 0) +
            "</svg>"));
      const d = () => {
        (n.forEach((e) => e.classList.add("on")),
          s.classList.remove("run"),
          s.classList.add("ok"),
          (a.textContent = "Your CV is ready to save"),
          (o.hidden = !1),
          o.querySelector("a").focus());
      };
      if (e) return ((a.textContent = ""), d());
      (s.classList.remove("run"), s.offsetWidth, s.classList.add("run"));
      let p = 0;
      ((a.textContent = c[0]),
        (i = setInterval(() => {
          (p++,
            n.forEach((e, t) => e.classList.toggle("on", t < p)),
            (a.textContent = c[Math.min(c.length - 1, Math.floor(p / 3.2))]),
            p >= 12 && (clearInterval(i), d()));
        }, 230)));
    }
    (document.querySelectorAll("a.dlh,#cvdl").forEach((e) =>
      e.addEventListener("click", (e) => {
        (e.preventDefault(), p());
      }),
    ),
      t.addEventListener("click", (e) => {
        (e.target.closest("[data-x]") || "dlq" === e.target.id) && d();
      }),
      addEventListener("keydown", (e) => {
        "Escape" === e.key && l() && d();
      }),
      mq.addEventListener("change", d));
  })(),
  (function () {
    const e = (e) => {
        (e.classList.remove("snap"), e.offsetWidth, e.classList.add("snap"));
      },
      t = document.getElementById("nsy"),
      s = document.getElementById("mnc");
    if (t && (t.addEventListener("click", () => e(t)), s)) {
      const e = () => {
        const e = s.textContent.match(/(\d+)\s*\/\s*(\d+)/);
        t.classList.toggle("done", !!e && +e[2] > 0 && +e[1] === +e[2]);
      };
      (new MutationObserver(e).observe(s, {
        childList: !0,
        characterData: !0,
        subtree: !0,
      }),
        e());
    }
    const a = document.getElementById("arb"),
      n = document.getElementById("axf");
    a &&
      (a.addEventListener("click", () => e(a)),
      n && n.addEventListener("click", () => e(a)));
  })(),
  (function () {
    const e = document.getElementById("pop"),
      t = document.getElementById("profB"),
      s = document.getElementById("pcx"),
      a = document.getElementById("zmn");
    (s &&
      s.addEventListener("click", () => {
        e.classList.contains("open") && t.click();
      }),
      document.addEventListener(
        "pointerdown",
        (s) => {
          e &&
            e.classList.contains("open") &&
            !s.target.closest("#pop,#profB,#me") &&
            t.click();
        },
        !0,
      ),
      addEventListener("keydown", (e) => {
        "Escape" === e.key && a && !a.hidden && (a.hidden = !0);
      }));
  })());
