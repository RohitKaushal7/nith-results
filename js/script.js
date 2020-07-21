// DISCLAIMER : I didn't knew React at the time I made this website. Thats why It is as It is.

var container = document.querySelector(".container"); // Main Data Container

// controllers
var branch;
var batch;
var cs = "c";
var ranking = "S"; // real Ranks

// theme
var dark = localStorage.getItem('dark');
if (dark === undefined) dark = 1;
if (dark == 1) {
  dark = 0;
  toggleDark();
} else {
  document.body.classList.remove('dark');
}

var n_elem = 200; // Number of elements per page
var limit = n_elem; // for pagination purpose

var xhr;
var data; // XHR response data
var res; // Search Result
var your_res; // Local user result if exists in the current page (`data`)

var you = document.querySelector("#you"); // Local Username / Result Container
var you_id; // JSON object - Local
var you_obj_res; // User Object JSON.parse(you_id)
var name; // User name S/D stripped

var res_cnt = document.querySelector("#res_cnt"); // Results found Count

getLocalUser(); // greet user if exists
if (you_obj_res.Rollno != 0) {
  document.querySelector("#rem").innerHTML =
    "Hi, " + name + '<span id="edit">🖊</span>';
}

setTimeout(change, 1000); // auto change to full_year in 3 sec.

// change branch or year. > Sends XHR
function change() {
  limit = n_elem;
  clear();
  branch = document.querySelector("#branch").value;
  batch = document.querySelector("#batch").value;
  ranking = document.querySelector("#ranking").value;
  xhr = new XMLHttpRequest();

  if (branch == "FULL_COLLEGE") {
    xhr.open("get", `./json/${branch}/full_college_${cs}gpi.json`);
  } else if (branch == "FULL_YEAR") {
    xhr.open("get", `./json/${branch}/full_year_batch${batch}_${cs}gpi.json`);
  } else {
    xhr.open("get", `./json/${branch}/batch_${batch}_${cs}gpi.json`);
  }

  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        data = JSON.parse(xhr.responseText);
        if (ranking == "S") StandardRanks(data);
        else if (ranking == "D") DenseRanks(data);

        render();
      }
    }
  };
}

// CGPA / SGPA toggle
function cs_toggle() {
  if (cs == "c") {
    cs = "s";
    this.innerText = "Sg";
  } else {
    cs = "c";
    this.innerText = "Cg";
  }
  change();
}

// Search
var ser = document.querySelector('input[type="search"]');
ser.addEventListener("keyup", function (e) {
  if (
    [
      13,
      8,
      32,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56,
      57,
      ...[...Array(26).keys()].map(x => 65 + x)
    ].indexOf(e.keyCode) == -1
  ) {
    // console.log(e.keyCode,'skipped');
    return;
  }
  // console.log(e.keyCode,'passed');

  let ip = String(
    document.querySelector("input[type=search]").value
  ).toUpperCase();
  let divs = document.querySelectorAll(".container > div");
  res_cnt.innerHTML = "";

  // in FULL SEARCH -search in the data[] instead of divs to find every result.
  if (branch == "FULL_COLLEGE" || branch == "FULL_YEAR") {
    res = data.filter(
      obj =>
        JSON.stringify(obj)
          .toUpperCase()
          .indexOf(ip) != -1
    );

    if (!ip && divs.length < 100) {
      // refresh / clear the search when input is empty
      change();
    } else if (ip) {
      clear();
      if (res) {
        res_cnt.innerHTML = res.length + " results found...";

        for (let i = 0; i < Math.min(n_elem, res.length); ++i) {
          renderSmooth(res[i], i);
        }
      }
    }
  }

  // search in DOM divs to avoid clearing the whole DOM.
  else {
    for (var div of divs) {
      str = String(div.innerText).toUpperCase();
      if (str.indexOf(ip) > -1) {
        div.style.display = "block";
      } else {
        div.style.display = "none";
      }
    }
  }
});

