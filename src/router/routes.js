const routes = [
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
  },
  {
    path: "/MainControl",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/MainControl.vue") },
    ],
  },
  {
    path: "/ProjectControl",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "project/:id", component: () => import("pages/ProjectControl.vue") },
    ],
  },
  {
    path: "/TaskControl",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "project/:projectId/tasks/:taskId", component: () => import("pages/TaskControl.vue") }
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
