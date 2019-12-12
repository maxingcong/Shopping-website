<template>
    <div class="page-amoeba" v-loading="loading">
        <x-credit
                ref="list"
                v-on:change="tabsChange('list')"
                v-on:loaded="loaded">
        </x-credit>
    </div>
</template>
<script>
    import XCredit from './List.vue'

    export default {
        components: {XCredit},
        data() {
            const that = this
            return {
                loading: false,
                tabsActiveName: 'list'
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