import "./assets/fonts/a_calling_font_d_by_7ntypes-webfont.woff";
import "./assets/fonts/a_calling_font_d_by_7ntypes-webfont.woff2";
import "./assets/fonts/inconsolata-webfont.woff";
import "./assets/fonts/inconsolata-webfont.woff2";
import "./assets/fonts/obelixpro-broken-cyr-webfont.woff";
import "./assets/fonts/obelixpro-broken-cyr-webfont.woff2";
import "./assets/css/normalize.css";
import "./assets/css/util.css";
import "./assets/css/hover.css";

import Vue from "vue";
import store from "./store";
import Frame from "./Frame.vue";
import operateTip from "./components/modal/OperateTip";
import miniSelect from "./components/widget/miniSelect";
import { Upload, Popover, Button, Loading } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import router from "./router";

Vue.config.productionTip = false;

Vue.component("OperateTip", operateTip);
Vue.component("miniSelect", miniSelect);
Vue.component("elUpload", Upload);
Vue.component("elPopover", Popover);
Vue.component("elButton", Button);
Vue.component("elLoading", Loading);

Vue.use(Loading.directive)
new Vue({
  router,
  store,
  created() {
    // 在页面加载时读取sessionStorage
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }
    // 在页面刷新时将store保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  },
  render: (h) => h(Frame),
}).$mount("#app");
