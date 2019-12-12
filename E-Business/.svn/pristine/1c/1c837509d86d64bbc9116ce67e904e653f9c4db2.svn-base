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
                        <el-dropdown trigger="hover" @command="commandStatus">
                            <span class="el-dropdown-link">
                                {{GLOBAL_ENUM.receivableStatus[params.status] || '全部'}}<i
                                    class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <template v-for="(item, index) in GLOBAL_ENUM_ARR.receivableStatus">
                                    <el-dropdown-item :command="item.value">{{item.text}}</el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-form-item label="起始月份">
                        <el-date-picker
                                :editable="false"
                                type="month"
                                format="yyyy-MM"
                                value-format="yyyy-MM"
                                v-model="params.staTime"
                                placeholder="请选择">
                        </el-date-picker>
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
                        prop="recordId"
                        label="流水号"
                        width="100">
                </el-table-column>
                <!--<el-table-column
                        fixed="left"
                        align="center"
                        prop="orderCode"
                        label="订单号"
                        width="100">
                </el-table-column>-->
                <el-table-column
                        fixed="left"
                        prop="enterpriseName"
                        label="付款公司"
                        width="150">
                    <template slot-scope="scope">
                        {{scope.row.buyerEnterprise.enterpriseName}}
                    </template>
                </el-table-column>
                <!--<el-table-column
                        align="center"
                        prop="bankReceipt"
                        label="收款回单">
                </el-table-column>-->
                <el-table-column
                        align="center"
                        prop="repaymentAmount"
                        label="还款金额（元）">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="还款时间"
                        class-name="t-date"
                        width="100">
                    <template slot-scope="scope">
                        <span v-html="formatDateOutput(scope.row.repaymentTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="确认时间"
                        class-name="t-date"
                        width="100">
                    <template slot-scope="scope">
                        <span v-html="formatDateOutput(scope.row.confirmationTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        align="center"
                        prop="status"
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        {{GLOBAL_ENUM.receivableStatus[scope.row.repaymentStatus]}}
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        v-if="permission([63])"
                        align="center"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button v-if="permission([63])" type="text"
                                   @click="$refs.confirm.load(scope.row)" class="o-link"
                                   :disabled="scope.row.repaymentStatus!==1">确认回款
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
                @imagePreview="imagePreview"
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
            const dr = that.Date.getDateRange(-1, 'month')
            console.log('dr', dr)
            return {
                loading: true,
                querying: false,
                list: [],
                total: 0,
                params: {
                    status: '', //状态
                    currentPage: 1,
                    pageSize: that.pageSizes[0],
                    staTime: dr.startDate.slice(0, 7) //起始月份
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
            imagePreview(url) {
                this.$refs.image.preview(url)
            },
            commandStatus: function (val) {
                console.log('状态: ' + val)
                this.params.status = val
                this.query()
            },
            query() {
                const that = this
                that.loading = true
                that.$http.get('order/payment/repayment_record', {params: that.params}).then(function (res) {
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