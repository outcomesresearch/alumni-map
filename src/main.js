import Vue from "vue";
import App from "./App.vue";
import OutcomesResearchWrapper from "shared-code";

Vue.config.productionTip = false;

Vue.use(OutcomesResearchWrapper);

new Vue({
  render: (h) => h(App),
}).$mount("#application");