// Get Full Result
let con = document.querySelector(".fullResult");
con.addEventListener("dblclick", function (e) {
  con.style.display = "none";
});
function fullResult(roll, el) {
  document.body.style.cursor = "wait";
  el.style.cursor = "wait";
  fetch(`https://nithp.herokuapp.com/api/result/student/${roll}`)
    .then(res => res.json())
    .then(res => {
      document.body.style.cursor = "initial";
      el.style.cursor = "initial";
      // console.log(res);

      con.style.display = "flex";
      con.innerHTML = "";
      con.innerHTML += `
        <div class="stInfo">
        <div class="stDesc">
          <div class="stName">${res.name}</div>
          <div class="stRoll">${res.roll} ${res.branch}</div>
          
        </div>
        <div class="stcg">
          <div class="cp">${res.cgpi}</div>
          <div class="cp_total">${
        res.summary[res.summary.length - 1].cgpi_total
        }</div>
        </div>
        </div>
        `;
      let stSemesters = document.createElement("div");
      stSemesters.className = "stSemesters";
      for (let i = 8; i > 0; --i) {
        let thisSem = res.result.filter(x => x.sem == i);
        let sem = document.createElement("div");
        sem.className = "sem";
        if (thisSem.length) {
          let stsg = document.createElement("div");
          stsg.className = "stsg";
          stsg.innerHTML = `
              <div class="semN">Sem ${i}</div>
              <div class="sg_total"> +${res.summary[i - 1].sgpi_total}</div>
              <div class="sg">${res.summary[i - 1].sgpi}</div>
            `;
          sem.appendChild(stsg);
          let subs = document.createElement("div");
          subs.className = "subs";
          for (subj of thisSem) {
            let sub = document.createElement("div");
            sub.className = "sub";
            sub.innerHTML = `
                <div class="code">${subj.subject}</div>
                <div class="grade ${subj.grade}">${Number(subj.sub_gp) / Number(subj.sub_point)}</div>
              `;
            subs.appendChild(sub);
          }
          sem.appendChild(subs);
        }
        if (sem.innerHTML != "") stSemesters.appendChild(sem);
      }
      con.appendChild(stSemesters);

      con.innerHTML += `<div>
                          <a href="https://nithp.herokuapp.com/result/student?roll=${roll}"> Source</a>
                          <i style="color:#666; margin-left:2rem;">Double click anywhere to close.</i>
                        </div>`;

      // window.open(`https://nithp.herokuapp.com/result/student?roll=${roll}`);
    })
    .catch(err => {
      console.log("Error : " + err);
      window.open(`https://nithp.herokuapp.com/result/student?roll=${roll}`);
    });
}

// create n new Card for Student // ----------------------------------------------------------------------------------------------------
function create(stud) {
  let node = document.createElement("div");
  node.className = "card";

  let Name = document.createElement("div");
  Name.className = "Name";
  Name.innerText = stud.Name.split("S/D")[0];
  // Name.title = "Name";
  let Rollno = document.createElement("div");
  Rollno.className = "Rollno";
  Rollno.innerText = stud.Rollno;
  Rollno.title = "Rollno";
  let Rank = document.createElement("div");
  Rank.className = "Rank";
  Rank.innerText = "#_" + stud.Rank;
  // Rank.title = "Rank";
  let Cgpa = document.createElement("div");
  Cgpa.className = "Cgpa";
  Cgpa.innerText = cs == "c" ? stud.Cgpa : stud.Sgpa;
  Cgpa.title = cs == "c" ? "Cgpa" : "Sgpa";
  let Sgpa = document.createElement("div");
  Sgpa.className = "Sgpa";
  Sgpa.innerText = cs == "c" ? stud.Sgpa : stud.Cgpa;
  Sgpa.title = cs == "c" ? "Sgpa" : "Cgpa";
  let Points = document.createElement("div");
  Points.className = "Points";
  Points.innerText = stud.Points;
  Points.title = "Points";

  if (branch == "FULL_COLLEGE") {
    // + Branch, Year
    let Branch = document.createElement("div");
    Branch.className = "Branch";
    Branch.innerText = stud.Branch;
    let Year = document.createElement("div");
    Year.className = "Year";
    Year.innerText = stud.Year;
    node.append(Rank, Name, Rollno, Branch, Year, Points, Sgpa, Cgpa);
  } else if (branch == "FULL_YEAR") {
    // + Branch
    let Branch = document.createElement("div");
    Branch.className = "Branch";
    Branch.innerText = stud.Branch;
    node.append(Rank, Name, Rollno, Branch, Points, Sgpa, Cgpa);
  } else {
    // +
    node.append(Rank, Name, Rollno, Points, Sgpa, Cgpa);
  }

  node.setAttribute("data-rank", stud.Rank);
  node.setAttribute(
    "data-base",
    Number(Cgpa.innerText) >= 9.5 && Number(Cgpa.innerText) < 10
      ? "9.5"
      : parseInt(Cgpa.innerText)
  );
  node.setAttribute("title", "Click to view Complete Result");

  node.addEventListener("click", e => {
    e.target.style.cursor = "busy";
    e.target.style.filter = "drop-shadow(10px -10px 2px #0003)";
    fullResult(stud.Rollno, e.target);
  });

  return node;
}

