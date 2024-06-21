import { route } from "quasar/wrappers";
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from "vue-router";
import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === "history" ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // 添加路由守衛
  Router.beforeEach((to, from, next) => {
  // 如果目標路由是 /，將 body 的背景顏色設置為漸層色
    if (to.path === "/") {
      document.body.style.backgroundColor = "#5453A9"; // 瀏覽器不支援漸層色時的後備顏色
      document.body.style.backgroundImage = "linear-gradient(to bottom right, #5453A9, #2466E2)";
    } else {
    // 其他情況下將 body 的背景顏色設置為白色
      document.body.style.backgroundColor = "white";
      document.body.style.backgroundImage = "none"; // 清除漸層色
    }
    next();
  });

  return Router;
});
