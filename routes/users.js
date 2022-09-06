var express = require('express');
var Workspace = require('../models/workspace');
var router = express.Router();
const fs = require('fs');
const workspace = require('../models/workspace');

const chemin = './contenu/private/';
var dossiers = []

fs.readdir('./contenu/public/GOETHE-BOX-INHALT', (err, files) => {
  files.forEach(file => {
    console.log(file);
    console.log("extension: ", file.substring(file.indexOf('.')));
  });
  dossiers = files;
});


router.get('/', (req, res, next) =>{
  if(req.session.public){
    req.session.path = req.session.public
    console.log(req.session.path);
    fs.readdir(req.session.path, (err, files) => {
      files.forEach(file => {
        console.log(file);
        console.log("extension: ", file.substring(file.indexOf('.')));
      });
      res.render('index', {dossiers : dossiers, files:files, chemin: req.session.path, session: req.session});
    });
  }
  else{
    req.session.public = './contenu/public/GOETHE-BOX-INHALT';
    req.session.my = './contenu/private'
    req.session.path = req.session.public;
  res.redirect('/');
  }
  
})

router.get('/workspace', (req, res, next) =>{
  console.log('mydocuent', req.session)
  if(req.session.my){
    req.session.path = req.session.my
    console.log(req.session.path)
    fs.readdir('./contenu/private', (err, files) => {
      files.forEach(file => {
        console.log(file);
      });
      res.render('index', {dossiers:dossiers,files:files, chemin: req.session.path, session: req.session})
    });
  }
  else{
  res.redirect('/');
  }
})

router.use('/all', (req, res, next) => {
  if(req.session.my){
    // req.session.path = req.session.my
    // console.log(req.session.path)
    // fs.readdir('./contenu/private', (err, files) => {
    //   files.forEach(file => {
    //     console.log(file);
    //   });
    //   res.render('index', {dossiers:dossiers,files:files, chemin: req.session.path, session: req.session})
    // });
    User.find()
    .then(users => res.render('index', {workspace: true, dossiers:dossiers,files:users, chemin: req.session.path, session: req.session}))
    .catch(error => res.status(400).json({ error }));
  }
  else{
  res.redirect('/');
  }
});

router.get('/download', (req, res, next) =>{
  if(req.query.file){
    let download_path = req.session.path+'/'+req.query.file
    console.log(download_path);
    fs.lstat(download_path, (err, stats) =>{
      if(err){
        return console.log('erreur');
      }
      console.log(`Is file: ${stats.isFile()}`);
      console.log(`Is directory: ${stats.isDirectory()}`);
      if(stats.isFile()){
        res.download(download_path);
      }
    })
  }
})

// router.get('/add_to_workspace', (req, res, next) =>{
//   if(req.query.file){
//     let move_path = req.session.path+'/'+req.query.file
//     console.log(move_path);
//     fs.copyFile(move_path, './contenu/private/', fs.constants.COPYFILE_EXCL, (err) =>{
//       if(err){
//         return console.log('erreur');
//       }
//       else{
//         console('copied success');
//       }
//     })
//   }
// })
router.get('/add_to_workspace', (req, res, next) => {
  let move_path = req.session.path+'/'+req.query.file
  console.log(1)
  Workspace.findOne({filepath: move_path})
    .then(data => {
      console.log(data);
      if(data === null){
        next();
      }
      else{
        res.status(201).json({message: 'User exist dejà !'})
      }
    })
    .catch(error => res.status(400).json({ error }));
});
// router.get('/add_to_workspace', (req, res, next) => {
//   const user = new User({
//     filename: req.query.file,
//     filepath: req.session.path+'/'+req.query.file
//   });
//   workspace.save()
//     .then(() => res.status(201).json({message: 'Objet enregistré !'}))
//     .catch(error => res.status(400).json({ error }));
//    redirect('/');
// });


router.get('/open_folder', (req, res, next) =>{
  if(req.query.folder){
    let download_path = req.session.path+'/'+req.query.folder;
    console.log(download_path);
    // fs.lstat(download_path, (err, stats) =>{
    //   if(err){
    //     return console.log('erreur');
    //   }
    //   console.log(`Is file: ${stats.isFile()}`);
    //   console.log(`Is directory: ${stats.isDirectory()}`);
    //   if(stats.isDirectory()){
        if(req.session.path.indexOf('public') !== -1){
          req.session.public = download_path;
        }
        else{
          req.session.my = download_path;
        }
        res.redirect('back');
    //   }
    // })
  }
})

router.get('/open_folder_from_root', (req, res, next) =>{
  if(req.query.folder){
    let download_path = './contenu/public/GOETHE-BOX-INHALT'+'/'+req.query.folder;
    console.log(download_path);
    // fs.lstat(download_path, (err, stats) =>{
    //   if(err){
    //     return console.log('erreur');
    //   }
    //   console.log(`Is file: ${stats.isFile()}`);
    //   console.log(`Is directory: ${stats.isDirectory()}`);
    //   if(stats.isDirectory()){
        //if(req.session.path.indexOf('public') !== -1){
          req.session.public = download_path;
        // }
        // else{
        //   req.session.my = download_path;
        // }
        res.redirect('/');
    //   }
    // })
  }
})

router.get('/precedent', (req, res, next) => {
  if(req.session.public){
    let tab = req.session.path.split('/');
    console.log(req.session.path ,tab);
    if(req.session.path.indexOf('public') !== -1){
      if(tab.length > 3){
        tab.pop();
        console.log(tab.join('/'))
        req.session.public = tab.join('/');
      }
    }
    else{
      if(tab.length > 2){
        tab.pop();
        console.log(tab.join('/'))
        req.session.my = tab.join('/');
      }
    }
  }
  res.redirect('back');
})


module.exports = router;
