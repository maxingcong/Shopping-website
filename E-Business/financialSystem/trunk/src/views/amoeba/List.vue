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
                    <el-form-item label="阿米巴编号/名称">
                        <el-input v-model="params.userChannel" placeholder="请输入要搜索的阿米巴编号/名称"></el-input>
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
                        prop="number"
                        label="阿米巴编号"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="servicePointName"
                        label="阿米巴名称">
                </el-table-column>
                <el-table-column
                        prop="userCode"
                        label="巴长编号">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="巴长姓名">
                </el-table-column>
                <el-table-column
                        prop="cellphone"
                        label="巴长电话">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="creditIntegral"
                        label="信用积分">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="totalCreditAmount"
                        label="信用额度（元）">
                    <template slot-scope="scope">
                        <template v-if="scope.row.totalCreditAmount<0">
                            <el-button v-if="permission([100])" type="text"
                                       @click="$refs.adjustAmount.load(scope.row, 3)" class="o-link">开通
                            </el-button>
                        </template>
                        <template v-else>
                            {{scope.row.totalCreditAmount | currency}}
                            <el-button v-if="permission([100])" type="text"
                                       @click="$refs.adjustAmount.load(scope.row, 1)" class="o-link">调额
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="currentCreditAmount"
                        label="信用可用额度（元）">
                    <template slot-scope="scope">
                        {{scope.row.currentCreditAmount | currency}}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="cashAmount"
                        label="代金账户余额（元）">
                    <template slot-scope="scope">
                        {{scope.row.cashAmount || 0 | currency}}
                        <el-button v-if="permission([100])" type="text"
                                   @click="$refs.adjustAmount.load(scope.row, 2)" class="o-link">调额
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="rebateAccount"
                        label="返点账户余额（元）">
                    <template slot-scope="scope">
                        {{scope.row.rebateAccount || 0 | currency}}
                        <el-button v-if="permission([100])" type="text"
                                   @click="$refs.adjustAmount.load(scope.row, 4)" class="o-link">操作
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
        <x-adjust-amount
                ref="adjustAmount"
                @success="query">
        </x-adjust-amount>
    </div>
</template>
<script>
    import XAdjustAmount from './components/AdjustAmount.vue'

    export default {
        components: {XAdjustAmount},
        data() {
            const that = this
            return {
                loading: true,
                querying: false,
                list: [],
                total: 0,
                params: {
                    userChannel: '', //阿米巴编号
                    currentPage: 1,
                    pageSize: that.pageSizes[0]
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
            query() {
                const that = this
                that.loading = true
                that.$http.get('in_payment/account/all_amoeba_account', {params: that.params}).then(function (res) {
                    // success callback
                    console.log(res)
                    const data = res.body || {}
                    if (res.succeed) {
                        that.list = data.accountList || []
                        that.total = data.totalCount || 0
                    } else {
                        that.list = []
                        that.total = 0
                        that.message.warning(that, data.msg)
                    }
                    that.loading = false
                    that.querying = false
                    that.$emit('loaded')
                }).catch(function (res) {
                    // error callback
                    that.loading = false
                    that.querying = false
                    that.message.error(that)
                    that.$emit('loaded')
                    console.log(res.config.url, res.response || res.message)
                })
            }
        }
    }
</script>