import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

// Handle GitHub Pages SPA redirect
const params = new URLSearchParams(window.location.search);
const redirectPath = params.get("p");
if (redirectPath) {
  const cleanUrl = window.location.pathname + window.location.hash;
  window.history.replaceState(null, "", cleanUrl);
  router.replace(redirectPath);
}

const app = createApp(App);
app.use(router);
app.mount("#app");
