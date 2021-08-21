<template>
    <div id="pads-nav-bar">
        <div class="nav">
            <ul>
                <!-- <li>
                    <router-link to="/pads">Pads</router-link>
                </li> -->
                <li>
                    <router-link to="/blog">Blog</router-link>
                </li>
            </ul>
            <ul>
                <li v-if="isSearchable"><span class="search-icon  fa fa-search"></span>
                    <input id="search" type="text" class="search" v-model="searchKey" @input="searchMe">
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import EventHub from "../utils/EventHub"
    import Utils from "../utils/Utils"

    export default {
        name: 'nav-bar',
        props: {
            isSearchable: Boolean,
        },
        data() {
            return {
                searchKey:null,
                lastSearchTime:new Date().getTime(),
            }
        },
        methods: {
            searchMe:Utils.debounce(function () {
                EventHub.$emit('navSearchKey', this.searchKey);
            },500),
        }
    }
</script>

<style scoped>
    #pads-nav-bar {
        position: fixed;
        height: 60px;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.79);
        z-index: 999999;
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    }

    #pads-nav-bar .nav {

        display: flex;
    }

    #pads-nav-bar .nav > ul {
        flex: 1;
        display: flex;
        justify-content: center;
    }

    #pads-nav-bar .nav > ul:last-child {
        justify-content: flex-end;
    }

    #pads-nav-bar .nav > ul > li {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 20px;
    }

    #pads-nav-bar .nav > ul:last-child > li:last-child {
        margin-right: 20px;
    }

    #pads-nav-bar .nav > ul > li > a {
        line-height: 60px;
        text-align: center;
    }

    #pads-nav-bar .nav:hover li {
        opacity: 0.4;
    }

    #pads-nav-bar .nav > ul > li:hover {
        cursor: pointer;
        opacity: 1;
    }

    #pads-nav-bar .nav > ul li {
        font-family: "obelixprobrokenregular", Arial, sans-serif;
        font-size: 14px;
    }

    #pads-nav-bar .nav > ul > li a {
        color: rgb(162, 251, 255);
    }

    #pads-nav-bar .nav > ul:first-child > li:first-child {
        font-family: "a_callingregular", Arial, sans-serif;
        font-size: 25px;
    }

    #pads-nav-bar .nav > ul:first-child > li:first-child a {
        color: #ff8000;
    }

    /*search*/
    #pads-nav-bar .search {
        background-color: rgba(48, 48, 48, 0.75);
        font-family: inconsolatamedium, Arial, sans-serif;
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        padding: 0 15px 0 30px;
        color: #a4a4a4;
        outline: none;
        border-radius: 15px;
        margin-right: 10px;
        transition: border-color 0.2s ease;
        background-size: 20px;
        vertical-align: middle !important;
        border-color: rgba(17, 24, 54, 0.69);
    }

    #pads-nav-bar .search-icon {
        transform: translateX(200%);
        color: #636363;
    }
</style>
