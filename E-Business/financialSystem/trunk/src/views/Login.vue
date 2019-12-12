<template>
    <div id="app" class="login" @keyup.enter="login">
        <div class="login-box">
            <el-form :model="form" :rules="rules" ref="form" class="login-form">
                <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="10">
                        <div class="logo">
                            <img src="../assets/logo/login.png"/>
                        </div>
                    </el-col>
                    <el-col :xs="13" :sm="13" :md="13" :lg="13">
                        <div class="head-title">云印财务管理系统</div>
                        <el-form-item prop="account">
                            <el-input type="text" v-model="form.account" auto-complete="off"
                                      placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="form.password" auto-complete="off"
                                      placeholder="请输入登录密码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="login" :loading="submitting">登 录</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        data() {
            return {
                submitting: false,
                form: {
                    account: '',//'huangwangyang',
                    password: ''//'123456'
                },
                rules: {
                    account: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入登录密码', trigger: 'blur'}
                    ]
                }
            };
        },

        computed: mapGetters({
            auth: 'auth'
        }),

        methods: {
            ...mapActions([
                'setAuth'
            ]),

            login() {
                const that = this
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        that.submitting = true
                        that.$http.post('in_finance/user/login', {
                            userName: that.form.account,
                            password: that.md5(that.form.password)
                        }).then(function (res) {
                            // success callback
                            const data = res.body || {}
                            console.log('login:succeed', data)
                            if (res.succeed) {
                                let user = {}
                                user.nickName = data.nickName
                                user.userName = data.userName
                                /*const roleIds = user.roleIds ? user.roleIds.split(';') : []
                                const roleNames = user.roleName ? user.roleName.split(';') : []*/
                                user.token = data.sid
                                user.roleIds = [10] //roleIds.map(val => parseInt(val, 10))
                                user.roleNames = '财务' //roleNames
                                if (user.token && data.userName/*&& user.roleIds.indexOf(1) >= 0*/) {
                                    user.resourceIds = data.resourceIds || '100'
                                    //保存认证
                                    that.setAuth(user)
                                } else {
                                    that.message.warning(that, '该账号不存在或无权登录此系统！')
                                }
                            } else if (data.result === 1) {
                                that.message.warning(that, '您输入的用户名不存在，请重新输入！')
                            } else if (data.result === 2) {
                                that.message.warning(that, '您输入的密码有误，请重新输入！')
                            } else {
                                that.message.warning(that, data.msg || '该账号不存在或无权登录此系统！')
                            }
                            that.submitting = false
                        }).catch(function (res) {
                            // error callback
                            that.submitting = false
                            that.message.error(that)
                            console.log(res.config && res.config.url, res.response || res.message)
                        })
                    } else {
                        console.log('Failure of form validation!!')
                        return false;
                    }
                })
            }
        }
    }
</script>
<style lang="less">
    .login {
        color: #fff;
        position: fixed;
        width: 100%;
        height: 100%;
        min-height: 480px;
        background: url(../assets/img/login.png) center no-repeat;
        background-size: cover;
        display: table;
        &:before {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            content: '';
            background: rgba(0, 0, 0, .65);
            display: block;
        }
        .login-box {
            display: table-cell;
            vertical-align: middle;
        }

        .login-form {
            width: 80%;
            max-width: 520px;
            min-height: 240px;
            margin: 0 auto;
            padding: 30px 30px 20px;
            background: rgba(0, 0, 0, .65);
            border-radius: 3px;
            box-sizing: border-box;
        }

        .login-form .logo {
            margin: 35px 30px 0 0;
            display: block;
            img {
                max-width: 100%;
            }
        }

        .login-form .head-title {
            font-size: 18px;
            margin: 0 0 15px;
        }

        .login-form button {
            width: 100%
        }

        .login-form .el-input__inner {
            color: #fff;
            background: transparent;
        }
    }
</style>
