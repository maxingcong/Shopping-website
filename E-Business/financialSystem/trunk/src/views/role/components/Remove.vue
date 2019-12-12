<template>
    <el-dialog
            width="480px"
            :visible.sync="visible"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose"
            @close="close">
        <div>确认删除该角色吗？删除后将无法恢复！</div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">暂不删除</el-button>
            <el-button type="primary" @click="submit" :loading="submitting">确认删除</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        // 声明 props
        props: {},
        data() {
            return {
                id: null,
                submitting: false,
                visible: false
            }
        },
        watch: {
            id: function () {
                this.visible = this.id > 0
            }
        },
        methods: {
            close() {
                this.id = 0
                this.visible = false
                this.submitting = false
            },
            submit() {
                const that = this
                if (that.id && that.id > 0) {
                    that.submitting = true
                    that.$http.delete('user/role/' + that.id).then(function (res) {
                        // success callback
                        console.log(res)
                        if (res.succeed) {
                            that.message.success(that, '删除成功')
                            that.$emit('success')
                            that.close()
                        } else {
                            that.message.warning(that, res.body.msg)
                        }
                        that.visible = false
                        that.submitting = false
                    }).catch(function (res) {
                        // error callback
                        that.submitting = false
                        that.visible = false
                        that.message.error(that)
                        console.log(res.config && res.config.url, res.response || res.message)
                    })
                }
            }
        }
    }
</script>