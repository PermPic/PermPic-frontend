<template>
    <div class="operator-modal modal-mask">
        <div class="modal-container">
            <div class="modal" v-bind:style="{width:width+'px'}">
                <h3 class="title">{{alertTitle}}</h3>
                <div class="halving-line"></div>
                <slot name="content"></slot>
                <div class="modal-actions">
                    <button class="modal-cancel" v-if="alertCallBackName[1]" @click="$emit(alertCallBackName[1])">Cancel</button>
                    <button class="modal-ok"  v-if="alertCallBackName[0]" @click="$emit(alertCallBackName[0])">Ok!</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OperatorModal",
        props:['width',"alertTitle","alertCallBackName"],
    }
</script>

<style scoped>
    .operator-modal{
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 9999;
    }
    .modal-mask{
        background: radial-gradient(circle at center, rgba(56, 56, 56, 0.4) 0, rgba(0, 0, 0, 0.8) 100%);
        will-change: opacity;
    }
    .modal-container{
        color:white;
        font-size: 16px;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    button {
        cursor: pointer;
        color: white;
        font-size: 20px;
        border: none;
        outline: none;
        background-color: transparent;
    }
    h3{
        font-size: 1em;
        line-height: 1em;
    }
    .title{
        color: #4ec9b4;
    }
    .content{
        margin: 30px 0;
        align-self: flex-end;
        width: 100%;
    }
    .modal-cancel {
        color: rgb(224, 115, 35);
    }
    .modal-ok {
        color: #4fff22;
    }
    .modal {
        opacity: 1;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
        background: rgba(7, 7, 7, 0.85);
        border-radius: 10px;
        padding: 0 30px 20px 35px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        color: #919191;
    }
    .modal-actions{
        align-self: flex-end;
    }
    .halving-line{
        width: 100%;
        height: 1px;
        background-color: rgba(92, 92, 92, 0.36);
    }
</style>