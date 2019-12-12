/*
 * <?php require_once($_SERVER['DOCUMENT_ROOT'].'/global.php');?>
 */
/*var o = {};
'1:办公用品;2:办公用品;3:耗材;4:名片;5:宣传用品;6:设计费;7:画册;8:运费;9:单页;10:折页;11:手提袋;12:宣传单;13:展架;14:展板;15:旗帜;16:易拉宝;17:KT板;18:标牌;19:广告字;20:信封;21:档案袋;22:不干胶贴;23:卡套;24:纸杯;25:台卡;26:KT板;27:卡牌;28:桌帖;29:横幅;30:立牌;31:海报;32:卡套;33:纸杯;34:台卡;35:KT板;36:卡牌;37:其它'
.split(';').forEach(function (value, i) {
    var vals = value.split(':');
    o[vals[0]] = vals[1]
})*/
define("zh_cn", [], function(){
    var CFG_DB = {
        INVOICE: {//发票
            TYPE: {1: "普通发票（纸质）", 2: "增值税专用发票", 3: "增值税电子普通发票"}//发票类型
            ,TITLE: {1: "个人", 2:"单位"}//发票抬头
            //,CONTENT: {1:"明细", 2:"办公用品", 3:"耗材", 4:"名片", 5:"宣传用品", 6:"设计费", 7:"画册", 8:"运费"}//发票内容
			,CONTENT_SORT: [6,4,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,27,28,29,30,31,38,39,37]
            ,CONTENT: {
                4: "名片",
                6: "设计费",
                7: "画册",
                9: "单页",
                10: "折页",
                11: "手提袋",
                12: "宣传单",
                13: "展架",
                14: "展板",
                15: "旗帜",
                16: "易拉宝",
                17: "KT板",
                18: "标牌",
                19: "广告字",
                20: "信封",
                21: "档案袋",
                22: "不干胶贴",
                23: "卡套",
                24: "纸杯",
                25: "台卡",
                27: "卡牌",
                28: "桌帖",
                29: "横幅",
                30: "立牌",
                31: "海报",
				38: "纸箱",
				39: "飞机盒",
                37: "其它"
            }
            ,STATUS: {Draft:"待审核", NotPass:"审核不通过", Pass:"审核通过"}
        }
        ,TAKEDATE: {//配送时间
            '1': '仅工作日送货（周一至周五）'
            ,'2': '工作日、双休日均可送货（周一至周六）'
        }
        /*,TAKETYPE: {//配送方式
         '1': '第三方物流'
         ,'2': '上门自提'
         }
         ,PAYTYPE: {//支付方式
         '1': '货到付款'
         ,'2': '线上支付'
         }
         ,TAKEADDRESS: [//门店地址
         {address_id: 1, address: '云印深圳海德店 深圳市南山区南山大道1145号万联大厦(南山大道与海德二道交汇处) 400-680-9111', checked: true}
         ,{address_id: 2, address: '云印深圳科兴店 深圳市南山高新区中区科苑路科兴科学园B2栋G34号铺 400-680-9111'}
         ]*/
        /*,CATEGORY: [//'30,29,36,31,33,28,34'
         {id:30, name:'名片'}
         ,{id:29, name:'宣传用品'}
         ,{id:36, name:'画册'}
         ,{id:33, name:'营销卡券'}
         ,{id:28, name:'办公用品'}
         ,{id:37, name:'标牌及广告字'}
         ]*/,
        TAKE_DATE_LIST: [{
            dateId: 1,
            name: "仅工作日送货",
            desc: "（周一至周五）"
        },{
            dateId: 2,
            name: "工作日、双休日均可送货",
            desc: "（周一至周六）"
        }],
        ACCOUNT: {
            0: '现金账户',
            1: '现金券',
            2: '普通账户'
        },
        IMG: {
            package: '<?=IMAGES?>package/750x425.jpg'
            ,design: '<?=IMAGES_DESIGN?>product/750x425.jpg'
        }
    };
    var CFG_TIP = {//通用状态码配置
        10: '您还未登录，请先登录',
        11: '您还未登录，请先登录',
        404: '您访问的资源不存在',
        501: '出现错误了',
        502: '502',
        503: '503'
    };
    var CFG_COM = {
        username: {
            tips: {
                empty: '请填写手机/邮箱',
                minlength: '请填写有效的账户名',
                maxlength: '请填写有效的账户名',
                mismatch: '账户名格式错误',
                error: '账户名格式错误',
                unique: '该账号已被注册'
            },
            show: 'code',
            show_rule: 'mobile',
            rule: 'mobile_email',
            unique: 'in_user/is_only', //{ act: "unique", mod: "MemberFGInfo" }, //唯一性验证
            minlength: 5,
            maxlength: 100,
            required: true
        },
        username_store: {
            tips: {
                empty: '请填写手机/邮箱',
                minlength: '请填写有效的账户名',
                maxlength: '请填写有效的账户名',
                mismatch: '账户名格式错误',
                error: '账户名格式错误',
                unique: '该账号已被注册'
            },
            rule: 'mobile_email',
            unique: 'in_user/is_only', //唯一性验证
            minlength: 5,
            maxlength: 100,
            required: true
        },
        code: {
            rule: 'code',
            tips: {
                empty: '请填写验证码',
                mismatch: '请填写有效的验证码',
                error: '验证码格式错误'
            },
            from: 'username',
            required: true
        },
        password: {
            rule: 'pwd',
            tips: {
                empty: '请填写密码',
                mismatch: '密码不能包含空格',
                minlength: '请填写不少于6位密码',
                maxlength: '请填写不超过16位密码',
                error: '密码格式有误'
            },
            required: true,
            minlength: 6,
            maxlength: 16
        },
        repwd: {
            target: 'password',
            tips: {
                empty: '请再次填写密码',
                same: '两次填写密码不一致',
                error: '密码格式有误'
            },
            rule: 'same',
            required: true
        },
        nick_name: {
            tips: {
                empty: '请填写昵称',
                error: '请填写昵称'
            },
            rule: 'nonempty',
            pattern: /\S+/
        },
        contact: {
            tips: {
                empty: '请填写联系人',
                error: '请填写联系人'
            },
            rule: 'nonempty',
            pattern: /\S+/
        },
        phone: {
            tips: {
                empty: '请填写手机号码',
                mismatch: '请填写正确的手机号码',
                error: '请填写手机号码'
            },
            rule: 'mobile'
        },
        email: {
            tips: {
                empty: '请填写邮箱',
                minlength: '请填写有效的邮箱',
                maxlength: '请填写有效的邮箱',
                mismatch: '邮箱格式错误',
                error: '邮箱格式错误'
            },
            rule: 'email',
            minlength: 5,
            maxlength: 100
        },
        phone_user: {
            tips: {
                empty: '请填写手机号码',
                mismatch: '请填写正确的手机号码',
                error: '请填写手机号码'
            },
            rule: 'mobile'
        },
        email_user: {
            tips: {
                empty: '请填写邮箱',
                minlength: '请填写有效的邮箱',
                maxlength: '请填写有效的邮箱',
                mismatch: '邮箱格式错误',
                error: '邮箱格式错误'
            },
            rule: 'email',
            minlength: 5,
            maxlength: 100
        },
        sex: {
            tips: {
                empty: '请选择性别',
                error: '请选择性别'
            },
            rule: 'nonempty',
            pattern: /\S/
        },
        qq: {
            tips: {
                empty: '请填写QQ',
                mismatch: '请填写正确的QQ',
                error: '请填写QQ'
            },
            rule: 'qq'
        },
        tel: {
            tips: {
                empty: '请填写固定电话',
                mismatch: '请填写正确的固定电话（如：0755-12345678）',
                error: '请填写固定电话'
            },
            rule: 'tel'
        },
        contact_job: {
            tips: {
                empty: '请选择联系人职位',
                error: '请选择联系人职位'
            },
            rule: 'nonempty',
            pattern: /\S/
        },
        ep_name: {
            tips: {
                empty: '请填写企业名称',
                error: '请填写企业名称'
            },
            rule: 'nonempty',
            pattern: /\S+/
        },
        ep_type: {
            tips: {
                empty: '请选择公司行业',
                error: '请选择公司行业'
            },
            rule: 'nonempty',
            pattern: /\S/
        },
        ep_person_sum: {
            tips: {
                empty: '请选择企业人数',
                error: '请选择企业人数'
            },
            rule: 'nonempty',
            pattern: /\S/
        },
        ep_trade: {
            tips: {
                empty: '请选择企业类型',
                error: '请选择企业类型'
            },
            rule: 'nonempty',
            pattern: /\S/
        },
        ep_purpose: {
            tips: {
                empty: '请选择购买产品用途',
                error: '请选择购买产品用途'
            },
            rule: 'nonempty',
            pattern: /\S/
        },
        ep_profile: {
            tips: {
                empty: '请填写企业简介',
                error: '请填写企业简介'
            },
            rule: 'nonempty',
            pattern: /\S/
        },
        ep_logo: {
            tips: {
                empty: '请填上传企业LOGO',
                error: '请填上传企业LOGO'
            },
            rule: 'nonempty',
            pattern: /\S/
        },
        province: {
            tips: {
                empty: '请选择地区',
                error: '请选择地区'
            },
            rule: 'nonempty'
        },
        city: {
            tips: {
                empty: '请选择地区',
                error: '请选择地区'
            },
            rule: 'nonempty'
        },
        area: {
            tips: {
                empty: '请选择地区',
                error: '请选择地区'
            },
            rule: 'nonempty'
        },
        address: {
            tips: {
                empty: '请填写详细地址',
                error: '请填写详细地址'
            },
            rule: 'nonempty',
            pattern: /\S+/
        },
        address_2: {
            tips: {
                empty: '请填写详细地址',
                error: '请填写详细地址'
            },
            rule: 'nonempty',
            pattern: /\S+/,
            required: true
        },
        inviter: {
            tips: {
                empty: '请填写为您服务的商务经理编号',
                error: '',
                mismatch: '商务经理编号格式错误',
                unique: '该编号不存在，请核实清楚后再验证'
            },
            rule: 'inviter',
            unique: 'in_user/check_bd_info' //唯一性验证
        },
        agreement: {
            tips: {
                empty: '请阅读并接受《云印服务协议》',
                error: '请阅读并接受《云印服务协议》'
            },
            required: true,
            rule: 'nonempty',
            pattern: /\S+/
        },
        question: {
            tips: {
                empty: '请选择安全问题',
                error: '请选择安全问题'
            },
            rule: 'nonempty',
            required: true
        },
        answer: {
            tips: {
                empty: '请填写安全答案',
                error: '请填写安全答案'
            },
            rule: 'nonempty',
            required: true
        }
    };
    var CFG_FORM = {//表单验证配置
        register: {
            action: 'in_user/regist', //{ act: "register_org", mod: "MemberFGInfo" },
            items: {
                username: CFG_COM['username'],
                code: CFG_COM['code'],
                password: CFG_COM['password'],
                inviter: CFG_COM['inviter'],
                agreement: CFG_COM['agreement']
            }
        },
        /*register_user: {
         action: 'in_user/regist', //{ act: "register_org", mod: "MemberFGInfo" },
         items: {
         username: CFG_COM['username'],
         code: CFG_COM['code'],
         password: CFG_COM['password'],
         inviter: CFG_COM['inviter'],
         agreement: CFG_COM['agreement']
         }
         },
         register_org: {
         action: 'in_user/regist', //{ act: "register_org", mod: "MemberFGInfo" },
         items: {
         username: CFG_COM['username'],
         code: CFG_COM['code'],
         password: CFG_COM['password'],
         contact: CFG_COM['contact'],
         phone: CFG_COM['phone'],
         email: CFG_COM['email'],
         qq: CFG_COM['qq'],
         tel: CFG_COM['tel'],
         ep_name: CFG_COM['ep_name'],
         ep_type: CFG_COM['ep_type'],
         province: CFG_COM['province'],
         city: CFG_COM['city'],
         area: CFG_COM['area'],
         address: CFG_COM['address'],
         inviter: CFG_COM['inviter'],
         agreement: CFG_COM['agreement']
         }
         },*/
        /*info_user: {
         action: 'in_user/user_update', //{ act: "editUserDetail", mod: "MemberPortal" },
         items: {
         nick_name: CFG_COM['nick_name'],
         phone: CFG_COM['phone_user'],
         email: CFG_COM['email_user'],
         qq: CFG_COM['qq'],
         tel: CFG_COM['tel']
         }
         },*/
        user_info: {
            action: 'in_user/user_update', //{ act: "editUserDetail", mod: "MemberPortal" },
            items: {
                contact: CFG_COM['contact'],
                phone: CFG_COM['phone'],
                /*email: CFG_COM['email'],*/
                qq: CFG_COM['qq'],
                tel: CFG_COM['tel'],
                sex: CFG_COM['sex'],
                contact_job: CFG_COM['contact_job'],
                ep_name: CFG_COM['ep_name'],
                ep_type: CFG_COM['ep_type'],
                ep_trade: CFG_COM['ep_trade'],
                ep_person_sum: CFG_COM['ep_person_sum'],
                ep_purpose: CFG_COM['ep_purpose'],
                province: CFG_COM['province'],
                city: CFG_COM['city'],
                area: CFG_COM['area'],
                address: CFG_COM['address']
            }
        },
        login_bind: {
            action: 'in_user/link_insert',
            items: {
                username: {
                    tips: {
                        empty: '请填写手机/邮箱',
                        minlength: '请填写有效的账户名',
                        maxlength: '请填写有效的账户名',
                        mismatch: '账户名格式错误',
                        error: '账户名格式错误',
                        unique: '该账号已被注册'
                    },
                    rule: 'mobile_email',
                    minlength: 5,
                    maxlength: 100,
                    required: true
                },
                password: {
                    rule: 'pwd',
                    tips: {
                        empty: '请填写密码',
                        mismatch: '密码不能包含空格',
                        minlength: '请填写不少于6位密码',
                        maxlength: '请填写不超过16位密码',
                        error: '密码格式有误'
                    },
                    required: true,
                    minlength: 6,
                    maxlength: 16
                },
                remember: {
                    rule: 'nonempty',
                    tips: {
                        empty: '',
                        error: ''
                    },
                    pattern: /\S/
                }
            }
        },
        forget_email: {
            action: 'in_user/create_code', //{ act: "backPassByEmail", mod: "MemberFGInfo" }, //邮箱找回密码
            items: {
                username: CFG_COM['email']
            }
        },
        forget_mobile: {
            action: 'in_user/check_code', //{ act: "backPassByMobile", mod: "MemberFGInfo" }, //手机找回密码
            items: {
                username: CFG_COM['phone'],
                code: {
                    rule: 'code',
                    tips: {
                        empty: '请填写验证码',
                        mismatch: '请填写有效的验证码',
                        error: '验证码格式错误'
                    },
                    required: true
                }
            }
        },
        setpwd: {
            action: 'in_user/back_passsword', //{ act: "updatePwds", mod: "MemberFGInfo" }, //设置新密码
            items: {
                password: CFG_COM['password'],
                repwd: CFG_COM['repwd']
            }
        },
        forgetpay_email: {
            action: 'in_user/create_code', //{ act: "backPayPwdByEmail", mod: "MemberFGInfo" }, //邮箱找回支付密码
            items: {
                username: CFG_COM['email']
            }
        },
        forgetpay_mobile: {
            action: 'in_user/check_code', //{ act: "backPayPwdByMobile", mod: "MemberFGInfo" }, //手机找回支付密码
            items: {
                //username: CFG_COM['phone'],
                code: {
                    rule: 'code',
                    tips: {
                        empty: '请填写验证码',
                        mismatch: '请填写有效的验证码',
                        error: '验证码格式错误'
                    },
                    required: true
                }
            }
        },
        setnewpaypwd: {
            action: 'in_user/back_passsword', //{ act: "updatePayPwds", mod: "MemberFGInfo" }, //设置新支付密码
            items: {
                password: CFG_COM['password'],
                repwd: CFG_COM['repwd']
            }
        },
        address: {
            action: 'in_user/address_insert', //{ act: "addAddr", mod: "OrderCart" }, //添加/修改地址
            items: {
                address_id: {
                    rule: 'nonempty'
                },
                receiver: {
                    tips: {
                        empty: '请填写收货人姓名',
                        error: '请填写收货人姓名'
                    },
                    rule: 'nonempty',
                    required: true
                },
                province: CFG_COM['province'],
                city: CFG_COM['city'],
                area: CFG_COM['area'],
                address: CFG_COM['address_2'],
                phone: {
                    tips: {
                        empty: '请填写收货人手机号码',
                        mismatch: '请填写正确的手机号码',
                        error: '请填写收货人手机号码'
                    },
                    inherit: 'tel',
                    rule: 'mobile',
                    required: true
                },
                tel: {
                    tips: {
                        empty: '请填写收货人固定电话',
                        mismatch: '请填写正确的固定电话（如：0755-12345678）',
                        error: '请填写收货人固定电话'
                    },
                    inherit: 'phone',
                    rule: 'tel',
                    required: true
                },
                email: {
                    tips: {
                        empty: '请填写邮箱',
                        minlength: '请填写有效的邮箱',
                        maxlength: '请填写有效的邮箱',
                        mismatch: '邮箱格式错误',
                        error: '邮箱格式错误'
                    },
                    rule: 'email',
                    minlength: 5,
                    maxlength: 100
                }
            }
        },
        invoice: {
            action: 'in_invoice/invoice_insert', //{ act: "addInvoice", mod: "OrderCart" }, //添加/修改发票
            items: {
                invoice_id: {
                    rule: 'nonempty'
                },
                invoice_type: {
                    rule: 'nonempty',
                    show: 'company_name|id_code|register_address|register_phone|bank|bank_account',
                    show_pattern: /^2$/,
                    required: true
                },
                title_type: {
                    show: 'invoice_title|company_id_code',
                    show_pattern: /^2$/,
                    rule: 'nonempty'
                },
                invoice_title: {
                    tips: {
                        empty: '请填写单位名称',
                        mismatch: '请填写单位名称',
                        error: '请填写单位名称'
                    },
                    from: 'title_type',
                    rule: 'nonempty'
                },
                company_id_code: {
                    tips: {
                        empty: '请填写纳税人识别号',
                        mismatch: '请填写纳税人识别号',
                        error: '请填写纳税人识别号'
                    },
                    from: 'title_type',
                    rule: 'nonempty'
                },
                company_name: {
                    tips: {
                        empty: '请填写单位名称',
                        mismatch: '请填写单位名称',
                        error: '请填写单位名称'
                    },
                    from: 'invoice_type',
                    rule: 'nonempty',
                    required: true
                },
                id_code: {
                    tips: {
                        empty: '请填写纳税人识别号',
                        mismatch: '请填写纳税人识别号',
                        error: '请填写纳税人识别号'
                    },
                    from: 'invoice_type',
                    rule: 'nonempty',
                    required: true
                },
                register_address: {
                    tips: {
                        empty: '请填写注册地址',
                        mismatch: '请填写注册地址',
                        error: '请填写注册地址'
                    },
                    from: 'invoice_type',
                    rule: 'nonempty',
                    required: true
                },
                register_phone: {
                    tips: {
                        empty: '请填写注册电话',
                        mismatch: '请填写注册电话',
                        error: '请填写注册电话'
                    },
                    from: 'invoice_type',
                    rule: 'nonempty',
                    required: true
                },
                bank: {
                    tips: {
                        empty: '请填写开户银行',
                        mismatch: '请填写开户银行',
                        error: '请填写开户银行'
                    },
                    from: 'invoice_type',
                    rule: 'nonempty',
                    required: true
                },
                bank_account: {
                    tips: {
                        empty: '请填写银行账户',
                        mismatch: '请填写银行账户',
                        error: '请填写银行账户'
                    },
                    from: 'invoice_type',
                    rule: 'nonempty',
                    required: true
                },
                data_path: {
                    tips: {
                        empty: '请上传证明资料',
                        mismatch: '请上传证明资料',
                        error: '请上传证明资料'
                    },
                    rule: 'nonempty'
                },
                content_type: {
                    rule: 'nonempty',
                    required: true,
                    tips: {
                        empty: '请勾选发票内容',
                        mismatch: '请勾选发票内容',
                        error: '请勾选发票内容'
                    }
                }
            }
        },
        apply_invoice: {
            action: 'in_invoice/invoice_order_create',
            items: {
                invoice_id: {
                    tips: {
                        empty: '请填写发票信息！',
                        error: '请填写发票信息！'
                    },
                    rule: 'nonempty',
                    required: true
                },
                invoice_type: {
                    tips: {
                        empty: '请填写发票信息！',
                        error: '请填写发票信息！'
                    },
                    rule: 'nonempty',
                    required: true
                },
                address_id: {
                    tips: {
                        empty: '请填写收货地址！',
                        error: '请填写收货地址！'
                    },
                    rule: 'nonempty',
                    required: true
                },
                invoice_price: {
                    tips: {
                        empty: '请填写发票金额',
                        mismatch: '金额只能是数字',
                        error: '金额只能是数字'
                    },
                    rule: 'nonempty',
                    required: true,
                    pattern: /[0-9]+\.*[0-9]{0,2}/
                }
            }
        },
        order: {
            action: 'in_order/order_create',//{ act: "submitOrder", mod: "OrderCart"} //创建订单
            items: {
                take_address_id: {
                    tips: {
                        empty: '请选择自取门店！',
                        error: '请选择自取门店！'
                    },
                    rule: 'nonempty'
                },
                address_id: {
                    tips: {
                        empty: '请您填写收货人联系方式，以便于商品到达后及时联系您',
                        error: '请您填写收货人联系方式，以便于商品到达后及时联系您'
                    },
                    rule: 'nonempty',
                    required: true
                },
                take_date: {
                    tips: {
                        empty: '请选择配送时间！',
                        error: '请选择配送时间！'
                    },
                    rule: 'nonempty'
                },
                take_id: {
                    tips: {
                        empty: '请选择配送方式！',
                        error: '请选择配送方式！'
                    },
                    rule: 'nonempty',
                    required: true
                },
                pay_id: {
                    tips: {
                        empty: '请选择支付方式！',
                        error: '请选择支付方式！'
                    },
                    rule: 'nonempty',
                    required: true
                },
                invoice_id: {
                    tips: {
                        empty: '请填写发票信息！',
                        error: '请填写发票信息！'
                    },
                    rule: 'nonempty',
                    required: true
                },
                buyer_remark: {
                    noplaceholder: true,
                    tips: {
                        empty: '请填写备注信息',
                        maxlength: '备注信息不得超过200字',
                        error: '请填写备注信息'
                    },
                    rule: 'nonempty',
                    maxlength: 200
                }
            }
        },
        order_package: {
            action: 'in_order/sure_plan_order',//{ act: "submitOrder", mod: "OrderCart"} //创建订单
            items: {
                buyer_remark: {
                    noplaceholder: true,
                    tips: {
                        empty: '请填写备注信息',
                        maxlength: '备注信息不得超过200字',
                        error: '请填写备注信息'
                    },
                    rule: 'nonempty',
                    maxlength: 200
                }
                /*pay_id: {
                 tips: {
                 empty: '请选择支付方式！',
                 error: '请选择支付方式！'
                 },
                 rule: 'nonempty',
                 required: true
                 },
                 invoice_id: {
                 tips: {
                 empty: '请选择发票信息！',
                 error: '请选择发票信息！'
                 },
                 rule: 'nonempty'
                 }*/
            }
        },
        order_design: {
            action: 'in_order/sure_design_order',//{ act: "submitOrder", mod: "OrderCart"} //创建订单
            items: {
                buyer_remark: {
                    noplaceholder: true,
                    tips: {
                        empty: '请填写备注信息',
                        maxlength: '备注信息不得超过200字',
                        error: '请填写备注信息'
                    },
                    rule: 'nonempty',
                    maxlength: 200
                }
                /*pay_id: {
                 tips: {
                 empty: '请选择支付方式！',
                 error: '请选择支付方式！'
                 },
                 rule: 'nonempty',
                 required: true
                 },
                 invoice_id: {
                 tips: {
                 empty: '请选择发票信息！',
                 error: '请选择发票信息！'
                 },
                 rule: 'nonempty'
                 }*/
            }
        },
        set_pwd: {
            action: 'in_user/retrieve_new_password',
            items: {
                new_password: {
                    rule: 'pwd',
                    tips: {
                        empty: '请填写新密码',
                        mismatch: '密码不能包含空格',
                        minlength: '请填写不少于6位密码',
                        maxlength: '请填写不超过16位密码',
                        error: '密码格式有误'
                    },
                    required: true,
                    minlength: 6,
                    maxlength: 16
                },
                renewpwd: {
                    target: 'new_password',
                    tips: {
                        empty: '请再次填写新密码',
                        same: '两次填写密码不一致',
                        error: '密码格式有误'
                    },
                    rule: 'same',
                    required: true
                }
            }
        },
        check_username: {
            action: 'in_user/is_only',
            items: {
               username: {
                   tips: {
                       empty: '请填写手机/邮箱',
                       minlength: '请填写有效的账户名',
                       maxlength: '请填写有效的账户名',
                       mismatch: '账户名格式错误',
                       error: '账户名格式错误'
                   },
                   show: 'code',
                   show_rule: 'mobile',
                   rule: 'mobile_email',
                   minlength: 5,
                   maxlength: 100,
                   required: true
               }
            }
        },
        check_safetips: {
            action: 'in_user/check_pwd_result',
            items: {
                answer1: CFG_COM['answer'],
                answer2: CFG_COM['answer']
            }
        },
        set_safetips: {
            action: 'in_user/bind_pwd_result',
            items: {
                question1: CFG_COM['question'],
                question2: CFG_COM['question'],
                question3: CFG_COM['question'],
                answer1: CFG_COM['answer'],
                answer2: CFG_COM['answer'],
                answer3: CFG_COM['answer']
            }
        },
        login_pwd: {
            action: 'in_user/update_password', //{ act: "updatePwd", mod: "MemberFGInfo" },
            items: {
                old_password: {
                    rule: 'pwd',
                    tips: {
                        empty: '请填写旧密码',
                        mismatch: '密码不能包含空格',
                        minlength: '请填写不少于6位密码',
                        maxlength: '请填写不超过16位密码',
                        error: '密码格式有误'
                    },
                    required: true,
                    minlength: 6,
                    maxlength: 16
                },
                new_password: {
                    rule: 'pwd',
                    tips: {
                        empty: '请填写新密码',
                        mismatch: '密码不能包含空格',
                        minlength: '请填写不少于6位密码',
                        maxlength: '请填写不超过16位密码',
                        error: '密码格式有误'
                    },
                    required: true,
                    minlength: 6,
                    maxlength: 16
                },
                renewpwd: {
                    target: 'new_password',
                    tips: {
                        empty: '请再次填写新密码',
                        same: '两次填写密码不一致',
                        error: '密码格式有误'
                    },
                    rule: 'same',
                    required: true
                }
            }
        },
        setpaypwd: {
            action: 'in_user/update_password', //{ act: "setPayPwd", mod: "MemberFGInfo" },
            items: {
                new_password: {
                    rule: 'pwd',
                    tips: {
                        empty: '请填写支付密码',
                        mismatch: '密码不能包含空格',
                        minlength: '请填写不少于6位密码',
                        maxlength: '请填写不超过16位密码',
                        error: '密码格式有误'
                    },
                    required: true,
                    minlength: 6,
                    maxlength: 16
                },
                renewpwd: {
                    target: 'new_password',
                    tips: {
                        empty: '请再次填写支付密码',
                        same: '两次填写密码不一致',
                        error: '密码格式有误'
                    },
                    rule: 'same',
                    required: true
                }
            }
        },
        pay_pwd: {
            action: 'in_user/update_password', //{ act: "updatePayPwd", mod: "MemberFGInfo" },
            items: {
                old_password: {
                    rule: 'pwd',
                    tips: {
                        empty: '请填写旧密码',
                        mismatch: '密码不能包含空格',
                        minlength: '请填写不少于6位密码',
                        maxlength: '请填写不超过16位密码',
                        error: '密码格式有误'
                    },
                    required: true,
                    minlength: 6,
                    maxlength: 16
                },
                new_password: {
                    rule: 'pwd',
                    tips: {
                        empty: '请填写新密码',
                        mismatch: '密码不能包含空格',
                        minlength: '请填写不少于6位密码',
                        maxlength: '请填写不超过16位密码',
                        error: '密码格式有误'
                    },
                    required: true,
                    minlength: 6,
                    maxlength: 16
                },
                renewpwd: {
                    target: 'new_password',
                    tips: {
                        empty: '请再次填写新密码',
                        same: '两次填写密码不一致',
                        error: '密码格式有误'
                    },
                    rule: 'same',
                    required: true
                }
            }
        },
        pdetail: {
            action: 'in_order/cart_add',//{ act: "goToCart", mod: "OrderCart" },      //goToCart，加入购物车
            prevent: true,
            //buynow: { act: "goToCart", mod: "OrderCart", param: { ytack: "" + new Date().getTime()} },    //Buy now，立即购买
            items: {
                pnum: {
                    tips: {
                        empty: '请输入数量',
                        type: '文件数只能是数字',
                        mismatch: '文件数只能是数字',
                        error: '请输入数量',
                        min: '文件数不能小于1',
                        max: '文件数不能大于1000000'
                    },
                    rule: 'number',
                    required: true,
                    min: 1,
                    max: 1000000
                }
            }
        },
        album: {
            action: 'in_order/cart_add',//{ act: "goToCart", mod: "OrderCart" },      //goToCart，加入购物车
            prevent: true,
            //buynow: { act: "goToCart", mod: "OrderCart", param: { ytack: "" + new Date().getTime()} },    //Buy now，立即购买
            items: {}
        },
        custom: {
            action: 'in_order/cart_add',//{ act: "goToCart", mod: "OrderCart" },      //goToCart，加入购物车
            prevent: true,
            items: {
                name: {
                    tips: {
                        empty: '请填写产品名称',
                        mismatch: '请填写产品名称',
                        error: '请填写产品名称'
                    },
                    rule: 'nonempty',
                    required: true
                },
                number: {
                    tips: {
                        empty: '请填写产品数量',
                        mismatch: '请填写正确格式的产品数量',
                        error: '请填写产品数量'
                    },
                    rule: 'nonempty',
                    pattern: /^[0-9]{1,10}[\u4e00-\u9fa5]{1}$/,
                    required: true
                },
                material: {
                    tips: {
                        empty: '请填写产品材质',
                        mismatch: '请填写产品材质',
                        error: '请填写产品材质'
                    },
                    rule: 'nonempty'
                },
                size_h: {
                    tips: {
                        empty: '请填写尺寸',
                        type: '尺寸只能是数字',
                        mismatch: '请填写尺寸',
                        error: '请填写尺寸',
                        min: '尺寸不能小于1',
                        max: '尺寸不能大于10000000'
                    },
                    rule: /^\d+(\.\d+)?$/,
                    depend: 'size_v',
                    min: 1,
                    max: 10000000
                },
                size_v: {
                    tips: {
                        empty: '请填写尺寸',
                        type: '尺寸只能是数字',
                        mismatch: '请填写尺寸',
                        error: '请填写尺寸',
                        min: '尺寸不能小于1',
                        max: '尺寸不能大于10000000'
                    },
                    rule: /^\d+(\.\d+)?$/,
                    depend: 'size_h',
                    min: 1,
                    max: 10000000
                },
                remark: {
                    tips: {
                        empty: '请填写其他备注信息',
                        maxlength: '其他备注信息不得超过1000字',
                        mismatch: '请填写其他备注信息',
                        error: '请填写其他备注信息'
                    },
                    rule: 'nonempty',
                    maxlength: 1000
                }
            }
        },
        mycart: {
            items: {
                cid: {
                    tips: {
                        empty: '请至少选择一项商品！',
                        error: '请至少选择一项商品！'
                    },
                    rule: 'nonempty',
                    required: true
                }
            }
        },
        recharge: {
            action: 'in_order/create_recharge',
            items: {
                amount: {
                    tips: {
                        empty: '请填写充值金额',
                        mismatch: '金额只能是数字',
                        error: '金额只能是数字'
                    },
                    rule: 'nonempty',
                    required: true,
                    pattern: /[0-9]+\.*[0-9]{0,2}/
                },
                pay_type: {
                    rule: 'nonempty',
                    tips: {
                        empty: '请选择支付类型',
                        mismatch: '请选择支付类型',
                        error: '请选择支付类型'
                    },
                    required: true
                }/*,
                 bank_id: {
                 rule: 'nonempty',
                 tips: {
                 empty: '请选择银行卡',
                 mismatch: '请选择银行卡',
                 error: '请选择银行卡'
                 },
                 required: true
                 }*/
            }
        },
        feedback: {
            action: 'in_feedback/insert_user_feedback',//{ act: "feedback", mod: "ProsceniumMember" },
            items: {
                feedback_content: {
                    rule: 'nonempty',
                    tips: {
                        //empty: '请写下您的意见建议，无论网站体验、产品质量还是售前售后服务，我们一定会仔细阅读并反馈。'
                        empty:'请写下您的意见建议'
                    },
                    required: true
                },
                contact_information: {
                    rule: 'nonempty',
                    tips: {
                        empty: '请输入您的联系方式'
                    }
                },
                real_name: {
                    rule: 'nonempty',
                    tips: {
                        empty: '请输入您的姓名'
                    }
                }
            }
        },
        store_payment: {
            action: 'in_payment/create_direct_pay',//'in_order/create_direct_pay'
            items: {
                store_money: {
                    tips: {
                        empty: '请填写充值金额',
                        mismatch: '金额只能是数字',
                        error: '金额只能是数字'
                    },
                    rule: 'nonempty',
                    required: true,
                    pattern: /[0-9]+\.*[0-9]{0,2}/
                },
                store_name: {
                    tips: {
                        empty: '请填写门店账号',
                        minlength: '请填写有效的门店账号',
                        maxlength: '请填写有效的门店账号',
                        mismatch: '账户名格式错误',
                        error: '门店账号格式错误'
                    },
                    rule: 'mobile_email',
                    minlength: 5,
                    maxlength: 100,
                    required: true
                },
                store_pwd: {
                    rule: 'pwd',
                    tips: {
                        empty: '请填写密码',
                        mismatch: '密码不能包含空格',
                        minlength: '请填写不少于6位密码',
                        maxlength: '请填写不超过16位密码',
                        error: '密码格式有误'
                    },
                    required: true,
                    minlength: 6,
                    maxlength: 16
                }
            }
        }
    };
    window.CFG_DB = CFG_DB;
    window.CFG_TIP = CFG_TIP;
    window.CFG_COM = CFG_COM;
    window.CFG_FORM = CFG_FORM;
});