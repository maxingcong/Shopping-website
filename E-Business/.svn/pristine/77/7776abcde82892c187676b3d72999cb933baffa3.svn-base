<template>
    <div>
        <!--accept="image/*"-->
        <el-upload
                ref="upload"
                class="file-uploader"
                name="file"
                :action="QINIU_UP"
                :data="formData"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">只能上传不超过100MB的文件</span>
        </el-upload>
        <div class="file" v-if="fileName && fileUrl">
            <a class="el-upload-list__item-name" :href="fileUrl"><i
                    class="el-icon-document"></i>{{fileName}}
            </a>
        </div>
    </div>
</template>
<script>
    export default {
        // 声明 props
        props: {
            url: String
        },
        data() {
            var that = this
            return {
                data: null,
                fileName: '',
                fileUrl: '',
                formData: {
                    token: '',
                    key: ''
                }
            }
        },
        watch: {
            data: function () {
                this.fileUrl = this.data || ''
                this.fileName = this.fileUrl.replace(/^.*\//, '')
                this.$emit('change', this.fileUrl)
            }
        },
        methods: {
            uploadSuccess(res) {
                var that = this
                if (res) {
                    that.fileName = res.key
                    that.fileUrl = 'http://cloud.ininin.com/' + res.key
                    that.$emit('change', that.fileUrl || '')
                }
            },
            beforeUpload(file) {
                //const isImg = /^image\/\w+$/i.test(file.type);
                const isLt2M = file.size / 1024 / 1024 < 100;

                /*if (!isImg) {
                    this.$message.error('只能上传 JPG、PNG、GIF 格式!');
                }*/
                var fileName = file.name
                var extIdx = fileName.lastIndexOf('.')
                var fileExt = extIdx >= 0 ? fileName.slice(extIdx) : ''
                this.$refs.upload.data.key = this.md5(new Date().getTime().toString() + Math.random()) + fileExt
                if (!isLt2M) {
                    this.$message.error('只能上传不超过100MB的文件!');
                }
                return isLt2M//isJPG && isLt2M;
            },
            getUploadToken() {
                var that = this
                that.formData.token = that.Cookies.get('upload_token')
                if (!that.formData.token) {
                    that.$http.get('in_token/get_token').then(function (res) {
                        // success callback
                        console.log(res)
                        if (res.succeed) {
                            var data = res.body || {}
                            that.formData.token = data.Token || ''
                            that.Cookies.set('upload_token', that.formData.token, {expires: 0.05, path: '/'})
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
    .file-uploader {
        .el-upload__tip {
            margin-left: 15px;
        }
    }
</style>