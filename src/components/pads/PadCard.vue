<template>
    <div class="pad-card-container type-area">
        <div class="pad-grid">
            <card v-for="(note,index) in notes"
                  :key="note.id"
                  :order="index"
                  :card="note"
                  :closeCardMoreAct="closeCardMoreAct"
                  :batchSelect="batchSelect"
                  :batchBasket="batchBasket"
                  :cardPercent="cardPercent"

                  v-on:closeCard="closeCard"
                  v-on:padProduced="padProduced"
                  v-on:updatePadNameAlert="updatePadNameAlert"
                  v-on:deletePadAlert="deletePadAlert"
                  v-on:movePadToAlert="movePadToAlert"
            >
            </card>
        </div>
        <transition name="alert-fade">
            <operator-modal v-if="padAlert"
                            v-on:updatePadNameAlertOK="updatePadNameAlertOK"
                            v-on:updatePadNameAlertCancel="updatePadNameAlertCancel"
                            v-on:deletePadAlertOK="deletePadAlertOK"
                            v-on:deletePadAlertCancel="deletePadAlertCancel"
                            :width="alertWidth"
                            :alertTitle="alertTitle"
                            :alertCallBackName="alertCallBackName"
            >
                <template slot="content">
                    <component v-bind:is="alertComponent"
                               v-model="newFolderOrPad"
                               :alertMsg="alertMsg"
                               :newFileName="newFileName"
                               :classify="classify"
                               :orders="orders"
                    >
                    </component>
                </template>
            </operator-modal>
        </transition>
        <transition name="alert-fade">
            <move-to-panel
                v-if="alertMoveCardPanel"
                :treeDatas="folders"
                :moveCardNum="moveCardNum"
                v-on:moveToOtherFolderCancel="moveToOtherFolderCancel"
                v-on:moveToOtherFolderOK="moveToOtherFolderOK"
            ></move-to-panel>
        </transition>
    </div>
</template>

