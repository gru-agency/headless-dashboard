<template>
  <b-card class="border-0" no-body>
    <box-header :title-text="ui.title" :subtitle-text="ui.subtitle"> </box-header>

    <b-card-body>
      <form-group :label="ui.brandName" :hint="ui.brandNameHint">
        <b-form-input v-model="form.brandName" trim></b-form-input>
      </form-group>

      <form-group :label="ui.email">
        <b-form-input v-model="form.supportEmail" trim></b-form-input>
      </form-group>

      <form-group :label="ui.phone">
        <b-form-input v-model="form.supportPhone" trim></b-form-input>
      </form-group>

      <form-group :label="ui.address">
        <b-form-textarea
          v-model="form.supportAddress.address"
          :placeholder="ui.addressHint"
          trim
        ></b-form-textarea>
      </form-group>

      <form-group>
        <b-row>
          <b-col cols="12" lg="6">
            <b-form-group class="mb-lg-0">
              <b-form-input v-model="form.supportAddress.city" :placeholder="ui.city" trim></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="12" lg="6">
            <b-form-group class="mb-lg-0">
              <b-form-input v-model="form.supportAddress.state" :placeholder="ui.state" trim></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </form-group>

      <form-group>
        <b-row>
          <b-col cols="12" lg="6">
            <b-form-group class="mb-lg-0">
              <b-form-input
                v-model="form.supportAddress.postalCode"
                :placeholder="ui.postcode"
                trim
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="12" lg="6">
            <b-form-group class="mb-lg-0">
              <b-form-input
                v-model="form.supportAddress.country"
                :placeholder="ui.country"
                trim
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
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
  name: 'PublicProfileCard',

  data() {
    return {
      ui: {
        title: this.$t('modules.accounts.publicProfileTitle'),
        subtitle: this.$t('modules.accounts.publicProfileSubtitle'),
        brandName: this.$t('modules.accounts.brandName'),
        brandNameHint: this.$t('modules.accounts.brandNameHint'),
        email: this.$t('modules.accounts.supportEmail'),
        phone: this.$t('modules.accounts.supportPhone'),
        address: this.$t('modules.accounts.supportAddress'),
        addressHint: this.$t('modules.accounts.supportAddressHint'),
        city: this.$t('general.city'),
        state: this.$t('general.state'),
        postcode: this.$t('general.postcode'),
        country: this.$t('general.country'),
      },
      form: {},
    }
  },

  computed: {
    ...mapState('user', ['user']),
    ...mapGetters('user', ['accountPublicProfile']),
  },

  created() {
    this.reset()
  },

  methods: {
    ...mapActions('user', ['update']),

    reset() {
      this.form = this.$_.cloneDeep(this.accountPublicProfile)
    },

    save() {
      this.update({ documentId: this.user.id, payload: { [`account.publicProfile`]: this.form } })
    },
  },
}
</script>