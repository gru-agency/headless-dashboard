<template>
  <div>
    <b-navbar type="light" fixed="top" class="bg-light border-bottom px-0">
      <b-container fluid="2xl">
        <b-row no-gutters class="w-100 justify-content-between px-4">
          <b-navbar-nav>
            <b-nav-text class="px-0 px-lg-2">
              <action-link icon-preset="bv-close" variant="secondary" link-to-parent></action-link>
            </b-nav-text>
            <b-nav-text class="px-2 pr-3 pr-lg-5">|</b-nav-text>
            <b-nav-text class="">{{ ui.pageTitle }}</b-nav-text>
          </b-navbar-nav>

          <b-navbar-nav class="flex-row">
            <b-nav-item link-classes="py-1 px-0 px-lg-2">
              <action-button
                size="sm"
                preset="bv-save"
                variant="primary"
                @click="onFormSubmit(true)"
              ></action-button>
            </b-nav-item>
          </b-navbar-nav>
        </b-row>
      </b-container>
    </b-navbar>

    <b-container fluid="2xl" class="main-content">
      <b-row tag="main" align-h="center" class="px-lg-4 py-8">
        <b-col cols="12" lg="6">
          <b-card class="border-0" no-body>
            <box-header :title-text="ui.productTitle"> </box-header>

            <b-card-body>
              <products-form :id="productId" edit-mode @product-submitted="onFormSubmitted"></products-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Create',

  data() {
    return {
      events: {
        products: {
          validate: 'product-validate',
          validated: 'product-validated',
          submit: 'product-submit',
          submitted: 'product-submitted',
          reset: 'product-reset',
          resetted: 'product-resetted',
        },
      },
      ui: {
        pageTitle: this.$t('modules.products.editFormTitle'),
        productTitle: this.$t('modules.products.title'),
      },
      exitImmediately: false,
    }
  },

  head() {
    return {
      title: this.$t('seo.products', { _brand: this.$config.brandName }),
    }
  },

  computed: {
    productId() {
      return this.$route.params.id
    },
  },

  methods: {
    errorHandler(_error) {},

    successHandler(response) {
      if (this.exitImmediately) {
        this.$router.push(this.localePath({ name: 'dashboard-products-id', params: { id: response.id } }))
      }
    },

    onFormSubmitted(success, error, response) {
      success ? this.successHandler(response) : this.errorHandler(error)
    },

    onFormSubmit(exit) {
      this.exitImmediately = exit
      this.$nuxt.$emit(this.events.products.submit)
    },
  },
}
</script>
