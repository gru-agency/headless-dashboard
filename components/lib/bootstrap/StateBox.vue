<template>
  <b-card-body class="text-center p-sm-5">
    <div v-if="empty || error">
      <p>
        <b-avatar size="3rem" variant="light" rounded>
          <b-icon
            :icon="icon || empty ? 'exclamation-octagon' : 'arrow-repeat'"
            variant="secondary"
          ></b-icon>
        </b-avatar>
      </p>
      <p class="h4">{{ title }}</p>
      <p>{{ body }}</p>

      <action-button
        v-if="!btnHide"
        :name="empty ? 'bv-new' : error ? 'bv-refresh' : undefined"
        :variant="btnVariant || empty ? 'primary' : 'light'"
        :to="btnLink"
        :size="btnSize"
        :text="btnText"
        :disabled="btnDisabled"
        :append="btnLinkAppend"
        :prefetch="btnLink ? true : false"
        @click="sendEvents"
      ></action-button>
    </div>
    <div v-if="loading">
      <b-spinner variant="secondary" label="Loading..."></b-spinner>
    </div>
  </b-card-body>
</template>

<script>
import { BIcon, BIconArrowRepeat, BIconExclamationOctagon } from 'bootstrap-vue'

export default {
  name: 'StateBox',

  components: {
    BIcon,
    BIconArrowRepeat, // eslint-disable-line vue/no-unused-components
    BIconExclamationOctagon, // eslint-disable-line vue/no-unused-components
  },

  props: {
    empty: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    body: { type: String, default: undefined },
    btnText: { type: String, default: undefined },
    btnLink: { type: String, default: undefined },
    btnSize: { type: String, default: 'sm' },
    btnVariant: { type: String, default: undefined },
    btnHide: { type: Boolean, default: false },
    btnDisabled: { type: Boolean, default: false },
    btnLinkAppend: { type: Boolean, default: false },
    // not recommended to use since icon is import explicitly
    icon: { type: String, default: undefined },
  },

  data() {
    return {
      def: {},
    }
  },

  computed: {
    getDefaultButtonText() {
      return this.$ui.getTextVariant(this.variant)
    },
  },

  methods: {
    sendEvents() {
      this.$emit('click')
    },
  },
}
</script>
