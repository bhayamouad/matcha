import Api from '@/services/Api'

export default {
  register (data) {
    return Api().post('register', data)
  }
}
