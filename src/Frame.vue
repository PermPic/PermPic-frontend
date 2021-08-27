<template>
  <div id="Frame">
    <!--提示框-->
    <operate-tip v-if="showOperateTip" :result="operateResult" v-model="showOperateTip" :showDuration="showDuration" />
    <!--导航栏-->
    <NavigationBar :isSearchable="isSearchable"></NavigationBar>
    <!--视图页-->
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import NavigationBar from "./components/NavigationBar";
import EventHub from "./utils/EventHub";

export default {
  name: "Frame",
  components: {
    NavigationBar
  },
  data() {
    return {
      isSearchable: false,
      /*tip*/
      showOperateTip: false,
      operateResult: { msg: this.$t('blog.operationSuccess'), status: true },
      showDuration: 1500
    };
  },
  methods: {
    goTip(params = [this.$t('blog.operationSuccess'), true, 1500]) {
      this.operateResult.msg = params[0] || this.$t('blog.operationSuccess');
      params[1] == false
        ? (this.operateResult.status = false)
        : (this.operateResult.status = params[1] || true);
      this.showDuration = params[2] || 1500;
      this.showOperateTip = true;
    }
  },
  watch: {
    $route: function () {
      if (this.$route.name === "pads") this.isSearchable = false;
      else this.isSearchable = true;
    }
  },
  created: function () {
    this.$store.state.state = 0
    EventHub.$on("goTip", this.goTip);
  },
  beforeDestroy: function () {
    EventHub.$off("goTip", this.goTip);
  }
};
</script>

<style>
#Frame {
  height: 100%;
}
</style>