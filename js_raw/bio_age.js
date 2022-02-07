const date = new Date();
const date_birth = new Date('2002/01/11');
document.getElementById('age').innerText = Math.floor(((date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()) - (date_birth.getFullYear() * 10000 + (date_birth.getMonth() + 1) * 100 + date_birth.getDate())) / 10000);