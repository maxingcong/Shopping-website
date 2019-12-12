<template>
    <div class="page-account" v-loading="loading">
        <el-card class="card-block">
            <el-form :inline="true" ref="search" :model="params" class="form-search">
                <div class="form-right">
                    <el-button type="text" @click="query" :loading="querying">
                        <i class="el-icon-refresh"></i>
                    </el-button>
                </div>
                <div class="form-left">
                    <el-form-item label="状态">
                        <el-dropdown trigger="hover" @command="creditStatusChange">
                            <div class="el-dropdown-link">
                                {{GLOBAL_ENUM.creditStatus[params.creditPayStatus]}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <template v-for="(item, index) in GLOBAL_ENUM_ARR.creditStatus">
                                    <el-dropdown-item :command="item.value">{{item.text}}</el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-form-item label="区域">
                        <el-cascader
                                filterable
                                clearable
                                change-on-select
                                :options="pcdData"
                                placeholder="请选择区域"
                                @change="pcdChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="企业名称">
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
                        prop="enterpriseId"
                        label="编号"
                        width="100">
                </el-table-column>
                <el-table-column
                        fixed="left"
                        prop="enterpriseName"
                        label="企业名称"
                        width="200">
                    <!--<template slot-scope="scope">
                        <popover-enterprise :data="scope.row"></popover-enterprise>
                    </template>-->
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="企业地址"
                        width="400">
                    <template slot-scope="scope">
                        {{scope.row.address | location}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="legalPerson"
                        label="企业法人"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="bankName"
                        label="开户行"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="accountName"
                        label="开户名"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="accountNumber"
                        label="银行账号"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="user.fullName"
                        label="管理员"
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
                        fixed="right"
                        align="center"
                        label="状态"
                        width="80">
                    <template slot-scope="scope">
                        <template v-if="scope.row.creditPayStatus===2">
                            <el-tooltip class="item" effect="dark" :content="scope.row.reason" placement="top">
                                <span>{{GLOBAL_ENUM.creditStatus[scope.row.creditPayStatus]}}</span>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            {{GLOBAL_ENUM.creditStatus[scope.row.creditPayStatus]}}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        v-if="permission([15,64])"
                        align="center"
                        label="操作"
                        width="150">
                    <template slot-scope="scope">
                        <el-button v-if="permission([15])" type="text"
                                   @click="detail(scope.row)" class="o-link">详情
                        </el-button>
                        <el-button v-if="permission([64]) && scope.row.creditPayStatus===1" type="text"
                                   @click="audit(scope.row.enterpriseId, 3)" class="o-link">通过
                        </el-button>
                        <el-button v-if="permission([64]) && scope.row.creditPayStatus===1" type="text"
                                   @click="audit(scope.row.enterpriseId, 2)" class="o-link">不通过
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
        <x-detail
                ref="detail"
                @audit="audit"
                @imagePreview="imagePreview">
        </x-detail>
        <x-audit
                ref="audit"
                @success="query">
        </x-audit>
        <com-image ref="image"></com-image>
    </div>
</template>
<script>
    import XDetail from './components/Detail.vue'
    import XAudit from './components/Audit.vue'

    export default {
        components: {XDetail, XAudit},
        data() {
            const that = this
            return {
                loading: true,
                querying: false,
                pcdData: that.Pcd.data(2).options,
                list: [],
                total: 0,
                params: {
                    currentPage: 1,
                    pageSize: that.pageSizes[0],
                    address: '',
                    creditPayStatus: 1,
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
            pcdChange(val) {
                console.log('当前: ', val)
                this.params.address = val.join('^')
                this.query()
            },
            creditStatusChange(val) {
                console.log(val)
                this.params.creditPayStatus = val || ''
                this.query()
            },
            imagePreview(url) {
                this.$refs.image.preview(url)
            },
            detail(row) {
                if (row, row.user) {
                    this.$refs.detail.load(row)
                }
            },
            audit(id, type) {
                if (id > 0 && type > 0) {
                    this.$refs.audit.load(id, type)
                }
            },
            query() {
                const that = this;
                that.loading = true
                that.$http.get('user/enterprise', {params: that.params}).then(function (res) {
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
                    console.log(res.config && res.config.url, res.response || res.message)
                })
            }
        },
        created() {
            this.query()
        }
    }
</script>