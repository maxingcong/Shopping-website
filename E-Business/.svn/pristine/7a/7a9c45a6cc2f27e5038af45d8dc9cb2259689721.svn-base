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
            <el-form-item label="阿米巴编号：">{{data.userChannel}}</el-form-item>
            <!--<el-form-item label="阿米巴名称 ：">{{data.userName}}</el-form-item>-->
            <el-form-item label="应收款金额："><b>{{data.repaymentAmount | currency}}</b> 元</el-form-item>
            <div style="padding-top: 15px">
                <template v-for="item in data.images">
                    <div v-if="item"
                         class="img-box"
                         style="margin: 0 10px 10px 0; vertical-align: top"
                         @click="imagePreview(item)">
                        <img :src="item.replace(/\?.*/,'') + globalThumbnail">
                    </div>
                </template>
            </div>
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
                data: {
                    recordId: '',
                    userChannel:'',
                    userName:'',
                    images: [],
                    repaymentAmount: 0
                }
            }
        },
        methods: {
            close() {
                this.visible = false
                this.submitting = false
            },
            load(item) {
                let that = this
                item = item || {}
                that.data.recordId = item.recordId || ''
                that.data.userChannel = item.userChannel || ''
                that.data.userName = item.userName || ''
                that.data.repaymentAmount = item.repaymentAmount || 0
                that.data.images = (item.bankReceipt || '').split(';')
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
                    repaymentId: that.data.recordId,
                    operateType: operateType
                }
                that.$http.post('in_payment/arrears/review_repayment', formData).then(function (res) {
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