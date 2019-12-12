<template>
    <div :id="id"></div>
</template>
<script>
    import WangEditor from 'wangeditor'

    export default {
        // 声明 props
        props: {
            'id': {
                type: String,
                default: 'wangEditor'
            }
        },
        data() {
            var that = this
            return {
                upToken: ''
            }
        },
        methods: {
            getContent(isText) {
                var that = this
                return that.editor ? (isText ? that.editor.txt.text() : that.editor.txt.html()) : ''
            },
            getUpToken(callback) {
                var that = this;
                var upToken = that.Cookies.get('upload_token')
                if (upToken) {
                    if (callback) callback(upToken)
                } else {
                    that.$http.get('in_token/get_token').then(function (res) {
                        // success callback
                        console.log(res)
                        if (res.succeed) {
                            upToken = res.body.Token || ''
                            if (upToken) {
                                that.Cookies.set('upload_token', upToken, {expires: 0.05, path: '/'})
                            }
                            if (callback) callback(upToken)
                        } else {
                            that.message.error(that, res.body.msg || '获取上传凭证失败，请尝试刷新页面。')
                        }
                    }, function (res) {
                        // error callback
                        console.log(res)
                        that.message.error(that)
                    })
                }
            },
            // 初始化七牛上传的方法
            uploadInit(upToken) {
                var that = this
                // 获取相关 DOM 节点的 ID
                var btnId = that.editor.imgMenuId;
                var containerId = that.editor.toolbarElemId;
                var textElemId = that.editor.textElemId;

                // 创建上传对象
                var uploader = window.Qiniu.uploader({
                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                    browse_button: btnId,       //上传选择的点选按钮，**必需**
                    //uptoken_url: 'http://action.ininin.com/in_token/get_token',
                    //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                    uptoken: upToken,//'<Your upload token>',
                    //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    // unique_names: true,
                    // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
                    // save_key: true,
                    // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
                    domain: 'http://cloud.ininin.com/',
                    //bucket 域名，下载资源时用到，**必需**
                    container: containerId,           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '2mb',           //最大文件体积限制
                    // flash_swf_url: '../js/plupload/Moxie.swf',  //引入flash,相对路径
                    filters: {
                        mime_types: [
                            //只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
                            {title: "图片文件", extensions: "jpg,gif,png,bmp"}
                        ]
                    },
                    max_retries: 3,                   //上传失败最大重试次数
                    dragdrop: true,                   //开启可拖曳上传
                    drop_element: textElemId,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    init: {
                        'FilesAdded': function (up, files) {
                            window.plupload.each(files, function (file) {
                                // 文件添加进队列后,处理相关的事情
                                console.log('on FilesAdded');
                            });
                        },
                        'BeforeUpload': function (up, file) {
                            // 每个文件上传前,处理相关的事情
                            console.log('on BeforeUpload');
                        },
                        'UploadProgress': function (up, file) {
                            // 显示进度
                            console.log('进度 ' + file.percent)
                        },
                        'FileUploaded': function (up, file, info) {
                            // 每个文件上传成功后,处理相关的事情
                            // 其中 info 是文件上传成功后，服务端返回的json，形式如
                            // {
                            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                            //    "key": "gogopher.jpg"
                            //  }
                            console.log(info);
                            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                            var domain = up.getOption('domain');
                            var res = JSON.parse(info.response);
                            var sourceLink = domain + res.key; //获取上传成功后的文件的Url

                            console.log(sourceLink);

                            // 插入图片到editor
                            that.editor.cmd.do('insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>')
                        },
                        'Error': function (up, err, errTip) {
                            //上传出错时,处理相关的事情
                            console.log('on Error');
                        },
                        'UploadComplete': function () {
                            //队列文件处理完毕后,处理相关的事情
                            console.log('on UploadComplete');
                        }
                        // Key 函数如果有需要自行配置，无特殊需要请注释
                        //,
                        // 'Key': function(up, file) {
                        //     // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        //     // 该配置必须要在 unique_names: false , save_key: false 时才生效
                        //     var key = "";
                        //     // do something with key here
                        //     return key
                        // }
                    }
                    // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
                    // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
                });
            },
            create(content) {
                var that = this
                if (!that.editor) {
                    that.id = that.id || that.md5(new Date().getTime().toString() + Math.random())
                    that.editor = new WangEditor('#' + that.id)
                    // 自定义菜单配置
                    that.editor.customConfig.menus = [
                        'head',  // 标题
                        'bold',  // 粗体
                        'italic',  // 斜体
                        'underline',  // 下划线
                        'strikeThrough',  // 删除线
                        'foreColor',  // 文字颜色
                        'backColor',  // 背景颜色
                        'link',  // 插入链接
                        'list',  // 列表
                        'justify',  // 对齐方式
                        'quote',  // 引用
                        //'emoticon',  // 表情
                        'image',  // 插入图片
                        'table',  // 表格
                        //'video',  // 插入视频
                        //'code',  // 插入代码
                        'undo',  // 撤销
                        'redo'  // 重复
                    ];
                    that.editor.create()
                }
                that.editor.txt.html(content || '')
                that.getUpToken(that.uploadInit)
            }
        }
    }
</script>