<template>
    <div class="pads-secondary-nav" v-bind:style="{zIndex:isShowCompleted}">
        <div class="fa switch" :class="{'fa-angle-double-down':!isShow,'fa-angle-double-up':isShow}" @click="showIt"></div>
        <transition>
            <div class="operator-btn type-area" v-show="isShow">
                <!--add pad-->
                <div class="add-pad hvr-wobble-horizontal" @click="$emit('addPad')" title="new pad"><span>+</span></div>
                <div class="btn-group">
                    <button class="btn hvr-wobble-top" v-bind:class="{selectAllCss:selectState}" @click="selectAll">批量操作</button>
                    <button class="btn hvr-wobble-top" @click="clearAll()">清空</button>
                    <button class="btn hvr-wobble-top" @click="refresh()">刷新</button>
                    <button class="btn" @click="moveTo()" v-bind:class="{'hvr-wobble-top':selectState,'disabled-btn':!selectState}" :disabled="!selectState">移动到</button>
                    <button class="btn delete-btn" @click="deleteAll" v-bind:class="{'hvr-wobble-top':selectState,'disabled-btn':!selectState}" :disabled="!selectState">删除</button>
                    <div class="card-percent">
                        <mini-select :options="options" v-model="cardPercent" @change="changePercent"></mini-select>
                    </div>
                </div>
                <div class="pad-card-tree-checkbox">
                    <small-search-down-tree  height="300">
                        <div class="insert-content">
                            <button class="btn" @click="smallSearchDownTreeClick">go up</button>
                        </div>
                    </small-search-down-tree>
                </div>
            </div>
        </transition>
        <transition name="alert-fade">
            <operator-modal v-if="batchDeleteAlert"
                            width="175"
                            alertTitle="批量删除pad"
                            :alertCallBackName="alertCallBackName"
                            v-on:batchDeletePadsAlertOK="batchDeletePadsAlertOK"
                            v-on:batchDeleteAlertCancel="batchDeleteAlertCancel"
            >
                <template slot="content">
                    <delete-folder-or-pad alertMsg="你确定要批量删除这些Pads吗？"></delete-folder-or-pad>
                </template>
            </operator-modal>
        </transition>
    </div>
</template>

<script>
    import EventHub from "../../utils/EventHub"
    import FrontConfig from "../../config/FrontConfig"
    import SmallSearchDownTree from "../search_down_tree/SmallSearchDownTree"
    import OperatorModal from "../modal/OperatorModal"
    import DeleteFolderOrPad from "../modal/DeleteFolderOrPad"
    import {tween, styler} from 'popmotion';

    export default {
        name: "PadOperatorButton",
        props: ['folders'],
        components: {
            SmallSearchDownTree,
            OperatorModal,
            DeleteFolderOrPad
        },
        data() {
            return {
                isShow: FrontConfig.showTopOperationBar,
                isShowCompleted: 1,
                padCards: null,
                selectState:false,

                padsStyler: null,

                batchDeleteAlert:false,
                alertCallBackName:['batchDeletePadsAlertOK', 'batchDeleteAlertCancel'],

                options:[{id:1,name:'Responsive'},{id:2,name:'30%'},{id:3,name:'50%'},{id:4,name:'100%'}],
                cardPercent:FrontConfig.cardPercent,

            }
        },
        computed: {

        },
        mounted() {
            this.$nextTick(function () {
                this.padsStyler = styler(document.querySelector('#pads'));
                this.padCards = EventHub.padCards;

                if(this.isShow){
                    this.isShowCompleted = 999;
                    this.padsStyler.set("paddingTop",120);
                }
            });
        },
        methods: {
            showIt() {
                var that = this;
                this.isShow = !this.isShow;

                if (this.isShow) {
                    that.isShowCompleted = 999;
                    tween({from: 60, to: 120, duration: 1500}).start({
                        update: v => { this.padsStyler.set("paddingTop", v) },
                        complete:()=>{
                            EventHub.padsTop = 120;
                        }
                    });
                } else {
                    tween({from: 120, to: 60, duration: 1500}).start({
                        update: v => { this.padsStyler.set("paddingTop", v) },
                        complete: () => { 
                            that.isShowCompleted = 1;
                            EventHub.padsTop = 60;
                        }
                    });
                }
            },
            clearAll(){ EventHub.$emit("clearAll");  },
            selectAll() {
                this.selectState=!this.selectState;
                EventHub.$emit('selectAll',this.selectState)
            },
            deleteAll() {  this.batchDeleteAlert = true },

            refresh() {
                this.padCards.refreshItems();
                this.padCards.layout(function (items) {});
            },
            sort() {
                this.padCards.sort('cardSort');
            },
            moveTo() { EventHub.$emit('moveTo') },
            batchDeletePadsAlertOK(){
                EventHub.$emit('deleteAll')
                this.batchDeleteAlert = false;
            },
            batchDeleteAlertCancel(){
                this.batchDeleteAlert = false;
            },

            smallSearchDownTreeClick(){
                /*批量生成Card*/
                EventHub.$emit("smallSearchDownTreeClick");
            },
            /*-------------------批量操作完成------------------------*/
            batchOperationCompleted(){
                this.selectState = false;
                EventHub.$emit('selectAll',this.selectState)
            },
            changePercent(){
                EventHub.$emit('cardPercentChange',this.cardPercent)
            }

        },
        created: function () {
            EventHub.$on('batchOperationCompleted', this.batchOperationCompleted);

        },
        beforeDestroy: function () {
            EventHub.$off('batchOperationCompleted', this.batchOperationCompleted);
        },
    }
