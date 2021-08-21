<template>
    <div class="small_search_down_tree_protector" v-bind:style="{width:width+'px'}">
        <div class="small_search_down_tree_container">
            <div class="search_input">
                <input type="text" placeholder="search you want..." @focus.stop="focusMe" v-model="searchKey" v-bind:style="{'borderBottom': foldWindow?'1px solid rgba(255, 255, 255, 0.5)':'none'}">
                <div class="pick-up" @click.stop="foldWindow=!foldWindow"><i class="fa" :class="[{ 'fa-caret-up': foldWindow}, {'fa-caret-down':!foldWindow}]"></i></div>
            </div>
            <div v-show="foldWindow" v-bind:style="{height : height+'px'}" id="small_search_down_tree-pen">
                <div class="small_search_down_tree">
                    <div class="tree-container">
                        <ul v-for="(treeNode,index) in treeDatas" :key="index">
                            <search-tree
                                v-if="treeNode.isShow"
                                :treeNode="treeNode"
                                :parent="null"
                                :previousLifeStatus="previousLifeStatus"
                                :dustChildrenState="false"
                                :searchKey="searchKey"

                            ></search-tree>
                        </ul>
                    </div>
                </div>
            </div>
            <slot v-if="foldWindow"></slot>
        </div>
    </div>
</template>

<script>
    import EventHub from "../../utils/EventHub";
    import SearchTree from "./SearchTree"
    import Utils from "../../utils/Utils"

    export default {
        name: "SmallSearchDownTree",
        props: ['width','height'],
        components: {
            SearchTree
        },
        mounted(){
            var that = this;
            $(document).click(function(event){
                if(that.foldWindow === false){
                    return;
                }
                var obj = event.target;
                if (!$(obj).is(".small_search_down_tree_protector,.small_search_down_tree_protector *")) {
                   that.foldWindow = false;
                }
            });
            Utils.makeScrollBar("#small_search_down_tree-pen", { scrollInertia: 400,deltaFactor: 40,axis:"yx"});
        },
        data() {
            return {
                treeDatas: EventHub.folders,
                searchKey: "",
                foldWindow:false,
                previousLifeStatus:new Map()
            }
        },
        methods: {
            focusMe(){
                this.foldWindow = true;
            }
        },
        watch: {
            searchKey() {
                let searchKey = this.searchKey;
                if(!searchKey.trim()){
                    return;
                }
                this.treeDatas.forEach(function (root) {
                    giveMeKey(root);
                });
                function giveMeKey(child) {
                    //重置一下
                    child.IHaveTheKey = false;
                    var haveKey = false;
                    if(child.children && child.children.length){
                        child.children.forEach(function (son) {
                            haveKey = giveMeKey(son);
                            if(haveKey){
                                child.IHaveTheKey = true;
                            }
                        });
                    }
                    if(child.IHaveTheKey){
                        return true;
                    }else if(child.name.toLocaleUpperCase().includes(searchKey.toLocaleUpperCase())){
                        child.IHaveTheKey = true;
                    }else{
                        child.IHaveTheKey = false;
                    }
                    return child.IHaveTheKey;
                }
            },
        },
        provide: function () {
            return {
                isOnlyFolder: false
            }
        },
        beforeDestroy: function () {
            this.previousLifeStatus = null;
        }
    }
</script>

