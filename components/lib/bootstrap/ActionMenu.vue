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
    <template #button-content> <icon preset="bv-more-v"></icon> </template>

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
        <icon :icon="['fad', 'pencil']" class="mr-2"></icon>
        {{ editText || defaultText.edit }}
      </b-dd-item>

      <b-dd-item v-if="!noArchive" :id="getId('archive')" @click.prevent="sendEvents('archive')">
        <icon preset="bv-archive" class="mr-2"></icon>
        {{ archiveText || defaultText.archive }}

        <b-popover :target="getId('archive')" triggers="hover" placement="left">
          <slot name="archive">{{ defaultText.archiveTips }}</slot>
        </b-popover>
      </b-dd-item>

      <b-dd-item v-if="!noUnarchive" @click.prevent="sendEvents('unarchive')">
        <icon preset="bv-unarchive" class="mr-2"></icon>
        {{ unarchiveText || defaultText.unarchive }}
      </b-dd-item>

      <b-dd-divider v-if="!deleteHide"></b-dd-divider>

      <b-dd-item
        v-if="!deleteHide"
        :variant="deleteVariant"
        :disabled="deleteDisabled"
        :append="deleteLinkAppend"
        @click.prevent="sendEvents('delete')"
      >
        <icon :icon="['fad', 'trash']" class="mr-2"></icon>
        {{ deleteText || defaultText.delete }}
      </b-dd-item>
    </slot>
  </b-dd>
</template>

<script>
export default {
  name: 'ActionMenu',

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
    archiveText: { type: String, default: undefined },
    noArchive: { type: Boolean, default: false },
    unarchiveText: { type: String, default: undefined },
    noUnarchive: { type: Boolean, default: false },
    primaryKey: { type: String, default: undefined },
  },

  data() {
    return {
      defaultText: {
        delete: this.$t('general.delete'),
        edit: this.$t('general.edit'),
        archive: this.$t('general.archive'),
        archiveTips: this.$t('general.archiveTips'),
        unarchive: this.$t('general.unarchive'),
      },
    }
  },

  methods: {
    sendEvents(event) {
      this.$emit(event)
    },

    getId(name) {
      return this.primaryKey + '-' + name
    },
  },
}
</script>
