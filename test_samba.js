const SambaClient = require('samba-client');

let client = new SambaClient({
  address: '//server/goethe', // required
  username: 'goethe', // not required, defaults to guest
  password: 'geothe@2022', // not required
//   domain: 'WORKGROUP', // not required
//   maxProtocol: 'SMB3', // not required
//   maskCmd: true, // not required, defaults to false
});
async function obtenir_fichier(){
    const contenu = await client.getFile('cours/creation_server.txt', './name.txt');
    return contenu;
}

console.log(obtenir_fichier());
// send a file
//await client.sendFile('somePath/file', 'destinationFolder/name');

// get a file


// // create a folder
// await client.mkdir('folder/tree', (optional) 'current/working/directory');
// // By default CWD is __dirname

// // executes dir command in remote directory
// await client.dir('remote/folder', (optional) 'current/working/directory');
// // By default CWD is __dirname

// // validate if file or folder exists in the remote device
// await client.fileExists('remote/file', (optional) 'current/working/directory');
// By default CWD is __dirname