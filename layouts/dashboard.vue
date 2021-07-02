<template>
  <b-container fluid="2xl" class="d-lg-flex vh-100 px-0">
    <sidebar id="sidebar" right-border>
      <app-menu></app-menu>
    </sidebar>

    <main class="flex-grow-1 of-y-auto">
      <b-navbar toggleable="lg" type="light" class="navbar-h border-bottom">
        <b-navbar-toggle target="sidebar"></b-navbar-toggle>

        <b-list-group horizontal class="navbar-nav ml-auto">
          <b-list-group-item class="border-0"> Document </b-list-group-item>
          <b-list-group-item class="border-0"> Feedback </b-list-group-item>
          <b-list-group-item class="border-0"> User </b-list-group-item>
        </b-list-group>
      </b-navbar>

      <b-container fluid>
        <nuxt></nuxt>
      </b-container>
    </main>
  </b-container>
</template>

<script>
export default {
  name: 'Dashboard',

  head() {
    return {
      // title: this.$appName,
    }
  },
}
</script>
