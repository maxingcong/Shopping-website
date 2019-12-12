<template>
    <el-dialog
            width="480px"
            :visible.sync="visible"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose"
            @close="close">
        <el-form ref="form" :model="form" :rules="rules" class="form-remark">
            <el-form-item>确认{{actions[type]}}吗？</el-form-item>
            <el-form-item v-if="type==3" prop="creditAmount">
                <el-input v-model="form.creditAmount" placeholder="请填写信用额度"></el-input>
            </el-form-item>
            <!--<el-form-item v-if="type==2" prop="reason">
                <el-input type="textarea" v-model="form.reason" placeholder="请填写不通过原因"></el-input>
            </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="submitting">关闭</el-button>
            <el-button type="primary" @click="audit(type)" :loading="submitting">{{actions[type]}}</el-button>
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
                actions: {3: '审核通过', 2: '审核不通过'},
                form: {
                    creditAmount: null,
                    reason: ''
                },
                rules: {
                    creditAmount: [that.validNumber({required: true, min: 1, message: '请填写信用额度', trigger: 'blur'})]
                    /*reason: [
                        {required: true, message: '请填写不通过原因', trigger: 'blur'},
                        {type: 'string', min: 1, max: 200, message: '长度不超过 200 个字符', trigger: 'blur'}
                    ]*/
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
                                enterpriseId: that.id,
                                creditPayStatus: auditStatus
                            }
                            if (auditStatus === 3) {
                                formData.creditAmount = that.form.creditAmount
                            }/*
                            if (auditStatus === 2) {
                                formData.reason = that.form.reason
                            }*/
                            that.$http.put('user/enterprise/credit_pay_audit', formData).then(function (res) {
                                // success callback
                                console.log(res)
                                const data = res.body || {}
                                if (res.succeed) {
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
                                that.message.error(that)
                                console.log(res.config && res.config.url, res.response || res.message)
                            })
                            that.visible = false
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