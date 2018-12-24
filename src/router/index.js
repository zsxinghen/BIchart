import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "boardCenter",
      component(resolve) {
        require(["../page/board-center/index"], resolve);
      }
    },
    {
      path: "/layoutCenter",
      name: "layoutCenter",
      component(resolve) {
        require(["../page/layout-center/index"], resolve);
      }
    },
    {
      path: "/chartCenter",
      name: "chartCenter",
      component(resolve) {
        require(["../page/chart-center/index"], resolve);
      }
    },
    {
      path: "/majorBorder",
      name: "majorBorder",
      component(resolve) {
        require(["../page/major-border/index"], resolve);
      }
    },
    {
      path: "/index",
      name: "index",
      component(resolve) {
        require(["../page/index"], resolve);
      }
    }
  ]
});
