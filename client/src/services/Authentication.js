import Api from '@/services/Api'

export default {
  register (data) {
    return Api().post('/account/register', data)
  }
  
}