<template>
  <b-card-footer class="d-flex justify-content-between align-items-center border-0">
    <caption v-if="!noCaption">
      {{
        formattedCaption
      }}
    </caption>

    <ul class="list-inline mb-0">
      <slot name="right">
        <li class="list-inline-item">
          <action-button size="sm" :disabled="!canPrevious" @click="$emit('prev')">
            {{ prevText }}
          </action-button>
        </li>

        <li class="list-inline-item">
          <action-button size="sm" :disabled="!lazyMode && !canNext" @click="$emit('next')">
            {{ nextText }}
          </action-button>
        </li>
      </slot>
    </ul>
  </b-card-footer>
</template>

<script>
export default {
  name: 'TableCaption',

  props: {
    caption: { type: [String, Number], default: undefined },
    currentPage: { type: [String, Number], default: 1 },
    totalRows: { type: [String, Number], default: 0 },
    perPage: { type: [String, Number], default: 10 },
    noCaption: { type: Boolean, default: false },
    forceNext: { type: Boolean, default: false },
  },

  data() {
    return {
      nextText: this.$t('general.next'),
      prevText: this.$t('general.previous'),
    }
  },

  computed: {
    formattedCaption() {
      return this.caption || this.$tc('pluralization.tableResults', this.totalRows)
    },

    canNext() {
      const currentRows = this.currentPage * this.perPage
      return this.totalRows > currentRows
    },

    canPrevious() {
      return this.currentPage > 1
    },

    /**
     * On this mode, next is available to fetch back dated item lazily.
     * Only available if rows fully fill up current page.
     */
    lazyMode() {
      return this.forceNext && this.totalRows > 0 && this.totalRows % this.perPage === 0
    },
  },
}
</script>
