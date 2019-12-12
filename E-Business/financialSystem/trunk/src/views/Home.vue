<template>
    <div style="text-align:center; font-size: 20px; line-height: 400px">您好，{{auth.nickName || auth.userName}}，欢迎使用云印财务管理系统</div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        data() {
            return {}
        },

        computed: mapGetters({
            auth: 'auth'
        }),

        methods: {},
        created() {
        }
    }
</script>