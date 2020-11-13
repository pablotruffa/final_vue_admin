<template>
  <div id="app">
    <div id="nav">
      <MainNavBar/>
      <Notification
      v-if="hasContent"
      :title="notify.title"
      :message="notify.message"
      :bClass="notify.bClass"
      @close="clearNotification"
      />
    </div>
    <router-view />
  </div>
</template>

<script>

  import Notification from '@/components/global/Notification.vue';
  import MainNavBar from '@/components/global/MainNavBar.vue';
  
  export default {
    name: 'App',
    components: {Notification,MainNavBar},
    computed: {
      hasContent() {
        let hasContent = this.$store.getters.notification.title != null ? true : false;
        return hasContent;
      },
      notify() {
        return this.$store.getters.notification;
      },

    },
    methods: {
      clearNotification() {
        this.$store.commit('SET_NOTIFICATION_NULL');
      },
    },
    watch: {
      
    }
  }
  
</script>

<style>
</style>
