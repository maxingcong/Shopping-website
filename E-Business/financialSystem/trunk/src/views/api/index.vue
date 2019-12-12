<template>
    <div class="page-role" v-loading="loading">
        <el-card class="card-block">
            <el-form :inline="true" ref="search" :model="params" class="form-search">
                <div class="form-right">
                    <el-button v-if="permission(10)" type="primary" @click="edit()">添加</el-button>
                </div>
                <div class="form-left">
                    <el-form-item label="组别">
                        <el-select v-model="params.parentId" placeholder="请选择" @change="parentIdChange">
                            <el-option
                                    v-for="item in resourceGroupList"
                                    :key="item.resourceId"
                                    :label="item.resourceName"
                                    :value="item.resourceId">
                            </el-option>
                        </el-select>
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
                        sortable
                        align="center"
                        prop="resourceId"
                        label="ID"
                        width="80">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="resourceName"
                        label="接口名称"
                        width="200">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="requestType"
                        label="请求类型"
                        width="150">
                </el-table-column>
                <el-table-column
                        sortable
                        prop="url"
                        label="URL">
                </el-table-column>
                <el-table-column
                        sortable
                        prop="needLogin"
                        label="登录校验">
                    <template slot-scope="scope">
                        {{scope.row.needLogin===1?'需要':'不需要'}}
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="permission([10,11])"
                        align="center"
                        label="操作"
                        width="120">
                    <template slot-scope="scope">
                        <el-button v-if="permission([11])" type="text" @click="edit(scope.row)"
                                   class="o-link">编辑
                        </el-button>
                        <el-button v-if="permission([10])" type="text" @click="edit(scope.row, true)"
                                   class="o-link">复制
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <x-edit
                ref="edit"
                @success="query">
        </x-edit>
    </div>
</template>
<script>
    import XEdit from './components/Edit.vue'

    export default {
        components: {XEdit},
        data() {
            return {
                loading: true,
                querying: false,
                resourceGroupList: [],
                data: [],
                list: [],
                total: 0,
                params: {
                    parentId: ''
                }
            }
        },
        methods: {
            parentIdChange(val) {
                const that = this
                if (val > 1) {
                    that.params.parentId = val
                    let list = []
                    that.data.forEach(function (item) {
                        if (item.parentId === val || item.resourceId === val) {
                            list.push(item)
                        }
                    })
                    that.list = list
                } else {
                    that.params.parentId = ''
                    that.list = that.data
                }
            },
            edit(item, isCopy) {
                this.$refs.edit.load(item, this.resourceGroupList, isCopy)
            },
            query() {
                const that = this
                that.querying = true
                that.$http.get('user/access').then(function (res) {
                    // success callback
                    console.log(res)
                    let list = []
                    const recursion = function (arr) {
                        list = list.concat(arr)
                        arr.forEach(function (item) {
                            if (item.childList) {
                                recursion(item.childList)
                            }
                        })
                    }
                    const data = res.body || {}
                    if (res.succeed) {
                        that.resourceGroupList = [data].concat(data.childList)
                        recursion(data.childList || [])
                        that.data = list
                        that.list = list
                        that.parentIdChange(that.params.parentId)
                    } else {
                        that.list = []
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