define("widgets/time_bucket", ["base", "tools"], function($, T){
    var weekArr = ['日', '一', '二','三','四','五','六'];
    var hourArr = [
        {sta: '09:00', end: '10:30', min: 540, max: 630},
        {sta: '10:30', end: '12:00', min: 630, max: 720},
        {sta: '13:30', end: '15:00', min: 810, max: 900},
        {sta: '15:00', end: '16:30', min: 900, max: 990},
        {sta: '16:30', end: '18:00', min: 990, max: 1080}
    ];
    function TimeBucket(options){
        this.init(options||{});
    }
    TimeBucket.prototype = {
        init: function (options, isEvent) {
            var _this = this, ops = options||{};
            _this.now = getNow();
            _this.picked = ops.contactTime;//已选时间
            _this.weekList = getWeekList();
            _this.getTime = ops.getTime;
            _this.render();
        },
        /**
         * 获取时间表格 dom 树
         */
        getTree: function(data) {debugger
            var _this = this;
            var tree = [];
            T.Each(data.hourList, function(i, v) {
                tree.push('<tr data-y='+ i +'>');
                tree.push('<th>'+ v.sta+'-'+v.end+'</th>');
                T.Each(_this.weekList, function(k, t) {
                    if ((k == 0 && _this.now > v.max -10) || t.w == '周六' || t.w == '周日') {
                        tree.push('<td class="nopick">不可选</td>');
                    }else if(_this.picked == (t.m +'月'+ t.d +'日'+ v.sta+'-'+v.end)){
                        tree.push('<td class="sel">已选</td>');
                    }else{
                        tree.push('<td>可选</td>');
                    }
                })
                tree.push('</tr>');
            })
            return tree.join('');
        },
        render: function () {
            var _this = this, data = { hourList: hourArr, weekList: _this.weekList};
            data.tree = _this.getTree(data);
            _this.popup = new T.Popup({
                fixed: 1,
                zIndex: 1800,
                title: "指定时间联系",
                ok: "确 认",
                no: "取 消",
                width: 890,
                content: T.Compiler.template("template-time_bucket", data),
                callback: function(_o, view){
                    _this.events($(view));
                }
            });
            _this.popup.on('ok', function(){debugger//将最终选择结果提供给回调
                _this.getTime && _this.getTime(_this.bucketTime);
            });
        },
        /**
         * 获取选中时间值
         */
        getValue: function(x, y){debugger
            var day = this.weekList[x];
            var time = hourArr[y];
            this.bucketTime = day.m +'月'+ day.d + '日'+ time.sta + '-'+ time.end;
        },
        events: function($cont){
            var _this = this;
            $cont.on('click', 'td:not(.nopick)', function(){
                var x = $(this).index()-1;
                var y = $(this).closest('tr').data('y');
                $(this).parents('tbody').find('.sel').removeClass('sel').text('可选');
                $(this).addClass('sel').text('已选');
                _this.getValue(x, y);
            });
        }
    };
    /*字符串 or 数字型的小时、分钟数*/
    function getNow(h, m){
        var _h, _m, t = new Date();
        _h = typeof h == 'undefined' ? t.getHours() : h;
        _m = typeof m == 'undefined' ? t.getMinutes() : m;
        return parseInt(_m) + _h*60;//换算成分钟
    }
    //获取一周时间序列
    function getWeekList(){
        var weekList = [], m, d;
        var today = new Date();
        for (var i = 0; i < 7; i++) {
            i?today.setDate(today.getDate() + 1) : '';
            m = today.getMonth()+1;
            d = today.getDate();
            weekList.push({
                m: m < 10? '0'+ m : m,
                d: d < 10? '0'+ d : d,
                w: '周'+ weekArr[today.getDay()]
            })
        }
        weekList[0].w = '今天';
        return weekList;
    }
    
    return function(options){
        return new TimeBucket(options);
    };
});