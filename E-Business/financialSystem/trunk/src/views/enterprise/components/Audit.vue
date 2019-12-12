<template>
    <el-dialog
            width="480px"
            :visible.sync="visible"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose"
            @close="close">
        <el-form ref="form" :model="form" :rules="rules" class="form-remark">
            <el-form-item>确认审核通过吗？</el-form-item>
            <el-form-item prop="reason">
                <el-input type="textarea" v-model="form.reason" placeholder="请填写备注信息"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="submitting">关闭</el-button>
            <el-button type="warning" @click="audit(4)" :loading="submitting">审核不通过</el-button>
            <el-button type="success" @click="audit(1)" :loading="submitting">审核通过</el-button>
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
                submitting: false,
                visible: false,
                form: {
                    reason: '',
                    auditStatus: 0
                },
                rules: {
                    reason: [{
                        validator: function (rule, value, callback) {
                            if (that.form.auditStatus === 4) {
                                if (value === '' || value == null) {
                                    return callback(new Error('请填写备注信息'))
                                } else if (value.length < 5 || value.length > 200) {
                                    return callback(new Error('长度在 5 到 200 个字符'))
                                } else {
                                    callback()
                                }
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }]
                }
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
            audit(auditStatus) {
                const that = this
                if (that.id && that.id > 0) {
                    that.form.auditStatus = auditStatus
                    that.$refs.form.validate(function (valid) {
                        if (valid) {
                            that.submitting = true
                            let formData = {
                                enterpriseId: that.id,
                                status: auditStatus
                            }
                            if (auditStatus === 4) {
                                formData.reason = that.form.reason
                            }
                            that.$http.put('user/enterprise/audit', formData).then(function (res) {
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