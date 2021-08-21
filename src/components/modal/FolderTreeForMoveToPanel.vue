<template>
    <li v-if="isFolder">
        <div>
            <span class="move-to-panel-collapse-arrow" @click="open = !open"><i class="fa" :class="[{ 'fa-caret-right': !open }, {'fa-caret-down':open}]"></i></span>
            <span class="move-to-panel-check-box" @click="selectedMe">
                <span class="move-to-panel-check-box-tiny" :class="{ 'move-to-panel-check-box-tiny-checked':checkedState.styler[treeNode.id] }"></span>
            </span>
            <span class="move-to-panel-down-item-name ellipsis" @click="selectedMe">{{treeNode.name }}</span>
            <span class="move-to-panel-children-num" >{{childrenNum}}</span>
        </div>
        <ul v-show="open" class="move-to-panel-children">
            <folder-tree-for-move-to-panel
                    v-for="(child, index) in treeNode.children"
                    :key="index"
                    :treeNode="child"
                    :parent="treeNode"
                    :checkedState="checkedState"
            >
            </folder-tree-for-move-to-panel>
        </ul>
    </li>
</template>

<script>
    import Utils from "../../utils/Utils"
    export default {
        name: "FolderTreeForMoveToPanel",
        data: function () {
            return {
                open: false,
                isChecked:false,
            }
        },
        props: {
            treeNode: Object,
            parent:Object,
            checkedState:Object,
        },
        watch:{

        },
        computed: {
            isFolder() {
                return Utils.isArrayFn(this.treeNode.children);
            },
            childrenNum(){
                return this.treeNode.children.length;
            }
        },
        methods:{
            selectedMe(){
                 if(this.checkedState.item.id && this.checkedState.item.id === this.treeNode.id){
                        this.checkedState.item = {};
                        this.checkedState.styler = {};
                 }else{
                     this.checkedState.item = this.treeNode;
                     this.checkedState.styler={};
                     this.checkedState.styler[this.treeNode.id] = true;
                 }
                this.isChecked = !this.isChecked;
            }
        }
    }
</script>

<style scoped>
    ul {
        margin-left: 20px;
        box-sizing: border-box;
        width: 100%;
    }
    li{
        width: 100%;
        min-height: 40px;
        line-height: 40px;
    }
    li:hover{
        cursor: pointer;
    }

    li div{
        display: flex;
        justify-content: flex-start;
    }
    .move-to-panel-down-item-name{
        margin: 0 3px;
    }
    .move-to-panel-collapse-arrow,.move-to-panel-children-num{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .move-to-panel-collapse-arrow{
        width: 20px;
    }
    .move-to-panel-children-num{
        width: 20px;
    }

    .move-to-panel-check-box {
        height: 100%;
        width: 20px;
        min-width: 20px;
        display: inline-block;
    }
    .move-to-panel-check-box-tiny {
        height: 12px;
        width: 12px;
        border-radius: 3px;
        display: inline-block;
        background-color: rgba(255, 255, 255, 0.5);
    }
    .move-to-panel-check-box-tiny:hover {
        transform: scale(0.9);
        box-sizing: border-box;
        border: 1px solid rgba(81, 186, 255, 0.6);
    }
    .move-to-panel-check-box-tiny-checked {
        background: url("../../assets/img/checkbox-checked.png") #039BE5 center no-repeat;
    }
    .adjustment{
        margin-left: 20px;
    }

</style>