<template>
    <div class="blog">
        <profile-bar v-model="isShowCatalog"></profile-bar>
        <transition name="show-catalog">
            <catalog-bar v-show="isShowCatalog"></catalog-bar>
        </transition>
        <router-view :style="{maxWidth:!isShowCatalog?'calc(100% - 300px)':null}"></router-view>
    </div>
</template>
<script>
    import '../assets/css/blog.css'
    import ProfileBar from "../components/blog/ProfileBar"
    import CatalogBar from "../components/blog/CatalogBar"
    import BlogPreviewList from "../components/blog/preview/BlogPreviewList"
    import BlogArticle from "../components/blog/read_edit/BlogArticle"

    export default {
        name: 'Blog',
        components: {
            ProfileBar,
            CatalogBar,
            BlogPreviewList,
            BlogArticle,
        },
        data() {
            return {
                title: "Hello Light Code Edit",
                isShowCatalog: true,
                isShowPreviewList: false,
                isShowBlogArticle:true,
            }
        },
        mounted: function () {


        },

    }
</script>
<style scoped>
    .blog {
        text-align: center;
    }

    .show-catalog-enter-active, .show-catalog-leave-active {
        transition: all 0.3s;
    }

    .show-catalog-enter, .show-catalog-leave-to {
        opacity: 0;
    }
</style>
