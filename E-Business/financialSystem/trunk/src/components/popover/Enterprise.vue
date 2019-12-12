<template>
    <el-popover
            :title="data.enterpriseName"
            placement="right-start"
            width="720"
            trigger="hover"
            @show="show">
        <el-button slot="reference" type="text" class="o-link">
            {{data.enterpriseName}}
        </el-button>
        <el-form class="form-detail" style="padding-top: 0">
            <el-row :gutter="20">
                <el-col :span="12">
                    <dl class="dl-detail">
                        <dd class="dl-group">
                            <el-form-item label="企业名称：">
                                {{data.enterpriseName}}
                            </el-form-item>
                            <el-form-item label="企业地址：">
                                {{data.address | location}}
                            </el-form-item>
                            <el-form-item label="加入时间：">
                                {{data.recordTime}}
                            </el-form-item>
                            <el-form-item label="联系人：">
                                {{data.user.fullName}}
                            </el-form-item>
                            <el-form-item label="联系方式：">
                                {{data.user.userName}}
                            </el-form-item>
                            <el-form-item label="联系人身份证：">
                                {{data.user.userName}}
                            </el-form-item>
                        </dd>
                        <dd class="dl-group">
                            <el-form-item label="开户行：">
                                {{data.bankName}}
                            </el-form-item>
                            <el-form-item label="开户名：">
                                {{data.accountName}}
                            </el-form-item>
                            <el-form-item label="银行账号：">
                                {{data.accountNumber}}
                            </el-form-item>
                            <el-form-item label="联系电话：">
                                {{data.tel}}
                            </el-form-item>
                            <el-form-item label="纳税人识别号：">
                                {{data.taxpayerIdentificationNumber}}
                            </el-form-item>
                            <el-form-item label="税务登记地址：">
                                {{data.taxRegistrationAddress | location}}
                            </el-form-item>
                        </dd>
                    </dl>
                </el-col>
                <el-col :span="12">
                    <dl class="dl-detail">
                        <dd class="dl-group">
                            <el-form-item label="企业法人：">
                                {{data.legalPerson}}
                            </el-form-item>
                            <el-form-item label="法人身份证：">
                                {{data.user.userName}}
                            </el-form-item>
                            <el-form-item label="统一社会信用代码：">
                                {{data.unifiedSocialCreditCode}}
                            </el-form-item>
                            <el-form-item label="营业执照：">
                                {{data.accountName}}
                            </el-form-item>
                        </dd>
                    </dl>
                    <div :id="mapId" class="baidumap" style="height: 210px"></div>
                </el-col>
            </el-row>
        </el-form>
    </el-popover>
</template>
<script>
    export default {
        // 声明 props
        props: {
            data: {}
        },
        data() {
            var that = this
            return {
                mapId: that.sha1(Math.random() + that.data.idNumber)
            }
        },
        methods: {
            show() {
                var that = this
                setTimeout(function () {
                    that.renderMap()
                }, 10)
            },
            renderMap() {
                var that = this
                if (that.type != 1) return
                // 创建地图
                that.map = new BMap.Map(that.mapId)
                var markerPoint = function (point) {
                    if (point.lng && point.lat) {
                        that.data.longitude = point.lng
                        that.data.latitude = point.lat
                        that.map.centerAndZoom(point, 12);
                        var marker = new BMap.Marker(point) //创建标注
                        that.map.addOverlay(marker)
                    }
                }
                //地图的点
                if (that.data.latitude && that.data.longitude) {
                    markerPoint(new BMap.Point(that.data.longitude, that.data.latitude))
                } else {
                    // 创建地址解析器实例
                    that.geo = new BMap.Geocoder()
                    // 将地址解析结果显示在地图上,并调整地图视野
                    that.geo.getPoint((that.data.city || that.DEF_PCD[1]) + that.data.address, function (point) {
                        if (!point) {
                            point = new BMap.Point(116.400244, 39.92556)
                        }
                        markerPoint(point)
                    }, that.data.province || that.DEF_PCD[0])
                }
            }
        }
    }
</script>