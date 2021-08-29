<template>
  <div class="content">
    <input class="form-control" type="text" :placeholder="$t('blog.title')" v-model="blog.blogName">
    <input class="form-control" type="text" :placeholder="$t('blog.dialog_tags')" v-model="blog.blogTags">
    <el-select v-model="blog.privacy" placeholder="privacy">
      <el-option v-for="item in privacyOptions" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>

  </div>
</template>

<script>
export default {
  name: "UpdatePadModal",
  props: {
    blog: Object
  },
  data() {
    return {
      privacyOptions: [
        {
          value: "public",
          label: "Public"
        },
        {
          value: "private",
          label: "Private"
        }
      ]
    };
  }
};
</script>
<style>
.el-select {
    width: 100%;
}
.el-input__inner {
  width: 100%;
  height: 34px;
  background: transparent;
  color: #bcbcbc;
  font-size: 14px;
  border: 1px solid #2b2b2b;
}
.el-select-dropdown {
  z-index: 9999 !important;
}
</style>
<style scoped>
input {
  width: 100%;
  background: transparent;
  color: #bcbcbc;
  font-size: 14px;
  border: 1px solid #2b2b2b; 
  margin-bottom: 10px;
}
</style>
