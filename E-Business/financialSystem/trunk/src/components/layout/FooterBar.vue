<template>
    <footer class="footer">
        <a href="http://www.miitbeian.gov.cn/" target="_blank">粤ICP备13078924号</a>
        | Copyright © {{endYear}} 云印技术（深圳）有限公司ininin.com 版权所有
    </footer>
</template>
<script>

    export default {

        data() {
            return {
                endYear: ''
            }
        },

        created() {
            this.getEndYear()
        },

        methods: {
            getEndYear() {
                this.endYear = Math.max(new Date().getFullYear(), 2017)
            }
        },

        watch: {
            $route() {
                this.getEndYear()
            }
        }
    }
</script>
<style lang="less">
    .footer {
        position: absolute;
        left: 130px;
        right: 0;
        bottom: 0;
        padding: 10px 0 10px;
        font-size: 12px;
        text-align: center;
    }
</style>