<script>
    import EventHub from "../../utils/EventHub"
    import Utils from "../../utils/Utils"
    import {tween, styler, spring} from 'popmotion';
    import Card from "./Card"
    import moveToPanel from "../modal/MoveToPanel"
    import operatorModal from '../modal/OperatorModal'
    import UpdatePadModal from '../modal/UpdatePadModal'
    import deleteFolderOrPad from '../modal/DeleteFolderOrPad'
    import FrontConfig from "../../config/FrontConfig";

    export default {
        name: "PadCard",
        components: {
            Card,
            operatorModal,
            UpdatePadModal,
            deleteFolderOrPad,
            moveToPanel,
        },
        data() {
            return {
                padCards: null,
                notes: [],
                folders:EventHub.folders,
                initLength: 0,

                padAlert: false,
                operatorCard:null,
                newFolderOrPad:null,
                newFileName:"",
                alertTitle: null,
                alertWidth: 300,
                alertMsg: null,
                alertComponent: null,
                orders : [],
                classify : EventHub.classify,

                closeCardMoreAct:false,

                alertMoveCardPanel:false,
                moveCardNum:1,

                batchSelect:false,
                batchBasket:new Map(),
                cardPercent:{
                    'percent1':FrontConfig.cardPercent === "30%",
                    'percent2':FrontConfig.cardPercent === "50%",
                    'percent3':FrontConfig.cardPercent === "100%",
                },
            }
        },
        mounted: function () {
            this.padCards = Utils.makeMuuri('.pad-grid', {
                sortData: {
                    cardSort:function(item, element){
                        return parseFloat(element.getAttribute('data-foo'));
                    },
                },
            });
            EventHub.padCards = this.padCards;
            this.initCards();
            var that = this;
            $(document).click(function(event){
                var obj = event.target;
                if (!$(obj).is(".pad-item .barrier .operation-group .more-act-pen,.pad-item .barrier .operation-group .more-act-pen *")){
                    that.closeCardMoreAct = !that.closeCardMoreAct;
                }
            });
        },
        methods: {
            /*初始化添加Card*/
            initCards(length = 12){
                var that = this;
                var folders = EventHub.folders;
                var seat = 0;
                for (var i = 0; i < folders.length; i++) {
                    var queue = [folders[i]];
                    var item, isFull;
                    while (queue.length) {
                        item = queue.shift();
                        if (!item.children) {
                            item.seat = seat++;
                            that.notes.push(item);
                            that.initLength++;
                            if (that.initLength === length) {
                                isFull = true;
                                break;
                            }
                        }
                        if (item.children && item.children.length) {
                            item.children.forEach(function (child) {
                                queue.push(child);
                            });
                        }
                    }
                    if (isFull) {
                        break;
                    }
                }
            },
            /*点击侧边栏添加Card*/
            addPadCard: function (card) {
                if (!this.notes.some(note => note.id == card.id)) {
                    this.notes.push(card);
                } else {
                    var cardDom = document.querySelector("#pad-custom-content" + card.id);
                    var Where = Utils.isInViewport(cardDom, EventHub.padsTop);
                    if (Where === "TOP" || Where === "UNDER")
                        Utils.goToViewport(cardDom,$(window).height());
                    spring({ from: {x: -5}, velocity: 500, to: {x: 0},  stiffness: 200, mass: 1, damping: 10,}).start(styler(cardDom).set);
                }
            },
            /*Card组件被生成后将会调用该函数*/
            padProduced(card) {
                this.padCards.add([document.querySelector('#pad-item-card' + card.id)], {index: card.seat || 0});
            },
            /*批量添加Card*/
            smallSearchDownTreeClick() {
                var that = this;
                var seat = 0;
                var folders = EventHub.folders;
                folders.forEach(function (root) {
                    makeCard(root);
                });

                function makeCard(child) {
                    if (child.children && child.children.length) {
                        child.children.forEach(function (son) {
                            makeCard(son);
                        });
                    } else {
                        if(!Utils.isArrayFn(child.children)){           //排除目录
                            if (child.isChecked && !child.isCard) {     //选中的才生成
                                child.seat = seat++;
                                that.notes.push(child);
                                child.isCard = true;
                            }
                        }
                    }
                }
            },

            /*----------------------关闭、关闭全部----------------------------*/
            closeCard(card) {
                for (var i = 0; i < this.notes.length; i++) {
                    if (card.id === this.notes[i].id) {
                        this.notes.splice(i, 1);
                    }
                }
            },
            selectAll(isSelectAll) {
                this.batchSelect = isSelectAll;
                if(!this.batchSelect)
                    this.batchBasket.clear();
            },
            moveTo(){
                this.moveCardNum = this.batchBasket.size;
                this.alertMoveCardPanel = true;
            },
            clearAll() {
                if (this.notes.length)
                    this.padCards.remove(document.querySelectorAll(".pad-card-container .pad-item"), {removeElements: false});
                this.notes = [];
                this.dustBatchStatus();
            },
            deleteAll(){
                if(this.batchBasket.size>0){
                    var cards = [...this.batchBasket.values()];
                    var results = this.deletedPads(cards,EventHub.folders);
                    for (var j = 0; j < cards.length; j++) {
                        this.closeCard(cards[j]);
                    }
                    if(results.length){
                        EventHub.$emit('goTip',["删除失败",false,3500]);
                        console.error(results);
                    } else{
                        EventHub.$emit('goTip');
                    }
                    this.dustBatchStatus();
                }
            },

            /***************** CRUD START******************/
            /*----------------------update----------------------------*/
            updatePadNameAlert(card){
                this.padAlert = true;
                this.alertTitle = "update pad";
                this.alertComponent = 'UpdatePadModal';
                this.alertWidth = 300;
                this.alertCallBackName = ['updatePadNameAlertOK', 'updatePadNameAlertCancel'];
                this.operatorCard = card;
                this.newFileName = card.name;
                this.orders = [];
                var parent = EventHub.getPadParent(card);
                EventHub.getOrders(card,this.orders,parent);
                EventHub.getTypes(card);
            },
            updatePadNameAlertOK(){
                if(this.newFolderOrPad.name && this.newFolderOrPad.name.trim()){
                    this.operatorCard.name = this.newFolderOrPad.name;
                    this.operatorCard.type = this.newFolderOrPad.type?this.newFolderOrPad.type.name:null;
                    //交换位置
                    if(this.newFolderOrPad.order && this.newFolderOrPad.order.id != this.operatorCard.id)
                        EventHub.interchange(this.operatorCard,this.newFolderOrPad.order.id);
                    var editor = EventHub.codeMirrors.get(this.operatorCard.id);
                    if(editor)
                        editor.setOption("mode",  EventHub.getMyType(this.operatorCard.type));
                    EventHub.$emit('goTip',["修改成功!"]);
                }
                this.padAlert = false;
            },
            updatePadNameAlertCancel(){
                this.padAlert = false;
            },

            /*----------------------delete----------------------------*/
            deletePadAlert(card){
                this.operatorCard = card;
                this.alertTitle = "delete pad";
                this.alertComponent = 'deleteFolderOrPad';
                this.alertWidth = 175;
                this.alertMsg = "确定删除!";
                this.alertCallBackName = ['deletePadAlertOK', 'deletePadAlertCancel']
                this.padAlert = true;
            },
            deletePadAlertOK() {
                this.closeCard(this.operatorCard);
                var pads = this.deletedPads(this.operatorCard,EventHub.folders);
                if(pads.length)
                    EventHub.$emit('goTip',["删除失败!",false,3500]);
                else
                    EventHub.$emit('goTip',["删除成功!"]);
                this.padAlert = false;
             },
            deletePadAlertCancel() {
                this.padAlert = false;
            },
            /******************************* 批量删除 ******************************************/
            deletedPads(padSource, roots) {
                var padTemp = Utils.isArrayFn(padSource) ? padSource : [padSource];
                if(padTemp.length === 0)
                    return padTemp;
                var pads = Array.from(padTemp);
                roots = Utils.isArrayFn(roots) ? roots : [roots];
                var queue, parents = [], item, findNum = 0;
                for (var i = roots.length - 1; i >= 0; i--) {
                    queue = [roots[i]];
                    /*---------------------这里进行批量搜索---------------------------*/
                    while (queue.length) {
                        item = queue.shift();
                        for (var k = 0; k < pads.length; k++) {         //遍历临时的Pads
                            if (item.id === pads[k].parentId) {
                                if (parents.indexOf(item) === -1)
                                    parents.push(item);                 //添加到临时的父数组
                                findNum++;
                            }
                        }
                        if(findNum === pads.length){                    //全部找到的话就不在搜索了
                            break;
                        }
                        if (item.children && item.children.length) {    //继续添加到队列进行比对
                            item.children.forEach(function (child) {
                                queue.push(child);
                            });
                        }
                    }
                    if (parents.length) {
                        /*---------------------这里进行批量删除---------------------------*/
                        var parent, findCount;
                        while (parents.length) {
                            parent = parents.shift();
                            findCount = false;
                            for (let cs = 0; cs < parent.children.length; cs++) {
                                for (let c = 0; c < pads.length; c++) {
                                    try{
                                        //这里需要注意一下，如果临时父数组只有一个子节点，当删除子节点后再次遍历取不到值就会报错
                                        if (parent.children[cs] && parent.children[cs].id === pads[c].id) {
                                            parent.children.splice(cs, 1);      //删除子节点
                                            pads.splice(c, 1);                  //删除临时pads
                                            c--;
                                            findCount = true;

                                            if(parent.id === EventHub.defaultFolderId && parent.children.length===0){   //默认目录的额外操作
                                                parent.isShow = false;
                                            }
                                        }
                                    }catch(err) {
                                        //1.如果数据对不上，例如子节点parentId为1，但自己却没有在id为1的目录里面
                                        //2.或根本没有parentId 为相应id的节点。
                                        console.error(parent,pads[c],cs,c);
                                    }
                                }
                                if (findCount) {
                                    cs--;
                                    findCount = false;
                                }
                            }
                        }
                        if (!pads.length) {
                            //删除失败剩余的节点
                            return pads;
                        }
                    }
                }
                //也可能没有找到
                return pads;
            },

            /*----------------------move----------------------------*/
            movePadToAlert(card){
                this.moveCardNum = 1;
                this.operatorCard = card;
                this.alertMoveCardPanel = true;
            },
            moveToOtherFolderCancel(){
                this.alertMoveCardPanel = false;
            },
            moveToOtherFolderOK(parent){
                var that = this;
                /***************** 批量移动 *********************/
                if(this.batchBasket.size>0){
                    var cards = [...this.batchBasket.values()];
                    cards.forEach(function (child) {
                        if(parent.children.some((son)=> son.id === child.id))
                            that.batchBasket.delete(child.id);                  //如果父元素里本身该节点就有先删除 batchBasket 相应数据
                    });

                    var cards2 = [...this.batchBasket.values()];                //重新获取batchBasket里的数据
                    var results = this.deletedPads(cards2,EventHub.folders);    //在移动之前先批量删除这些节点

                    cards2.forEach(function (child) {
                        child.parentId = parent.id;
                        parent.children.push(child);                            //最后在这里批量的移动到指定的父节点
                        if(parent.id === EventHub.defaultFolderId && !parent.isShow)
                            parent.isShow = true;                               // 默认节点的额外操作
                    });
                    //移动失败后这里捕获异常
                    if(results.length>0){
                        console.error(results);
                        EventHub.$emit('goTip',["移动失败!",false,3500]);
                    } else{
                        EventHub.$emit('goTip',["移动成功!"]);
                    }

                    /*其他状态管理*/
                    /*关掉批量操作状态*/
                    this.dustBatchStatus();
                }else{  /************************ 单条移动 ****************************/
                    if(this.operatorCard && parent.id != this.operatorCard.parentId) {
                        this.deletedPads(this.operatorCard,EventHub.folders);    //在移动之前先批量删除这些节点
                        this.operatorCard.parentId = parent.id;
                        parent.children.push(this.operatorCard);
                        if(parent.id === EventHub.defaultFolderId){
                            parent.isShow = true;
                        }
                        EventHub.$emit('goTip');
                    }
                }
                this.alertMoveCardPanel = false;
            },
            /***************** CRUD EDN******************/

            /*------------------------helper-----------------------*/
            dustBatchStatus(){
                this.batchBasket.clear();
                EventHub.$emit('batchOperationCompleted');
            },
            /*样式*/
            cardPercentChange(cardPercent){
                if(cardPercent.name === 'Responsive')
                    return;
                this.cardPercent = {
                    'percent1':cardPercent.name === "30%",
                    'percent2':cardPercent.name === "50%",
                    'percent3':cardPercent.name === "100%",
                };
                this.$nextTick(function(){
                    EventHub.padCards.refreshItems();
                    EventHub.padCards.layout();
                    EventHub.codeMirrors.forEach(function (v) {
                        v.setSize(null);
                    });
                });
                sessionStorage.setItem('cardPercent', cardPercent.name);
            }
        },

        created: function () {
            EventHub.$on('moveTo', this.moveTo);
            EventHub.$on('selectAll', this.selectAll);
            EventHub.$on('deleteAll', this.deleteAll);
            EventHub.$on('clearAll', this.clearAll);
            EventHub.$on('addPadCard', this.addPadCard);
            EventHub.$on('smallSearchDownTreeClick', this.smallSearchDownTreeClick);
            EventHub.$on('cardPercentChange', this.cardPercentChange);
        },
        beforeDestroy: function () {
            EventHub.$off('moveTo', this.moveTo);
            EventHub.$off('selectAll', this.selectAll);
            EventHub.$off('deleteAll', this.deleteAll);
            EventHub.$off('clearAll', this.clearAll);
            EventHub.$off('addPadCard', this.addPadCard);
            EventHub.$off('smallSearchDownTreeClick', this.smallSearchDownTreeClick);
            EventHub.$off('cardPercentChange', this.cardPercentChange);

            sessionStorage.clear();
        },
    }
