import { setupCounter } from "./counter.js";

setupCounter(document.querySelector("#counter"));

// window.lwx.setLogEnable(true);
const code = window.lwx.getCodeFormUrl() || "no find code";
console.log("lwx-jsb_web", code);

window.lwx
  .getAppRunInfo("token")
  .then((res) => {
    console.log("lwx-jsb_web res---", res);
  })
  .catch((err) => {
    console.log("lwx-jsb_web err---", err);
  });
window.lwx
  .getAppRunInfo("token")
  .then((res) => {
    console.log("lwx-jsb_web res---", res);
  })
  .catch((err) => {
    console.log("lwx-jsb_web err---", err);
  });
window.lwx
  .getAppRunInfo("token")
  .then((res) => {
    console.log("lwx-jsb_web res---", res);
  })
  .catch((err) => {
    console.log("lwx-jsb_web err---", err);
  });
