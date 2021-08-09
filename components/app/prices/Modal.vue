<template>
  <b-modal
    :id="id"
    :title="price ? ui.editTitle : ui.createTitle"
    :ok-title="ui.save"
    :cancel-title="ui.cancel"
    :ok-disabled="okDisabled"
    body-bg-variant="light"
    cancel-variant="light"
    button-size="sm"
    size="lg"
    centered
    scrollable
    no-stacking
    hide-header-close
    @ok.prevent="onModalOk"
    @hide="onModalHide"
  >
    <b-card-body>
      <prices-form
        :price="price"
        :product="product"
        @validated="onFormValidated"
        @submitted="onFormSubmitted"
      ></prices-form>
    </b-card-body>
  </b-modal>
</template>

<script>
export default {
  name: 'Modal',

  props: {
    id: { type: String, default: undefined },
    price: { type: Object, default: () => undefined },
    product: { type: String, default: undefined },
  },

  data() {
    return {
      events: {
        validate: 'price-validate',
        submit: 'price-submit',
        reset: 'price-reset',
      },
      ui: {
        createTitle: this.$t('modules.prices.createTitle'),
        editTitle: this.$t('modules.prices.editTitle'),
        cancel: this.$t('general.cancel'),
        save: this.$t('general.save'),
      },
      okDisabled: true,
    }
  },

  methods: {
    onModalOk() {
      this.$nuxt.$emit(this.events.submit)
    },

    /**
     * BUG: explicitly prevent closing by unknown trigger
     */
    onModalHide(bvModalEvent) {
      if (!bvModalEvent.trigger) bvModalEvent.preventDefault()
    },

    onFormSubmitted(success, error, response) {
      if (success) this.$bvModal.hide(this.id)
    },

    onFormValidated(valid) {
      this.okDisabled = !valid
    },
  },
}
</script>
