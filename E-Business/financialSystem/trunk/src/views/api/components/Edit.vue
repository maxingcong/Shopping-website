<template>
    <el-dialog
            :title="title"
            width="480px"
            :visible.sync="visible"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose"
            @close="close">
        <el-form ref="form" :model="form" :rules="rules" class="form-edit" label-width="80px">
            <el-form-item label="接口组别" prop="parentId">
                <el-select v-model="form.parentId" placeholder="请选择" @change="parentIdChange" :disabled="disabled">
                    <el-option
                            v-for="item in resourceGroupList"
                            :key="item.resourceId"
                            :label="item.resourceName"
                            :value="item.resourceId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="接口名称" prop="resourceName">
                <el-input v-model="form.resourceName" placeholder="请输入接口名称" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item v-if="form.parentId>1" label="请求类型" prop="requestType">
                <el-select v-model="form.requestType" placeholder="请选择" :disabled="disabled">
                    <el-option
                            v-for="item in requestTypeList"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="form.parentId>1" label="接口URL" prop="url">
                <el-input v-model="form.url" placeholder="请输入接口URL" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item v-if="form.parentId>1" label="登录校验" prop="needLogin">
                <el-radio-group v-model="form.needLogin">
                    <el-radio :label="1">需要</el-radio>
                    <el-radio :label="0">不需要</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="close">关 闭</el-button>
            <el-button v-if="!disabled" type="primary" @click="submit" :loading="submitting">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        // 声明 props
        props: {},
        data() {
            return {
                data: null,
                title: '',
                submitting: false,
                visible: false,
                disabled: false,
                resourceGroupList: [],
                requestTypeList: [{value: 'GET', text: 'GET'}, {value: 'POST', text: 'POST'}, {
                    value: 'PUT',
                    text: 'PUT'
                }, {value: 'DELETE', text: 'DELETE'}],
                resourceOptions: {
                    value: 'resourceId',
                    label: 'resourceName',
                    children: 'childList'
                },
                form: {
                    parentId: [],
                    resourceId: '',
                    resourceName: '',
                    requestType: '',
                    url: '',
                    needLogin: 1
                },
                rules: {
                    parentId: [
                        {type: 'number', required: true, message: '请选择接口组别', trigger: 'change'}
                    ],
                    resourceName: [
                        {required: true, message: '请输入接口名称', trigger: 'blur'},
                        {type: 'string', min: 1, max: 20, message: '长度不超过 20 个字符', trigger: 'blur'}
                    ],
                    requestType: [
                        {type: 'string', required: true, message: '请选择请求类型', trigger: 'change'}
                    ],
                    url: [
                        {type: 'string', required: true, message: '请输入接口URL', trigger: 'blur'},
                        {type: 'string', min: 1, message: '长度不小于 1 个字符', trigger: 'blur'}
                    ],
                    needLogin: [
                        {type: 'number', required: true, message: '请选择是否需要登录校验', trigger: 'change'}
                    ]
                }
            }
        },
        methods: {
            close() {
                this.data = null
                this.visible = false
                this.submitting = false
            },
            load(item, resourceGroupList, isCopy) {
                let that = this
                that.visible = true
                item = item || {}
                that.resourceGroupList = resourceGroupList || []
                that.form.parentId = item.parentId || ''
                that.form.resourceId = isCopy ? '' : (item.resourceId || '')
                that.form.resourceName = item.resourceName || ''
                that.form.requestType = item.requestType || ''
                that.form.url = item.url || ''
                that.form.needLogin = item.needLogin || ''
                that.title = item.resourceId ? '修改接口' : '新增接口'
                that.disabled = !this.permission([10, 11])
                that.parentIdChange(that.form.parentId)
            },
            parentIdChange(val) {
                console.log(val)
                this.rules.requestType[0].required = val > 1
                this.rules.url[0].required = val > 1
            },
            submit() {
                const that = this
                that.$refs.form.validate(function (valid) {
                    if (valid) {
                        let formData = {
                            parentId: that.form.parentId,
                            resourceName: that.form.resourceName,
                            requestType: that.form.parentId > 1 ? that.form.requestType : '',
                            url: that.form.parentId > 1 ? that.form.url : '',
                            needLogin: that.form.parentId > 1 ? that.form.needLogin : ''
                        }
                        console.log(that.form, formData)
                        that.submitting = true
                        if (that.form.resourceId && that.form.resourceId > 0) {
                            formData.resourceId = that.form.resourceId
                            that.$http.put('user/access/' + that.form.resourceId, formData).then(function (res) {
                                // success callback
                                console.log(res)
                                const data = res.body || {}
                                if (res.succeed) {
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
                                console.log(res.config && res.config.url, res.response || res.message)
                            })
                        } else {
                            that.$http.post('user/access', formData).then(function (res) {
                                // success callback
                                console.log(res)
                                const data = res.body || {}
                                if (res.succeed) {
                                    that.message.success(that, '添加成功')
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
                        }
                    } else {
                        console.log('Failure of form validation!!')
                        return false
                    }
                })
            }
        }
    }
</script>