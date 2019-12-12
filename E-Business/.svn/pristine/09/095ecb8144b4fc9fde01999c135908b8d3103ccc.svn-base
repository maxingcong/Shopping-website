<template>
    <header id="header" class="header">
        <div class="head-right">
            <el-dropdown @command="handleCommand">
                <div class="el-dropdown-link">
                    <span class="user-img fa fa-user-circle-o"></span>
                    <span v-if="auth.userName"
                          class="user-info">您好，{{auth.nickName}}<br/>{{auth.userName}}</span>
                    <i class="fa fa-angle-down"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <!--<el-dropdown-item command="1">修改密码</el-dropdown-item>-->
                    <el-dropdown-item command="2">安全退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="head-left">
            <span class="logo"><img src="~assets/logo/sys.png"/></span><b
                class="sys-name">云印财务管理系统<!--{{version}}-{{pkg.version}}--></b>
        </div>
    </header>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        props: {
            show: Boolean
        },

        data() {
            return {
                //version: window.location.host.indexOf('alpha.') >= 0 ? 'Alpha' : 'Beta'
            }
        },

        computed: mapGetters({
            pkg: 'pkg',
            auth: 'auth'
        }),

        methods: {
            ...mapActions([
                'setAuth'
            ]),

            handleCommand(command) {
                if (command == 1) {
                    //this.dialogFormVisible = true
                } else if (command == 2) {
                    this.logout()
                }
            },

            logout() {
                this.setAuth()
            }
        }
    }
</script>
<style lang="less">
    .header {
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        color: #0487E2;
        border-bottom: 1px solid #f3f3f3;
        box-sizing: border-box;
        overflow: hidden;
        background-color: #fff;
        .head-left {
            .logo {
                display: inline-block;
                vertical-align: top;
                padding: 8px 10px;
                height: 44px;
                overflow: hidden;
                img {
                    height: 100%;
                    vertical-align: top;
                }
            }
            .sys-name {
                font-size: 24px;
                line-height: 60px;
            }
        }

        .head-right {
            padding: 10px 15px;
            float: right;
            .el-dropdown {
            }
            .el-dropdown-link {
                white-space: nowrap;
            }
            .user-img {
                color: #0487E2;
                font-size: 40px;
                display: inline-block;
                vertical-align: middle;
                border-radius: 40px;
            }
            .user-info {
                text-align: right;
                display: inline-block;
                vertical-align: middle;
            }
            .fa-angle-down {
                display: inline-block;
                vertical-align: middle;
            }

        }
    }
</style>