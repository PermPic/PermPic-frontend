<template>
    <transition name="operate-pen-fade">
        <div class="operate-pen" :class="{'operate-tip-success':result.status,'operate-tip-error':!result.status}">
            <div class="msg"><i class="fa" :class="{'fa-check-circle-o':result.status,'fa-bug':!result.status}" aria-hidden="true"></i>{{result.msg}}</div>
            <div class="close"  @click="$emit('click', false)"><i class="fa fa-times" aria-hidden="true"></i></div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "OperateTip",
        props: ['result', 'showDuration'],
        model: {
            prop: 'showOperateTip',
            event: 'click'
        },
        mounted() {
            this.timeout = setTimeout(() => {
                this.$emit('click', false);
                clearTimeout(this.timeout);
            }, parseInt(this.showDuration || 1500));
        },
        data() {
            return {
                timeout:null,
            }
        } ,
        beforeDestroy(){
            clearTimeout(this.timeout);
        }
    }
</script>

<style scoped>
    .operate-pen {
        width: 250px;
        height: 60px;
        position: fixed;
        top:200px;
        left:50%;
        margin-left:-125px;
        z-index: 9999999;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
    }
    .operate-pen .msg {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 25px;
    }

    .operate-pen .msg i {
        margin-right: 15px;
    }

    .operate-pen .close {
        font-size: 14px;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .operate-pen .close:hover {
        cursor: pointer;
    }
    .operate-tip-success{
        background-color: rgba(101, 101, 101, 0.59);
        color: #45dc2f;
    }
    .operate-tip-error{
        background-color: rgba(101, 101, 101, 0.59);
        color: #dc3545;
    }


    .operate-pen-fade-enter-active, .operate-pen-fade-leave-active {
        transition: all .8s;
    }
    .operate-pen-fade-enter, .operate-pen-fade-leave-to{
        opacity: 0;
        transform: translateY(-200px);
    }
</style>