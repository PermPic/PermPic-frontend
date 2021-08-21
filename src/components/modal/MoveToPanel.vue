<template>
    <div class="move-to-frame">
        <div class="move-to-panel">
            <div class="header">
                <div class="title">你正在移动{{moveCardNum}}个Pad到</div>
                <div class="tip">{{pleaseSelect}}</div>
                <div class="close" @click="$emit('moveToOtherFolderCancel')"><i class="fa fa-times" aria-hidden="true"></i></div>
            </div>
            <div class="content">
                <div class="move-to-panel-tree-container"  id="move-to-panel-tree-container">
                    <ul v-for="(treeNode,index) in treeDatas" :key="index">
                        <folder-tree-for-move-to-panel
                                :treeNode="treeNode"
                                :parent="null"
                                :checkedState="checkedState"
                        ></folder-tree-for-move-to-panel>
                    </ul>
                </div>
            </div>
            <div class="footer">
                <button class="modal-cancel" @click="$emit('moveToOtherFolderCancel')">Cancel</button>
                <button class="modal-ok"  @click="$emit('moveToOtherFolderOK',checkedState.item)">Ok!</button>
            </div>
        </div>
    </div>
</template>

<script>
    import folderTreeForMoveToPanel from "./FolderTreeForMoveToPanel"
    import Utils from "../../utils/Utils"

    export default {
        name: "MoveToPanel",
        props:{
            moveCardNum:Number,
            treeDatas:Array,
         },
        components:{
            folderTreeForMoveToPanel
        },
        mounted(){
            Utils.makeScrollBar("#move-to-panel-tree-container", { scrollInertia: 200,deltaFactor: 40,axis:"yx"});
        },
        data(){
            return {
                pleaseSelect:"[请选择]",
                checkedState:{
                    item:{},
                    styler:{}
                },
            }
        },

        watch:{
            'checkedState.item':function () {
                this.pleaseSelect = this.checkedState.item.name || "[请选择]";
            },

        }

    }
</script>

<style scoped>
    .move-to-frame{
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 9999991;
        background: radial-gradient(circle at center, rgba(56, 56, 56, 0.4) 0, rgba(0, 0, 0, 0.8) 100%);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .move-to-panel{
        width: 345px;
        height: 525px;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(211, 211, 211, 0.75);
        color: #e1e1e1;
        background-color: rgba(9, 9, 9, 0.49);
    }
    button {
        cursor: pointer;
        color: white;
        font-size: 16px;
        border: none;
        outline: none;
        background-color: transparent;
        margin: 0 10px;
        padding: 10px;
    }
    .modal-cancel {
        color: rgb(224, 115, 35);
    }
    .modal-ok {
        color: #4fff22;
    }

    .header{
        flex: 1;
        max-height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .header .title,.header .tip{
        flex: 1;
        display: flex;
        align-items: flex-end;
    }
    .header .tip{
        align-items: center;
    }
    .header .close{
        width: 20px;
        height: 20px;
        position: absolute;
        right: 3px;
        top: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
    }
    .header .close:hover{
        cursor: pointer;
    }

    .content{
        flex: 1;
        display: flex;
        box-sizing: border-box;
        border-top: 1px solid rgba(211, 211, 211, 0.75);
        border-bottom: 1px solid rgba(211, 211, 211, 0.75);

    }
    .move-to-panel-tree-container{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .footer{
        flex: 1;
        max-height: 60px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }


</style>
<style>
    /*滚动条*/
    #move-to-panel-tree-container .mCSB_dragger_bar{
        background-color: rgba(115, 115, 115, 0.88) !important;
    }
    #move-to-panel-tree-container .mCSB_container_wrapper{
        margin-right: 10px !important;
        margin-bottom: 10px !important;
    }
    #move-to-panel-tree-container .mCSB_container{
        padding-right: 10px !important;
        padding-bottom: 10px !important;
    }
</style>