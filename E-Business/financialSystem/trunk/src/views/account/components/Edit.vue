<template>
    <el-dialog
            width="480px"
            :visible.sync="visible"
            :title="title"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose"
            custom-class="dialog-form"
            @close="close">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="销售姓名" prop="fullName">
                <el-input v-model="form.fullName" placeholder="如：张三" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="销售手机" prop="userName">
                <el-input v-model="form.userName" placeholder="如：13800000000" :disabled="disabled"></el-input>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="close">关 闭</el-button>
            <el-button type="primary" @click="submit" :loading="submitting">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        // 声明 props
        props: {},
        data() {
            return {
                title: '',
                submitting: false,
                visible: false,
                disabled: false,
                form: {
                    fullName: '',
                    userName: ''
                },
                rules: {
                    fullName: [
                        {required: true, message: '请输入销售姓名', trigger: 'blur'},
                        {type: 'string', min: 1, max: 20, message: '长度不超过 20 个字符', trigger: 'blur'}
                    ],
                    userName: [
                        {required: true, message: '请输入销售手机', trigger: 'blur'},
                        {type: 'string', pattern: this.RE.mobile, message: '请输入正确的手机号', trigger: 'blur'}
                    ]
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
                that.form.userId = item.userId || ''
                that.setFormData(that.form, item)
                that.title = item.userId ? '修改销售' : '添加销售'
                that.disabled = !this.permission([22, 23])
                that.visible = true
                setTimeout(function () {
                    that.$refs.form.resetFields()
                }, 10)
            },
            submit() {
                const that = this
                that.$refs.form.validate(function (valid) {
                    if (valid) {
                        let formData = {
                            userName: that.form.userName,
                            fullName: that.form.fullName
                        }
                        console.log(that.form, formData)
                        that.submitting = true
                        if (that.form.userId && that.form.userId > 0) {
                            formData.userId = that.form.userId
                            that.$http.put('user/' + that.form.userId, formData).then(function (res) {
                                // success callback
                                console.log(res)
                                const data = res.body || {}
                                if (res.succeed) {
                                    //that.form = res.body || {}
                                    that.message.success(that, '修改成功')
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
                                console.log(res.config.url, res.response || res.message)
                            })
                        } else {
                            that.$http.post('user/sale', formData).then(function (res) {
                                // success callback
                                console.log(res)
                                const data = res.body || {}
                                if (res.succeed) {
                                    that.message.success(that, '新增成功')
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
                                console.log(res.config.url, res.response || res.message)
                            })
                        }
                    } else {
                        console.log('Failure of form validation!!')
                        return false;
                    }
                })
            }
        }
    }
</script>