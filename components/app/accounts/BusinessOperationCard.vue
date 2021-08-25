<template>
  <b-card class="border-0" no-body>
    <box-header :title-text="ui.title" :subtitle-text="ui.subtitle"> </box-header>

    <b-card-body>
      <form-group :label="ui.openingHours" :hint="ui.openingHoursHint">
        <b-form-input v-model="form.openingHour" trim></b-form-input>
      </form-group>

      <b-form-group
        :label="ui.vacation"
        label-align="left"
        label-align-md="right"
        label-cols="12"
        label-cols-md="4"
        content-cols="12"
        content-cols-md="8"
      >
        <div class="d-flex align-items-center" style="min-height: 38px">
          <b-form-checkbox v-model="form.vacation" switch @change="onVacationChanged"></b-form-checkbox>
        </div>
      </b-form-group>

      <form-group :label="ui.vacationPeriod">
        <b-row>
          <b-col cols="12" lg="6">
            <b-form-group class="mb-lg-0">
              <b-datepicker
                v-model="form.vacationStart"
                :disabled="!form?.vacation"
                :placeholder="ui.start"
                :date-format-options="datePickerOptions.dateFormat"
                :locale="datePickerOptions.locale"
                value-as-date
                ><template #button-content><icon preset="bv-calendar"></icon></template>
              </b-datepicker>
            </b-form-group>
          </b-col>
          <b-col cols="12" lg="6">
            <b-form-group class="mb-lg-0">
              <b-datepicker
                v-model="form.vacationEnd"
                :disabled="!form?.vacation"
                :placeholder="ui.end"
                :date-format-options="datePickerOptions.dateFormat"
                :min="vacationEndMinDate"
                :locale="datePickerOptions.locale"
                value-as-date
                ><template #button-content><icon preset="bv-calendar"></icon></template>
              </b-datepicker>
            </b-form-group>
          </b-col>
        </b-row>
      </form-group>

      <form-group :label="ui.vacationNotice" :hint="ui.vacationNoticeHint">
        <b-form-input v-model="form.vacationNotice" :disabled="!form?.vacation" trim></b-form-input>
      </form-group>
    </b-card-body>

    <b-card-footer class="border-top">
      <div class="d-flex justify-content-end">
        <action-button preset="bv-cancel" size="sm" class="mr-2" @click="reset"></action-button>
        <action-button preset="bv-save" size="sm" variant="primary" @click="save"></action-button>
      </div>
    </b-card-footer>
  </b-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'BusinessOperationCard',

  data() {
    return {
      ui: {
        title: this.$t('modules.accounts.businessOperationTitle'),
        subtitle: this.$t('modules.accounts.businessOperationSubtitle'),
        openingHours: this.$t('modules.accounts.openingHours'),
        openingHoursHint: this.$t('modules.accounts.openingHoursHint'),
        vacation: this.$t('modules.accounts.vacation'),
        vacationNotice: this.$t('modules.accounts.vacationNotice'),
        vacationNoticeHint: this.$t('modules.accounts.vacationNoticeHint'),
        vacationPeriod: this.$t('modules.accounts.vacationPeriod'),
        start: this.$t('general.start'),
        end: this.$t('general.end'),
      },
      datePickerOptions: {
        dateFormat: { year: 'numeric', month: 'long', day: 'numeric' },
        locale: this.$i18n.locale,
      },
      form: {},
    }
  },

  computed: {
    ...mapState('user', ['user']),
    ...mapGetters('user', ['accountBusinessOperation']),

    vacationEndMinDate() {
      return this.form?.vacationStart
    },
  },

  created() {
    this.reset()
  },

  methods: {
    ...mapActions('user', ['update']),

    reset() {
      this.form = this.$_.cloneDeep(this.accountBusinessOperation)
    },

    save() {
      this.update({ documentId: this.user.id, payload: { [`account.businessOperation`]: this.form } })
    },

    onVacationChanged(checked) {
      if (checked) return
      this.form.vacationStart = null
      this.form.vacationEnd = null
      this.form.vacationNotice = null
    },
  },
}
</script>