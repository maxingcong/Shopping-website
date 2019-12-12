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
                    <el-form-item label="截止应还款日期">
                        <el-date-picker
                                :editable="false"
                                :clearable="false"
                                type="date"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                v-model="params.staTime"
                                placeholder="请选择"
                                style="width: 110px">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="阿米巴编号">
                        <el-input v-model="params.userChannel" placeholder="请输入要搜索的阿米巴编号"></el-input>
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
                        prop="recordId"
                        label="编号"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="userChannel"
                        label="阿米巴编号">
                </el-table-column>
                <!--<el-table-column
                        align="center"
                        prop="bankReceipt"
                        label="阿米巴名称">
                </el-table-column>-->
                <el-table-column
                        prop="userName"
                        label="客户账号">
                </el-table-column>
                <el-table-column
                        prop="orderCode"
                        label="订单编号">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="下单时间"
                        class-name="t-date"
                        width="100">
                    <template slot-scope="scope">
                        <span v-html="formatDateOutput(scope.row.orderCreateTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="信用支付时间"
                        class-name="t-date"
                        width="100">
                    <template slot-scope="scope">
                        <span v-html="formatDateOutput(scope.row.paymentTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="amount"
                        label="信用支付金额（元）">
                    <template slot-scope="scope">
                        {{scope.row.amount | currency}}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="应还款时间"
                        class-name="t-date"
                        width="100">
                    <template slot-scope="scope">
                        <span v-html="formatDateOutput(scope.row.expectedReturnTime)"></span>
                    </template>
                </el-table-column>
                <!--<el-table-column
                        align="center"
                        label="实际还款时间"
                        class-name="t-date"
                        width="100">
                    <template slot-scope="scope">
                        <span v-html="formatDateOutput(scope.row.returnTime)"></span>
                    </template>
                </el-table-column>-->
                <el-table-column
                        align="center"
                        prop="overdueAmount"
                        label="逾期金额（元）">
                    <template slot-scope="scope">
                        {{scope.row.overdueAmount | currency}}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="totalAmount"
                        label="应还款金额（元）">
                    <template slot-scope="scope">
                        {{scope.row.totalAmount | currency}}
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="permission([100])"
                        align="center"
                        label="审核"
                        width="90">
                    <template slot-scope="scope">
                        <el-button v-if="permission([100])" type="text"
                                   @click="$refs.confirm.load(scope.row, 3)" class="o-link"
                                   :disabled="scope.row.resourceIdList.indexOf(3)===-1">确认延期
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
        <x-confirm
                ref="confirm"
                @success="query">
        </x-confirm>
        <com-image ref="image"></com-image>
    </div>
</template>
<script>
    import XConfirm from './components/Confirm.vue'

    export default {
        components: {XConfirm},
        data() {
            const that = this
            const dr = that.Date.getDateRange(0, 'day')
            console.log('dr', dr)
            return {
                loading: true,
                querying: false,
                list: [],
                total: 0,
                params: {
                    status: 3, //状态
                    userChannel: '', //阿米巴编号
                    currentPage: 1,
                    pageSize: that.pageSizes[0],
                    staTime: dr.today //截止日期
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
            commandStatus: function (val) {
                console.log('状态: ' + val)
                this.params.status = val
                this.query()
            },
            query() {
                const that = this
                that.loading = true
                that.$http.get('in_payment/arrears/credit_payment_record', {params: that.params}).then(function (res) {
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