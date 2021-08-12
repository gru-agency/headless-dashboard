const state = () => ({
  /**
   * Initial state of price object
   */
  price: {
    currency: 'myr',
    unitAmount: null,
    description: null,
    transformQuantity: { divideBy: 0, round: 'up' },
    billingScheme: 'perunit',
    type: 'onetime',
  },
})

const getters = {}

const mutations = {}

const actions = {}

export default { state, getters, mutations, actions }
