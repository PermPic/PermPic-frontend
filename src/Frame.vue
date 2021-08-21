<template>
    <div id="Frame">
        <!--提示框-->
        <operate-tip v-if="showOperateTip" :result="operateResult" v-model="showOperateTip" :showDuration="showDuration"/>
        <!--导航栏-->
        <NavigationBar :isSearchable="isSearchable"></NavigationBar>
        <!--视图页-->
        <router-view></router-view>
    </div>
</template>

<script>
    import NavigationBar from './components/NavigationBar'
    import EventHub from './utils/EventHub'

    export default {
        name: "Frame",
        components: {
            NavigationBar,
        },
        data() {
            return {
                isSearchable: false,
                /*tip*/
                showOperateTip: false,
                operateResult: {msg: "操作成功!", status: true},
                showDuration: 1500,
            }
        },
        methods: {
            goTip(params = ["操作成功!",true,1500]) {
                this.operateResult.msg = params[0] || "操作成功!";
                this.operateResult.status = params[1] || true;
                this.showDuration = params[2] || 1500;
                this.showOperateTip = true;
            },
        },
        watch: {
            $route: function () {
                if (this.$route.name === "pads")
                    this.isSearchable = false;
                else
                    this.isSearchable = true;
            }
        },
        created: function () {
            EventHub.$on('goTip', this.goTip);

        },
        beforeDestroy: function () {
            EventHub.$off('goTip', this.goTip);
        },
    }
</script>

<style>
    #Frame {
        height: 100%;
    }
</style>