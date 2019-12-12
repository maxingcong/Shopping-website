<template>
    <el-dialog
            width="720px"
            :title="{1: '调整信用额度', 2:'调整代金账户余额', 3: '开通信用账户', 4: '调整返点账户余额'}[type]"
            :visible.sync="visible"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose"
            @close="close">
        <el-form ref="form" :model="form" :rules="rules" class="form-remark">
            <el-row :gutter="20" class="form-detail">
                <el-col :span="14">
                    <el-form-item label="阿米巴编号：">{{data.number}}</el-form-item>
                    <el-form-item label="阿米巴名称：">{{data.servicePointName}}</el-form-item>
                    <el-form-item label="巴长编号：">{{data.userCode}}</el-form-item>
                    <el-form-item label="巴长姓名：">{{data.userName}}</el-form-item>
                    <el-form-item label="巴长电话：">{{data.cellphone}}</el-form-item>
                    <el-form-item label="信用额度：">
                        <template v-if="data.totalCreditAmount<0">
                            未开通
                        </template>
                        <template v-else>
                            {{data.totalCreditAmount | currency}} 元
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="信用积分：">{{data.creditIntegral}}</el-form-item>
                    <el-form-item label="信用可用额度：">{{data.currentCreditAmount | currency}} 元</el-form-item>
                    <el-form-item label="代金账户余额：">{{data.cashAmount || 0 | currency}} 元</el-form-item>
                    <el-form-item label="返点账户余额：">{{data.rebateAccount || 0 | currency}} 元</el-form-item>
                    <el-form-item label="返点账户可提现余额：">{{data.activityAmount || 0 | currency}} 元</el-form-item>
                    <el-form-item label="返点账户已冻结余额：">{{data.rebateInvoiceAmount || 0 | currency}} 元</el-form-item>
                </el-col>
            </el-row>
            <template v-if="type==3">
                <el-form-item prop="creditAmount" label="要开通的额度" label-width="120px">
                    <el-input v-model="form.creditAmount" placeholder="如：100" style="width:240px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <!--<div class="form-detail">
                    <el-form-item label="提升后信用额度：">{{data.expectedAmount}} 元</el-form-item>
                </div>-->
            </template>
            <template v-if="type==1">
                <el-form-item prop="operateType" label="调整方式" label-width="80px">
                    <el-radio v-model="form.operateType" label="1">增加</el-radio>
                    <el-radio v-model="form.operateType" label="2">减少</el-radio>
                </el-form-item>
                <el-form-item prop="creditAmount" label="调整额度" label-width="80px">
                    <el-input v-model="form.creditAmount" placeholder="如：100" style="width:240px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
            </template>
            <template v-if="type==2">
                <el-form-item prop="operateType" label="调整方式" label-width="80px">
                    <el-radio v-model="form.operateType" label="1">增加</el-radio>
                    <el-radio v-model="form.operateType" label="2">减少</el-radio>
                </el-form-item>
                <el-form-item prop="cashAmount" label="调整额度" label-width="80px">
                    <el-input v-model="form.cashAmount" placeholder="如：100" style="width:240px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
            </template>
            <template v-if="type==4">
                <el-form-item prop="operateType" label="操作方式" label-width="80px">
                    <el-radio v-model="form.operateType" label="1">增加</el-radio>
                    <el-radio v-model="form.operateType" label="2">提现</el-radio>
                    <el-radio v-model="form.operateType" label="3">转入现金账户</el-radio>
                    <el-radio v-model="form.operateType" label="4">解冻</el-radio>
                </el-form-item>
                <el-form-item prop="cashAmount" label="调整额度" label-width="80px">
                    <el-input v-model="form.cashAmount" placeholder="如：100" style="width:240px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
            </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="submitting">关闭</el-button>
            <el-button type="primary" @click="audit(type)" :loading="submitting">确认调整</el-button>
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
                type: 0,
                data: {},
                submitting: false,
                visible: false,
                form: {
                    operateType: null,
                    creditAmount: null,
                    cashAmount: null
                },
                rules: {
                    operateType: [that.validNumber({
                        required: true,
                        min: 0,
                        message: '请选择调整方式',
                        trigger: 'change'
                    })],
                    creditAmount: [{
                        required: true,
                        validator: function (rule, value, callback) {
                            if (that.form.operateType == 2) {
                                if (value > that.data.currentCreditAmount) {
                                    return callback(new Error('要调整的额度不能大于信用可用额度'))
                                } else if (value > 0) {
                                    callback()
                                } else {
                                    return callback(new Error('请填写要调整的额度'))
                                }
                            } else {
                                if (value > 0) {
                                    callback()
                                } else {
                                    return callback(new Error('请填写要调整的额度'))
                                }
                            }
                        },
                        trigger: 'blur'
                    }],
                    cashAmount: [{
                        required: true,
                        validator: function (rule, value, callback) {
                            if (that.type == 4) {
                                if (that.form.operateType == 2 || that.form.operateType == 3) {
                                    let operateText = {
                                        2: '提现',
                                        3: '转入代金账户'
                                    }[that.form.operateType]
                                    if (value > that.data.activityAmount) {
                                        return callback(new Error('要' + operateText + '的额度不能大于返点账户可提现余额'))
                                    } else if (value > 0) {
                                        callback()
                                    } else {
                                        return callback(new Error('请填写要' + operateText + '的额度'))
                                    }
                                } else if (that.form.operateType == 4) {
                                    if (value > that.data.rebateInvoiceAmount) {
                                        return callback(new Error('要解冻的额度不能大于返点账户已冻结余额'))
                                    } else if (value > 0) {
                                        callback()
                                    } else {
                                        return callback(new Error('请填写要解冻的额度'))
                                    }
                                } else {
                                    if (value > 0) {
                                        callback()
                                    } else {
                                        return callback(new Error('请填写要增加的额度'))
                                    }
                                }
                            } else {
                                if (that.form.operateType == 2) {
                                    if (value > that.data.cashAmount) {
                                        return callback(new Error('要减少的额度不能大于代金账户余额'))
                                    } else if (value > 0) {
                                        callback()
                                    } else {
                                        return callback(new Error('请填写要减少的额度'))
                                    }
                                } else {
                                    if (value > 0) {
                                        callback()
                                    } else {
                                        return callback(new Error('请填写要调整的额度'))
                                    }
                                }
                            }
                        },
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            close() {
                this.data = {}
                this.visible = false
                this.submitting = false
            },
            load(data, type = 0) {
                const that = this
                if (data && type > 0) {
                    that.visible = true
                    that.type = type
                    that.data = data || {}
                    that.form.creditAmount = null
                    that.form.cashAmount = null
                    that.rules.creditAmount.message = type == 3 ? '请填写要开通的信用账户额度' : '请填写要调整的额度',
                        setTimeout(function () {
                            that.$refs.form.resetFields()
                        })
                }
            },
            audit(auditStatus) {
                const that = this
                if (that.data.id > 0 && that.type > 0) {
                    that.$refs.form.validate(function (valid) {
                        if (valid) {
                            that.submitting = true
                            let formData = {}
                            let url = ''
                            if (that.type === 3) { //开通信用账户
                                url = 'in_payment/account/open_credit_account'
                                formData.userChannel = that.data.number
                                formData.creditAmount = that.form.creditAmount
                            } else if (that.type === 1) { //调整信用额度
                                url = 'in_payment/account/raise_credit_line'
                                formData.operateType = that.form.operateType
                                formData.userChannel = that.data.number
                                formData.creditAmount = that.form.creditAmount
                            } else if (that.type === 4) { //调整信用返点账户
                                url = 'in_payment/account/adjust_rebate_account'
                                formData.operateType = that.form.operateType
                                formData.userChannel = that.data.number
                                formData.cashAmount = that.form.cashAmount
                            } else {
                                url = 'in_payment/account/raise_cash_line'
                                formData.operateType = that.form.operateType
                                formData.userChannel = that.data.number
                                formData.cashAmount = that.form.cashAmount
                            }
                            that.$http.post(url, formData).then(function (res) {
                                // success callback
                                console.log(res)
                                const data = res.body || {}
                                if (res.succeed) {
                                    that.message.success(that, '调整成功')
                                    that.$emit('success')
                                    that.close()
                                } else {
                                    that.message.warning(that, data.msg)
                                }
                                that.submitting = false
                            }).catch(function (res) {
                                // error callback
                                that.submitting = false
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