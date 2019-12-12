<template>
    <div class="page-receivable" v-loading="loading">
        <el-tabs class="page-tabs" v-model="tabsActiveName" @tab-click="tabsClick">
            <el-tab-pane name="credit" label="信用回款">
                <x-credit
                        ref="credit"
                        v-on:change="tabsChange('credit')"
                        v-on:loaded="loaded">
                </x-credit>
            </el-tab-pane>
            <el-tab-pane name="monthly" label="月结回款">
                功能正在研发中，敬请期待
                <!--<x-monthly
                        ref="monthly"
                        v-on:change="tabsChange('monthly')"
                        v-on:loaded="loaded">
                </x-monthly>-->
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import XCredit from './Credit.vue'
    import XMonthly from './Monthly.vue'

    export default {
        components: {XCredit, XMonthly},
        data() {
            const that = this
            return {
                loading: false,
                tabsActiveName: 'credit'
            }
        },
        methods: {
            loaded() {
                this.loading = false
            },
            tabsClick(tab, event) {
                console.log(tab, event)
                this.tabsChange(tab.name)
            },
            tabsChange(name) {
                //this.loading = true
                console.log('change:name', name)
                this.execChildMethod(this, name, 'query')
            }
        },
        created() {
            this.tabsChange(this.tabsActiveName)
        }
    }
</script>