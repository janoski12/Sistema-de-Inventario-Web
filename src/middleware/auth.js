export default function auth(to, from, next) {
    const token = localStorage.getItem('token')
    if (token) {
        next()
    } else {
        next({ path: '/login' })
    }
}