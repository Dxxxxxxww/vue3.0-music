export default {
  namespaced: true,
  state: () => ({
    singer: {}
  }),
  mutations: {
    setSinger: (state, singer) => {
      state.singer = singer
    }
  },
  getters: {
    singer: state => state.singer
  }
}