</script>

<style scoped>
    .v-enter-active,
    .v-leave-active {
        transition: all 1.5s;
    }

    .v-enter,
    .v-leave-to {
        transform: translateY(-100%);
    }

    /*layout*/
    .pads-secondary-nav {
        position: fixed;
        top: 60px;
        left: 20%;
        height: 50px;
        width: 80%;
    }

    /*action*/
    .switch {
        box-sizing: border-box;
        width: 60px;
        height: 30px;
        padding-top: 10px;
        color: #404040;
        text-align: center;
        transition: all .3s linear;
        border-radius: 3px;
        display: block;
        position: absolute;
        right: 50px;
        top: 10px;
    }

    .switch:hover {
        cursor: pointer;
        transform: translateY(10px);
        box-shadow: 1px 1px 1px rgba(112, 112, 112, 0.33);
    }

    @media screen and (max-width: 1620px) {
        .switch {
            right: 0px
        }
    }

    /*add-pad*/
    .operator-btn .add-pad {
        width: 35px;
        height: 35px;
        background-color: #ff700f;
        border-radius: 50%;
        text-align: center;
        opacity: 0.5;
    }

    .operator-btn .add-pad:hover {
        opacity: 1;
        cursor: pointer;
    }

    .operator-btn .add-pad span {
        font-size: 30px;
        line-height: 35px;
        user-select: none;
    }

    /*behavior*/
    .operator-btn {
        margin: auto;
        height: 100%;
        padding-left: 1.3%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-bottom: 1px solid rgba(37, 37, 37, 0.83);
    }

    
    /*pad-card-group*/
    .btn-group {
        /*width: 100%;*/
        text-align: center;
        flex: 1;
    }
    .btn-group .btn {
        color: white;
        opacity: 0.5;
        font-size: 12px;
        outline: none;
        background-color: rgba(255, 255, 255, 0);
        height: 30px;
    }
    .btn-group .card-percent{
        cursor: pointer;
        width: 100px;
        display: inline-block;
        vertical-align: middle;
    }
    .btn-group .btn:hover {
        opacity: 1;
        cursor: pointer;
    }
    .btn-group .delete-btn{
        color: #ff6433;
    }
    .btn-group .disabled-btn {
        opacity: 0.5;
    }
    .btn-group .disabled-btn:hover{
        opacity: 0.5;
    }
    
    /*pad-pad-card-tree-checkbox-tree*/
    .pad-card-tree-checkbox {
        flex: 1;
        max-width: 200px;
        height: 30px;
        color: black;

    }

    .btn-group .selectAllCss{
        color: #14ff2b;
        opacity: 1;
    }
    .btn-group .cardPercent{
        cursor: pointer;
        opacity: 0.5;
    }
    .btn-group .cardPercent:hover{
        opacity: 1;
    }
    .btn-group select{
        color:white;
        cursor: pointer;
        border: 1px solid rgba(40, 40, 40, 0.6);
        outline: none;
        border-radius: 3px;
        overflow: hidden;
        background-color:transparent;
    }
    .btn-group select option{

    }
    .btn-group .cardPercentOpt{
        cursor: pointer;
        color:white;
        background-color: rgba(0, 0, 0, 0);
        opacity: 0;
    }
</style>
<style>
    .operator-btn .vue-treeselect__control {
        color: #dbdbdb;
        background-color: rgba(0, 0, 0, 0);
        overflow: hidden;
    }
    .operator-btn .vue-treeselect__menu {
        color: #dbdbdb;
        background-color: rgba(0, 0, 0, 0);
    }
    .operator-btn .vue-treeselect__option--highlight {
        background-color: rgba(0, 0, 0, 0);
    }
    .operator-btn .vue-treeselect__input-container .vue-treeselect__input {
        color: #dbdbdb;
    }
</style>