<template>
    <ul class="folder-tree-contents">
        <li v-for="child in children" v-if="child.isShow">
            <folder-tree
                    v-if="child.children"
                    :colors="colors"
                    :folder="child"
                    :selectedState="selectedState"
                    :collapseAll="collapseAll"
            ></folder-tree>
            <div class="folder-item-name" @click="selectedFile(child)" v-else>{{ child.name }}</div>
        </li>
    </ul>
</template>

<script>
    import folderTree from './FolderTree'
    import EventHub from "../../utils/EventHub"

    export default {
        name: "folderTreeContents",
        components: {
            folderTree
        },
        props: {
            'children':Array,
            'colors':Array,
            'parent':Object,
            'selectedState':Object,
            'collapseAll':Boolean,
        },
        methods:{
            selectedFile(child) {
                this.selectedState.folder = {};
                this.selectedState.styler = {};
                this.selectedState.styler[this.parent.id] = {
                    borderBottom: "1px dashed rgba(198, 198, 198, 0.8)",
                    display: "inline-block",
                };
                this.selectedState.folder = this.parent;
                EventHub.$emit('addPadCard', child);
            }
        }
    }
</script>
<style>
    .folder-tree-contents .folder-tree{
        margin-right: 1em;
    }
    .folder-tree-contents {
        font-size: 14px;
        font-weight: 400;
    }
    .folder-item-name{
        margin-right:20px;
        height: 30px;
        line-height: 30px;
    }
</style>
