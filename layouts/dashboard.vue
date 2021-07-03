<template>
  <div>
    <!-- decoration -->
    <div class="w-50 vh-100 position-absolute bg-yingyang -z-1"></div>

    <b-container fluid="2xl" class="d-lg-flex vh-100 px-0">
      <sidebar id="sidebar" right-border>
        <app-menu></app-menu>
      </sidebar>

      <main class="flex-grow-1 of-y-auto bg-white">
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
  </div>
</template>

<script>
export default {
  name: 'Dashboard',

  head() {
    return {
      title: this.$app.brandName,
    }
  },
}
</script>

<style lang="scss" scoped>
.bg-yingyang {
  @media (min-width: 1024px) {
    background-color: #f8f9fa;
  }
}
</style>