</script>

<style>
    .pad-card-container {
        margin: auto;
        box-sizing: border-box;
    }

    .pad-card-container .pad-grid {
        box-sizing: border-box;
        position: relative;
    }
    .pad-card-container .pad-item {
        display: block;
        position: absolute;
        margin: 1.5%;
        z-index: 1;
        color: #fff;
    }
    .pad-card-container .pad-item.percent1{
        width: 30%;
        height: 250px;
    }
    .pad-card-container .pad-item.percent2{
        width: 47%;
        height:390px
    }
    .pad-card-container .pad-item.percent3{
        width: 94%;
        height:780px
    }
    .pad-card-container .pad-item.muuri-item-dragging {
        z-index: 3;
        opacity: 0.7;
    }
    .pad-card-container .pad-item.muuri-item-releasing {
        z-index: 2;
        opacity: 1;
    }
    .pad-card-container .pad-item.muuri-item-hidden {
        z-index: 0;
    }

    .pad-card-container .pad-item.muuri-item-dragging .pad-item-content {
        opacity: 0.5;
    }
    .pad-card-container .pad-item.muuri-item-releasing .pad-item-content {
        opacity: 1;
    }

    .pad-card-container .pad-item-content {
        position: relative;
        width: 100%;
        height: 100%;
    }

    /* Safe zone, enter your custom markup */
    .pad-card-container .pad-item-content .pad-custom-content {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
    }
    .pad-card-container .pad-item-content .pad-custom-content .barrier {
        flex: 1;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        max-width: 100%;
        max-height: 100%;
    }
    .pad-card-container .pad-item-content .pad-custom-content .header {
        flex: 1;
        max-height: 30px;
        font-size: 14px;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }
    .pad-card-container .pad-item-content .pad-custom-content .header .title {
        flex: 1;
        height: 100%;
    }
    .pad-card-container .pad-item-content .pad-custom-content .header .title span {
        padding: 0 15px;
        display: inline-block;
        height: 100%;
        max-width: 150px;
        line-height: 30px;
    }
    .pad-card-container .pad-item-content .pad-custom-content .header .minus-act {
        width: 30px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0.3;
        font-size: 12px;
    }
    .pad-card-container .pad-item-content .pad-custom-content .header .minus-act:hover {
        opacity: 1;
        cursor: pointer;
    }

    .pad-card-container .pad-item-content .pad-custom-content .content {
        flex: 1;
        display: flex;
        max-height: calc(100% - 60px);
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer {
        flex: 1;
        max-height: 30px;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .date {
        font-family: "Times New Roman", Times, serif;
        font-size: 12px;
        display: flex;
        align-items: center;
        flex: 1;

        opacity: 0.7;
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .date i {
        margin: 0 5px 0 15px;
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group {
        flex: 1;
        display: flex;
        max-width: 112px;
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .copy-text,
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .move-to-first,
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .move-to-last,
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .more-act,
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .save-text
    {
        width: 28px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0.3;
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .save-text{
        opacity: 0.5;
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group div:hover {
        opacity: 1;
        cursor: pointer;
    }
    .pad-card-container .pad-item-content  .card-enter-active {
        transition: opacity .4s linear;
    }
    .pad-card-container .pad-item-content  .card-enter {
        opacity: 0;
    }
    .pad-card-container .pad-custom-content .footer .operation-group .more-act-pen{
        font-size: 12px;
        position: relative;
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .dialogs{
        position: absolute;
        bottom: -142px;
        right: -10px;
        z-index: 99999999;
        width: 100px;
        height: 140px;
        background-color: rgba(20, 18, 16, 0.92);
        color: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        overflow: hidden;

    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .dialogs div{
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 12px;
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .dialogs div i{
        margin-left: 8px;
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .dialogs div:hover{
        background-color: rgba(94, 92, 90, 0.62);
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .dialogs div:nth-child(2){
        border-top: 1px solid rgba(62, 62, 62, 0.6);
        border-bottom: 1px solid rgba(62, 62, 62, 0.6);
    }
    .pad-card-container .pad-item-content .pad-custom-content .footer .operation-group .dialogs div i{
        padding: 0 8px;
    }
    .pad-card-container .pad-item-content .more-act-enter-active, .more-act-leave-active {
        transition: opacity .5s;
    }
    .pad-card-container .pad-item-content .more-act-enter, .more-act-leave-to{
        opacity: 0;
    }

    .pad-card-container .pad-item-content .pad-custom-content .header .checkbox-pen{
        width: 40px;
        height: 40px;
        position: absolute;
        top: 0px;
        right: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }
    .pad-card-container .pad-item-content .pad-custom-content .header .checkbox-pen:hover{
        cursor: pointer;
    }
    .pad-card-container .pad-item-content .pad-custom-content .header .checkbox-pen .checkbox{
        width: 25px;
        height: 25px;
        border-radius: 5px;
        border: 2px solid #ffffff;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>