import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "EditPage",
    component: () =>
      import(/* webpackChunkName: "editpage" */ "../views/EditPage.vue")
  },
  {
    path: "/preview",
    name: "Preview",
    component: () =>
      import(/* webpackChunkName: "preview" */ "../views/Preview.vue")
  }
];

const router = new VueRouter({
  mode: process.env.VUE_APP_ROUTER_MODE,
  base: process.env.BASE_URL,
  routes
});

export default router;
