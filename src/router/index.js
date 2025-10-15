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
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/"];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem("token");

  // If logged in and trying to access login page, redirect to dashboard
  if (to.path === "/" && token) {
    return next("/dashboard");
  }

  // If not logged in and trying to access protected page, redirect to login
  if (authRequired && !token) {
    return next("/");
  }

  next();
});

export default router;
