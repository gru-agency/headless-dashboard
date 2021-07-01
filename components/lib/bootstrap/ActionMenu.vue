<template>
  <b-dd
    :lazy="lazy"
    :size="size"
    :variant="variant"
    :disabled="disabled"
    :boundary="boundary"
    :toggle-classs="toggleClass"
    no-caret
    right
  >
    <template #button-content> <b-icon-three-dots></b-icon-three-dots> </template>

    <slot>
      <b-dd-item
        v-if="!editHide"
        :to="editLink"
        :variant="editVariant"
        :disabled="editDisabled"
        :append="editLinkAppend"
        :prefetch="editLink ? true : false"
        @click.prevent="sendEvents('edit')"
      >
        {{ editText || def.edit }}
      </b-dd-item>

      <b-dd-divider v-if="!deleteHide"></b-dd-divider>

      <b-dd-item
        v-if="!deleteHide"
        :variant="deleteVariant"
        :disabled="deleteDisabled"
        :append="deleteLinkAppend"
        @click.prevent="sendEvents('delete')"
      >
        {{ deleteText || def.delete }}
      </b-dd-item>
    </slot>
  </b-dd>
</template>

<script>
import { BIconThreeDots } from 'bootstrap-vue'

export default {
  name: 'ActionMenu',

  components: { BIconThreeDots },

  props: {
    size: { type: String, default: 'sm' },
    lazy: { type: Boolean, default: false },
    variant: { type: String, default: 'light' },
    disabled: { type: Boolean, default: false },
    boundary: { type: String, default: 'window' },
    toggleClass: { type: String, default: undefined },
    editText: { type: String, default: undefined },
    editLink: { type: String, default: undefined },
    editVariant: { type: String, default: undefined },
    editHide: { type: Boolean, default: false },
    editDisabled: { type: Boolean, default: false },
    editLinkAppend: { type: Boolean, default: false },
    deleteText: { type: String, default: undefined },
    deleteLink: { type: String, default: undefined },
    deleteVariant: { type: String, default: 'danger' },
    deleteHide: { type: Boolean, default: false },
    deleteDisabled: { type: Boolean, default: false },
    deleteLinkAppend: { type: Boolean, default: false },
  },

  data() {
    return {
      def: {
        delete: this.$t('general.delete'),
        edit: this.$t('general.edit'),
      },
    }
  },

  methods: {
    sendEvents(event) {
      this.$emit(event)
    },
  },
}
</script>
