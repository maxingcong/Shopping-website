<template>
    <aside id="sidebar" class="app-sidebar">
        <el-menu :default-active="activeIndex">
            <template v-if="item.name" v-for="(item, i) in menu">
                <template v-if="item.meta && permission(item.meta.auth) && !item.children">
                    <el-menu-item v-if="item.name!=='home'" :index="item.name">
                        <router-link :to="generatePath({}, item)">
                            <i :class="[item.meta.icon]"></i>{{ item.meta.label}}
                        </router-link>
                    </el-menu-item>
                </template>
                <template v-else>
                    <el-submenu :index="item.name" v-if="item.meta && permission(item.meta.auth)">
                        <template slot="title">
                            <i :class="[item.meta.icon]"></i>{{ item.meta && item.meta.label}}
                        </template>
                        <template v-for="(subItem, k) in item.children">
                            <el-menu-item :index="subItem.name">
                                <router-link :to="generatePath(item, subItem)">
                                    {{ subItem.meta && subItem.meta.label}}
                                </router-link>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
            </template>
        </el-menu>
    </aside>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        data() {
            return {
                activeIndex: 'home'
            }
        },

        computed: mapGetters({
            menu: 'menuItems'
        }),

        methods: {
            generatePath(item, subItem) {
                return `${item.component ? item.path + '/' : ''}${subItem.path}`
            },

            getName(route) {
                let matched = route.matched
                let lastMatched = matched[matched.length - 1]
                let parent = lastMatched.parent || lastMatched
                //const isParent = parent === lastMatched
                let name = route.name || ''
                if (parent && parent.redirect === route.path && !parent.meta.icon) {
                    name = parent.name || ''
                }
                this.activeIndex = name
            }
        },

        watch: {
            $route(route) {
                this.getName(route)
            }
        }
    }
</script>
<style lang="less">
    #sidebar {
        position: absolute;
        z-index: 999;
        top: 0;
        left: 0;
        width: 170px;
        height: 100%;
        margin: 0;
        padding: 60px 0 0;
        border-right: 1px solid #f3f3f3;
        overflow: auto;
        overflow-x: hidden;
        box-sizing: border-box;
        .el-menu {
            background-color: inherit;
            border-radius: 0;
            border: 0;
        }
        .el-menu-item {
            height: 50px;
            padding: 0 !important;
            line-height: 50px;
            background-color: inherit;
        }
        a {
            color: inherit;
            font-size: 16px;
            height: 100%;
            padding: 0 20px;
            background-color: inherit;
            border-left: 3px solid transparent;
            text-decoration: none;
            display: block;
            &:hover {
                background-color: rgba(4, 135, 226, .1);
                border-left-color: #0487E2;
            }
            &:visited {
                color: inherit;
            }
        }
        .fa {
            margin: 0 5px 2px 0;
        }
        .is-active {
            a {
                background-color: rgba(4, 135, 226, .1);
                border-left-color: #0487E2;
            }
        }
    }

    @media (min-width: 992px) {
        #sidebar {
            position: fixed;
        }
    }
</style>