import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import {
  HomeIcon,
  UserIcon,
  CalendarDaysIcon,
  ArrowsRightLeftIcon,
  ClockIcon,
} from "@heroicons/vue/24/solid";

// Create the app instance
const app = createApp(App);

// Register icons globally
app.component("HomeIcon", HomeIcon);
app.component("UserIcon", UserIcon);
app.component("CalendarDaysIcon", CalendarDaysIcon);
app.component("ArrowsRightLeftIcon", ArrowsRightLeftIcon);
app.component("ClockIcon", ClockIcon);

// Use the router
app.use(router);

// Mount the app
app.mount("#app");
