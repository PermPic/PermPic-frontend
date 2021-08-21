<template>
    <ul :id="'miniSelect'+key" class="mini-select" :style="{height:height+'px'}">
        <li class="select-head" @click="showOption = !showOption;makeOneScrollBar()" :style="{height:height+'px'}">
            <div>
                <span class="select-head-cont">{{defaultVal}}</span>
                <span class="select-icon"><i class="fa fa-caret-down" aria-hidden="true"></i></span>
            </div>
        </li>
        <transition name="mini-select">
            <li class="option-barrier" v-show="showOption" :style="{height:myHeightLimit+'px'}" :id="'mini-select-option'+key">
                <div class="option">
                    <ul :style="{height:myHeight+'px'}" class="option-container">
                        <li class="option-item"
                            :class="{'left':alignment==='left'?true:false}"
                            v-for="(item,index) in myOptions" @click.stop.prevent="selectMe(item,index)">{{item.name}}
                        </li>
                    </ul>
                </div>
            </li>
        </transition>
    </ul>
</template>

<script>
    import Utils from "../../utils/Utils";

    export default {
        name: "miniSelect",
        model: {
            event: 'click'
        },
        props: {
            options: Array,
            alignment: String,
            height: String,
        },
        computed: {
            myHeight() {
                if (this.height) {
                    return parseInt(this.height) * this.options.length;
                } else {
                    return 25 * this.options.length;
                }
            },
            myHeightLimit() {
                return this.myHeight < 200 ? this.myHeight : 200;
            },
            myOptions() {
                return this.options;
            },
        },
        data() {
            return {
                showOption: false,
                defaultVal: "",
                key: new Date().getTime().toString(),
                miniSelected:null,
                confirmTheScroll:false,
            }
        },
        mounted() {
            for (var i = 0; i < this.options.length; i++) {
                if (this.options[i].isMiniSelected){
                    this.defaultVal = this.options[i].name;
                    this.miniSelected = this.options[i];
                    break;
                }
            }
            if(this.options.length){
                this.defaultVal = this.defaultVal || this.options[0].name;
                this.miniSelected = this.miniSelected || this.options[0];
            }else{
                this.defaultVal = "没有数据!";
            }
            this.makeOneScrollBar();
            window.addEventListener('click', this.closeHandle, false);
        },
        methods: {
            closeHandle(e) {
                var obj = e.target;
                if (!$(obj).is("#miniSelect" + this.key + " *")) {
                    this.showOption = false;
                }
            },
            selectMe(item,index) {
                if(index!=0){
                    this.$emit('click', item);
                    this.$emit('change', item);
                    this.defaultVal = item.name;
                    this.showOption = false;
                    this.miniSelected.isMiniSelected = false;
                    this.miniSelected = item;
                    item.isMiniSelected = true;
                }
            },
            makeOneScrollBar(){
                //有时候挂载后的组件不能生成滚动条,所以点击时在判断一下
                if(!this.confirmTheScroll){
                    if (this.myHeight >= 200){
                        Utils.makeScrollBar("#mini-select-option" + this.key,{ scrollInertia: 200,deltaFactor: 40,axis:"y"});
                        this.confirmTheScroll = true;
                    }
                }
            }
        },
        beforeDestroy() {
            window.removeEventListener('click', this.closeHandle, false);
        }
    }
</script>

<style scoped>
    .mini-select {
        background: transparent;
        width: 100%;
        height: 25px;
        font-size: 14px;
        color: white;
        border: 1px rgba(111, 111, 111, 0.49) solid;
        border-radius: 5px;
        box-sizing: border-box;
        opacity: 0.5;
        cursor: pointer;
        position: relative;
    }
    .mini-select:hover {
        opacity: 1;
        z-index: 1000000;
    }
    .mini-select li {
        height: 25px;
    }

    .mini-select .select-head div {
        width: 100%;
        height: 100%;
        display: flex;
    }
    .mini-select .select-head .select-head-cont {
        flex: 1;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        overflow: hidden;
        padding: 0 8px;
    }
    .mini-select .select-head .select-icon {
        flex: 1;
        max-width: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .mini-select .option {
        overflow: hidden;
    }


    .mini-select .option-barrier{
        width: 100%;
        box-sizing: border-box;
        border: 1px rgba(111, 111, 111, 0.49) solid;
        border-top: none;
        background-color: rgba(27, 27, 27, 0.71);
        border-radius: 5px;
        overflow: hidden;
    }
    .mini-select .option-container{
        display: flex;
        flex-direction: column;
    }
    .mini-select .option-item {
        flex: 1;
        box-sizing: border-box;
        padding-left: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        min-height: 25px;
    }
    .mini-select .option-item.left {
        justify-content: flex-start;
    }

    .mini-select .option-item:hover {
        background: rgba(204, 106, 67, 0.3);
    }

    .mini-select-enter-active, .mini-select-leave-active {
        transition: all .5s;
    }
    .mini-select-enter, .mini-select-leave-to {
        opacity: 0;
        transform: translateY(-90%);
    }

</style>
<style>
    .mini-select .option-barrier .mCSB_inside > .mCSB_container{
        margin-right: 10px;
    }
    .mini-select .option-barrier .mCS-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{
        background-color: rgba(43, 43, 43, 0.65);
    }
</style>