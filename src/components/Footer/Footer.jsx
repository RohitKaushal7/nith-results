import React from "react";
import GitHubButton from "react-github-btn";
import "./Footer.scss";

export default function Footer({ hits }) {
  return (
    <div className="footer">
      <GitHubButton
        href="https://github.com/RohitKaushal7/nith-results"
        data-color-scheme="no-preference: light; light: light; dark: dark;"
        data-icon="octicon-star"
        data-show-count="true"
        aria-label="Star RohitKaushal7/nith-results on GitHub"
      >
        Star
      </GitHubButton>
      <span id="me">
        Made with <span className="heart">❤</span> by{" "}
        <a href="https://github.com/RohitKaushal7">Rohit Kaushal</a>.
      </span>
      <span id="ref">
        API : <a href="https://nithp.herokuapp.com/">nithp.herokuapp.com/</a>
      </span>
      <span id="count">{hits ? hits : "hits"}</span>
    </div>
  );
}
