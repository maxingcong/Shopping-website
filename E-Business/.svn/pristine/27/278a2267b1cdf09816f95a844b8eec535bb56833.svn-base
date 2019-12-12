<template>
    <div class="page-account" v-loading="loading">
        <el-card class="card-block">
            <el-form :inline="true" ref="search" :model="params" class="form-search">
                <div class="form-right">
                    <el-button v-if="permission(28)" type="primary" @click="edit()">添加</el-button>
                    <el-button type="text" @click="query" :loading="querying">
                        <i class="el-icon-refresh"></i>
                    </el-button>
                </div>
                <div class="form-left">
                    <el-form-item label="角色">
                        <el-dropdown trigger="hover" @command="commandRole">
                            <span class="el-dropdown-link">
                                {{roleName || '全部'}}<i
                                    class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <template v-for="(item, index) in roleList">
                                    <el-dropdown-item :command="item.roleId">{{item.roleName}}</el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-dropdown trigger="hover" @command="commandStatus">
                            <span class="el-dropdown-link">
                                {{GLOBAL_ENUM.accountStatua[params.status] || '全部'}}<i
                                    class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <template v-for="(item, index) in GLOBAL_ENUM_ARR.accountStatua">
                                    <el-dropdown-item :command="item.value">{{item.text}}</el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-form-item label="姓名/账号/公司">
                        <el-input v-model="params.searchKey" placeholder="请输入要搜索的关键字"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="text" @click="query" :loading="querying">
                            <i class="el-icon-search"></i>
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
        <el-card class="card-block">
            <el-table
                    :data="list"
                    :max-height="tableMaxHeight"
                    stripe
                    style="width: 100%">
                <el-table-column
                        fixed="left"
                        align="center"
                        prop="userId"
                        label="编号"
                        width="80">
                </el-table-column>
                <el-table-column
                        fixed="left"
                        prop="fullName"
                        label="姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="账号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="enterpriseName"
                        label="公司名称">
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="角色"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="加入时间"
                        class-name="t-date"
                        width="100">
                    <template slot-scope="scope">
                        <span v-html="formatDateOutput(scope.row.recordTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="最后登录时间"
                        class-name="t-date"
                        width="110">
                    <template slot-scope="scope">
                        <span v-html="formatDateOutput(scope.row.lastLoginTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        align="center"
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        {{GLOBAL_ENUM.accountStatua[scope.row.status]}}
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        v-if="permission([29,30])"
                        align="center"
                        label="操作"
                        width="120">
                    <template slot-scope="scope">
                        <el-button v-if="permission([29])" type="text" @click="edit(scope.row)"
                                   class="o-link">编辑
                        </el-button>
                        <el-button v-if="permission(30)" type="text" @click="$refs.remove.id=scope.row.userId"
                                   class="o-link" :disabled="scope.row.status!==3">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <div class="pagination clearfix">
            <el-pagination
                    v-if="total>0"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="params.currentPage"
                    :page-sizes="pageSizes"
                    :page-size="params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
        <x-edit
                ref="edit"
                @success="query">
        </x-edit>
        <x-remove
                ref="remove"
                @success="query">
        </x-remove>
    </div>
</template>
<script>
    import XEdit from './components/Edit.vue'
    import XRemove from './components/Remove.vue'

    export default {
        components: {XEdit, XRemove},
        data() {
            const that = this
            return {
                loading: true,
                querying: false,
                roleList: [],
                roleName: '',
                list: [],
                total: 0,
                params: {
                    currentPage: 1,
                    pageSize: that.pageSizes[0],
                    roleId: '',
                    status: '',
                    searchKey: ''
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                console.log('每页 ' + val + ' 条')
                this.params.pageSize = val
                this.params.currentPage = 1
                this.query()
            },
            handleCurrentChange(val) {
                console.log('当前页: ' + val)
                this.params.currentPage = val
                this.query()
            },
            commandRole(val) {
                const that = this
                console.log('当前: ' + val)
                that.params.roleId = val
                that.roleList.forEach(function (item) {
                    if (item.roleId === val) {
                        that.roleName = item.roleName
                    }
                })
                that.query()
            },
            commandStatus(val) {
                console.log('当前: ' + val)
                this.params.status = val
                this.query()
            },
            edit(item) {
                const that = this
                that.$refs.edit.load(item || {})
            },
            queryRole() {
                const that = this
                that.$http.get('user/role', {params: {currentPage: 1, pageSize: 20}}).then(function (res) {
                    // success callback
                    console.log(res)
                    const data = res.body || {}
                    if (res.succeed) {
                        that.roleList = data.list || []
                    } else {
                        that.roleList = []
                        that.message.warning(that, data.msg)
                    }
                }).catch(function (res) {
                    // error callback
                    that.message.error(that)
                    console.log(res.config && res.config.url, res.response || res.message)
                })
            },
            query() {
                const that = this;
                that.loading = true
                that.$http.get('user/all', {params: that.params}).then(function (res) {
                    // success callback
                    console.log(res)
                    const data = res.body || {}
                    if (res.succeed) {
                        that.list = data.list || []
                        that.total = data.totalCount || 0
                    } else {
                        that.list = []
                        that.total = 0
                        that.message.warning(that, data.msg)
                    }
                    that.loading = false
                }).catch(function (res) {
                    // error callback
                    that.loading = false
                    that.querying = false
                    that.message.error(that)
                    console.log(res.config.url, res.response || res.message)
                })
            }
        },
        created() {
            this.query()
            this.queryRole()
        }
    }
</script>