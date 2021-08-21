<template>
  <div class="edit_blog">
    <div class="go-back">
      <button class="hvr-wobble-top" @click="$emit('goBack')">返回</button>
    </div>
    <div class="title">
      <input
        placeholder="输入标题.."
        type="text"
        v-model="readOrEdit.blog.title"
      />
    </div>
    <div class="more-info">
      <div
        class="author word-ellipsis"
        id="blog_author_input"
        @click="isEditAuthor = true"
      >
        <i class="fa fa-user-o" aria-hidden="true"></i>
        <span v-show="!isEditAuthor">{{ readOrEdit.blog.author }}</span>
        <input
          v-show="isEditAuthor || editableAuthor"
          type="text"
          v-model="readOrEdit.blog.author"
          placeholder="作者名称..."
        />
      </div>
      <div class="date">
        <i class="fa fa-calendar-o" aria-hidden="true"></i>
        <span>{{ readOrEdit.blog.updateTime }}</span>
      </div>
      <div class="tags" id="blog_tags_input" @click="isEditTags = true">
        <i class="fa fa-tags" aria-hidden="true"></i>
        <div class="tag-group word-ellipsis" v-show="!isEditTags">
          <span v-for="tag in tagsArr">#{{ tag }}</span>
        </div>
        <input
          v-show="isEditTags || editableTags"
          type="text"
          v-model="tags"
          placeholder="标签..(多个标签以空格分割)"
        />
      </div>
    </div>
    <div class="content">
      <div
        id="blog-editor"
        @click="clickBlogEditor"
        v-html="myHtmlContent"
      ></div>
    </div>
    <div class="commit">
      <button class="btn hvr-wobble-top" @click="commitToPre">预览</button>
      <button class="btn hvr-wobble-top" @click="saveBlog">保存</button>
    </div>
  </div>
</template>

<script>
import Utils from "../../../utils/Utils";
import EventHub from "../../../utils/EventHub";
export default {
  name: "EditBlog",
  model: {
    event: "editable",
  },
  props: {
    title: String,
    readOrEdit: Object,
  },
  mounted() {
    this.myHtmlContent = this.readOrEdit.blog.htmlContent;
    this.$nextTick(function () {
      if ($("#blog-editor")[0])
        this.blogEditor = Utils.makeQuillEditor(
          "#blog-editor",
          this.myEidtorBinds()
        );
    });

    var that = this;
    $(document).click(function (event) {
      var obj = event.target;
      if (!$(obj).is("#blog_tags_input,#blog_tags_input *"))
        that.isEditTags = false;
      if (!$(obj).is("#blog_author_input,#blog_author_input *"))
        that.isEditAuthor = false;
    });

    if (this.readOrEdit.blog.tags) {
      this.tags = this.readOrEdit.blog.tags.join(" ");
    } else {
      this.readOrEdit.blog.tags = null;
    }
  },
  data() {
    return {
      blogEditor: null,
      tags: null,
      tagsArr: this.readOrEdit.blog.tags,
      oldTags: this.readOrEdit.blog.tags,

      isEditTags: false,
      isEditAuthor: false,

      myHtmlContent: null,
    };
  },
  methods: {
    clickBlogEditor() {
      if (!this.blogEditor.hasFocus()) {
        this.blogEditor.focus();
      }
    },
    commitToPre() {
      this.saveBlog();
      this.readOrEdit.isEditable = false;
      this.readOrEdit.isReadable = true;
    },
    saveBlog() {
      this.readOrEdit.blog.updateTime = new Date().toLocaleDateString();
      this.readOrEdit.blog.htmlContent = $("#blog-editor .ql-editor").html();
      this.readOrEdit.blog.textContent = this.blogEditor.getText();
      this.readOrEdit.blog.previewContent = this.blogEditor
        .getText()
        .substr(0, 150);
      if (this.readOrEdit.blog.textContent.lenght > 150) {
        this.readOrEdit.blog.previewContent += "...";
      }

      if (this.oldTags) {
        for (let i = 0; i < this.oldTags.length; i++) {
          EventHub.putBlogTag(this.oldTags[i], false);
        }
      }
      if (this.tags && this.tags.trim()) {
        this.readOrEdit.blog.tags = [];
        var tags = this.tags.trim().split(" ");
        tags = Utils.removeDuplicate(tags);
        for (let i = 0; i < tags.length; i++) {
          if (tags[i].trim()) {
            EventHub.putBlogTag(tags[i]);
            this.readOrEdit.blog.tags.push(tags[i].trim());
          }
        }
      }
      this.readOrEdit.blog.tags = Utils.removeDuplicate(
        this.readOrEdit.blog.tags
      );
      this.oldTags = this.readOrEdit.blog.tags;
      this.$store.state.logList.forEach((element, index) => {
        if (element.createTime == this.readOrEdit.blog.createTime) {
          this.$store.state.logList[index] = {
            ...this.$store.state.logList[index],
            ...element,
          };
          console.log(this.$store.state.logList[index])
        }
      });
      EventHub.makeBlogTags();
      EventHub.$emit("goTip", ["保存成功!"]);
    },
    myEidtorBinds() {
      var that = this;
      return {
        save: {
          ctrlKey: true,
          key: "s",
          handler: function () {
            that.saveBlog();
          },
        },
      };
    },
  },
  computed: {
    editableTags() {
      if (this.tags && this.tags.length) return false;
      else return true;
    },
    editableAuthor() {
      //!!获取真实分布尔值
      return !!!this.readOrEdit.blog.author;
    },
  },
  watch: {
    "readOrEdit.blog.createTime": function () {
      this.oldTags = this.readOrEdit.blog.tags;
      if (this.readOrEdit.blog.tags && this.readOrEdit.blog.tags.length) {
        this.tags = this.readOrEdit.blog.tags.join(" ");
      }
      if (this.blogEditor) {
        this.blogEditor.setText("");
        this.blogEditor.enable();
        this.blogEditor.focus();
      }
    },
    tags() {
      if (this.tags && this.tags.length > 0) {
        this.tagsArr = this.tags.split(" ");
      }
    },
  },
};
</script>

