<template>
  <div>
    <form-nav-bar :title="ui.pageTitle">
      <template #nav-end>
        <b-nav-item link-classes="py-1 px-0 px-lg-2">
          <action-button size="sm" preset="bv-save" variant="primary" @click="save()"></action-button>
        </b-nav-item>
      </template>
    </form-nav-bar>

    <b-container fluid="2xl" class="main-content">
      <b-row tag="main" align-h="center" class="px-lg-4 py-8">
        <b-col cols="12" lg="6">
          <b-card class="border-0" no-body>
            <b-alert :show="showError" variant="danger">
              <icon preset="bv-error" class="mr-2"></icon> {{ server.message }}
            </b-alert>

            <box-header :title-text="ui.productTitle"> </box-header>

            <b-card-body>
              <products-form
                :product="originalProduct"
                @changed="onProductFormChanged"
                @validated="onProductFormValidated"
              ></products-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Edit',
  layout: 'default',

  data() {
    return {
      events: {
        products: {
          validate: 'product-validate',
          submit: 'product-submit',
          reset: 'product-reset',
        },
      },
      ui: {
        pageTitle: this.$t('modules.products.editFormTitle'),
        productTitle: this.$t('modules.products.title'),
      },

      // product form
      product: { name: null, description: null },
      productComplete: false,

      // states
      server: { validated: false, valid: false, field: null, code: null, message: null },
    }
  },

  head() {
    return {
      title: this.$t('seo.products', { _brand: this.$config.brandName }),
    }
  },

  computed: {
    ...mapGetters('user', ['account']),
    ...mapGetters('products', ['find']),

    formComplete() {
      return !!this.productComplete
    },

    showError() {
      const { validated, valid, field } = this.server
      return validated && !valid && !field
    },

    objectId() {
      const parts = this.$route.params.id.split('_')
      return parts.length === 2 ? parts[1] : parts[0]
    },

    originalProduct() {
      return this.find(this.objectId, this.account)
    },
  },

  methods: {
    ...mapActions('products', ['update']),

    routeToProductPage(id) {
      const location = { name: 'dashboard-products-id', params: { id: `prod_${id}` } }
      this.$router.push(this.localePath(location))
    },

    errorHandler(error) {
      this.server = {
        ...this.server,
        validated: true,
        valid: false,
        code: error.code,
        message: this.$t('general.error5xx'),
      }
    },

    successHandler(response) {
      this.routeToProductPage(response.id)
    },

    submitForm() {
      this.update({ document: this.objectId, account: this.account, payload: this.product }).then(
        (response) => this.successHandler(response),
        (error) => this.errorHandler(error)
      )
    },

    onFormSubmitted(success, error, response) {
      success ? this.successHandler(response) : this.errorHandler(error)
    },

    save() {
      this.$nuxt.$emit(this.events.products.validate)
    },

    onProductFormChanged(value) {
      this.product = value
    },

    onProductFormValidated(valid) {
      this.productComplete = valid
      if (this.formComplete) this.submitForm()
    },
  },
}
</script>
