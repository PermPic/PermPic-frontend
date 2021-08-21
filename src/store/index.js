import Vue from 'vue'
import Vuex from 'vuex'
import { getPermPicLogList } from 'permpic-core-test'
import Utils from '../utils/Utils'

Vue.use(Vuex)

const state = {
  wallet: {},
  logList: [],
  tags: []
}

const mutations = {
  changeLogList(state, value) {
    state.logList = value
  },
  changeTags(state, value) {
    state.tags = value
  }
}

const actions = {
  getPermLogList({ commit, state }, { owner, refresh }) {
    return new Promise(async (resolve, reject) => {
      try {
        const logsList = (await getPermPicLogList(owner)).map(log => {
          const logItem = {
            arid: log.node.id
          }
          const tags = log.node.tags
          for (let index = 0; index < tags.length; index++) {
            logItem[tags[index].name] = tags[index].value
          }
          log.node.block ? (logItem.sync = 2) : (logItem.sync = 1)
          console.log(logItem)
          if (logItem.tags) {
            logItem.tags = logItem.tags.split(',')
          }
          return logItem
        })
        const tags = logsList
          .map(item => item.tags)
          .toString()
          .split(',')
        commit('changeTags', Utils.removeDuplicate(tags))
        // if (refresh) {
        commit('changeLogList', logsList)
        // } else {
        //   commit(
        //     "changeLogList",
        //     Utils.removeDuplicateLog(state.logList, logsList)
        //   );
        // }
        resolve(logsList)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
