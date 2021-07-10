<template>
  <b-container>
    <b-row class="py-3">
      <b-col cols="4" class="mt-4">
        <b-card header="ActionToggler">
          <action-toggler target="collapsible" text="More" icon-right></action-toggler>
          <b-collapse id="collapsible"> <span> peek-a-boo </span> </b-collapse>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="ActionLink">
          <action-link text="Custom link" link="custom" class="mr-2" @click="echo"></action-link>
          <action-link
            text="Parent link"
            :icon="['fad', 'long-arrow-left']"
            link-to-parent
          ></action-link>
          <action-link text="Colored link" variant="danger" class="ml-2"></action-link>
          <action-link :icon="['far', 'times']" link-to-parent></action-link>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="ActionMenu">
          <action-menu edit-link="/edit" @delete="echo"> </action-menu>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="ActionButton">
          <action-button preset="bv-new" variant="primary" size="sm" @click="echo"></action-button>
          <action-button preset="bv-edit" size="sm" @click="echo"></action-button>
          <action-button preset="bv-save" link="save" link-append disabled></action-button>
          <action-button preset="bv-cancel" :icon="['far', 'times']"></action-button>
          <action-button preset="bv-refresh" variant="dark" size="md" @click="echo"></action-button>
          <action-button preset="bv-savemore" variant="info" @click="echo"></action-button>
          <action-button text="custom" variant="danger" size="lg" @click="echo"></action-button>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="vee-validate">
          <validation-observer ref="form">
            <b-form-group label="Required">
              <validation-provider v-slot="vp" name="Email" rules="required|email" immediate>
                <b-form-input v-model="email" :state="validationState(vp)"></b-form-input>
                <b-form-invalid-feedback> {{ vp.errors[0] }} </b-form-invalid-feedback>
              </validation-provider>
            </b-form-group>
          </validation-observer>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="i18n">
          <p>
            <action-button
              v-for="locale in $i18n.locales"
              :key="locale.code"
              :text="locale.name"
              variant="info"
              class="mr-2"
              @click="changeLocale(locale.code)"
            ></action-button>
          </p>
          <div>Translate: {{ $t('general.cancel') }}</div>
          <div>Date: {{ $d(date, 'long') }}</div>
          <div>Currency: {{ $n(money, 'currency') }}</div>
          <div>
            Pluralization: {{ $tc('pluralization.tableResults', 0) }},
            {{ $tc('pluralization.tableResults', 1) }}, {{ $tc('pluralization.tableResults', 10) }}
          </div>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="Icon w. FontAwesome">
          <icon :icon="['fas', 'home']" class="fa-sm"></icon>
          <icon :icon="['far', 'home']" class="fa-md"></icon>
          <icon :icon="['fal', 'home']" class="fa-lg" variant="primary"></icon>
          <icon :icon="['fad', 'home']" class="fa-gru"></icon>
          <icon :icon="['fad', 'home']" class="fa-2x fa-gru"></icon>
          <icon :icon="['fad', 'home']" class="fa-3x fa-gru"></icon>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="Reserve"> </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="Toast">
          <action-button @click="$bvToast.show('bvBottomCenter')">Toast</action-button>
          <toast preset="error"> Something is wrong with your input!! </toast>
          <toast preset="success"> Congratulations </toast>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="TagField">
          <tag-field preset="bv-optional"></tag-field>
          <tag-field preset="bv-required"></tag-field>
          <tag-field text="custom" variant="primary"></tag-field>
          <tag-field text="custom" variant="info"></tag-field>
          <tag-field text="custom" variant="dark"></tag-field>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="TipsField">
          <tips-field preset="bv-info"> {{ text }} </tips-field>
          <tips-field preset="bv-info" placement="top" trigger="hover"> {{ text }} </tips-field>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="MoneyField">
          <money-field></money-field>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="Firestore">
          <div>
            <action-button text="Add" class="mr-2" @click="writeToFirestore"></action-button>
            <action-button text="Read" class="mr-2" @click="readFromFirestore"></action-button>
          </div>
          <div class="mt-2">Firestore: {{ message || 'None' }}</div>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="TextField">
          <text-field></text-field>
          <text-field :text="text"></text-field>
          <text-field :date="date"></text-field>
          <text-field :money="money" currency="myr"></text-field>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="ImageField">
          <div class="mt-2"><image-field :icon="icon"></image-field></div>
          <div class="mt-2"><image-field :image="images[0]"></image-field></div>
          <div class="mt-2"><image-field :images="images" max="3"></image-field></div>
          <div class="mt-2"><image-field :images="images"></image-field></div>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="BoxHeader - List">
          <box-header title-text="Products" no-border new-btn @new="echo"> </box-header>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="BoxHeader - View w. nav">
          <box-header
            title-text="Products"
            no-border
            edit-btn
            btn-link="/edit"
            parent-link
            parent-link-text="Products"
          >
          </box-header>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="BoxHeader - Custom">
          <box-header title-text="Custom" subtitle-text="Hello">
            <template #right>
              <action-menu edit-link="/edit" @delete="echo"> </action-menu>
            </template>
          </box-header>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="BoxState - Refresh">
          <box-state error title="Error!" body="Opss.. something happens" @click="echo"></box-state>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="BoxState - Empty">
          <box-state empty title="No content" body="Nothing's here." @click="echo"></box-state>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card header="BoxState - Loading">
          <box-state loading></box-state>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import * as consola from 'consola'

export default {
  name: 'Playground',

  layout: 'Default',

  data() {
    return {
      // TextField
      text: 'normal text field',
      date: new Date().getTime(),
      money: 123456789,

      // image field
      icon: ['fad', 'box'],
      images: [
        'http://placekitten.com/72/72',
        'http://placekitten.com/73/73',
        'http://placekitten.com/74/74',
        'http://placekitten.com/75/75',
        'http://placekitten.com/76/76',
      ],

      // form input
      email: null,

      // firestore
      message: null,
    }
  },

  methods: {
    echo(msg) {
      alert(msg || 'hello')
    },

    changeLocale(locale) {
      this.$router.push(this.switchLocalePath(locale))
    },

    validationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null
    },

    async writeToFirestore() {
      const ref = this.$fire.firestore.collection('t_playground').doc('sandbox')
      try {
        await ref.set({
          message: new Date(),
        })
      } catch (e) {
        consola.error(e)
      }
    },

    async readFromFirestore() {
      const ref = this.$fire.firestore.collection('t_playground').doc('sandbox')
      try {
        const doc = await ref.get()
        this.message = doc.data().message.toDate()
      } catch (e) {
        consola.error(e)
      }
    },
  },
}
</script>
