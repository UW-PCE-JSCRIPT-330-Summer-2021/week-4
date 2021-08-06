const bcrypt = require('bcrypt')

const password = 'oe3im3io2r3o2'
const rounds = 10

bcrypt.hash(password, rounds, (err, hash) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(hash)
})