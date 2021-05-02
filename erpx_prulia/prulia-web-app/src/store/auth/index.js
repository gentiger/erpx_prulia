import { make } from 'vuex-pathify'
import axios from 'axios'

const state = {
  member: null,
  loaded: false
}

const getters = {
  ...make.getters(state)
}
const mutations = {
  ...make.mutations(state)
}

const actions = {
  ...make.actions(state),
  getMember({ commit }) {
    return axios
      .get(
        '/api/method/erpx_prulia.prulia_members.doctype.prulia_member.prulia_member.mobile_member_login',
        {
          withCredentials: true
        }
      )
      .then(response => {
        let { data } = response
        let { message } = data

        commit('SET_MEMBER', message)
        return true
      })
      .finally(() => {
        commit('SET_LOADED', true)
      })
  },
  updateMemberDetails({ commit }, data) {
    return axios
      .post(
        '/api/method/erpx_prulia.prulia_members.doctype.prulia_member.prulia_member.update_member_pref',
        data
      )
      .then(response => {
        let { data } = response
        let { message } = data

        commit('SET_MEMBER', message)
        return true
      })
  },
  login({ dispatch }, params) {
    return fetch('/api/method/login', {
      headers: {
        accept: '*/*',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest'
      },
      body: `usr=${params.usr}&pwd=${params.pwd}&device=desktop`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include'
    }).then(async response => {
      let data = await response.json()
      if (response.ok) {
        return dispatch('getMember')
      } else return Promise.reject({ response: { data } })
    })
  },
  forgotPassword(self, data) {
    return axios.post(
      '/api/method/erpx_prulia.prulia_members.doctype.prulia_member.prulia_member.forget_password',
      data
    )
  },
  changePassword(self, data) {
    return axios({
      url: '/api/method/frappe.core.doctype.user.user.update_password',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      data: JSON.stringify({
        ...data,
        logout_all_sessions: false
      })
    })
  },
  logout({ commit }) {
    commit('SET_MEMBER', null)
    return axios.get(`/api/method/logout`)
  },
  uploadPic({ commit, getters }, data) {
    let member_name = getters['member'].name

    let { filedata, file_size, filename } = data

    console.log(commit, data, member_name)

    const config = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    return axios
      .post(
        '/',
        {
          from_form: 1,
          is_private: 0,
          cmd: 'uploadfile',
          doctype: 'PRULIA Member',
          docname: member_name,
          filename: member_name + '_' + filename,
          file_url: '',
          filedata,
          file_size
        },
        config
      )
      .then(response => {
        console.log(response)
        return true
      })

    // return axios({
    //   url: 'http://167.99.77.197',
    //   method: 'POST',
    //   withCredentials: true,
    //   headers: {
    //     accept: '*/*',
    //     'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //   },
    //   data: JSON.stringify({
    //     from_form: 1,
    //     is_private: 0,
    //     cmd: 'uploadfile',
    //     doctype: 'PRULIA Member',
    //     docname: member_name,
    //     filename: member_name + '_' + filename,
    //     file_url: '',
    //     filedata,
    //     file_size
    //   })
    // })

    // return axios
    //   .post('http://167.99.77.197', {
    //     from_form: 1,
    //     is_private: 0,
    //     cmd: 'uploadfile',
    //     doctype: 'PRULIA Member',
    //     docname: member_name,
    //     filename: member_name + '_' + filename,
    //     file_url: '',
    //     filedata,
    //     file_size
    //   })
    //   .then(response => {
    //     console.log(response)
    //   })
  },
  load({ dispatch }) {
    return axios.get(`/api/method/frappe.auth.get_logged_user`).then(() => {
      return dispatch('getMember')
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
