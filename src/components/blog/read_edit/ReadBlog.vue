<template>
    <div class="read-blog">
        <div class="go-back"><button class="hvr-wobble-top" @click="$emit('goBack')">返回</button></div>
        <div class="title word-ellipsis">{{readOrEdit.blog.title||"Untitled"}}</div>
        <div class="more-info">
            <div class="author word-ellipsis">
                <i class="fa fa-user-o" aria-hidden="true"></i>
                <span>{{readOrEdit.blog.author||'匿名'}}</span>
            </div>
            <div class="date">
                <i class="fa fa-calendar-o" aria-hidden="true"></i>
                <span>{{readOrEdit.blog.updateTime}}</span>
            </div>
            <div class="tags word-ellipsis" :title="readOrEdit.blog.tags">
                <i class="fa fa-tags" aria-hidden="true"></i>
                <span v-for="tag in readOrEdit.blog.tags">#{{tag}}</span>
                <span v-if="!readOrEdit.blog.tags">#</span>
            </div>
        </div>
        <div class="content ql-editor" v-html="readOrEdit.blog.htmlContent"></div>
        <div class="read-btn-group">
            <a class="hvr-wobble-top" href="javascript:;" @click="editBlog"  v-if="!readOrEdit.blog.sync">修改</a>
            <!-- <a class="hvr-wobble-top" href="javascript:;" @click="deleteBlog">删除</a> -->
        </div>
        <div class="continue-read">
            <div class="last-page hvr-wobble-top" @click="lastPage">
                <a href="javascript:;" ><i class="fa fa-angle-double-left" aria-hidden="true"></i> 上一篇</a>
            </div>
            <div class="next-page hvr-wobble-top" @click="nextPage">
                <a href="javascript:;">下一篇 <i class="fa fa-angle-double-right" aria-hidden="true"></i></a>
            </div>
        </div>
    </div>
</template>

<script>
    import EventHub from "../../../utils/EventHub"

    export default {
        name: "ReadBlog",
        props:{
            'readOrEdit':Object,
            'mySize':Number,
        },
        model:{
            event:"readable",
         },

        mounted(){

        },
        data(){
            return{

            }
        },
        methods:{
            editBlog(){
                this.readOrEdit.isEditable = true;
                this.readOrEdit.isReadable = false;
                this.$emit('readable',this.readOrEdit);
            },
            lastPage(){
                var myPos = this.$store.state.logList.map(item => item.createTime).indexOf(this.readOrEdit.blog.createTime);
                if(myPos-1 >= 0){
                    EventHub.pageInfo.current = Math.ceil((myPos-2) / EventHub.pageInfo.pagenum);
                    this.$router.push({ name: 'blogArticle', params: { id: this.$store.state.logList[myPos-1].createTime, isReadable: true }});
                }else{
                    EventHub.$emit("goTip",["没有上一篇了!"]);
                }
            },
            nextPage(){
                var myPos = this.$store.state.logList.indexOf(this.readOrEdit.blog);
                if(myPos+1 < this.$store.state.logList.length){
                    EventHub.pageInfo.current = Math.ceil((myPos+2) / EventHub.pageInfo.pagenum);
                    this.$router.push({ name: 'blogArticle', params: { id: this.$store.state.logList[myPos+1].createTime, isReadable: true }});
                }else{
                    EventHub.$emit("goTip",["没有下一篇了!"])
                }
            },
            deleteBlog(){
                this.$emit('deleteBlog',this.readOrEdit.blog);
            },
        },
    }
</script>

<style scoped>
    .read-blog:before{
        content: '';
        width: 15px;
        position: absolute;
        top: 15px;
        left: -15px;
        bottom: 0;
        background-color: #e5e5e5;
        border-top-left-radius: 0.3rem;
    }
    .read-blog{
        min-height: 100%;
        width: 100%;
        border-top-left-radius: 0.3rem;
        border-top-right-radius: 0.3rem;
        text-align: left;
        background-color: #656565;
        position: relative;
        padding: 10px;
        box-sizing: border-box;
    }
    .read-blog .title{
        width: 80%;
        font-size: 30px;
        border-width: 0;
        border-bottom: 1px solid rgba(134, 134, 134, 0.24);
        color: #f2f2f2;
        padding: 20px 20px 0 20px;
        margin: 0 auto;
        box-sizing: border-box;
        text-align: center;

    }
    .read-blog .content{
        min-height: 300px;
        border: 1px solid rgba(175, 175, 175, 0.24);
        margin: 10px;
        padding: 20px 15px;
        border-radius: 8px;
        background-color: #353535;
    }
    .read-blog .read-btn-group{
        margin: 0 10px;
    }
    .read-blog .read-btn-group a{
        margin: 10px;
        color: #a7ffe1;
        text-decoration:underline;
        opacity: 0.3;
    }
    .read-blog .read-btn-group a:hover{
        opacity: 1;
    }
    .read-blog .continue-read{
        margin: 80px 10px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .read-blog .continue-read .next-page,
    .read-blog .continue-read .last-page{
        user-select: none;
    }
    .read-blog .continue-read .next-page{
        margin-left: 20px;
    }
    .read-blog .continue-read a{
        color: #ffbc89;
        opacity: 0.8;
    }
    .read-blog .continue-read a:hover{
        opacity: 1;
    }
    .read-blog .hasLastPage{
        color: red;
    }
    .read-blog .hasNextPage{
        color: blueviolet;
    }
</style>
<style>
    .read-blog .content pre{
        background-color: #23241f;
        color: #47e0ff;
        overflow: visible;
        white-space: pre-wrap;
        word-break: break-word;
        margin-bottom: 5px;
        margin-top: 5px;
        padding: 5px 10px;
        border-radius: 3px;
        overflow: hidden;
    }
    /*---------------------------Read-Blog START--------------------------------------------------*/
    .read-blog .content{
        font-family:STKaiti,LiSu,STXinwei;
        font-size: 20px;
        white-space: pre-wrap;
        word-break: break-word;
    }
    .read-blog .content ul,
    .read-blog .content ol
    {
        padding-left: 1.5em;
    }



    .read-blog .content a{
        text-decoration: underline;
        color: #78fffb;
    }
    .read-blog .content p{
        line-height: 1.5em;
        margin: 0;
    }
    /*---------------------------Read-Blog END--------------------------------------------------*/
</style>