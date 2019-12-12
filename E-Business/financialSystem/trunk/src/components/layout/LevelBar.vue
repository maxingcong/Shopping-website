<template>
    <nav v-if="list.length" class="app-levelbar">
        <el-row :gutter="0">
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
                <el-breadcrumb separator="/">
                    <template v-for="item in list">
                        <el-breadcrumb-item :to="item">{{item.meta && item.meta.label || item.name}}
                        </el-breadcrumb-item>
                    </template>
                </el-breadcrumb>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" class="btn-group">
                <template v-for="button in buttons">
                    <el-button v-if="button.auth==null || permission(button.auth)" type="text" @click="button.click">
                        <i :class="['fa', button.icon]"></i> {{button.text}}
                    </el-button>
                </template>
            </el-col>
        </el-row>
    </nav>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {

        data() {
            return {
                list: null
            }
        },

        created() {
            this.getList()
        },

        computed: {
            ...mapGetters({
                buttons: 'buttons'
            }),

            name() {
                return this.$route.name
            }
        },

        methods: {
            getList() {
                let matched = this.$route.matched.filter(item => item.name)
                let first = matched[0]
                if (first) {
                    if (first.path === '' || first.path === '/' || first.path === '/home') {
                        matched = []
                    } else {
                        // matched = [{name: '首页', path: '/'}].concat(matched)
                    }
                }
                this.list = matched
            }
        },

        watch: {
            $route() {
                this.getList()
            }
        }
    }
</script>
<style lang="less">
    .app-levelbar {
        padding: 0 5px;
        .el-breadcrumb {
            font-size: 18px;
            line-height: 50px;
        }
        .btn-group {
            text-align: right;
        }
    }
</style>
