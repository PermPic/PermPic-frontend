<template>
    <div class="content">
        <input class="form-control" type="text" :placeholder="$t('blog.title')"
               v-model="blog.blogName">
        <input class="form-control" type="text" :placeholder="$t('blog.dialog_tags')"
               v-model="blog.blogTags">
    </div>
</template>

<script>
    export default {
        name: "UpdatePadModal",
        props:{
            'blog':Object,
        },
    }
</script>
<style scoped>
    input{
        width: 100%;
        background: transparent;
        color: #bcbcbc;
        font-size: 14px;
        border: 1px solid #2b2b2b;
    }
    input:first-child{
        margin-bottom: 10px;
    }
</style>
