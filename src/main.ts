import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);

// Handle GitHub Pages SPA redirect
const redirect = sessionStorage.getItem("redirect");
if (redirect) {
  sessionStorage.removeItem("redirect");
  const path = redirect.replace("/homepage", "");
  router.replace(path || "/");
}

app.mount("#app");
