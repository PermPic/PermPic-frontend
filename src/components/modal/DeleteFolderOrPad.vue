<template>
    <div class="content">
        <div class="msg">
            {{alertMsg}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "DeleteFolderOrPad",
        props:['alertMsg'],
        methods: {

        }
    }
</script>
<style scoped>
    .msg{
        text-align: center;
        width: 100%;
        font-size: 12px;
        color: #63a225;
    }
</style>
