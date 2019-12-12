<template>
    <!--accept="image/*"-->
    <el-upload
            class="avatar-uploader"
            name="file"
            :action="QINIU_UP"
            :data="formData()"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload">
        <img v-if="avatarUrl"
             class="avatar"
             :src="avatarUrl + globalThumbnail"
             v-on:click="imagePreview">
        <i v-if="!avatarUrl" class="el-icon-plus uploader-icon"></i>
    </el-upload>
</template>
<script>
    export default {
        // 声明 props
        props: {
            url: String
        },
        data() {
            return {
                data: null,
                upToken: '',
                avatarUrl: ''
            }
        },
        watch: {
            data: function () {
                this.avatarUrl = this.data || ''
                this.$emit('change', this.avatarUrl)
            }
        },
        methods: {
            formData() {
                return {token: this.upToken}
            },
            uploadSuccess(res) {
                var that = this
                if (res) {
                    that.avatarUrl = 'http://cloud.ininin.com/' + res.key
                    that.$emit('change', that.avatarUrl)
                }
            },
            beforeUpload(file) {
                const isImg = /^image\/\w+$/i.test(file.type);
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isImg) {
                    this.$message.error('只能上传 JPG、PNG、GIF 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isImg//isJPG && isLt2M;
            },
            imagePreview(file) {
                this.$emit('imagePreview', file.url)
            },
            getUploadToken() {
                var that = this
                that.upToken = that.Cookies.get('upload_token')
                if (!that.upToken) {
                    that.$http.get('in_token/get_token').then(function (res) {
                        // success callback
                        console.log(res)
                        if (res.succeed) {
                            var data = res.body || {}
                            that.upToken = data.Token || ''
                            that.Cookies.set('upload_token', that.upToken, {expires: 0.05, path: '/'})
                        } else {
                            that.message.warning(that, res.body.msg)
                        }
                    }, function (res) {
                        // error callback
                        console.log(res)
                        that.message.error(that)
                    })
                }
            }
        },
        created() {
            this.getUploadToken()
        }
    }
</script>
<style lang="less">
    .avatar-uploader {
        height: 102px;
        overflow: hidden;
        .el-upload {
            height: 100px;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            &:hover {
                border-color: #409EFF;
            }
        }
        .uploader-icon {
            font-size: 32px;
            color: #8c939d;
            width: 100px;
            height: 100%;
            overflow: hidden;
            line-height: 100px;
            text-align: center;
        }
        .avatar {
            width: 100px;
            height: 100%;
            display: block;
            overflow: hidden;
        }
    }
</style>