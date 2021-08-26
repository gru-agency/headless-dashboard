<template>
  <b-card class="border-0" no-body>
    <box-header :title-text="ui.title" :subtitle-text="ui.subtitle"> </box-header>

    <b-table-lite :items="all" :fields="fields" responsive class="mb-0">
      <template #cell(time)="{ value }">
        {{ $dayjs.factory.unix(value).fromNow() }}
      </template>

      <template #cell(status)="item">
        {{ item.index === 0 ? ui.current : ui.expired }}
      </template>
    </b-table-lite>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SessionTable',

  data() {
    return {
      ui: {
        title: this.$t('modules.users.sessionTitle'),
        subtitle: this.$t('modules.users.SessionSubtitle', { _brand: this.$config.brandName }),
        current: this.$t('modules.users.sessionCurrent'),
        expired: this.$t('general.expired'),
      },
      fields: [
        { key: 'location', label: this.$t('general.location') },
        { key: 'device', label: this.$t('general.device') },
        { key: 'ip', label: this.$t('general.ipAddress'), tdClass: 'text-monospace' },
        { key: 'time', label: this.$t('general.time') },
        { key: 'status', label: '' },
      ],
    }
  },

  computed: {
    ...mapState('user_sessions', ['all']),
  },
}
</script>
