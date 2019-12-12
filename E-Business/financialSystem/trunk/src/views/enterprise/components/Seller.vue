<template>
    <el-dialog
            width="480px"
            :visible.sync="visible"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose"
            @close="close">
        <el-form ref="form" class="form-remark">
            <el-form-item>确认{{type===1?'开通':'关闭'}}该企业的卖家功能吗？</el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="submitting">以后再说</el-button>
            <el-button type="success" @click="seller" :loading="submitting">确认{{type===1?'开通':'关闭'}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        // 声明 props
        props: {},
        data() {
            const that = this
            return {
                id: null,
                type: 1,
                submitting: false,
                visible: false
            }
        },
        methods: {
            close() {
                this.id = 0
                this.visible = false
                this.submitting = false
            },
            load(id, type) {
                if (id > 0 && type > 0) {
                    this.visible = true
                    this.id = id
                    this.type = type
                }
            },
            seller() {
                const that = this

                that.submitting = true
                let formData = {
                    enterpriseId: that.id,
                    isSale: that.type === 1 ? 1 : 2
                }
                that.$http.put('user/enterprise/sellerAuth', formData).then(function (res) {
                    // success callback
                    console.log(res)
                    const data = res.body || {}
                    if (res.succeed) {
                        that.message.success(that, (that.type === 1 ? '开通' : '关闭') + '成功')
                        that.$emit('success')
                        that.close()
                    } else {
                        that.message.warning(that, data.resultMsg)
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
</script>