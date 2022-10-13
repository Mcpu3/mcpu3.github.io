const date = new Date()
const date_birth = new Date('2002/01/11')
document.getElementById('age').innerText = Math.floor(0.0001 * ((10000 * date.getFullYear() + 100 * (date.getMonth() + 1) + date.getDate()) - (10000 * date_birth.getFullYear() + 100 * (date_birth.getMonth() + 1) + date_birth.getDate())))