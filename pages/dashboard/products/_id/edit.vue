<template>
  <div>
    <form-nav-bar :title="ui.pageTitle">
      <template #nav-end>
        <b-nav-item link-classes="py-1 px-0 px-lg-2">
          <action-button
            size="sm"
            preset="bv-save"
            variant="primary"
            @click="onFormSubmit(true)"
          ></action-button>
        </b-nav-item>
      </template>
    </form-nav-bar>

    <b-container fluid="2xl" class="main-content">
      <b-row tag="main" align-h="center" class="px-lg-4 py-8">
        <b-col cols="12" lg="6">
          <b-card class="border-0" no-body>
            <box-header :title-text="ui.productTitle"> </box-header>

            <b-card-body>
              <products-form :id="objectId" edit-mode @product-submitted="onFormSubmitted"></products-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  layout: 'default',

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
    objectId() {
      const parts = this.$route.params.id.split('_')
      return parts.length === 2 ? parts[1] : parts[0]
    },
  },

  methods: {
    errorHandler(_error) {},

    successHandler(response) {
      if (this.exitImmediately) {
        this.$router.push(
          this.localePath({ name: 'dashboard-products-id', params: { id: 'prod_' + response.id } })
        )
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