// render `data` > divs in the container // ----------------------------------------------------------------------------------------------------
function render() {
  limit = limit < data.length ? limit : data.length;
  // enable page-navigation buttons if data exceeds n_elem
  if (data.length > n_elem) {
    document.querySelector(".nav").style.display = "flex";
  } else {
    document.querySelector(".nav").style.display = "none";
  }

  // find User result
  getLocalUser();
  your_res = data.filter(obj => obj.Rollno == you_obj_res.Rollno)[0];
  if (your_res) {
    you.innerHTML = "";
    you.appendChild(create(your_res));
    you.innerHTML += `<span id="edit" onclick="togglePopup()" title="Edit Your Roll No.">🖊</span>`;
  } else {
    you.innerHTML = `<span id ='rem'>You are not Here..!<span id="edit" onclick="togglePopup()" title="Edit Your Roll No.">🖊</span></span>`;
  }

  // Statastics 
  let mean = data.reduce((acc, cur) => acc + Number(cur.Sgpa != "0" ? cur.Cgpa : 0), 0) / (data.length - data.filter((st => st.Sgpa == "0")).length);
  document.querySelector('#stats').innerHTML = `Avg : ${mean.toFixed(3)}`;


  // Render the divs
  let i = 0;
  for (const stud of data) {
    renderSmooth(stud, i, 20);
    i++;
    if (i > limit) break;
  }
}

// Renders with animation
function renderSmooth(div, i, n = 50) {
  if (Number(div.Cgpa)) {
    if (i < n) {
      // animations delay for some first divs
      anim_div = create(div);
      anim_div.style.animationDelay = i / 50 + "s";
      container.appendChild(anim_div);
    } else {
      container.appendChild(create(div));
    }
  }
}

// Clears the Container
function clear() {
  let divs = document.querySelectorAll(".container > div");

  for (var div of divs) {
    div.parentElement.removeChild(div);
  }
}

// Pagination navigation // ----------------------------------------------------------------------------------------------------
function next() {
  clear();
  p_data = res || data;
  limit += n_elem;
  limit = limit > p_data.length ? p_data.length : limit;
  for (i = Math.max(0, limit - n_elem); i < limit; ++i) {
    if (Number(p_data[i].Cgpa)) {
      container.appendChild(create(p_data[i]));
    }
  }
}

function prev() {
  clear();
  p_data = res || data;
  limit -= n_elem;
  limit = limit < n_elem ? n_elem : limit;
  for (i = Math.max(0, limit - n_elem); i < limit; ++i) {
    if (Number(p_data[i].Cgpa)) {
      container.appendChild(create(p_data[i]));
    }
  }
}

// Local User Popup // ----------------------------------------------------------------------------------------------------
var popup = document.querySelector(".popup");
function togglePopup() {
  if (popup.style.display == "none") {
    popup.style.display = "flex";
    popup.style.transform = "scale(1)";
    popup.style.opacity = 1;
    popup.querySelector("input").focus();
  } else {
    setTimeout(() => {
      popup.style.display = "none";
    }, 1000);
    popup.style.transform = "scale(1.1)";
    popup.style.opacity = 0;
  }
}

