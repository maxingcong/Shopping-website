<template>
    <div id="app" class="app">
        <template v-if="auth.token">
            <header-bar></header-bar>
            <sidebar></sidebar>
            <app-main></app-main>
            <footer-bar></footer-bar>
        </template>
        <template v-else>
            <login></login>
        </template>
    </div>
</template>

<script>
    import HeaderBar from './components/layout/HeaderBar'
    import Sidebar from './components/layout/Sidebar'
    import AppMain from './components/layout/AppMain'
    import FooterBar from './components/layout/FooterBar'
    import Login from './views/Login'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        components: {
            HeaderBar, Sidebar, AppMain, FooterBar, Login
        },

        beforeMount() {
        },

        computed: mapGetters({
            auth: 'auth'
        }),

        methods: {}
    }
</script>