<style scoped>
.edit_blog:before {
  content: "";
  width: 15px;
  position: absolute;
  top: 15px;
  left: -15px;
  bottom: 0;
  background-color: #656565;
  border-top-left-radius: 0.3rem;
}
.edit_blog {
  min-height: 100%;
  width: 100%;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  text-align: left;
  background-color: #e5e5e5;
  position: relative;
  color: #424242;
  padding-bottom: 100px;
  box-sizing: border-box;
}
.edit_blog .title {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.edit_blog .title input {
  width: 80%;
  outline: none;
  background-color: transparent;
  font-size: 30px;
  box-sizing: border-box;
  border-width: 0;
  border-bottom: 1px solid rgba(219, 219, 219, 0.69);
  padding: 0 20px;
  text-align: center;
  color: #3b3b3b;
}
.edit_blog .more-info .author {
  max-width: 200px;
  display: flex;
}
.edit_blog .more-info .tags {
  max-width: 200px;
  display: flex;
}
.edit_blog .more-info .tags div {
  justify-content: center;
  align-items: center;
}
.edit_blog .more-info input {
  border: none;
  border-radius: 5px;
  overflow: hidden;
}
/*---------------------------Editor START--------------------------------*/
.edit_blog .content {
  padding: 10px;
}
.edit_blog #blog-editor {
  min-height: 300px;
  font-size: 18px;
  background-color: #fff;
}
/*---------------------------Editor END--------------------------------*/
.edit_blog .commit {
  text-align: right;
  margin: 10px;
}
.edit_blog .commit button:first-child {
  background-color: #ff6c00;
  color: #ffd59f;
}
.edit_blog .commit button:nth-child(2) {
  background-color: #ff0007;
}
.edit_blog .commit button:nth-child(3) {
  background-color: #1a83ff;
}
.edit_blog .commit button:hover {
  opacity: 1;
}
.edit_blog .go-back button {
  margin: 20px;
}
</style>
<style>
.edit_blog .content p {
  white-space: pre-wrap;
  line-height: 1.5em;
}
</style>