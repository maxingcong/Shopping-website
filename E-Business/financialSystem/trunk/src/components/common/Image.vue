<template>
    <el-dialog
            :fullscreen="true"
            :append-to-body="true"
            :visible.sync="visible"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose">
        <div style="text-align: center">
            <img style="max-width: 100%" :src="imgUrl + thumbnail">
        </div>
    </el-dialog>
</template>
<script>
    export default {
        // 声明 props
        props: {},
        data() {
            return {
                visible: false,
                thumbnail: '?imageMogr2/thumbnail/1024',
                imgUrl: ''
            }
        },
        methods: {
            preview(imgUrl) {
                const that = this
                if (imgUrl) {
                    that.imgUrl = imgUrl.replace(/\?.*/,'')
                    that.visible = true
                }
            }
        }
    }
</script>