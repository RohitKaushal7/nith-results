import React from "react";
import "./RememberMe.scss";

export default function RememberMe() {
  return (
    <div className="popup">
      <div className="title">Hi There</div>
      <div className="desc">
        Enter your Roll No. to remember you on this device.
      </div>
      <form id="form_you_inp">
        <input type="text" className="inp" id="you_inp" autoComplete="off" />
      </form>

      {/* <div className="tip">Tip - you can always change roll no by clicking on your info.</div> */}
    </div>
  );
}
