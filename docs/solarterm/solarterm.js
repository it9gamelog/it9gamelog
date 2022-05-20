let data;
let solartermZh = [];
let solartermEn = [];
let zodiacEmoji = [];
let zodiacZh = [];
let zodiacEn = [];

let currentYear;

let t = document.querySelector("div.ft-wrapper table");
let tHeader = document.querySelector("template#header-cell");
let tYear = document.querySelector("template#year-cell");
let tzs = $("#timezone");

if (window.moment && tzs) {
  tzs.select2({
    data: moment.tz.names(),
  });
  tzs.val(moment.tz.guess()).trigger("change");
}

let currentTz = "";

tzs.on("select2:select", function (e) {
  var data = e.params.data;
  tzs.val(data.text).trigger("change");
  refresh(data.text, currentYear);
});

let loadData = async () => {
  if (data) return;
  let keys = (await (await fetch("/solarterm/solarterm-key.csv")).text()).split(
    "\n"
  );

  for (let i = 0; i < keys.length; i++) {
    if (keys[i].includes("Solar Term")) {
      let texts = keys.slice(i + 1, i + 25);
      solartermZh = texts.map((v) => v.split(" ")[0]);
      solartermEn = texts.map((v) => v.match(/ (.*)/)[1]);
    }
    if (keys[i].includes("Zodiac Text")) {
      let texts = keys.slice(i + 1, i + 13);
      zodiacZh = texts.map((v) => v.split(" ")[0]);
      zodiacEn = texts.map((v) => v.split(" ")[1]);
    }
    if (keys[i].includes("Zodiac Emoji")) {
      zodiacEmoji = keys.slice(i + 1, i + 13);
    }
  }

  data = (await (await fetch("/solarterm/solarterm-data.csv")).text()).split(
    "\n"
  );
};

let populateHeader = (lang) => {
  if (!t) return;
  let zh = lang === "zh";
  let solartermP = zh ? solartermZh : solartermEn;
  let zodiacP = zh ? zodiacZh : zodiacEn;

  for (let i = 0; i < 24; i++) {
    let r = t.insertRow(i + 1);
    let zi = Math.floor(((i - 5 + 24) % 24) / 2);

    let h = tHeader.content.cloneNode(true);
    h.className = "header";
    h.querySelector(".text").textContent = zodiacP[zi];
    h.querySelector(".emoji").textContent = zodiacEmoji[zi];
    r.appendChild(h);

    h = tHeader.content.cloneNode(true);
    h.className = "header";
    h.querySelector(".text").textContent = solartermP[i];
    r.appendChild(h);
  }
};

populateYearSelector = (year, yearSelector, path) => {
  if (!yearSelector) {
    yearSelector = document.querySelector("#year-selector");
    path = "";
  }
  if (!path) path = "";

  for (let row of data) {
    if (!row.match(/^[0-9]{4}/)) continue;
    let dataYear = parseInt(row.substring(0, 4));

    let t = tYear.content.cloneNode(true);
    if (dataYear != year) {
      t.querySelector("a").href = `${path}${dataYear}.html`;
      t.querySelector("a").textContent = `${dataYear}`;
    } else {
      t.querySelector("a").remove();
      t.textContent = `${dataYear}`;
    }
    yearSelector.appendChild(t);
  }
};

let refresh = (tz, year) => {
  if (!t) return;
  if (!data) return;

  t.querySelectorAll(".dd").forEach((e) => e.remove());
  let dataRows = t.querySelectorAll("tr:not(.heading)");
  for (let row of data) {
    if (row.match(/^\s*$/)) continue;
    dataYear = row.substring(0, 4);
    if (dataYear != `${year}`) continue;

    terms = row.split(",");
    for (let i = 0; i < 24; i++) {
      let d = moment.tz(terms[i] + "Z", tz);
      let c = dataRows[i].insertCell();
      c.innerText = d.format("YYYY-MM-DD HH:mm:ss");
      c.className = "dd";
    }
  }
};

async function showSolarterm(year, lang) {
  currentYear = year;
  await loadData();
  populateHeader(lang);
  populateYearSelector(year);
  if (window.moment) {
    refresh(moment.tz.guess(), year);
  }

  document
    .querySelectorAll(".loading")
    .forEach((e) => (e.style.display = "none"));
  sectionHeight();
}

async function showYearSelector() {
  await loadData();

  populateYearSelector(0);
  document
    .querySelectorAll(".loading")
    .forEach((e) => (e.style.display = "none"));
  sectionHeight();
}
