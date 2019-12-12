<template>
    <el-dialog
            width="1080px"
            :visible.sync="visible"
            :close-on-click-modal="dialogModalClose"
            :close-on-press-escape="dialogEscClose"
            @close="close">
        <el-form class="form-detail" style="padding-top: 0">
            <el-row :gutter="20">
                <el-col :span="12">
                    <dl class="dl-detail">
                        <dd class="dl-group">
                            <el-form-item label="企业名称：">
                                {{showText(data.enterpriseName)}}
                            </el-form-item>
                            <el-form-item label="联系人：">
                                {{showText(data.user.fullName)}}
                            </el-form-item>
                            <el-form-item label="联系方式：">
                                {{showText(data.user.userName)}}
                            </el-form-item>
                            <el-form-item label="加入时间：">
                                {{showText(data.recordTime)}}
                            </el-form-item>
                            <el-form-item label="企业地址：">
                                {{showText(data.address) | location}}
                            </el-form-item>
                            <!--<el-form-item label="联系人身份证：">
                                <div v-if="data.idCard" class="img-box" @click="imagePreview(data.idCard)">
                                    <img :src="QINIU_DOWNLOAD+data.idCard + globalThumbnail">
                                </div>
                                <template v-else>暂无</template>
                            </el-form-item>-->
                        </dd>
                        <dd class="dl-group">
                            <el-form-item label="企业法人：">
                                {{showText(data.legalPerson)}}
                            </el-form-item>
                            <!--<el-form-item label="法人身份证：">
                                <div v-if="data.idNumber" class="img-box" @click="imagePreview(data.idNumber)">
                                    <img :src="QINIU_DOWNLOAD + data.idNumber + globalThumbnail">
                                </div>
                                <template v-else>暂无</template>
                            </el-form-item>-->
                            <el-form-item label="统一社会信用代码：">
                                {{showText(data.unifiedSocialCreditCode)}}
                            </el-form-item>
                            <!--<el-form-item label="营业执照：">
                                <div v-if="data.enterpriseLicense" class="img-box"
                                     @click="imagePreview(data.enterpriseLicense)">
                                    <img :src="QINIU_DOWNLOAD + data.enterpriseLicense + globalThumbnail">
                                </div>
                                <template v-else>暂无</template>
                            </el-form-item>-->
                        </dd>
                        <dd class="dl-group">
                            <el-form-item label="开户行：">
                                {{showText(data.bankName)}}
                            </el-form-item>
                            <el-form-item label="开户名：">
                                {{showText(data.accountName)}}
                            </el-form-item>
                            <el-form-item label="银行账号：">
                                {{showText(data.accountNumber)}}
                            </el-form-item>
                            <el-form-item label="联系电话：">
                                {{showText(data.tel)}}
                            </el-form-item>
                            <el-form-item label="纳税人识别号：">
                                {{showText(data.taxpayerIdentificationNumber)}}
                            </el-form-item>
                            <el-form-item label="税务登记地址：">
                                {{showText(data.taxRegistrationAddress) | location}}
                            </el-form-item>
                        </dd>
                    </dl>
                </el-col>
                <el-col :span="12">
                    <table class="ent-credentials" cellpadding="0" cellspacing="0" style="width: 100%">
                        <tr>
                            <td>
                                <div v-if="data.idCard" class="img-box" @click="imagePreview(data.idCard)">
                                    <img :src="QINIU_DOWNLOAD+data.idCard + globalThumbnail">
                                </div>
                                <div v-else class="not-uploaded">未上传</div>
                            </td>
                            <td>
                                <div v-if="data.idNumber" class="img-box" @click="imagePreview(data.idNumber)">
                                    <img :src="QINIU_DOWNLOAD + data.idNumber + globalThumbnail">
                                </div>
                                <div v-else class="not-uploaded">未上传</div>
                            </td>
                            <td>
                                <div v-if="data.enterpriseLicense" class="img-box"
                                     @click="imagePreview(data.enterpriseLicense)">
                                    <img :src="QINIU_DOWNLOAD + data.enterpriseLicense + globalThumbnail">
                                </div>
                                <div v-else class="not-uploaded">未上传</div>
                            </td>
                        </tr>
                        <tr>
                            <td>联系人身份证</td>
                            <td>法人身份证</td>
                            <td>营业执照</td>
                        </tr>
                    </table>
                    <div :id="mapId" class="baidumap" style="height: 280px; margin: 10px 0 0 3px"></div>
                </el-col>
            </el-row>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="close">关闭</el-button>
            <el-button v-if="permission([16]) && data.status===3" type="warning" @click="audit(data.enterpriseId)">审核
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        // 声明 props
        props: {},
        data() {
            const that = this
            return {
                visible: false,
                data: {user: {}},
                mapId: ''
            }
        },
        methods: {
            close() {
                this.data = {user: {}}
                this.visible = false
            },
            load(data) {
                const that = this
                that.data = data
                that.data.user = data.user || {}
                that.mapId = that.sha1(Math.random() + that.data.idNumber)
                that.visible = true
                setTimeout(function () {
                    that.markerPoint(that.mapId, {
                        longitude: data.longitude,
                        latitude: data.latitude,
                        address: data.address
                    })
                }, 10)
            },
            audit(enterpriseId) {
                const that = this
                that.$emit('audit', enterpriseId)
            },
            imagePreview(url) {
                if (url) {
                    this.$emit('imagePreview', url)
                }
            }
        }
    }
</script>
<style lang="less">
    .ent-credentials {
        table-layout: fixed;
        td {
            width: 33.33%;
            text-align: center;
            vertical-align: bottom;
        }
        .img-box {
            vertical-align: bottom;
        }
        .not-uploaded {
            color: #99a9bf;
            line-height: 80px;
        }
    }
</style>