var express  = require('express')
var app  = express()
var server = app.listen(8081, () => {
    console.log('Server is started on 127.0.0.1:8081')
})
app.get('/video1/', (req, res) => {
  res.download('./contenu/eviteurdobstacle.sb2');
})