require(["base", "tools", "uploader"], function ($, T, Uploader) {
    var Editor = window.wangEditor
    console.log(T.JSON.stringify(T.Browser))
    var app = {
        path: '',
        entry: false, //是否已点击我的大赛和我要报名
        $entry: $("#entry"),
        thumbnail: '?imageMogr2/thumbnail/!120x120r/auto-orient/gravity/Center/crop/120x120',
        images: [],
        workFile: '',
        data: {work: {}},
        workTypeList: [{k: 1, v: '祥恒杯“真题真做”'},
            {k: 2, v: '电商包装'},
            {k: 3, v: '快销产品包装'},
            {k: 4, v: '工业产品包装'},
            {k: 5, v: '零售展示包装'},
            {k: 6, v: '电器包装'},
            {k: 7, v: '农产品包装'},
            {k: 8, v: '智能包装'},
            {k: 9, v: '其他'}],
        init: function () {
            var that = this
            //var w = $("#home .article").width(), h = w / 720 * 250
            that.loadPage();
            that.events();
            if (T._LOGED) {
                $(".nav-right .login-after").addClass("shw")
            } else {
                $(".nav-right .login-before").addClass("shw")
            }
            /*$("#home .slide-panel").width(w).height(h)
            $("#home .slide-item").width(w).height(h)
            T.Slider({
                cont: "#banner",
                duration: 600,
                interval: 3000,
                direction: "lr",
                autoplay: true
            });*/
            that.query()
            that.queryNews()
            that.queryTopic()
            that.queryReview(1)
            that.queryReview(2)
            that.queryAwards(1)
            that.queryAwards(2)
            that.queryConfig()
        },
        loadPage: function () {
            var that = this
            that.path = location.hash
            var sidebarPath = that.path.replace(/\d+$/, '').replace(/\/|\$/g, '')
            var $page = $(sidebarPath)
            $("#sidebar a").removeClass("sel").parent().siblings("li").removeClass("sel")
            if ((/^#[a-z]+$/.test(that.path) || /^#about|awardsList/.test(sidebarPath)) && $page && $page.length === 1) {
                $("#sidebar a[href='" + sidebarPath + "']").addClass("sel").parent().addClass("sel")
                $page.show().siblings(".content").hide()
                $("#header .anchor").html($(".anchor", $page).html())
                if ($page.attr("id") === "home" || $page.attr("id") === "proposition") {
                    $(".article", $page).hide().first().show()
                }
                that.pageScroll(0)
            } else {
                if (/^#home\/news\/\$\d+$/.test(location.hash)) {
                    $("#home .article").hide().last().show()
                    that.queryNews(location.hash.replace(/^#home\/news\/\$/, ''))
                } else if (/^#proposition\/\$\d+$/.test(location.hash)) {
                    $("#proposition .article").hide().last().show()
                    that.queryTopic(location.hash.replace(/^#proposition\/\$/, ''))
                } else {
                    location.hash = '#home'
                }
            }
            $("#header a[href='" + that.path + "']").addClass("sel").siblings("a").removeClass("sel")
            var $anchor = $(that.path)
            if ($anchor && $anchor.length === 1) {
                that.pageScroll($anchor.offset().top - 180)
            }
            if (that.path === '#entry') {
                if (!T._LOGED) {
                    T.alt('您尚未登录云印账户！', function (o) {
                        o.remove();
                        location.replace($("#login").attr("href"))
                    });
                    return
                }
                if (that.data.userCode) {
                    $(".article:eq(1)", that.$entry).show().siblings(".article").hide();
                } else {
                    $(".article:eq(0)", that.$entry).show().siblings(".article").hide();
                }
                if ($("[name='agreement']")[0].checked) {
                    $("#nextStep").removeClass("btn-dis")
                } else {
                    $("#nextStep").addClass("btn-dis")
                }
                if (!that.entry) {
                    that.entry = true
                    that.data.workTypeList = that.workTypeList
                    $("#entryForm").html(T.Compiler.template("entryFormTpl", that.data))
                    if (!$.trim($("#phone").val())) {
                        if (T.RE.mobile.test(T._ACCOUNT)) {
                            $("#phone").val(T._ACCOUNT)
                        }
                    }
                    if (!$.trim($("#email").val())) {
                        if (!T.RE.mobile.test(T._ACCOUNT)) {
                            $("#email").val(T._ACCOUNT)
                        }
                    }
                    if (that.data.userCode) {

                        that.bindUploadImage()
                        that.bindUploadFile()
                        /*if (T.Browser.ie >= 10 || !T.Browser.ie) {
                            $("#editor").show()
                            $("#designConcept").hide().removeClass("form-input")
                            that.editor = new Editor('#editor')
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
                            that.editor.txt.html(that.data.work.designConcept || '')
                            that.editorUploadImage()
                        } else {*/
                        $("#editor").hide()
                        $("#designConcept").show().parent().addClass("form-input").val(that.data.work.designConcept)
                        T.FORM().placeholder(T.DOM.byId('designConcept'), "* 请填写设计理念");
                        //}
                    }
                    T.FORM().placeholder(T.DOM.byId('contestName'), "* 如是团队报名，姓名请以空格分开");
                    //T.FORM().placeholder(T.DOM.byId('code'), "* 请填写手机验证码");
                    T.FORM().placeholder(T.DOM.byId('schoolName'), "* 请填写高校名称");
                    T.FORM().placeholder(T.DOM.byId('major'), "* 请填写专业名称");
                    T.FORM().placeholder(T.DOM.byId('instructor'), "* 请填写指导教师");
                    T.FORM().placeholder(T.DOM.byId('phone'), "* 请填写联系手机");
                    T.FORM().placeholder(T.DOM.byId('email'), "* 请填写联系邮箱");
                    T.FORM().placeholder(T.DOM.byId('qq'), "* 请填写联系QQ");
                    T.FORM().placeholder(T.DOM.byId('workName'), "* 请填写作品名称");
                }
            }
        },
        pageScroll: function (height) {
            height = height || 0
            $("html, body").stop(true, true).animate({scrollTop: height}, 120);
        },
        /*editorUploadImage: function () {
            var that = this
            that.uploader = Uploader({
                spaceLimit: false,
                containerId: that.editor.toolbarElemId,
                dropElementId: that.editor.textElemId,
                inputId: that.editor.imgMenuId,
                multi: true,
                sizeLimit: '2MB',
                queueSizeLimit: 5,
                text: "选择图片",
                text2: "选择图片",
                type: "jpg,jpeg,png,gif",
                /!*onSelect: function () {
                },
                onComplete: function (params) {

                },*!/
                onSuccess: function (params) {
                    if (params.fileUri) {
                        // 插入图片到editor
                        that.editor.cmd.do('insertHtml', '<img src="' + params.fileUri + '" style="max-width:100%;"/>')
                    }
                }
            });
        },*/
        bindUploadImage: function () {
            var that = this
            var $upload = $("#uploadImage").parent()
            var images = String(that.data.work.workPic || '')
            if (images.length > 10) {
                T.each(images.split(';'), function (i, workPic) {
                    that.images.push(workPic)
                    $upload.before('<div class="upload-image"><img src="' + workPic + that.thumbnail + '"/><i class="del"></i></div>')
                })
                that.images = images.split(';');
            }
            that.uploader = Uploader({
                spaceLimit: false,
                inputId: "uploadImage",
                multi: true,
                sizeLimit: '2MB',
                queueSizeLimit: 5,
                text: "选择图片",
                text2: "选择图片",
                type: "jpg,jpeg,png",
                /*onSelect: function () {
                },
                onComplete: function (params) {

                },*/
                onSuccess: function (params) {
                    console.log('images:', that.images.length)
                    if (params.fileUri && that.images.length < 8) {
                        that.images.push(params.fileUri)
                        $upload.before('<div class="upload-image"><img src="' + params.fileUri + that.thumbnail + '"/><i class="del"></i></div>')
                    }
                    if (that.images.length < 8) {
                        $upload.show()
                    } else {
                        $upload.hide()
                    }
                }
            });
        },
        bindUploadFile: function () {
            var that = this
            var workFile = that.data.work.workFile || ''
            if (workFile) {
                var workName = workFile.slice(24)
                var html = '<ul class="clearfix row-single file-uploaded"><li class="file-name ellipsis" title="' + workName + '"><a href="' + workFile + '" target="_blank" title="' + workName + '">' + workName + '</a></li></ul></div>'
                $("#uploadFile-info").html(html)
                that.workFile = workFile
            }
            that.uploadFile = Uploader({
                spaceLimit: false,
                inputId: "uploadFile",
                multi: false,
                sizeLimit: '200MB',
                text: workFile ? "重新上传作品文件" : "上传作品文件",
                text2: "重新上传作品文件",
                type: "rar,zip,7z",
                uiCfg: {
                    name: true, //是否显示文件名
                    size: true, //是否显示文件大小
                    progress: true, //是否显示上传进度
                    loaded: true, //是否显示已上传
                    speed: true, //是否显示上传速度
                    remove: false //是否显示删除上传完成的文件
                },
                /*onSelect: function () {
                },
                onComplete: function (params) {

                },*/
                onSuccess: function (params) {
                    console.log('workFile:', params.fileUri)
                    if (params.fileUri) {
                        that.workFile = params.fileUri
                    }
                }
            });
        },
        validator: function (add) {
            var that = this
            var data = {}
            var getValue = function (id) {
                return $.trim($("#" + id).val())
            }
            data.contestTypeStr = '1'//(that.data.contestTypeList || []).join(";")
            if (add) {
                var contestName = getValue('contestName')
                if (contestName !== '') {
                    data.nickName = contestName
                } else {
                    T.msg("请填写参赛人姓名")
                    return
                }
                var phone = getValue('phone')
                if (phone !== '' && T.RE.mobile.test(phone)) {
                    data.contact = phone
                } else if (phone && !T.RE.mobile.test(phone)) {
                    T.msg("请填写真实有效的联系手机")
                    return
                } else {
                    T.msg("请填写联系手机")
                    return
                }
                /*var code = getValue('code')
                if (code !== '') {
                    data.code = code
                } else if (code && !T.RE.code.test(code)) {
                    T.msg("请填写有效的手机验证码")
                    return
                } else {
                    T.msg("请填写手机验证码")
                    return
                }*/
                var schoolName = getValue('schoolName')
                if (schoolName !== '') {
                    data.schoolName = schoolName
                } else {
                    T.msg("请填写高校名称")
                    return
                }
                var grade = getValue('grade')
                if (grade !== '') {
                    data.grade = grade
                } else {
                    T.msg("请选择年级")
                    return
                }
                var major = getValue('major')
                if (major !== '') {
                    data.major = major
                } else {
                    T.msg("请填写专业名称")
                    return
                }
                var instructor = getValue('instructor')
                if (instructor !== '') {
                    data.instructor = instructor
                }/* else {
                    T.msg("请填写指导教师")
                    return
                }*/
                var qq = getValue('qq')
                if (qq !== '') {
                    data.qq = qq
                } else {
                    T.msg("请填写联系QQ号")
                    return
                }
                var email = getValue('email')
                if (email !== '' && T.RE.email.test(email)) {
                    data.email = email
                } else if (email && !T.RE.email.test(email)) {
                    T.msg("请填写真实有效的联系邮箱")
                    return
                } else {
                    T.msg("请填写联系邮箱")
                    return
                }
                /*var contestTypeList = []
                $("input[name='contestType']").each(function (i, el) {
                    if (el.checked) {
                        contestTypeList.push(parseInt($.trim(el.value), 10))
                    }
                })
                if (contestTypeList.length > 0) {
                    data.contestTypeStr = contestTypeList.join(";")
                } else {
                    T.msg("请选择参赛类型")
                    return
                }*/
            } else {
                var workName = getValue('workName')
                if (workName !== '') {
                    data.workName = workName
                } else {
                    T.msg("请填写作品名称")
                    return
                }
                var workType = getValue('workType')
                if (workType >= 1) {
                    data.workType = workType
                } else {
                    T.msg("请选择作品类别")
                    return
                }
                if (that.images.length > 0) {
                    data.workPic = that.images.join(';')
                } else {
                    T.msg("请上传作品图片")
                    return
                }
                if (that.workFile !== '') {
                    data.workFile = that.workFile
                } else {
                    T.msg("请上传作品文件")
                    return
                }
                var designConcept = getValue('designConcept')
                /*if (that.editor) {
                    designConcept = that.editor.txt.html()
                    if (designConcept !== '') {
                        data.designConcept = designConcept
                    } else {
                        T.msg("请填写设计理念")
                        return
                    }
                } else {
                    designConcept = getValue('designConcept')*/
                if (designConcept !== '') {
                    data.designConcept = designConcept
                } else {
                    T.msg("请填写设计理念")
                    return
                }
                //}
            }
            return data
        },
        submit: function (params) {
            var that = this
            T.POST({
                action: 'in_competition/contestant/contest',
                params: params,
                success: function (data, params) {
                    if (that.data.userCode) {
                        T.msg("保存成功");
                    } else {
                        T.msg("报名成功");
                        setTimeout(function () {
                            that.query()
                        }, 800)
                    }
                },
                failure: function (data, params) {
                    T.msg(data.msg || T.TIPS.DEF);
                }
            });
        },
        query: function () {
            var that = this
            if (!T._LOGED) return
            T.GET({
                action: 'in_competition/contestant/contestant_work',
                success: function (data, params) {
                    that.entry = false
                    that.data = data.contestant || {}
                    that.data.workList = that.data.workList || []
                    that.data.work = that.data.workList[0] || {}
                    /*that.data.contestTypeList = []
                    that.data.contestTypeText = []
                    if (that.data.workList[0]) {
                        that.data.contestTypeList.push(that.data.workList[0].contestType)
                        that.data.contestTypeText.push(that.data.workList[0].contestTypeText)
                    }
                    if (that.data.workList[1]) {
                        that.data.contestTypeList.push(that.data.workList[1].contestType)
                        that.data.contestTypeText.push(that.data.workList[1].contestTypeText)
                    }
                    that.data.contestTypeText = that.data.contestTypeText.join('，')*/
                    that.data.workTypeList = that.workTypeList
                    $("#entryForm").html(T.Compiler.template("entryFormTpl", that.data))
                    that.loadPage();
                },
                failure: function (data, params) {
                    T.msg(data.msg || T.TIPS.DEF);
                }
            });
        },
        queryNews: function (id) {
            var that = this
            var action = 'list'
            var params = {
                currentPage: 1,
                pageSize: 100
            }
            if (id > 0) {
                action = 'one'
                params.id = id
            }
            T.GET({
                action: 'in_competition/news/' + action,
                params: params,
                success: function (data, params) {
                    if (id > 0) {
                        that.data.newsDetail = data.news || {}
                        $("#newsDetail").html(T.Compiler.template("newsDetailTpl", that.data))
                    } else {
                        that.data.newsList = data.list || []
                        $("#newsList").html(T.Compiler.template("newsListTpl", that.data))
                    }
                },
                failure: function (data, params) {
                    T.msg(data.msg || T.TIPS.DEF);
                }
            });
        },
        queryTopic: function (id) {
            var that = this
            var action = 'list'
            var params = {
                currentPage: 1,
                pageSize: 100
            }
            if (id > 0) {
                action = 'one'
                params.id = id
            }
            T.GET({
                action: 'in_competition/proposition/' + action,
                params: params,
                success: function (data, params) {
                    if (id > 0) {
                        that.data.topicDetail = data.proposition || {}
                        $("#topicDetail").html(T.Compiler.template("topicDetailTpl", that.data))
                    } else {
                        that.data.topicList = data.list || []
                        $("#topicList").html(T.Compiler.template("topicListTpl", that.data))
                    }
                },
                failure: function (data, params) {
                    T.msg(data.msg || T.TIPS.DEF);
                }
            });
        },
        queryReview: function (type) {
            var that = this
            var params = {
                category: type || 1,
                currentPage: 1,
                pageSize: 100
            }
            T.GET({
                action: 'in_competition/reviewer/list',
                params: params,
                success: function (data, params) {
                    data.reviewerList = data.reviewerList || []
                    $("#reviewerList" + type).html(T.Compiler.template("reviewerListTpl", data))
                },
                failure: function (data, params) {
                    T.msg(data.msg || T.TIPS.DEF);
                }
            });
        },
        queryAwards: function (type) {
            var that = this
            var params = {
                awardCategory: type || 1
            }
            T.GET({
                action: 'in_competition/contestant/work/award/list',
                params: params,
                success: function (data, params) {
                    var awardsList = data.awardList || []
                    var obj = {
                        '1': [],
                        '2': [],
                        '3': [],
                        '4': [],
                        '5': [],
                        '50': []
                    }
                    T.each(awardsList, function (i, item) {
                        if (item.workPic) {
                            var imgs = item.workPic.split(';')
                            item.workImg = imgs[0]
                        }
                        item.thumbnail = that.thumbnail;
                        if (obj[item.awardRank]) {
                            obj[item.awardRank].push(item)
                        }
                    })
                    var list = [obj['1'], obj['2'], obj['3'], obj['4'], obj['50']];
                    var awardsEnum = {
                        1: {1: '特等奖', 2: '一等奖', 3: '二等奖', 4: '三等奖', 5: '优秀组织奖'},
                        2: {1: '一等奖', 2: '二等奖', 3: '三等奖'},
                        3: {50: '最佳人气奖'}
                    }
                    if (type == 3) {
                        list.push({
                            awardCategory: type,
                            awardRank: 50,
                            awardRankText: awardsEnum[type][50],
                            thumbnail: that.thumbnail,
                            list: obj['50']
                        });
                    } else {
                        list.push({
                            awardCategory: type,
                            awardRank: 1,
                            awardRankText: awardsEnum[type][1],
                            thumbnail: that.thumbnail,
                            list: obj['1']
                        });
                        list.push({
                            awardCategory: type,
                            awardRank: 2,
                            awardRankText: awardsEnum[type][2],
                            thumbnail: that.thumbnail,
                            list: obj['2']
                        });
                        list.push({
                            awardCategory: type,
                            awardRank: 3,
                            awardRankText: awardsEnum[type][3],
                            thumbnail: that.thumbnail,
                            list: obj['3']
                        });
                        list.push({
                            awardCategory: type,
                            awardRank: 4,
                            awardRankText: awardsEnum[type][4],
                            thumbnail: that.thumbnail,
                            list: obj['4']
                        });
                    }
                    $("#awards" + type).html(T.Compiler.template("awardsListTpl", {
                        awardCategory: type,
                        awardsList: list
                    }));
                    if (type == 2) {
                        that.queryAwards(3);
                    }
                },
                failure: function (data, params) {
                    T.msg(data.msg || T.TIPS.DEF);
                }
            });
        },
        queryConfig: function () {
            var that = this
            T.GET({
                action: 'in_competition/config/query',
                success: function (data, params) {
                },
                failure: function (data, params) {
                    T.msg(data.msg || T.TIPS.DEF);
                }
            });
        },
        events: function () {
            var that = this
            if (window.addEventListener) {
                window.addEventListener('hashchange', function (e) {
                    that.loadPage();
                }, false);
            } else {
                window['onhashchange'] = function (e) {
                    that.loadPage();
                };
            }
            $("#header .nav-right .btn").on("click", function (e) {
                that.loadPage();
            });
            $("[name='agreement']").change(function (e) {
                var input = e.target || e.srcElement
                if (input.checked) {
                    $("#nextStep").removeClass("btn-dis")
                } else {
                    $("#nextStep").addClass("btn-dis")
                }
            });
            $("#nextStep").click(function (e) {
                if ($("[name='agreement']")[0].checked) {
                    $(".article:eq(1)", that.$entry).show().siblings(".article").hide();
                } else {
                    T.msg('请先阅读并愿意遵守大赛赛制');
                }
            });
            $("#entryForm").on("click", "#nowEntry", function (e) {
                var data = that.validator(!that.data.userCode)
                if (data) {
                    that.submit(data)
                }
            }).on("click", ".upload-images .del", function (e) {
                var $this = $(this).parent()
                var src = $("img", $this).attr("src").replace(/\?.+$/, '')
                if (src) {
                    var idx = -1
                    T.each(that.images, function (i, url) {
                        if (url === src) {
                            idx = i
                        }
                    });
                    if (idx >= 0) {
                        that.images.splice(idx, 1)
                        $this.remove()
                    }
                }
            });
        }
    }
    app.init();
});