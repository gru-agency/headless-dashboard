<template>
  <b-list-group flush>
    <b-list-group-item class="navbar-h d-flex align-items-center h3 mb-0 font-weight-bold border-0">
      shoplex
    </b-list-group-item>
    <b-list-group-item v-for="i in 10" :key="i" class="border-0">
      Cras justo odio {{ i }}
    </b-list-group-item>
  </b-list-group>
</template>

<script>
export default {
  name: 'AppMenu',
}
</script>
