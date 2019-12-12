define("oauth/qrcode", ["base", "tools"], function($, T){
    //APP扫码登陆
    function OAuthQRCode(options){
        this.init();
    }
    OAuthQRCode.prototype = {
        expire: 5*60*1000,
        startTime: 0,
        /*secretKey: "0123456789abcdefghijklmnopqrstuvwxyz",*/
        params: T.getRequest(),
        $quick: $(".qrcode-login-btn"),
        init: function(options){
            var _this = this;
            _this.events();
        },
        /*getToken: function(){
            var _this = this;
            var timestamp = new Date().getTime()||0;
            if(_this.timestamp==timestamp){
                timestamp += 1;
            }
            _this.timestamp = timestamp;
            timestamp = '' + timestamp;
            var token = "";
            for(var i=0; i<16; i++){
                var k = timestamp.charAt(i);
                if(k===''){
                    k = Math.floor(Math.random()*36);
                }
                token += _this.secretKey.charAt(Math.floor(Math.random()*36))||'g';
                token += _this.secretKey.charAt(k)||'o';
            }
            return token;
        },*/
        /**
         * 生成二维码
         * @param $cont
         */
        qrCode: function($cont){
            var _this = this;
            //生成为二维码
            var $qrcode = $(".qr-code", $cont);
            $qrcode.html("");
            T.GET({
                action: "in_user/create_qr_code",
                success: function(data, params){
                    if(data.code){
                        $qrcode.qrcode({
                            width: 150,
                            height: 150,
                            background: "#fff",
                            foreground: "#000",
                            render: T.IS.CVS ? "canvas" : "table",
                            text: "http://m.ininin.com/app/download.html#" + data.code
                            //text: "http://wx.ininin.com/_test/qrcode_login.html?code=" + data.code
                        });
                        console.log("http://wx.ininin.com/_test/qrcode_login.html?code=" + data.code);
                        $(".qr-msg", $cont).show();
                        $(".qr-err", $cont).hide();
                        _this.startTime = new Date().getTime();
                        _this.timing($cont, data.code);
                    }
                }
            });
        },
        /**
         * 检测登陆
         */
        checkLogin: function($cont, code){
            var _this = this;
            T.POST({
                action: "in_user/scan_code_login",
                params: {
                    code: code
                },
                success: function(data, params){
                    T.SetCookie(data, params);
                    if(_this.timeObj){
                        clearTimeout(_this.timeObj);
                    }
                    setTimeout(function(){
                        location.replace(_this.params.backurl||T.DOMAIN.WWW);
                    }, 100);
                },
                failure: function(data, params){
                    if(Number(data.scanFlag)===0){
                        $cont.hide();
                        $cont.siblings(".qrcode-suc").show();
                    }
                }
            });
        },
        /**
         * 轮询任务
         */
        timing: function($cont, code){
            var _this = this;
            if(new Date().getTime() - _this.startTime > _this.expire){
                $(".qr-msg", $cont).hide();
                $(".qr-err", $cont).show();
                if(_this.timeObj){
                    clearTimeout(_this.timeObj);
                }
            }else{
                _this.checkLogin($cont, code);
                _this.timeObj = setTimeout(function(){
                    _this.timing($cont, code);
                }, 3000);
            }
        },
        /**
         * 绑定事件
         */
        events: function(){
            var _this = this;
            _this.$quick.toggle(function(e){
                var $this = $(this).addClass("off"),
                    $cont = $this.siblings(".qrcode-login").show();
                _this.qrCode($cont);
                return false;
            }, function(e){
                var $this = $(this).removeClass("off"),
                    $cont = $this.siblings(".qrcode-login").hide();
                if(_this.timeObj){
                    clearTimeout(_this.timeObj);
                }
                return false;
            });
            $(".qr-refresh").on("click", function(e){
                _this.qrCode($(this).closest(".qrcode-login"));
                return false;
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(OAuthQRCode.prototype);
    return function(options){
        return new OAuthQRCode(options);
    };
});