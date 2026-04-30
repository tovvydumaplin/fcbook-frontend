import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/home.vue";
import Login from "../views/Login.vue";
import PortModule from "../views/PortModule.vue";
import tellerBooking from "../views/tellerBooking.vue";
import ScheduleModule from "../views/ScheduleModule.vue";
import RoutesModule from "../views/RoutesModule.vue";
import VesselsModule from "../views/VesselsModule.vue";
import RatesPassengerLayout from "../views/Rates/RatePassengerLayout.vue";
import PassengerMonitoringModule from "../views/PassengerMonitoringModule.vue";
import PassengerAccommodation from "../views/PassengerAccommodation.vue";
import VehiclesModule from "../views/VehiclesModule.vue";
import AgentsModule from "../views/Agents/AgentsLayout.vue";
import PromosDiscountsLayout from "../views/Promos/PromosDiscountsLayout.vue";
import VDARModule from "../views/VDARModule.vue";
import RefundsLayout from "../views/Refunds/RefundsLayout.vue";
import RefundsModule from "../views/Tellers/RefundsModule.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/dashboard", component: Dashboard },
  { path: "/ports", component: PortModule },
  { path: "/teller-booking", component: tellerBooking },
  { path: "/schedules", component: ScheduleModule },
  { path: "/routes", component: RoutesModule },
  { path: "/vessels", component: VesselsModule },
  { path: "/rates", component: RatesPassengerLayout },
  { path: "/passenger-monitoring", component: PassengerMonitoringModule },
  { path: "/passenger-accommodation", component: PassengerAccommodation },
  { path: "/vehicles", component: VehiclesModule },
  { path: "/agents", component: AgentsModule },
  { path: "/promos", component: PromosDiscountsLayout },
  { path: "/vdar", component: VDARModule },
  { path: "/refunds", component: RefundsLayout },
  { path: "/teller-refunds", component: RefundsModule },
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
