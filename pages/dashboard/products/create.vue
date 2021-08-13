<template>
  <div>
    <form-nav-bar :title="ui.pageTitle">
      <template #nav-end>
        <b-nav-item link-classes="py-1 px-0 px-lg-2">
          <action-button size="sm" preset="bv-savemore" @click="saveAndMore()"></action-button>
        </b-nav-item>
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

            <b-toast
              id="toast"
              variant="success"
              toaster="b-toaster-top-right"
              toast-class="toast-top"
              no-close-button
              ><icon preset="bv-success" class="mr-2"></icon> {{ ui.success }}
            </b-toast>

            <box-header :title-text="ui.productTitle"> </box-header>

            <b-card-body>
              <products-form
                @changed="onProductFormChanged"
                @validated="onProductFormValidated"
              ></products-form>
            </b-card-body>

            <box-header :title-text="ui.priceTitle">
              <template #right>
                <action-button preset="bv-new" size="sm" @click="addPrice">
                  {{ ui.addNewPrice }}
                </action-button>
              </template>
            </box-header>

            <div v-for="(price, index) in prices" :key="price.id">
              <b-card-body class="py-0 border-bottom">
                <action-toggler
                  :target="`price-${price.id}`"
                  :text="ui.pricingDetails"
                  :text-on-hide="getPricingText(price)"
                  :visible="index === prices.length - 1"
                  no-icon
                  stretch
                >
                  <action-menu
                    no-archive
                    no-unarchive
                    edit-hide
                    toggle-class="btn-float"
                    @delete="removePrice(index)"
                  ></action-menu>

                  <template #collapsible>
                    <prices-form
                      :price="price"
                      @changed="onPriceFormChanged"
                      @validated="onPriceFormValidated"
                    ></prices-form>
                  </template>
                </action-toggler>
              </b-card-body>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'Create',
  layout: 'default',

  data() {
    return {
      events: {
        products: {
          validate: 'product-validate',
          submit: 'product-submit',
          reset: 'product-reset',
        },
        prices: {
          validate: 'price-validate',
          submit: 'price-submit',
          reset: 'price-reset',
        },
      },
      ui: {
        pageTitle: this.$t('modules.products.createFormTitle'),
        productTitle: this.$t('modules.products.title'),
        priceTitle: this.$t('modules.prices.title'),
        success: this.$t('general.saveSuccessfully'),
        addNewPrice: this.$t('modules.prices.addNewPrice'),
        pricingDetails: this.$t('modules.prices.pricingDetails'),
      },

      // product
      product: {},
      productComplete: false,

      // prices
      prices: [],
      pricesComplete: new Map(),

      // states
      exitImmediately: true,
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
    ...mapState('prices', ['price']),
    ...mapState('products', { initialProduct: 'product' }),

    showError() {
      const { validated, valid, field } = this.server
      return validated && !valid && !field
    },
  },

  created() {
    this.initProduct()
    this.addPrice()
  },

  methods: {
    ...mapActions('products', ['create']),

    initProduct() {
      this.product = this.$_.cloneDeep(this.initialProduct)
    },

    addPrice() {
      const price = { ...this.$_.cloneDeep(this.price), id: this.$util.nanoid() }
      this.prices.push(price)
    },

    removePrice(index) {
      this.prices.splice(index, 1)
    },

    routeToProductPage(id) {
      const location = { name: 'dashboard-products-id', params: { id: `prod_${id}` } }
      this.$router.push(this.localePath(location))
    },

    getPricingText(price) {
      const { divideBy } = price.transformQuantity
      const quantity = divideBy === 0 ? 1 : divideBy
      return this.$tc('pluralization.pricePerUnit', quantity, {
        _price: this.$n(price.unitAmount / 100, { style: 'currency', currency: price.currency }),
      })
    },

    hasFormCompleted() {
      let incomplete = false
      for (let i = 0; i < this.prices.length; i++) {
        if (this.pricesComplete.get(this.prices[i].id) !== true) {
          incomplete = true
          break
        }
      }
      return this.productComplete && !incomplete
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
      if (this.exitImmediately) {
        this.routeToProductPage(response.id)
      } else {
        this.resetForm()
        this.$bvToast.show('toast')
      }
    },

    submitForm() {
      this.product.prices = this.prices
      this.create({ account: this.account, payload: this.product }).then(
        (response) => this.successHandler(response),
        (error) => this.errorHandler(error)
      )
    },

    resetForm() {
      this.$nuxt.$emit(this.events.products.reset)
      this.$nuxt.$emit(this.events.prices.reset)

      this.exitImmediately = true
      this.prices = []
      this.pricesComplete = new Map()
      this.productComplete = false
      this.product = this.$_.cloneDeep(this.initialProduct)
      this.server = { validated: false, valid: false, field: null, code: null, message: null }

      this.addPrice()
    },

    saveAndMore() {
      this.exitImmediately = false
      this.$nuxt.$emit(this.events.products.validate)
      this.$nuxt.$emit(this.events.prices.validate)
    },

    save() {
      this.exitImmediately = true
      this.$nuxt.$emit(this.events.products.validate)
      this.$nuxt.$emit(this.events.prices.validate)
    },

    onProductFormChanged(value) {
      this.product = value
    },

    onProductFormValidated(valid) {
      this.productComplete = valid
      if (this.hasFormCompleted()) this.submitForm()
    },

    onPriceFormChanged(value) {
      const index = this.prices.findIndex((el) => el.id === value.id)
      if (index >= 0) this.prices.splice(index, 1, value)
    },

    onPriceFormValidated(valid, id) {
      this.pricesComplete.set(id, valid)
      if (this.hasFormCompleted()) this.submitForm()
    },
  },
}
</script>
