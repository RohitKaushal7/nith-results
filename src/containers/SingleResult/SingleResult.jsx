import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import { getResultByRollNumber } from "../../services/api";
import sadImg from "../../assets/perry.png";
import "./SingleResult.scss";

export default function SingleResult({ history, match }) {
  const [result, setResult] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    getResultByRollNumber(match.params.roll).then((res) => {
      if (res) {
        setResult(res);
        setError(null);
      } else {
        setError({
          message: "Failed to Fetch",
        });
      }
    });
  }, []);

  if (error) {
    return (
      <div className="fullResult error">
        <div className="notice">
          <img src={sadImg} alt="" width={200} />
          <div>
            <h2>😕 Hey! this project stopped working because...</h2>
            <p>
              The results portal on the official NITH results websites now has a
              human verification captcha, making web scrapping not possible /
              hard. So we can't programetically create a database of everyone's
              result. This website can't work unless either there is another way
              to scrap the results data or NITH itself provides a results API.
            </p>
            <p>
              Although unfortunately this website can no longer work, we had a
              pretty good achievement of receiving more than 400K pageviews. 😊
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (!result) {
    return <div className="fullResult loading">loading...</div>;
  }

  let semesters = [8, 7, 6, 5, 4, 3, 2, 1]
    .map((sem) => result?.result.filter((x) => x.sem == sem))
    .filter((sem) => sem.length);

  return (
    <div className="fullResult">
      <header>
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
        <div className="home">
          <Link to="/">
            <Header />
          </Link>
        </div>
      </header>
      <div className="stSemesters">
        {semesters.map((sem, i) => (
          <div
            className="sem"
            key={i}
            style={{ animationDelay: i * 0.1 + "s" }}
          >
            <div className="stsg">
              <div className="semN">Sem {sem[0].sem}</div>
              <div className="sg_total">
                {" "}
                +{result.summary[sem[0].sem - 1].sgpi_total}
              </div>
              <div className="sg">{result.summary[sem[0].sem - 1].sgpi}</div>
            </div>
            <div className="subs">
              {sem.map((subj) => (
                <div className="sub" key={subj.subject}>
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
