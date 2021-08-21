<template>
    <div class="folder-tree" v-bind:style="{color:myColor}" v-if="folder.isShow">
        <div class="folder-pen">
            <div class="folder-name" @click="selectedFolder" v-bind:style="selectedState.styler[folder.id]">{{ folder.name}}</div>
            <div class="pack-up" @click="folder.isStretch = !folder.isStretch"><i class="fa" :class="[{ 'fa-caret-left': !folder.isStretch }, {'fa-caret-down':folder.isStretch}]"></i></div>
        </div>
        <folder-tree-contents v-if="isFolder && folder.isStretch"
                              :children="folder.children"
                              :colors="colors"
                              :parent="folder"
                              :selectedState="selectedState"
                              :collapseAll="collapseAll"
        >
        </folder-tree-contents>
    </div>
</template>

<script>
    import EventHub from "../../utils/EventHub"
    export default {
        name: "folderTree",
        props: {
            'folder':Object,
            'colors':Array,
            'selectedState':Object,
            'collapseAll':Boolean,
        },
        beforeCreate: function () {
            this.$options.components.folderTreeContents = require('./FolderTreeContents.vue').default
        },
        data() {
            return {
                showColor: false,
                showDefault: false,
                myColor: this.colors[Math.floor(Math.random() * this.colors.length)],
            }
        },
        computed: {
            isFolder: function () {
                return this.folder.children && this.folder.children.length
            }
        },
        mounted(){
            if(!this.folder.beCreate)
                this.folder.isStretch = this.collapseAll;
        },
        methods: {
            selectedFolder() {
                if (this.selectedState.folder.name && this.folder.id === this.selectedState.folder.id) {
                    this.selectedState.folder = {};
                    this.selectedState.styler = {};
                } else {
                    this.selectedState.folder = {};
                    this.selectedState.styler = {};
                    this.selectedState.styler[this.folder.id] = {
                        borderBottom: "1px dashed rgba(198, 198, 198, 0.8)",
                        display: "inline-block",
                    };
                    this.selectedState.folder = this.folder;
                }
                this.myColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            },
        },
        watch:{
            collapseAll(){
               this.folder.isStretch = this.collapseAll;
            },
        },
    }
</script>

<style>
    .folder-tree {
        font-family: kaushan_scriptregular;
        user-select: none;
    }
    .folder-tree .folder-pen{
        height: 30px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        line-height: 30px;
    }

    .folder-tree:hover .folder-pen,
    .folder-tree:hover li {
        cursor: pointer;
        opacity: 0.8;
    }

    .folder-tree .folder-pen:hover,
    .folder-tree li:hover {
        opacity: 1;
    }

    .folder-tree .folder-pen .folder-name{
        font-weight: 500;
        font-size: 14px;
        height: 100%;

    }
    .folder-tree .pack-up{
        width: 20px;
        height: 100%;
    }

</style>