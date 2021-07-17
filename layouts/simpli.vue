<template>
  <div class="bg-light">
    <b-container class="vh-100 bg-fixed-width d-flex flex-column">
      <div class="flex-grow-1"></div>

      <div class="align-self-start py-6 mx-4 px-12">
        <span class="h3 font-weight-bolder"> {{ ui.brand.toLowerCase() }} </span>
      </div>

      <b-row no-gutters class="w-100 align-self-center">
        <b-col cols="12"><nuxt></nuxt></b-col>
      </b-row>

      <ul class="align-self-start py-6 mx-4 px-12 list-unstyled">
        <b-link v-for="menu in menus" :key="menu.label" :href="localePath(menu.link)" class="pr-2">
          {{ menu.label }}
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
      ui: { brand: this.$config.brandName },
      menus: {
        home: { label: `© ${this.$config.brandName}`, link: { name: 'index' } },
        contact: { label: this.$t('general.contact'), link: { name: 'contact' } },
        privacy: { label: this.$t('general.privacy'), link: { name: 'privacy' } },
        terms: { label: this.$t('general.terms'), link: { name: 'terms' } },
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.bg-fixed-width {
  width: 568px;
}
</style>
