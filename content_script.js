// Put all the javascript code here, that you want to execute after page load.

// Functions
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

  // Regular expression in case there are notifications in front of title, e.g., (231) HAWKS at BUCKS...
  const re = /\({1}\d+\){1}/;

  // Get title, e.g., HAWKS at BUCKS | NBA FULL GAME HIGHLIGHTS | October 29, 2022 - YouTube
  let title = document.title;

  // Clean title
  title = title.replace(re, "");

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

function getDate(string = false) {
  // Get title, e.g., HAWKS at BUCKS | NBA FULL GAME HIGHLIGHTS | October 29, 2022 - YouTube
  const title = document.title;

  let date = title.split("|")[title.split("|").length - 1];
  date = date.split("-")[0].trim();
  if (!string) {
    return new Date(date);
  } else {
    return date;
  }
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

    let players;

    if (i === 0) {
      players = stats.visit;
    } else {
      players = stats.home;
    }

    // Loop through players
    for (let j = 0; j <= players.length; j++) {
      const tr = tbl.insertRow();
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
          // Add players starting at 0
        } else if (players[j - 1].min + players[j - 1].sec > 0) {
          const td = tr.insertCell();
          td.style.border = "1px solid #ddd";
          td.style.padding = "5px";
          td.style.textAlign = "center";
          switch (k) {
            case 0:
              td.appendChild(
                document.createTextNode(
                  `${players[j - 1].fn} ${players[j - 1].ln}`
                )
              );
              td.style.textAlign = "left";
              break;
            case 1:
              td.appendChild(document.createTextNode(`${players[j - 1].min}`));
              break;
            case 2:
              td.appendChild(
                document.createTextNode(
                  `${players[j - 1].fgm}-${players[j - 1].fga}`
                )
              );
              break;
            case 3:
              td.appendChild(
                document.createTextNode(
                  `${players[j - 1].tpm}-${players[j - 1].tpa}`
                )
              );
              break;
            case 4:
              td.appendChild(document.createTextNode(`${players[j - 1].reb}`));
              break;
            case 5:
              td.appendChild(document.createTextNode(`${players[j - 1].ast}`));
              break;
            case 6:
              td.appendChild(document.createTextNode(`${players[j - 1].pts}`));
              break;
          }
        }
      }
    }
    boxDiv.appendChild(document.createElement("br"));
    boxDiv.appendChild(tbl);
  }

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

async function getStats(gid) {
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

// Get game id from background script
function getGid() {
  function handleResponse(message) {
    console.log(`Game ID: ${message.response}`);
    return message.response;
  }

  function handleError(error) {
    console.log(`Error: ${error}`);
  }
  const sending = browser.runtime.sendMessage({
    dateStr: getDate((string = true)),
    awayTeam: getTeams()[0],
  });
  return sending.then(handleResponse, handleError);
}

function loadExtension() {
  // Check video is an NBA game
  if (isNBA()) {
    getGid()
      .then((gid) => getStats(gid))
      .then((stats) => {
        loadBoxscore(stats);
      });
  }
}

function addBoxscoreBtn() {
  // Add button if one is not present
  if (!document.getElementById("btn-boxscore")) {
    const currentDiv = document.getElementById("bottom-row");

    // Add a button
    const div = document.createElement("div");
    div.setAttribute("id", "btn-boxscore");
    const btn = document.createElement("button");
    btn.innerText = "Box Score";

    // Button style
    btn.style.backgroundColor = "#fb8c00";
    btn.style.color = "white";
    btn.style.fontFamily = "Roboto, sans-serif";
    btn.style.fontWeight = "bold";
    btn.style.fontSize = "14px";
    btn.style.padding = "5px 10px";
    btn.style.border = "none";
    btn.style.borderRadius = "10px";

    div.appendChild(document.createElement("br"));
    div.appendChild(btn);
    currentDiv.before(div);

    btn.addEventListener("click", (e) => {
      if (document.querySelector(".boxscore")) {
        return removeBoxscore();
      } else if (isNBA()) {
        loadExtension();
      } else {
        console.log("Not a valid NBA video.");
      }
    });
  }
}

function removeBoxscoreBtn() {
  let btn = document.getElementById("btn-boxscore");
  btn.remove();
}

let previousUrl = window.location.href;
const observer = new MutationObserver(function (mutations) {
  if (window.location.href !== previousUrl) {
    console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
    previousUrl = window.location.href;
    setTimeout(() => {
      if (isNBA()) {
        removeBoxscore();
        addBoxscoreBtn();
      } else {
        removeBoxscore();
        removeBoxscoreBtn();
      }
    }, 1000);
  }
  if (isNBA()) {
    addBoxscoreBtn();
  }
});
const config = { subtree: true, childList: true };

// start listening to changes
observer.observe(document, config);
