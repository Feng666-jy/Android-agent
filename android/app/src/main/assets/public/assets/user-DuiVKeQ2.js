import { r as e } from './request-CrdghNby.js'
const s = {
  login(r) {
    return e.post('/user/login', r)
  },
  register(r) {
    return e.post('/user/register', r)
  },
  getInfo() {
    return e.get('/user/info')
  },
  updateProfile(r) {
    return e.put('/user/profile', r)
  }
}
export { s as u }
