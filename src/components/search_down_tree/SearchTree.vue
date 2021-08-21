<template>
    <li v-show="lookTheKey && isOnlyFolderCompute">
        <div class="check_item" :class="[{'bold': isFolder},{'justify_child':!isFolder}]">
            <span class="collapse_arrow" @click="open = !open" v-if="isFolder"><i class="fa" :class="[{ 'fa-caret-right': !open }, {'fa-caret-down':open}]"></i></span>
            <span class="check_box" @click="toggleSelect()" v-if="isOnlyFolderCompute">
                <span class="check_box_tiny" :class="{
                                                check_box_tiny_checked:treeNode.isChecked,
                                                check_box_tiny_checked2:checkedForParent
                                            }">
                </span>
            </span>
            <span class="down_item_name ellipsis" @click.stop="toggleSelect">{{ treeNode.name }}</span>
        </div>
        <ul v-show="open" v-if="isFolder">
            <search-tree
                    v-for="(child, index) in treeNode.children"
                    :key="index"
                    :treeNode="child"
                    :parent="treeNode"
                    :previousLifeStatus="previousLifeStatus"
                    :searchKey="searchKey"
                    :dustChildrenState="myDustChildrenState"
                    v-on:childrenHaveChecked="childrenHaveChecked"
            >
            </search-tree>
        </ul>
    </li>
</template>

<script>
    import Utils from "../../utils/Utils";

    export default {
        name: "SearchTree",
        props: {
            treeNode: Object,
            parent:Object,
            previousLifeStatus:Map,
            dustChildrenState:Boolean,   //利用watch可以简单的告诉子组件父组件的状态
            searchKey:String,
        },
        inject: ['isOnlyFolder'],
        data: function () {
            return {
                open: false,
                checkedForParent:false,
                myDustChildrenState: this.dustChildrenState,
            }
        },
        mounted(){
            this.treeNode.isChecked = this.previousLifeStatus.get(this.treeNode.id)||false;
            this.tellParentMyState(this.parent);
        },
        computed: {
            isFolder() {
                return Utils.isArrayFn(this.treeNode.children) || (this.treeNode.children && this.treeNode.children.length);
            },
            lookTheKey(){
                if(!this.searchKey.trim())
                    return true;
                else if(this.treeNode.IHaveTheKey)
                    return true;
                else
                    return false;
            },
            isOnlyFolderCompute(){
                if(this.isOnlyFolder){
                    if(this.isFolder){
                          return true
                    }else{
                        return false
                    }
                }else{
                    return true;
                }
            }
        },
        methods: {
            childrenHaveChecked(checkedCode){
                switch (checkedCode){
                    case "ALL_OF_THEM":
                        this.checkedForParent = false;
                        this.treeNode.isChecked = true;
                        break;
                    case "SOME_OF_THEM":
                        this.checkedForParent = true;
                        this.treeNode.isChecked = true;
                        break;
                    case "NOTHING":
                        this.checkedForParent = false;
                        this.treeNode.isChecked = false;
                }
            },
            toggleSelect(){
                this.checkedForParent =  false;
                this.treeNode.isChecked = !this.treeNode.isChecked;
                this.previousLifeStatus.set(this.treeNode.id,this.treeNode.isChecked);

                this.tellParentMyState(this.parent);
                if(this.isFolder){
                    var that = this;
                    function handleChildrenState (child) {
                        child.children.forEach(function (item) {
                            item.isChecked = that.treeNode.isChecked;
                            that.previousLifeStatus.set(item.id,item.isChecked);
                            if(item.children && item.children.length){
                                handleChildrenState(item);
                            }
                        });
                    }
                    handleChildrenState(this.treeNode);
                    //向下改变子组件状态的入口
                    this.myDustChildrenState = !this.myDustChildrenState;
                }
            },
            tellParentMyState:function (who) {
                var parent = who;
                var currentVm = this;
                var childFolderCheckedSome = false;
                //向上为父目录添加状态的入口
                while(parent){
                    if(parent){
                        if(childFolderCheckedSome){
                            currentVm.$emit("childrenHaveChecked","SOME_OF_THEM");
                        }else if(parent.children.every(child => child.isChecked)){
                            currentVm.$emit("childrenHaveChecked","ALL_OF_THEM");
                        }else if(parent.children.some(child => child.isChecked)){
                            childFolderCheckedSome = true;
                            currentVm.$emit("childrenHaveChecked","SOME_OF_THEM");
                        }else{
                            currentVm.$emit("childrenHaveChecked","NOTHING");
                        }
                        currentVm = currentVm.$parent;
                    }
                    parent = currentVm.parent
                }
            }
        },
        watch:{
            dustChildrenState(){
                this.checkedForParent = false;
                //取非让子目录递归此方法
                this.myDustChildrenState = !this.myDustChildrenState;
            },
            searchKey(){
                if(this.searchKey.trim())
                    this.open =true;
                else
                    this.open = false;
            }
        },
        beforeDestroy: function () {
            this.tellParentMyState(this.parent);
        }
    }
</script>
