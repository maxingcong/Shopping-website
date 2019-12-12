import Base64 from 'js-base64'
import sha1 from 'js-sha1'
import md5 from 'js-md5'
import Pcd from './assets/js/location'
import Calculator from './assets/js/calculator'
import Drag from './assets/js/drag'
import myDate from './assets/js/date'

export default {
    install(Vue, options) {
        // Base64.Base64.raw = false;
        // Base64.Base64.utf8decode = true;
        Vue.prototype.Base64 = Base64.Base64
        Vue.prototype.sha1 = sha1
        Vue.prototype.md5 = md5
        Vue.prototype.Pcd = Pcd
        Vue.prototype.Calculator = Calculator
        Vue.prototype.Date = myDate
        Vue.prototype.dialogModalClose = false
        Vue.prototype.dialogEscClose = false
        Vue.prototype.pageSizes = [10, 20, 30, 50, 80, 100]
        var tableMaxHeight = 0
        if (document.documentElement) {
            tableMaxHeight = document.documentElement.clientHeight - 140
        }
        if (tableMaxHeight <= 0) {
            tableMaxHeight = window.screen.availHeight * .8
        }
        Vue.prototype.tableMaxHeight = tableMaxHeight
        Vue.prototype.QINIU_DOWNLOAD = 'http://p19f6k93d.bkt.clouddn.com/'
        Vue.prototype.QINIU_UP = window.document.location.protocol.indexOf('https') === 0 ? 'https://upload.qiniup.com/' : 'http://up.qiniu.com/'
        Vue.prototype.globalThumbnail = '?imageMogr2/auto-orient/thumbnail/150x80'
        Vue.prototype.MSG = {
            unknown: '您操作太过频繁，请稍后再试'
        }

        Vue.prototype.RE = {
            uuid: /^[A-Za-z0-9]{3,20}$/,
            mobile: /^1[3|4|5|6|7|8|9]\d{9}$/,
            mobileTel: /^[+\-\s0-9]{6,20}$/,
            // mobileEmail: /^1[3|4|5|6|7|8|9]\d{9}$|^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            bankCode: /^[\s0-9]{15,30}$/,
            qq: /^[0-9]{5,13}$/,
            pwd: /^\S{6,16}$/,
            date: /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31))|(([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/,
            blank: /\s+/g,
            nonempty: /^\S+$/,
        }

        var GLOBAL_ENUM = {}
        var GLOBAL_ENUM_ARR = {}

        var setEnumAndArray = function (key, parts) {
            var obj = {}, arr = []
            parts.forEach(function (part) {
                obj[part.k] = part.v
                arr.push({value: part.k, text: part.v})
            })
            GLOBAL_ENUM[key] = obj
            GLOBAL_ENUM_ARR[key] = arr
        }

        //企业状态
        setEnumAndArray('enterpriseStatus', [
            {k: '', v: '全部'},
            {k: 1, v: '正常'},
            {k: 3, v: '待审核'},
            {k: 4, v: '审核不通过'}
        ])

        //企业信用状态
        setEnumAndArray('creditStatus', [
            {k: 1, v: '待审核'},
            {k: 2, v: '审核不通过'},
            {k: 3, v: '审核通过'}
        ])

        //账号状态
        setEnumAndArray('accountStatua', [
            {k: '', v: '全部'},
            {k: 1, v: '正常'},
            {k: 2, v: '采购待确认'}, //采购待确认（资料补全）
            {k: 3, v: '销售待确认'}, //销售待确认
            {k: 4, v: '禁用'}
        ])

        //还款状态
        setEnumAndArray('receivableStatus', [
            {k: '', v: '全部'},
            {k: 0, v: '待确认'},
            {k: 1, v: '确认通过'},
            {k: 2, v: '确认不通过'}
        ])

        Vue.prototype.GLOBAL_ENUM = GLOBAL_ENUM
        Vue.prototype.GLOBAL_ENUM_ARR = GLOBAL_ENUM_ARR

        /**
         * 基于时间戳生成16位全局唯一标识（每一毫秒只对应一个唯一的标识，适用于生成DOM节点ID）
         * @method uuid
         * @param {Number} [len] 生成字符串的位数
         * @returns {String}
         */
        Vue.prototype.uuid = (function () {
            let _timestamp = 0;
            return function (len) {
                let timestamp = new Date().getTime() || 0, chars = 'abcdefghijklmnopqrstuvwxyz', uuid = '';
                _timestamp = _timestamp == timestamp ? timestamp + 1 : timestamp;
                timestamp = '' + _timestamp;
                len = len || 16;
                for (let i = 0; i < len; i++) {
                    let k = timestamp.charAt(i);
                    if (k === '') {
                        k = Math.floor(Math.random() * 26);
                    }
                    uuid += chars.charAt(k) || 'x';
                }
                return uuid;
            };
        }())

        Vue.prototype.formatDateOutput = function (date) {
            return String(date || '').replace(' ', '<br/>')
        }
        Vue.prototype.validNumber = function (opts) {
            return {
                required: opts.required,
                type: opts.type || 'number',
                min: opts.min || 0,
                message: opts.message || '只能输入数字',
                trigger: opts.trigger || 'blur',
                transform(value) {
                    value = String(value).trim()
                    if (this.required && (value === '' || value === null)) {
                        return value
                    } else {
                        return value >= 0 ? Number(value) : value
                    }
                }
            }
        }
        /**
         * 权限验证
         * @param support 支持的权限
         * @param limit 仅限使用的权限
         * @param have 具备的权限
         */
        Vue.prototype.permission = function (support, limit, have) {
            var supportPrivilege = false
            var limitObj = {}
            if (limit) {
                limit.forEach(function (resourceId) {
                    limitObj[resourceId] = true
                })
            }
            if (support) {
                if (!Array.isArray(support)) {
                    support = [support]
                }
                if (options.auth && options.auth.privileges) {
                    support.forEach(function (privilege) {
                        supportPrivilege = supportPrivilege || (!!options.auth.privileges[privilege])
                    })
                }
                if (supportPrivilege && limit) {
                    supportPrivilege = false
                    support.forEach(function (privilege) {
                        supportPrivilege = supportPrivilege || (!!limitObj[privilege])
                    })
                }
            }
            return supportPrivilege
        }
        Vue.prototype.execChildMethod = function (that, objName, methodName) {
            var args = Array.from(arguments)
            setTimeout(function () {
                if (that.$refs[objName] && that.$refs[objName][methodName]) {
                    that.$refs[objName][methodName](...args.slice(3))
                }
            }, 10)
        }
        Vue.prototype.globalResponse = function (res, success, fail) {
            let data = res.data
            try {
                if (res.data.indexOf('document.domain') === 31) {
                    data = JSON.parse(res.data.slice(84, -12))
                } else if (res.data.indexOf('null(') === 0) {
                    data = JSON.parse(res.data.slice(5, -2))
                }
            } catch (e) {
            }
            if (data && parseInt(data.result, 10) === 0) {
                success(data.data || {})
            } else if (data.result === 3) {//没有登录或登录超时，请重新登录
                options.logout(data.data || {})
            } else {
                fail(data)
            }
        }
        // 过滤掉值为空字符的参数
        Vue.prototype.filterParams = function (params, excludeEmpty) {
            var obj = {}
            Object.keys(params).forEach(function (key) {
                params[key] = typeof params[key] == 'string' ? params[key].trim() : params[key]
                if (excludeEmpty) {
                    if (params[key] !== '' && params[key] != null) {
                        obj[key] = params[key]
                    }
                } else {
                    obj[key] = params[key]
                }
            })
            return obj
        }

        Vue.prototype.dialogOpen = function (uuid) {
            const dom = document.getElementById(uuid)
            if (dom) {
                const target = dom.querySelector('.el-dialog')
                const trigger = dom.querySelector('.el-dialog__header')
                //target.parentNode.style.overflow = 'hidden'
                target.style.top = 0
                target.style.left = 0
                target.style.margin = '15vh auto 50px'
                new Drag.install({
                    trigger: trigger,
                    target: target,
                    keepOrigin: false/*,
                    //top: 0,
                    bottom: 100,
                    left: 100,
                    right: 100*/
                });
            }
        }
        // 全局消息提示
        Vue.prototype.message = {
            success: function (o, msg) {
                if (msg) {
                    o.$message({
                        showClose: true,
                        message: msg,
                        type: 'success'
                    });
                }
            },
            warning: function (o, msg) {
                if (msg) {
                    o.$message({
                        showClose: true,
                        message: msg || Vue.prototype.MSG.unknown,
                        type: 'warning'
                    });
                }
            },
            error: function (o, msg) {
                o.$message({
                    showClose: true,
                    message: msg || Vue.prototype.MSG.unknown,
                    type: 'error'
                });
            }
        }
        /**
         * 展示文本
         * @param val
         * @param text
         */
        Vue.prototype.showText = function (val, text = '暂无') {
            return (val === '' || val == null) ? text || '' : val
        }
        /**
         * 渲染地图定位
         * @param mapId {String} 展示容器ID
         * @param opts
         * @param opts.longitude {Number} 经度
         * @param opts.latitude {Number} 纬度
         * @param opts.address {String} 地址
         * @param opts.change {Function} 地址
         */
        Vue.prototype.markerPoint = function (mapId, opts) {
            opts = opts || {}
            if (mapId && ((opts.longitude && opts.latitude) || (opts.address && opts.dragging))) {
                // 创建地图
                const map = new BMap.Map(mapId)
                const markerPoint = function (point) {
                    if (point.lng && point.lat) {
                        opts.longitude = point.lng
                        opts.latitude = point.lat
                        map.centerAndZoom(point, 16);
                        const marker = new BMap.Marker(point) //创建标注
                        if (opts.dragging) {
                            marker.enableDragging() //标注可拖拽
                            marker.addEventListener('mouseup', function () {
                                const p = marker.getPosition() //获取marker的位置
                                if (point.lng && point.lat) {
                                    opts.change && opts.change(p.lng, p.lat)
                                }
                            })
                        }
                        map.addOverlay(marker)
                    }
                }
                //地图的点
                if (opts.latitude && opts.longitude) {
                    markerPoint(new BMap.Point(opts.longitude, opts.latitude))
                } else {
                    // 创建地址解析器实例
                    const geo = new BMap.Geocoder()
                    const parts = (opts.address || '').split('^')
                    // 将地址解析结果显示在地图上,并调整地图视野
                    geo.getPoint(parts.slice(1).join('') || '北京市', function (point) {
                        if (!point) {
                            point = new BMap.Point(116.400244, 39.92556)
                        }
                        markerPoint(point)
                    }, parts[0] || '北京市')
                }
                return map
            } else {
                document.getElementById(mapId).innerHTML = ''
            }
        }
        /**
         * 百度地址模糊搜索
         * @param opts
         * @param opts.map {Object} 百度地图实例
         * @param opts.value {String} 要搜索的地址关键字
         * @param opts.callback {Function} 搜索完成回调
         */
        Vue.prototype.searchAddress = function (opts) {
            opts = opts || {}
            const value = String(opts.value).trim()
            let addressList = []
            if (opts.map && value) {
                const mapSearch = new BMap.LocalSearch(opts.map, {
                    //renderOptions: {map: that.map},
                    onSearchComplete(results) {
                        // 判断状态是否正确
                        if (mapSearch.getStatus() == BMAP_STATUS_SUCCESS) {
                            for (let i = 0; i < results.getCurrentNumPois(); i++) {
                                let item = results.getPoi(i)
                                if (opts.region[0] === item.province && opts.region[1] === item.city) {
                                    item.value = item.title + ' ' + item.address
                                    addressList.push(item)
                                }
                            }
                            opts.callback && opts.callback(addressList)
                            console.log(addressList)
                        } else {
                            opts.callback && opts.callback(addressList)
                        }
                    }
                })
                mapSearch.search(value)
            } else {
                opts.callback && opts.callback(addressList)
            }
        }
    }
}