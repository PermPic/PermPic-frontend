<template>
  <div class="blog-preview-barrier">
    <div class="header">
      <div class="img" v-if="blog.isShowBanner">
        <img :src="getMyBanner" alt="" />
      </div>
      <div class="title">{{ blog.title }}</div>
    </div>
    <div class="content">
      <p class="article">{{ blog.previewContent }}</p>
      <div class="more-group">
        <div class="more" v-if="isAll" @click="readMore">
          <a>阅读全文</a>
        </div>
        <div class="more" v-if="isAll && (!blog.sync || blog.sync == 1)">
          <el-popover placement="top" width="160" v-model="visible" @show="showArFee">
            <div v-loading="popLoading">
              <p>同步需要花费<br />{{ arFee }}AR</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="danger" size="mini" @click="syncAr" v-if="!blog.sync">确定</el-button>
              </div>
            </div>
            <a slot="reference">{{
              blog.sync == 1 ? "正在同步" : "同步到ARweave"
            }}</a>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="author word-ellipsis">
        <i class="fa fa-user-o" aria-hidden="true"></i>
        <span>{{ blog.author || "匿名" }}</span>
      </div>
      <div class="date">
        <i class="fa fa-calendar" aria-hidden="true"></i>
        <span>{{ blog.updateTime }}</span>
      </div>
      <div class="tags word-ellipsis">
        <i class="fa fa-tags" aria-hidden="true"></i>
        <span v-for="tag in blog.tags">#{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import FrontConfig from "../../../config/FrontConfig";
import EventHub from "../../../utils/EventHub";
import {
  getArPrice,
  preparePermPicTransaction,
  permPicUpload,
  getPermPicData
} from "permpic-core-test";

export default {
  name: "BlogPreview",
  props: {
    blog: Object
  },
  data() {
    return {
      isAll: true,
      visible: false,
      arFee: 0,
      popLoading: false
    };
  },
  mounted() {},
  computed: {
    getMyBanner() {
      var bannerImg =
        FrontConfig.blogBanners[
          Math.floor(Math.random() * FrontConfig.blogBanners.length)
        ];
      return require("../../../static/img/blog_banner/" + bannerImg);
    }
  },
  methods: {
    readMore() {
      this.$router.push({
        name: "blogArticle",
        params: { id: this.blog.createTime, isReadable: true }
      });
    },
    async showArFee() {
      this.popLoading = true;
      this.arFee = await getArPrice(this.blog.htmlContent.length);
      this.popLoading = false;
    },
    async syncAr() {
      let metaData;
      this.$store.state.logList.forEach((element, index) => {
        if (element.createTime == this.blog.createTime) {
          metaData = {
            ...this.$store.state.logList[index],
            ...{
              title: this.blog.title,
              tags: this.blog.tags,
              isShowBanner: this.blog.isShowBanner,
              createTime: this.blog.createTime,
              updateTime: this.blog.updateTime,
              "Content-Type": "text/html"
            }
          };
        }
      });

      let tx = await preparePermPicTransaction(
        this.$store.state.wallet,
        this.blog.htmlContent,
        metaData
      );
      const uploader = await permPicUpload(tx);
      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(
          `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
        );
      }
      this.blog.sync = 1;
      EventHub.$emit("goTip", ["等待区块同步!"]);
      this.visible = false;
    }
  }
};
</script>

<style>
.el-popover {
  background: rgba(7, 7, 7, 0.85) !important;
  color: #fff;
}
.el-button--danger {
  background-color: #d4515e;
  border-color: #d4515e;
}
</style>
<style scoped>
.blog-preview-barrier {
  width: 90%;
  margin: 20px auto;
  background-color: rgba(42, 42, 42, 0.85);
}
.blog-preview-barrier:first-child {
  margin-top: 0;
}
.blog-preview-barrier .header {
  box-sizing: border-box;
  border-bottom: 1px solid rgba(104, 104, 104, 0.91);
}
.blog-preview-barrier .header .img {
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(67, 67, 67, 0.8);
}
.blog-preview-barrier .header img {
  width: 100%;
  height: 100%;
}

.blog-preview-barrier .header .title {
  text-align: left;
  padding-left: 15px;
  font-size: 27px;
  color: #4f98af;
  height: 50px;
  line-height: 50px;
}
.blog-preview-barrier .content .article {
  font-size: 20px;
  max-height: 6em;
  color: #dadada;
  line-height: 1.5em;
  font-family: STKaiti, LiSu, STXinwei;
  font-style: normal;
  text-align: left;
  text-indent: 2em;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 4;
}
.blog-preview-barrier .content .more {
  height: 25px;
  background-color: #2e2e2e;
  min-width: 80px;
  max-width: 120px;
  margin: 10px;

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  color: rgba(157, 157, 157, 0.67);
}
.blog-preview-barrier .content .more-group {
  display: flex;
}
.blog-preview-barrier .content .more:hover {
  cursor: pointer;
  background-color: #d4515e;
  color: white;
}

.blog-preview-barrier .footer {
  border-top: 1px solid rgba(104, 104, 104, 0.91);
  height: 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  color: rgba(117, 117, 117, 0.77);
  font-size: 14px;
}
.blog-preview-barrier .footer .author,
.blog-preview-barrier .footer .date,
.blog-preview-barrier .footer .tags {
  margin-left: 10px;
}
.blog-preview-barrier .footer i {
  margin-right: 5px;
}
.blog-preview-barrier .footer .date {
  max-width: 140px;
  font-family: sans-serif;
}
.blog-preview-barrier .footer .tags span {
  margin-right: 10px;
}
</style>