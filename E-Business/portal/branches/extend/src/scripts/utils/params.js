"use strict";
/**
 * @fileOverview 日期操作类
 */
define("utils/params", ["utils/base"], function(Base){
    /**
     * 日期操作类
     * @summary 日期操作类
     * @namespace Utils.Date
     * @author Woo
     * @version 1.1
     * @since 2016/2/24
     */
    /*
     * http://www.oschina.net/code/snippet_257704_50496#73684
     *功能：对url加密算法（只针对window.location.href跳转，不针对post表单提交及ajax方式）
     *算法：对于暴露在浏览器地址栏中的属性值进行加密，如一个属性为agentID=1，
     *     若对1加密后为k230101io934jksd32r4，说明如下：
     *     前三位为随机数；
     *     第四到第五位为要加密字符转换成16进制的位数，
     *       如：要加密字符为15转换成16进制为f，位数为1，则第四、五位为01；
     *     第六位标识要加密字符为何种字符，0：纯数字，1：字符
     *       若是字符和数字的混合，则不加密；
     *     从第七位开始为16进制转换后的字符（字母和非数字先转换成asc码）；
     *     若加密后的字符总位数不足20位，则用随机数补齐到20位，若超出20位，则不加随机数。
     *     即加密后总位数至少为20位。
     */

    return {
        encode16: function(str){
            //str = str.toLowerCase();
            if (str.match(/^[-+]?\d*$/) == null){//非整数字符，对每一个字符都转换成16进制，然后拼接
                var s = str.split("");
                var temp="";
                for(var i=0;i<s.length;i++){
                    s[i] = s[i].charCodeAt(0);//先转换成Unicode编码
                    s[i] = s[i].toString(16);
                    temp = temp + s[i];
                }
                return temp+","+1;//1代表字符
            }else{//数字直接转换成16进制
                str = parseInt(str).toString(16);
            }
            return str+","+0;//0代表纯数字
        },
        produceRandom: function (n){
            var num="";
            for(var i=0;i<n;i++){
                num += Math.floor(Math.random()*10);
            }
            return num;
        },
        encode: function(str){ //主加密函数
            var encryptStr="";//最终返回的加密后的字符串
            encryptStr += this.produceRandom(3);//产生3位随机数

            var temp = this.encode16(str).split(",");//对要加密的字符转换成16进制
            var numLength = temp[0].length;//转换后的字符长度
            numLength = numLength.toString(16);//字符长度换算成16进制
            if(numLength.length==1){//如果是1，补一个0
                numLength = "0"+numLength;
            }else if(numLength.length>2){//转换后的16进制字符长度如果大于2位数，则返回，不支持
                return "";
            }
            encryptStr += numLength;

            if(temp[1]=="0"){
                encryptStr += 0;
            }else if(temp[1]=="1"){
                encryptStr += 1;
            }

            encryptStr += temp[0];

            if(encryptStr.length<20){//如果小于20位，补上随机数
                encryptStr += this.produceRandom(20-encryptStr.length);
            }
            return encryptStr;
        },
        decode: function (str) {
            if(str!=null && str!=="" && String(str).length>=20){
                var charLength = str.substring(3, 5);//加密后的字符有多少位
                var charLen = parseInt(charLength, 16);//转换成10进制
                var type = parseInt(str.substring(5, 6), 10);//加密字符的类型（0：数字，1：字符串）
                var valueEnc = str.substring(6, 6+charLen);//16进制字符串
                if(type==0){
                    var trueValue = parseInt(valueEnc, 16);
                    return String.fromCharCode(trueValue);
                }else{
                    var ret = "";
                    var valueEncArray=valueEnc.split("");
                    for(var i=0;i<valueEncArray.length;i+=2){
                        var value10 = parseInt(valueEncArray[i]+valueEncArray[i+1], 16);//转换成10进制的asc码
                        ret += String.fromCharCode(value10);//asc码转换成字符
                    }
                    return ret;
                }
            }
        }
    };
});