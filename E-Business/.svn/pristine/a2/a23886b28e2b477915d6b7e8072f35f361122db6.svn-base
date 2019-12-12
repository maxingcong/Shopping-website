<template>
    <el-dialog
            width="480px"
            :visible.sync="visible"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose"
            @close="close">
        <el-form ref="form" :model="form" :rules="rules" class="form-remark">
            <el-form-item>确认{{actions[type]}}该企业的月结吗？</el-form-item>
            <el-form-item v-if="type<3" prop="monthlyAmount">
                <el-input v-model="form.monthlyAmount" placeholder="请填写月结额度"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="submitting">关闭</el-button>
            <el-button type="primary" @click="audit(type)" :loading="submitting">确认{{actions[type]}}</el-button>
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
                type: null,
                submitting: false,
                visible: false,
                actions: {1: '开通', 2: '调额', 3: '关闭'},
                form: {
                    monthlyAmount: ''
                },
                rules: {
                    monthlyAmount: [that.validNumber({required: true, min: 1, message: '请填写月结额度', trigger: 'blur'})]
                }
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
            audit(auditStatus) {
                const that = this
                if (that.id && that.id > 0) {
                    that.$refs.form.validate(function (valid) {
                        if (valid) {
                            that.submitting = true
                            let formData = {
                                sellerEnterpriseId: 1015,
                                enterpriseId: that.id,
                                auditStatus: auditStatus
                            }
                            if (auditStatus === 1) {
                                formData.auditStatus = auditStatus
                                formData.monthlyAmount = that.form.monthlyAmount
                            }
                            if (auditStatus === 2) {
                                formData.monthlyAmount = that.form.monthlyAmount
                            }
                            if (auditStatus === 3) {
                                formData.monthlyAmount = 0
                            }
                            that.$http.put('user/enterprise/monthly_pay_audit', formData).then(function (res) {
                                // success callback
                                console.log(res)
                                const data = res.body || {}
                                if (res.succeed) {
                                    that.message.success(that, that.actions[that.type] + '成功')
                                    that.$emit('success')
                                    that.close()
                                } else {
                                    that.message.warning(that, data.msg)
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
                        } else {
                            console.log('Failure of form validation!!')
                            return false;
                        }
                    })
                }
            }
        }
    }
</script>