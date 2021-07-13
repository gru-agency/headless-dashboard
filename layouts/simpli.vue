<template>
  <div class="bg-light">
    <b-container class="vh-100 bg-fixed-width d-flex flex-column">
      <div class="flex-grow-1"></div>

      <div class="align-self-start py-4 mx-4 px-3">
        <span class="h3 font-weight-bolder"> {{ ui.brandName }} </span>
      </div>

      <b-row class="w-100 align-self-center">
        <b-col cols="12"><nuxt></nuxt></b-col>
      </b-row>

      <ul class="align-self-start py-4 mx-4 px-3 list-unstyled">
        <b-link v-for="item in menus" :key="item.label" :href="item.link" class="pr-2">
          {{ item.label }}
        </b-link>
      </ul>

      <div class="flex-grow-1"></div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Simpli',

  data() {
    return {
      ui: { brandName: this.$app.brandName.toLowerCase() },
      menus: {
        home: { label: '© ' + this.$app.brandName, link: this.localePath('/') },
        contact: { label: this.$t('general.contact'), link: this.localePath('/contact') },
        privacy: { label: this.$t('general.privacy'), link: this.localePath('/privacy') },
        terms: { label: this.$t('general.terms'), link: this.localePath('/terms') },
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.bg-fixed-width {
  width: 550px;
}
</style>
