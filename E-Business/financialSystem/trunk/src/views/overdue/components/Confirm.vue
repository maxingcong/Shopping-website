<template>
    <el-dialog
            width="750px"
            :id="uuid"
            :visible.sync="visible"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose"
            @open="dialogOpen(uuid)"
            @close="close">
        <el-form class="form-detail">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="编号：">{{data.recordId}}</el-form-item>
                    <el-form-item label="阿米巴编号：">{{data.userChannel}}</el-form-item>
                    <el-form-item label="客户账号：">{{data.userName}}</el-form-item>
                    <el-form-item label="订单编号：">{{data.orderCode}}</el-form-item>
                    <el-form-item label="下单时间：">{{data.orderCreateTime}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="信用支付时间：">{{data.paymentTime}}</el-form-item>
                    <el-form-item label="信用支付金额：">{{data.amount | currency}} 元</el-form-item>
                    <el-form-item label="应还款时间：">{{data.expectedReturnTime}}</el-form-item>
                    <el-form-item label="逾期金额：">{{data.overdueAmount | currency}} 元</el-form-item>
                    <el-form-item label="应还款金额：">{{data.totalAmount | currency}} 元</el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="submitting">关闭</el-button>
            <el-button type="warning" @click="submit(2)" :loading="submitting">不通过</el-button>
            <el-button type="success" @click="submit(1)" :loading="submitting">通过</el-button>
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
                uuid: that.uuid(),
                submitting: false,
                visible: false,
                data: {}
            }
        },
        methods: {
            close() {
                this.visible = false
                this.submitting = false
            },
            load(item) {
                let that = this
                that.data = item || {}
                that.visible = true
            },
            imagePreview(url) {
                if (url) {
                    this.$emit('imagePreview', url)
                }
            },
            submit(operateType) {
                const that = this
                that.submitting = true
                let formData = {
                    userName: that.data.userName,
                    orderCode: that.data.orderCode,
                    recordId: that.data.recordId,
                    operateType: operateType
                }
                that.$http.post('in_payment/arrears/review_delay_credit_repayment', formData).then(function (res) {
                    // success callback
                    console.log(res)
                    debugger
                    const data = res.body || {}
                    if (res.succeed) {
                        that.visible = false
                        that.message.success(that, '审核成功')
                        that.$emit('success')
                        that.close()
                    } else {
                        that.message.warning(that, data.msg)
                    }
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