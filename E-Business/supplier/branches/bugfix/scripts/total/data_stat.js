!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var dataStat = {
        data: {
            start_time: '', //开始时间
            end_time: '', //结束时间
            stat_type: '1', //数据统计类型
            index: 1, //当前页
            offset: 10 //每页条数
        },
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.$cont = $("#template-stat_info-view"); //容器
            _this.render();
            _this.initUI();
            _this.getStatistic();
            _this.bindEvents();
        },
        /**
         * 渲染页面
         */
        render: function(data){
            var _this = this;
            if(data){
                data.statType = _this.data.stat_type;
            }
            T.Template('stat_info', data?data: {statType: _this.data.stat_type});
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#list_tabs').on('click', 'li > a', function(e){ //tabs
                _this.data.stat_type = $(this).data("stat_type")||"";
                _this.getStatistic();
            });
            _this.startTime.on('changeDate', function(e){ //开始时间
                _this.data.start_time = $('#startTime').val();
                _this.endTime.datetimepicker("setStartDate", _this.data.start_time);
                _this.getStatistic();
            });
            _this.endTime.on('changeDate', function(e){ //结束时间
                _this.data.end_time = $('#endTime').val();
                _this.startTime.datetimepicker("setEndDate", _this.data.end_time);
                _this.getStatistic();
            });
            $('#time_range_btn').on('click', 'button', function(){ //时间范围选择
                var range = {},
                    time_range = $(this).data('time_range');
                if(time_range == '-1'){ //昨天
                    range = T.getDateRange(-2, 'day', true)
                }else if(time_range == 'preMonth'){ //上月
                    range = T.getDateRange(-1, 'month');
                }else if(time_range == 'curMonth'){ //本月
                    range = {
                        startDate: T.getDateRange(0, 'day').startDate.substr(0,8) + '01',
                        endDate: T.getDateRange(0, 'day').startDate
                    }
                }else{
                    range = T.getDateRange(($(this).data('time_range')), 'day');
                }
                _this.data.start_time = range.startDate;
                _this.data.end_time = range.endDate;
                $('#startTime').val(range.startDate);
                $('#endTime').val( range.endDate);
                $(this).addClass('btn-primary active').removeClass('btn-link').siblings().addClass('btn-link').removeClass('btn-primary active');
                _this.getStatistic();
            });
            $('#searchBtn').on('click', function(){ //搜索
                _this.getStatistic();
            });
            _this.$cont.on("change.pageCount", "select[name='pageCount']", function(e){
                _this.data.index = 1;
                _this.data.offset = $(this).val()||10;
                _this.queryOrder();
            }).on("change.pageCount", "select[name='pageCount']", function(e){
                _this.data.index = 1;
                _this.data.offset = $(this).val()||10;
                _this.queryOrder();
            });
        },
        /**
         * 初始化UI
         */
        initUI: function(){
            var _this = this,
                date_range = T.getDateRange(-7, 'day'),
                start_time = date_range.startDate,
                end_time = date_range.endDate;
            _this.startTime = $('#startTime').datetimepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                autoclose: true,
                weekStart: 1,
                startView: 2,
                minView: 2,
                forceParse: false,
                initialDate: start_time,
                endDate: new Date()
            });
            _this.endTime = $('#endTime').datetimepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                autoclose: true,
                weekStart: 1,
                startView: 2,
                minView: 2,
                forceParse: false,
                endDate: new Date()
            });
            $('#startTime').val(start_time);
            $('#endTime').val(end_time);
            _this.data.start_time = start_time;
            _this.data.end_time = end_time;
        },
        /**
         * 绘制图表
         */
        markChart: function(data){
            var _this = this,
                categories = [],
                series = [];
            if(_this.data.stat_type == '1'){ //接单数据统计
                series.push(
                    {name: '每日接单数', data: []},
                    {name: '生产逾期', data: []},
                    {name: '拒单数', data: []}
                );
                for( var i= 0,l=data.length; i<l; i++){
                    //赋值 series
                    series[0].data.push(data[i].singleCount);
                    series[1].data.push(data[i].deliveryCount);
                    series[2].data.push(data[i].refuseCount);
                    //对报表X轴显示名称赋值
                    categories.push(data[i].date);
                }
            }else{ //财务数据统计
                series.push(
                    {name: '每日接单金额', data: []}
                );
                for( var i= 0,l=data.length; i<l; i++){
                    //赋值 series
                    series[0].data.push(data[i].amount);
                    //对报表X轴显示名称赋值
                    categories.push(data[i].date);
                }
            }
            var options = {
                chart: {
                    renderTo: 'chart_container' //DIV容器ID
                },
                title: {
                    text: ''
                },
                xAxis: {
                    reversed: true,
                    tickInterval: Math.ceil(data.length/8),
                    categories: []   //指定x轴分组
                },
                yAxis: {
                    minRange: 10,
                    title: ''
                },
                colors: ['#7cb5ec', '#90ed7d', '#ff0000'],
                credits: {
                    enabled: false
                },
                series: [] //指定数据列
            };
            options.xAxis.categories = categories;
            options.series = series;
            _this.chart = new Highcharts.Chart(options); //图表展示
        },
        /**
         * 获取统计数据
         */
        getStatistic: function(){
            var _this = this,
                params = {};
            params.startTime = _this.data.start_time;
            params.endTime = _this.data.end_time;
            params.supplier = T.Cookie.get('_a_name'); //供应商名称
            params.from = _this.data.stat_type; //查询类型
            $('#template-stat_info-view').addClass('load');
            T.GET({
                action: CFG.API.statistic,
                params: params,
                success: function(res){
                    $('#template-stat_info-view').removeClass('load');
                    console.log(res);
                    _this.render(res);
                    _this.markChart(res.statisticList);
                    if(_this.data.stat_type == '2'){
                        _this.queryOrder();
                    }
                }
            });
        },
        queryOrder: function(index){
            var _this = this,
                index = index|| 1,
                params = {};
            params.startTime = _this.data.start_time;
            params.endTime = _this.data.end_time;
            params.supplier = T.Cookie.get('_a_name'); //供应商名称
            params.currentPage = index; //当前页
            params.pageCount = _this.data.offset; //每页条数
            $('#template-total_order_list-view').addClass('load');
            T.GET({
                action: CFG.API.order_query,
                params: params,
                success: function(res){
                    console.log(res);
                    $('#template-total_order_list-view').removeClass('load');
                    T.Template('total_order_list', res?res: {});
                    _this.data.recordCount = res.totalCount||0;
                    T.BindData("data", _this.data);
                    //分页条
                    T.Paginbar({
                        num: 3,
                        size: _this.data.offset, //每页条数
                        total: Math.ceil(_this.data.recordCount/_this.data.offset), //总页数
                        index: index||1, //当前页码
                        paginbar: "paginbar", //容器ID
                        callback: function(obj, index, size, total){ //点击页码回调
                            _this.queryOrder(index);
                        }
                    });
                    _this.data.index = index;
                }
            });
        }
    };
    dataStat.init();
}(window, document));