<style>
    .small_search_down_tree_protector{
        display: block;
        color: rgba(255, 255, 255, 0.98);
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.53);
    }
    .small_search_down_tree_container .ellipsis {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .small_search_down_tree_container .item {
        cursor: pointer;
    }
    .small_search_down_tree_container ul ul {
        list-style: none;
        padding-left: 20px;
        box-sizing: border-box;
    }
    .small_search_down_tree_container li {
        min-height: 28px;
        line-height: 28px;
        font-size: 14px;
    }

    .small_search_down_tree_container li:hover {
        cursor: pointer;
    }


    .small_search_down_tree_container .bold {
        font-size: 14px;
        height: 28px;
        line-height: 28px;
    }

    .small_search_down_tree_container {
        background-color: rgba(0, 0, 0, 0);
        box-sizing: border-box;
        border: 1px solid rgba(89, 89, 89, 0.51);
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .small_search_down_tree_container .search_input {
        min-height: 30px;
        box-sizing: border-box;
        flex: 1;
        text-align: center;
        position: relative;
    }

    .small_search_down_tree_container .search_input input {
        background-color: rgba(32, 32, 32, 0.4);
        color: rgb(219, 219, 219);
        outline: none;
        padding: 0 30px 0 15px;
        border: none;
        box-sizing: border-box;
        height: 30px;
        line-height: 30px;
        width: 100%;
    }
    .small_search_down_tree_container .search_input .pick-up{
        width: 20px;
        height: 35px;
        position: absolute;
        top: 0;
        right: 0;
        color: rgba(168, 168, 168, 0.88);
    }
    .small_search_down_tree_container .search_input .pick-up:hover{
        cursor: pointer;
    }
    .small_search_down_tree_container .search_input .pick-up i{
        text-align: center;
        line-height: 35px;
    }
    .small_search_down_tree_container .small_search_down_tree {
        flex: 1;
        box-sizing: border-box;
    }
    .small_search_down_tree_container #small_search_down_tree-pen{
        overflow: hidden;
    }

    .small_search_down_tree_container .small_search_down_tree .check_item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .small_search_down_tree_container .small_search_down_tree .justify_child {
        padding-left: 20px;
        box-sizing: border-box;
    }

    .small_search_down_tree_container .small_search_down_tree .collapse_arrow {
        height: 28px;
        width: 20px;
        min-width: 20px;
        display: inline-block;
        text-align: center;
    }

    .small_search_down_tree_container .small_search_down_tree .check_box {
        height: 28px;
        width: 20px;
        min-width: 20px;
        display: inline-block;
        text-align: center;
        vertical-align: middle;

    }

    .small_search_down_tree_container .small_search_down_tree .check_box .check_box_tiny {
        height: 12px;
        width: 12px;
        border-radius: 3px;
        display: inline-block;
        background-color: rgba(255, 255, 255, 0.5);
    }

    .small_search_down_tree_container .small_search_down_tree .check_box .check_box_tiny:hover {
        transform: scale(0.9);
        box-sizing: border-box;
        border: 1px solid rgba(81, 186, 255, 0.6);
    }

    .small_search_down_tree_container .small_search_down_tree .check_box .check_box_tiny_checked {
        background: url("../../assets/img/checkbox-checked.png") #039BE5 center no-repeat;
    }

    .small_search_down_tree_container .small_search_down_tree .check_box .check_box_tiny_checked2 {
        background: url("../../assets/img/checkbox-indeterminate.png") #039BE5 center no-repeat;
    }

    .small_search_down_tree_container .small_search_down_tree .down_itme_name {
        box-sizing: border-box;
        padding-left: 5px;
    }

    /*slot*/
    .small_search_down_tree_container .insert-content{
        width: 100%;
        box-sizing: border-box;
        border-top: 1px solid rgba(255, 255, 255, 0.49);
        min-height: 30px;
        background-color: transparent;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .small_search_down_tree_container .insert-content button{
        background-color: transparent;
        color:white;
        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.5);
        padding: 0px 5px;
        outline: none;
    }
    .small_search_down_tree_container .insert-content button:hover{
        box-sizing: border-box;
        border: 1px solid #4efcff;
    }

    /*滚动条*/
    .small_search_down_tree_container #small_search_down_tree-pen .mCSB_dragger_bar{
        background-color: rgba(115, 115, 115, 0.88) !important;
    }
    .small_search_down_tree_container #small_search_down_tree-pen .mCSB_container_wrapper{
        margin-right: 10px !important;
        margin-bottom: 10px !important;
    }
    .small_search_down_tree_container #small_search_down_tree-pen .mCSB_container{
        padding-right: 10px !important;
        padding-bottom: 10px !important;
    }

</style>