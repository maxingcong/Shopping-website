<template>
    <div class="page-role" v-loading="loading">
        <el-card class="card-block">
            <el-form :inline="true" ref="search" :model="params" class="form-search">
                <div class="form-right">
                    <el-button type="text" @click="query" :loading="querying">
                        <i class="el-icon-refresh"></i>
                    </el-button>
                </div>
                <div class="form-left">
                    <el-form-item label="角色">
                        <el-input v-model="params.searchKey" placeholder="请输入要搜索的角色"></el-input>
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
                        align="center"
                        prop="roleName"
                        label="角色"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="remark"
                        label="描述">
                </el-table-column>
                <el-table-column
                        v-if="permission([5])"
                        align="center"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button v-if="permission([5])" type="text" @click="edit(scope.row)"
                                   class="o-link" :disabled="scope.row.roleId===1">编辑
                        </el-button>
                        <!--<el-button v-if="permission(1)" type="text" @click="$refs.remove.id=scope.row.roleId"
                                   class="o-link">删除
                        </el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <div class="pagination clearfix">
            <el-pagination
                    v-if="total>params.pageSize"
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
                list: [],
                total: 0,
                params: {
                    currentPage: 1,
                    pageSize: that.pageSizes[0],
                    searchKey: ''
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                console.log('每页 ' + val + ' 条')
                this.params.pageSize = val
                this.query()
            },
            handleCurrentChange(val) {
                console.log('当前页: ' + val)
                this.params.currentPage = val
                this.query()
            },
            edit(item) {
                this.$refs.edit.load(item || {})
            },
            query() {
                const that = this
                that.querying = true
                that.$http.get('user/role', {params: that.params}).then(function (res) {
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
                    that.querying = false
                }).catch(function (res) {
                    // error callback
                    that.loading = false
                    that.querying = false
                    that.message.error(that)
                    console.log(res.config && res.config.url, res.response || res.message)
                })
            }
        },
        created() {
            this.query()
        }
    }
</script>