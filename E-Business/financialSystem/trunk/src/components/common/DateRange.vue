<template>
    <el-date-picker
            :editable="false"
            v-model="dateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            align="right"
            placeholder="请选择日期范围"
            style="width: 100%"
            :range-separator="'至'"
            :picker-options="options"
            @change="change">
    </el-date-picker>
</template>

<script>
    export default {
        // 声明 props
        props: {
            defaultRange: Array,
            change: Function
        },
        data() {
            var that = this
            const range = that.Date.getDateRange(0, 'week')
            let defaultRange = that.defaultRange || [range.startDateObj, range.todayObj]
            return {
                dateRange: defaultRange,
                options: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(0, 'day')
                            that.dateRange = dateRange
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.endDateObj])
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-2, 'day')
                            that.dateRange = dateRange
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.startDateObj])
                        }
                    }, {
                        text: '最近三天',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-3  , 'day')
                            that.dateRange = dateRange
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayObj])
                        }
                    }, {
                        text: '最近7天',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-7  , 'day')
                            that.dateRange = dateRange
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayObj])
                        }
                    }, {
                        text: '最近30天',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-30  , 'day')
                            that.dateRange = dateRange
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayObj])
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(0, 'week')
                            that.dateRange = dateRange
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayObj])
                        }
                    }, {
                        text: '上周',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-1, 'week')
                            that.dateRange = dateRange
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.endDateObj])
                        }
                    }, {
                        text: '最近三周',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-2, 'week')
                            that.dateRange = dateRange
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayObj])
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(0, 'month')
                            that.dateRange = dateRange
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayObj])
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-1, 'month')
                            that.dateRange = dateRange
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.endDateObj])
                        }
                    }, {
                        text: '最近三月',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-2, 'month')
                            that.dateRange = dateRange
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayObj])
                        }
                    }]
                }
            }
        }
    }
</script>
