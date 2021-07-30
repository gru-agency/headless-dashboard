<template>
  <b-card class="border-0" no-body>
    <box-header :title-text="ui.profile">
      <template #right>
        <div v-if="readonly">
          <action-button preset="bv-edit" size="sm" @click="onFormEdit"></action-button>
        </div>
        <div v-else>
          <action-button preset="bv-cancel" size="sm" class="mr-2" @click="onFormCancel"></action-button>
          <action-button
            :disabled="!dirty"
            preset="bv-save"
            variant="primary"
            size="sm"
            @click="onFormSubmit"
          ></action-button>
        </div>
      </template>
    </box-header>

    <b-card-body>
      <b-alert :show="showError" variant="danger">
        <icon preset="bv-error" class="mr-2"></icon> {{ server.message }}
      </b-alert>

      <validation-observer ref="profileForm" tag="form">
        <b-form-group
          :label="ui.email"
          label-align="left"
          label-align-md="right"
          label-cols="12"
          label-cols-md="4"
          content-cols="12"
          content-cols-md="8"
          content-cols-xl="6"
        >
          <b-form-input :value="userEmail" :plaintext="uneditable"></b-form-input>
        </b-form-group>

        <validation-provider v-slot="vp" :name="ui.name" rules="required|max:320">
          <b-form-group
            :label="ui.name"
            label-for="pro-name"
            label-align="left"
            label-align-md="right"
            label-cols="12"
            label-cols-md="4"
            content-cols="12"
            content-cols-md="8"
            content-cols-xl="6"
          >
            <b-form-input
              id="pro-name"
              v-model="form.name"
              :state="readonly ? null : $vee.state(vp)"
              :plaintext="readonly"
              autocomplete="name"
              trim
            ></b-form-input>
            <b-form-invalid-feedback>
              <span><icon preset="bv-error"></icon> {{ $vee.error(vp) }}</span>
            </b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <b-form-group
          :label="ui.password"
          label-align="left"
          label-align-md="right"
          label-cols="12"
          label-cols-md="4"
          content-cols="12"
          content-cols-md="8"
          content-cols-xl="6"
          class="mb-0"
        >
          <b-form-input v-if="readonly" value="••••••••••" :plaintext="uneditable"></b-form-input>
          <div v-else class="h-100 d-flex align-items-center">
            <action-button
              v-b-modal.change-password-modal
              :text="ui.changePassword"
              size="sm"
            ></action-button>
          </div>
        </b-form-group>
      </validation-observer>
    </b-card-body>

    <users-change-password-modal></users-change-password-modal>
  </b-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ProfileForm',

  data() {
    return {
      ui: {
        profile: this.$t('general.profile'),
        email: this.$t('general.email'),
        name: this.$t('general.name'),
        password: this.$t('general.password'),
        changePassword: this.$t('modules.users.profileChangePassword'),
      },
      form: { name: null },
      server: { validated: false, valid: false, field: null, code: null, message: null },
      readonly: true,
      uneditable: true,
    }
  },

  computed: {
    ...mapState('user', ['user']),

    userEmail() {
      return this.user?.email
    },

    userName() {
      return this.user?.displayName
    },

    dirty() {
      if (this.form.name && this.userName !== this.form.name) return true
      return false
    },

    showError() {
      const { validated, valid, field } = this.server
      return validated && !valid && !field
    },
  },

  mounted() {
    this.form.name = this.userName
  },

  methods: {
    ...mapActions('user', ['update']),

    errorHandler(error) {
      this.server = {
        ...this.server,
        validated: true,
        valid: false,
        code: error.code,
        message: error.message,
      }

      this.server = { ...this.server, message: this.$t('general.error5xx') }
    },

    successHandler(response) {
      this.server = { ...this.server, validated: true, valid: true }
      this.resetForm()
      this.readonly = true
    },

    onFormSubmit() {
      this.resetFormState()
      this.update({ docId: this.user.id, payload: { displayName: this.form.name } }).then(
        (response) => this.successHandler(response),
        (error) => this.errorHandler(error)
      )
    },

    async resetForm() {
      this.resetFormState()
      this.form = { name: this.userName }
      this.$refs.profileForm?.reset()
      await this.$nextTick()
    },

    resetFormState() {
      this.server = { validated: false, valid: false, field: null, code: null, message: null }
    },

    onFormCancel() {
      this.resetForm()
      this.readonly = true
    },

    onFormEdit() {
      this.readonly = false
    },
  },
}
</script>
