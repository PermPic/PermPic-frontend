<template>
  <div class="blog-preview-list">
    <!--列表-->
    <blog-preview v-for="blog in blogs" :blog="blog"></blog-preview>
    <!--分页-->
    <pagination :pageInfo="pageInfo" @change="getPageBlogs"></pagination>
  </div>
</template>

<script>
import pagination from "../../../components/pagination/vue-pagination";
import BlogPreview from "./BlogPreview";
import EventHub from "../../../utils/EventHub";

export default {
  name: "Book",
  data() {
    return {
      pageInfo: EventHub.pageInfo,
      blogs: []
    };
  },
  components: {
    BlogPreview,
    pagination
  },
  mounted() {
    this.pageInfo.current = this.$route.params.page || 1;
    this.getPageBlogs(this.pageInfo.current);
  },
  methods: {
    getPageBlogs: function (current) {
      // 页码改变传入新的页码，此处做回调
      var that = this;
      current = current - 1;
      //   EventHub.$emit("getBlogsList");
      this.blogs = this.$store.state.logList.filter(function (v, index) {
        if (
          index >= current * that.pageInfo.pagenum &&
          index < current * that.pageInfo.pagenum + that.pageInfo.pagenum
        )
          return true;
      });
    },
    navSearchKey(searchKey) {
      this.blogs = this.$store.state.logList.filter(function (v) {
        if (
          v.title.includes(searchKey) ||
          // v.htmlContent.includes(searchKey) ||
          v.tags.indexOf(searchKey) > -1
        ) {
          return true;
        }
      });
      console.log(this.$route.name);
      EventHub.pageInfo.current = 1;
      EventHub.pageInfo.total = this.blogs.length;
    }
  },
  created: function () {
    EventHub.$on("navSearchKey", this.navSearchKey);
  },
  beforeDestroy: function () {
    EventHub.$off("navSearchKey", this.navSearchKey);
  }
};
</script>
