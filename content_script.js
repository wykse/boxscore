// Put all the javascript code here, that you want to execute after page load.

window.addEventListener("dblclick", () => {
  if (document.querySelector(".boxscore")) {
    removeBoxscore();
  }

  if (isNBA()) {
    getStats().then((stats) => {
      loadBoxscore(stats);
    });
  }
});

function removeBoxscore() {
  let boxscore = document.querySelectorAll(".boxscore");
  for (let i = 0; i < boxscore.length; i++) {
    boxscore[i].remove();
  }
}

function isNBA() {
  if (getTeams() && getDate()) {
    return true;
  } else {
    return false;
  }
}

function getTeams() {
  const allTeams = [
    "76ers",
    "bucks",
    "bulls",
    "cavaliers",
    "celtics",
    "clippers",
    "grizzlies",
    "hawks",
    "heat",
    "hornets",
    "jazz",
    "kings",
    "knicks",
    "lakers",
    "magic",
    "mavericks",
    "nets",
    "nuggets",
    "pacers",
    "pelicans",
    "pistons",
    "raptors",
    "rockets",
    "spurs",
    "suns",
    "thunder",
    "timberwolves",
    "trail blazers",
    "warriors",
    "wizards",
  ];

  // Get title, e.g., HAWKS at BUCKS | NBA FULL GAME HIGHLIGHTS | October 29, 2022 - YouTube
  const title = document.title;

  let teams = title.split("|")[0].split("at");
  teams = teams.map((team) => {
    return team.trim().toLowerCase();
  });

  // Validate team is actually a NBA team
  if (
    containsObject(teams[0], allTeams) &&
    containsObject(teams[1], allTeams)
  ) {
    return teams;
  } else {
    return;
  }
}

function getDate() {
  // Get title, e.g., HAWKS at BUCKS | NBA FULL GAME HIGHLIGHTS | October 29, 2022 - YouTube
  const title = document.title;

  let date = title.split("|")[title.split("|").length - 1];
  date = date.split("-")[0].trim();
  return new Date(date);
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function containsObject(obj, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === obj) {
      return true;
    }
  }
  return false;
}

function loadBoxscore(stats) {
  // Create div to insert table
  const boxDiv = document.createElement("div");
  boxDiv.setAttribute("class", "boxscore");
  boxDiv.style.fontSize = "15px";

  let teams = getTeams();

  // For each team, make a box score
  for (let i = 0; i < teams.length; i++) {
    // Start box score
    const tbl = document.createElement("table");
    tbl.setAttribute("id", teams[i] + "-boxscore");
    tbl.style.borderCollapse = "collapse";

    let team;

    if (i === 0) {
      team = stats.home;
    } else {
      team = stats.visit;
    }

    for (let j = 0; j < team.length; j++) {
      const tr = tbl.insertRow();
      // tr.style.backgroundColor = "#272727";
      for (let k = 0; k < 7; k++) {
        // Header row
        if (j === 0) {
          const th = tr.insertCell();
          th.style.border = "1px solid #ddd";
          th.style.backgroundColor = "#263850";
          th.style.paddingTop = "12px";
          th.style.paddingBottom = "12px";
          th.style.padding = "8px";
          th.style.textAlign = "left";
          th.style.color = "white";
          th.style.fontWeight = "bold";
          switch (k) {
            case 0:
              th.appendChild(
                document.createTextNode(`${toTitleCase(teams[i])}`)
              );
              break;
            case 1:
              th.appendChild(document.createTextNode("Min"));
              break;
            case 2:
              th.appendChild(document.createTextNode("FG"));
              break;
            case 3:
              th.appendChild(document.createTextNode("3PT"));
              break;
            case 4:
              th.appendChild(document.createTextNode("Reb"));
              break;
            case 5:
              th.appendChild(document.createTextNode("Ast"));
              break;
            case 6:
              th.appendChild(document.createTextNode("Pts"));
              break;
          }
        } else if (team[j].min !== 0 && team[j].sec !== 0) {
          const td = tr.insertCell();
          td.style.border = "1px solid #ddd";
          td.style.padding = "5px";
          td.style.textAlign = "center";
          switch (k) {
            case 0:
              td.appendChild(
                document.createTextNode(`${team[j].fn} ${team[j].ln}`)
              );
              td.style.textAlign = "left";
              break;
            case 1:
              td.appendChild(document.createTextNode(`${team[j].min}`));
              break;
            case 2:
              td.appendChild(
                document.createTextNode(`${team[j].fgm}-${team[j].fga}`)
              );
              break;
            case 3:
              td.appendChild(
                document.createTextNode(`${team[j].tpm}-${team[j].tpa}`)
              );
              break;
            case 4:
              td.appendChild(document.createTextNode(`${team[j].reb}`));
              break;
            case 5:
              td.appendChild(document.createTextNode(`${team[j].ast}`));
              break;
            case 6:
              td.appendChild(document.createTextNode(`${team[j].pts}`));
              break;
          }
        }
      }
    }
    boxDiv.appendChild(document.createElement("br"));
    boxDiv.appendChild(tbl);
  }

  // Add a remove button
  boxDiv.appendChild(document.createElement("br"));
  const cBtn = document.createElement("button");
  cBtn.innerText = "Close";
  boxDiv.append(cBtn);
  cBtn.addEventListener("click", (e) => {
    removeBoxscore();
  });

  const currentDiv = document.getElementById("bottom-row");
  // Add box scores
  currentDiv.before(boxDiv);
}

const getLeagueSlug = (gid) => {
  if (gid.startsWith("13")) {
    return "sacramento";
  } else if (gid.startsWith("14")) {
    return "orlando";
  } else if (gid.startsWith("15")) {
    return "vegas";
  } else if (gid.startsWith("16")) {
    return "utah";
  } else {
    return "nba";
  }
};

async function getStats(gid = "0022200085") {
  // Get box score
  const year = "2022";
  const leagueSlug = getLeagueSlug(gid);
  const url = `https://data.nba.com/data/10s/v2015/json/mobile_teams/${leagueSlug}/${year}/scores/gamedetail/${gid}_gamedetail.json`;
  let response = await fetch(url);
  response = await response.json();
  let h = await response.g.hls.pstsg;
  let v = await response.g.vls.pstsg;
  return { home: h, visit: v };
}
