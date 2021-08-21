<template>
    <div class="content">
        <input class="form-control" type="text" placeholder="标题..."
               v-model="blog.blogName">
        <input class="form-control" type="text" placeholder="标签... (多个以空格分割)"
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