// Esc popup
popup.addEventListener("keyup", function (e) {
  if (e.keyCode == 27) togglePopup();
});
popup.addEventListener("dblclick", function (e) {
  togglePopup();
});
// store User rollNo on LocalStorage
document.querySelector("#form_you_inp").addEventListener("submit", function (e) {
  e.preventDefault(e);
  tmp = document.querySelector("#you_inp").value;
  console.log(tmp);
  rollno_ip = tmp != "" && tmp != null ? tmp : you_id;
  you_obj = data.filter(
    obj =>
      JSON.stringify(obj)
        .toUpperCase()
        .indexOf(rollno_ip) != -1
  )[0];
  console.log(you_obj);

  let save_str;
  if (you_obj) {
    save_str = JSON.stringify(you_obj);
  } else {
    save_str = JSON.stringify({ Rollno: rollno_ip, Name: "There" });
  }
  console.log(save_str);

  localStorage.setItem("you_id", save_str);
  change();
  togglePopup();
});

// get the local user if it is in the localStorage
function getLocalUser() {
  you_id = localStorage.getItem("you_id") || "";
  if (you_id) {
    you_obj_res = JSON.parse(you_id);
  } else {
    you_obj_res = { Rollno: 0, Name: "There" };
  }
  if (you_obj_res) name = toTitleCase(you_obj_res.Name.split("S/D")[0]);
}

// Tip
(function load_tip() {
  let tip = localStorage.getItem("tip");
  if (!tip) {
    document.querySelector(".tip").style.display = "block";
  }
})();

function tip_close() {
  localStorage.setItem("tip", true);
  document.querySelector(".tip").style.display = "none";
}

// Save csv
function csv() {
  let text = "Rollno,Name,Branch,Year,Points,Sgpa,Cgpa\n";
  sorted = data.sort((x, y) => Number(x.Rollno) - Number(y.Rollno));
  for (const st of sorted) {
    text += `${st.Rollno},${st.Name},${st.Branch},${st.Year},${st.Points},${st.Sgpa},${st.Cgpa}\n`;
  }
  // console.log(text);

  let a = document.createElement("a");
  a.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(text)
  );
  a.setAttribute("download", `${branch}_${batch}.csv`);

  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// window.addEventListener("resize", () => {
//   clear();
//   render();
//   console.log("resized");
// });

function toggleDark() {
  let moon = document.querySelector('.dark_toggle')
  let cover = document.querySelector('.dark_toggle .cover')
  if (dark == 1) {
    localStorage.setItem('dark', 0);
    document.body.classList.remove('dark');
    dark = 0;
    cover.style.width = "2.5em";
    cover.style.height = "2.5em";
    cover.style.background = "#ffd700";
  }
  else {
    localStorage.setItem('dark', 1);
    document.body.classList.add('dark');
    dark = 1;
    cover.style.width = "1.7em";
    cover.style.height = "1.7em";
    cover.style.background = "#111";
  }
}

// Helper Fuctions // ----------------------------------------------------------------------------------------------------
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function StandardRanks(data) {
  let k = 1;
  if (cs == "c") {
    for (let i = 1; i < data.length; ++i) {
      if (data[i - 1].Cgpa != data[i].Cgpa) k = i + 1;
      data[i].Rank = k;
    }
  } else {
    for (let i = 1; i < data.length; ++i) {
      if (data[i - 1].Sgpa != data[i].Sgpa) k = i + 1;
      data[i].Rank = k;
    }
  }
}
function DenseRanks(data) {
  let k = 1;
  if (cs == "c") {
    for (let i = 1; i < data.length; ++i) {
      if (data[i - 1].Cgpa != data[i].Cgpa) k++;
      data[i].Rank = k;
    }
  } else {
    for (let i = 1; i < data.length; ++i) {
      if (data[i - 1].Sgpa != data[i].Sgpa) k++;
      data[i].Rank = k;
    }
  }
}
