<template>
    <div class="content">
        <input class="form-control" type="text" placeholder="请输入..."
               v-model="result.name"
               v-on:input="inputMe">
        <mini-select v-model="order" :options="orders" :alignment="'left'" height="30"></mini-select>
        <mini-select v-model="type"  :options="classify" height="30"></mini-select>
    </div>
</template>

<script>
    export default {
        name: "UpdatePadModal",
        props:{
            'newFileName':String,
            'classify':Array,
            'orders':Array,
        },
        model: {
            event: 'change'
        },
        data(){
            return {
                type:null,
                order:null,
                result:{
                    name:this.newFileName||"",
                    type:{},
                    order:{},
                },
            }
        },
        methods:{
          inputMe($event){
              this.result.name =  $event.target.value;
              this.$emit('change',this.result);
          },
        },
        mounted(){
            for (var j = 0; j < this.orders.length; j++) {
                if (this.orders[j].isMiniSelected){
                    this.order = this.orders[j];
                    break;
                }
            }
            for (var i = 0; i < this.classify.length; i++) {
                if (this.classify[i].isMiniSelected){
                    this.type = this.classify[i];
                    break;
                }
            }
        },
        watch:{
            type:function () {
                this.result.type =  this.type;
                if(this.type !== "交换位置:" )
                    this.$emit('change',this.result);
            },
            order:function () {
                this.result.order =  this.order;
                if(this.type !== "选择语言:" )
                    this.$emit('change',this.result);
            }
        }
    }
</script>
<style scoped>
    input{
        width: 100%;
        background: transparent;
        color: #bcbcbc;
        font-size: 14px;
        border: 1px solid #2b2b2b;
    }
    .content > ul{
        margin: 10px 0;
    }

</style>
