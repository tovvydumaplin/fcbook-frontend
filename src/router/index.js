import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/home.vue";
import Login from "../views/Login.vue";
import createPort from "../views/createPort.vue";
import tellerBooking from "../views/tellerBooking.vue";
import ScheduleModule from "../views/ScheduleModule.vue";
import RoutesModule from "../views/RoutesModule.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/dashboard", component: Dashboard },
  { path: "/create-port", component: createPort },
  { path: "/teller-booking", component: tellerBooking },
  { path: "/schedule", component: ScheduleModule },
  { path: "/routes", component: RoutesModule },
];

const router = createRouter({
  history: createWebHistory("/fcbook-dev/"),
  routes,
});

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const jwt = token.startsWith("Bearer ") ? token.slice(7) : token;
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
}

router.beforeEach((to, from, next) => {
  const publicPages = ["/"];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem("token");

  // If logged in and trying to access login page, redirect to dashboard
  if (to.path === "/" && token && !isTokenExpired(token)) {
    return next("/dashboard");
  }

  // If not logged in (or token expired) and trying to access protected page, redirect to login
  if (authRequired && (!token || isTokenExpired(token))) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return next("/");
  }

  next();
});

export default router;
