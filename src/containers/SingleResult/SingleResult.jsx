import React, { useEffect, useState } from "react";
import "./SingleResult.scss";

export default function SingleResult({ history, match }) {
  const [result, setResult] = useState();

  useEffect(() => {
    fetch(`https://nithp.herokuapp.com/api/result/student/${match.params.roll}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setResult(res);
      });
  }, []);

  if (!result) {
    return null;
  }

  let semesters = [8, 7, 6, 5, 4, 3, 2, 1]
    .map((sem) => result.result.filter((x) => x.sem == sem))
    .filter((sem) => sem.length);

  console.log(semesters);
  return (
    <div className="fullResult">
      <div className="stInfo">
        <div className="stDesc">
          <div className="stName">{result.name}</div>
          <div className="stRoll">
            {result.roll} {result.branch}
          </div>
        </div>
        <div className="stcg">
          <div className="cp">{result.cgpi}</div>
          <div className="cp_total">
            {result.summary[result.summary.length - 1].cgpi_total}
          </div>
        </div>
        <div className="ranks">
          <div className="rk">
            <span className="rkt">#_ {result.rank.class.cgpi}</span> class
          </div>
          <div className="rk">
            <span className="rkt">#_ {result.rank.year.cgpi}</span> year
          </div>
          <div className="rk">
            <span className="rkt">#_ {result.rank.college.cgpi}</span> college
          </div>
        </div>
      </div>
      <div className="stSemesters">
        {semesters.map((sem) => (
          <div className="sem">
            <div className="stsg">
              <div class="semN">Sem {sem[0].sem}</div>
              <div class="sg_total">
                {" "}
                +{result.summary[sem[0].sem - 1].sgpi_total}
              </div>
              <div class="sg">{result.summary[sem[0].sem - 1].sgpi}</div>
            </div>
            <div className="subs">
              {sem.map((subj) => (
                <div className="sub">
                  <div className="code">{subj.subject}</div>
                  <div className={`grade ${subj.grade}`}>
                    {Number(subj.sub_gp) / Number(subj.sub_point)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
