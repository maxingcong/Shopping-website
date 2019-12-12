<template>
    <el-dialog
            :title="title"
            width="800px"
            :visible.sync="visible"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose"
            @close="close">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="form.roleName" placeholder="请输入角色名称" :disabled="disabled"
                          style="width: 320px"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入角色描述" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="角色权限" prop="resourceIds" class="resource-tree">
                <el-tree
                        class="clearfix"
                        ref="resourceTree"
                        :data="resourceTree"
                        show-checkbox
                        node-key="resourceId"
                        default-expand-all
                        :props="defaultProps"
                        @check-change="resourceCheckChange">
                </el-tree>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="close">关 闭</el-button>
            <el-button type="primary" @click="submit" :loading="submitting">确 定</el-button>
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
                roleList: [],
                form: {
                    roleId: '',
                    roleName: '',
                    remark: '',
                    resourceIds: []
                },
                rules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {type: 'string', min: 1, max: 20, message: '长度不超过 20 个字符', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请输入角色描述', trigger: 'blur'},
                        {type: 'string', min: 1, max: 100, message: '长度不超过 100 个字符', trigger: 'blur'}
                    ],
                    resourceIds: [
                        {type: 'array', required: true, min: 1, message: '请勾选权限', trigger: 'blur'}
                    ]
                },
                resourceTree: [],
                defaultProps: {
                    children: 'childList',
                    label: 'resourceName'
                }
            }
        },
        methods: {
            close() {
                this.resourceTree = []
                this.visible = false
                this.submitting = false
            },
            load(item) {
                let that = this
                that.query(item.roleId, function (role, resourceTree) {
                    that.visible = true
                    that.form.roleId = role.roleId || ''
                    that.form.roleName = role.roleName || ''
                    that.form.remark = role.remark || ''
                    let resourceIds = role.resourceIds || ''
                    that.form.resourceIds = resourceIds.split(';')
                    that.resourceTree = resourceTree
                    setTimeout(function () {
                        that.$refs.resourceTree.setCheckedKeys(that.form.resourceIds);
                    }, 100)
                })
                that.title = item.roleId ? '修改角色' : '新增角色'
                that.disabled = !this.permission([4, 5])
            },
            resourceCheckChange() {
                this.form.resourceIds = this.$refs.resourceTree.getCheckedKeys(true)
            },
            query(roleId, cb) {
                const that = this
                that.$http.get('user/role/' + roleId).then(function (res) {
                    // Both requests are now complete
                    const data = res.body || {}
                    if (res.succeed) {
                        let resourceList = data.resourceList || {}
                        resourceList = resourceList.childList || []
                        let role = data.role || {}
                        cb(role, resourceList)
                    } else {
                        that.message.warning(that, data.msg)
                    }
                }).catch(function (res) {
                    // error callback
                    that.message.error(that)
                    console.log(res.config.url, res.response || res.message)
                })
            },
            submit() {
                const that = this
                that.$refs.form.validate(function (valid) {
                    if (valid) {
                        let formData = {
                            roleName: that.form.roleName,
                            remark: that.form.remark,
                            resourceIds: that.form.resourceIds.join(';')
                        }
                        console.log(that.form, formData)
                        that.submitting = true
                        if (that.form.roleId && that.form.roleId > 0) {
                            formData.roleId = that.form.roleId
                            that.$http.put('user/role/' + that.form.roleId, formData).then(function (res) {
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
                                console.log(res.config && res.config.url, res.response || res.message)
                            })
                        } else {
                            that.$http.post('user/role', formData).then(function (res) {
                                // success callback
                                console.log(res)
                                const data = res.body || {}
                                if (res.succeed) {
                                    //that.form = res.body || {}
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
<style lang="less">
    .resource-tree {
        .el-tree {
            padding: 8px 0;
            border: none;
        }
        .el-tree-node {
            display: block;
            .el-tree-node {
                float: left;
            }
        }
        .el-tree-node__content {
            min-width: 100px;
            height: 30px;
            line-height: 30px;
            &:hover {
                background: transparent;
            }
        }
    }
</style>