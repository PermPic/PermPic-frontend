<template>
    <transition name="card" v-on:leave="leave">
        <div class="pad-item percent1" :id="'pad-item-card'+card.id" :data-foo="order"
             v-bind:style="{ zIndex: showMoreAct ? 4 : null}"
             v-bind:class="cardPercent"
        >
            <div class="pad-item-content">
                <div class="pad-custom-content" :id="'pad-custom-content'+card.id">
                    <div class="barrier" :style="myBackground">
                        <div class="header">
                            <div class="title draggable">
                                <span class="word-ellipsis">#{{card.name}}</span>
                            </div>
                            <div class="minus-act" @click="$emit('closeCard',card)">
                                <i class="fa fa-times" aria-hidden="true"></i>
                            </div>
                            <div class="checkbox-pen" v-if="batchSelect" @click="checkboxSelect">
                                <div class="checkbox"
                                     v-bind:style="{'backgroundColor': checkAllMe?'rgb(235, 116, 13)':null}"><i
                                        aria-hidden="true" class="fa fa-check"></i></div>
                            </div>
                        </div>
                        <div class="content" :class="{draggable:card.content==null}">
                            <textarea v-show="card.content!=null" :class="'cardEditCodeArea'+card.id"></textarea>
                        </div>
                        <div class="footer">
                            <div class="date" :class="{draggable:card.content==null}">
                                <p><i class="fa fa-calendar" aria-hidden="true"></i>{{myDate}}</p>
                            </div>
                            <div class="operation-group" :style="{'max-width': isChange?'140px':null}">
                                <div class="save-text" v-if="isChange" @click="saveCardContent"><i class="fa fa-floppy-o" aria-hidden="true"></i></div>
                                <div class="copy-text" @click="copyCode"><i class="fa fa-files-o" aria-hidden="true"></i></div>
                                <div class="move-to-first" @click="moveToFirst"><i class="fa fa-angle-left" aria-hidden="true"></i></div>
                                <div class="move-to-last" @click="moveToLast"><i class="fa fa-angle-right" aria-hidden="true"></i></div>
                                <div class="more-act-pen">
                                    <div class="more-act" @click="showMoreAct=!showMoreAct"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></div>
                                    <div class="dialogs" v-if="showMoreAct && !batchSelect">
                                        <div class="edit" @click="editMe">编辑<i class="fa fa-pencil" aria-hidden="true"></i></div>
                                        <div class="update" @click="showMoreAct=false;$emit('updatePadNameAlert',card)">修改<i class="fa fa-pencil-square-o" aria-hidden="true"></i></div>
                                        <div class="update" @click="showMoreAct=false;$emit('movePadToAlert',card)">移动<i class="fa fa-truck" aria-hidden="true"></i></div>
                                        <div class="delete" @click="showMoreAct=false;$emit('deletePadAlert',card)">删除<i class="fa fa-trash-o" aria-hidden="true"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import Utils from "../../utils/Utils"
    import FrontConfig from "../../config/FrontConfig"
    import EventHub from "../../utils/EventHub"

    export default {
        name: "Card",
        props: {
            order: Number,
            card: Object,
            closeCardMoreAct: Boolean,
            batchSelect: Boolean,
            batchBasket: Map,
            cardPercent:Object,
        },
        watch: {
            closeCardMoreAct: function () {
                this.showMoreAct = false;
            },
            batchSelect: function () {
                this.checkAllMe = false;
            }
        },
        data() {
            return {
                background: FrontConfig.imgs[Math.floor(Math.random() * FrontConfig.imgs.length)],
                showMoreAct: false,
                checkAll: false,
                checkAllMe: false,
                isEditable: false,
                isChange:false,
                editObj: null,
                codeMirror: null,
                curCursor:null,
            }
        },
        computed: {
            myDate() {
                if(this.card.updateTime){
                    var time = this.card.updateTime.split("-");
                    var month = Utils.numberMonthToEnMonth(time[1]);
                    var day = Utils.numberDayToEnOrdinal(time[2]);
                    return day + " " + month + "," + time[0];
                }else{
                    return Utils.simpleDateFormat(new Date());
                }
            },
            myBackground() {
                if (!this.background) {
                    return {
                        border: '1px solid rgba(56, 56, 56, 0.54)'
                    };
                }
                if (this.background.includes("material")) {
                    return {
                        background: Utils.getBackground(this.background) + 'repeat'
                    }
                } else if (this.background.includes("spot")) {
                    return {
                        backgroundImage: Utils.getBackground(this.background),
                        backgroundSize: '100% 100%'
                    }
                } else {
                    return this.background;
                }
            },
        },
        mounted() {
            this.card.isCard = true;
            this.$emit("padProduced", this.card);
            
            if (this.card.content != null || this.card.editable){
                this.mallocCodeMirror();
                if(this.card.editable)
                    this.editMe();
            }
        },
        methods: {
            moveToFirst() {
                EventHub.padCards.move(document.querySelector('#pad-item-card' + this.card.id), 0);
            },
            moveToLast() {
                EventHub.padCards.move(document.querySelector('#pad-item-card' + this.card.id), -1);
            },

            leave: function (el, done) {
                EventHub.padCards.remove(el, {removeElements: true});
                done();
            },
            checkboxSelect() {
                this.checkAllMe = !this.checkAllMe;
                if (this.checkAllMe) {
                    this.batchBasket.set(this.card.id, this.card)
                } else {
                    this.batchBasket.delete(this.card.id);
                }
            },
            cursorActivity(cm){
                this.curCursor = cm.getCursor();
            },
            editMe() {
                if(!this.codeMirror){
                    this.mallocCodeMirror();
                    this.card.content = "";
                }
                this.showMoreAct = false;
                this.isEditable = true;
                this.isChange = true;
                this.codeMirror.setOption("readOnly",false);
                var lastLine = this.codeMirror.lastLine();
                var lineHandle =  this.codeMirror.getLineHandle(lastLine);
                if(this.curCursor){
                    this.codeMirror.setCursor(this.curCursor);
                }else{
                    this.codeMirror.setCursor({line:lastLine,ch:lineHandle.text.length});
                }
                this.codeMirror.focus();
            },
            copyCode(){
                if(this.codeMirror){
                    if(Utils.copyText(this.codeMirror.getValue()))
                        EventHub.$emit('goTip',["复制成功",true,800]);
                }
            },
            saveCardContent(){
                this.isChange = false;
                this.isEditable = false;
                this.card.editable = false;
                this.codeMirror.setOption("readOnly","nocursor");
                var text = this.codeMirror.getValue();
                this.card.content = text;
                EventHub.$emit("goTip",["保存成功!"])
            },
            mallocCodeMirror(){
                var that = this;
                this.editObj = document.querySelector(".pad-item .cardEditCodeArea" + this.card.id);
                this.codeMirror = Utils.makeCodeMirror(
                    this.editObj,
                    this.card.content,
                    EventHub.getMyType(this.card.type),
                    {
                        saveText:that.saveCardContent
                    });
                this.codeMirror.on("cursorActivity", this.cursorActivity);
                EventHub.codeMirrors.set(this.card.id,this.codeMirror);
            },

        },
        beforeDestroy: function () {
            this.card.isCard = false;
            this.card.seat = null;
            this.codeMirror = null;
            if(this.codeMirror){
                this.codeMirror.off("cursorActivity", this.cursorActivity);
                EventHub.codeMirrors.delete(this.card.id);
            }

        }
    }
</script>

