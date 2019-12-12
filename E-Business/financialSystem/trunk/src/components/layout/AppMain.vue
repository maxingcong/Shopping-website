<template>
    <section id="appMain" class="app-main">
        <div id="appContent" class="app-content">
            <level-bar></level-bar>
            <transition
                    mode="out-in"
                    enter-active-class="fadeIn"
                    leave-active-class="fadeOut"
                    appear>
                <router-view></router-view>
            </transition>
        </div>
    </section>
</template>

<script>
    import LevelBar from './LevelBar.vue'
    import {mapGetters} from 'vuex'

    export default {
        computed: {
            ...mapGetters({
                sidebar: 'sidebar'
            }),
            hiddenSidebarStyle() {
                return this.sidebar.hidden ? {'padding-left': 0} : null
            }
        },

        components: {
            LevelBar
        }
    }
</script>
<style lang="less">
    .app-main {
        padding: 60px 0 40px 170px;
        min-width: 960px;
        box-sizing: border-box;
    }

    .app-content {
        padding: 0 15px 15px;
    }
</style>