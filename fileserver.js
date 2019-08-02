var hapi = require('hapi');
const fs = require("fs");
const Inert = require('inert');

var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'localhost',
      user : 'root',
      password : '',
      database : 'studentform'
    }
  });

  const start = async () => {



var server = new hapi.Server({
  host: 'localhost',
  port: 7000,
  routes: {
    cors: true
  },     
});
await server.register(require('inert'));
server.route({
  method: 'POST',
  path: '/fileupload',
  handler: (request, h) => {
      const data = request.payload;
      if (data.file) {
          const name = data.file.hapi.filename;
          const path = __dirname + "/uploads/" + name ;
          const file = fs.createWriteStream(path);
          file.on('error', (err) => console.error(err));
          data.file.pipe(file);
          data.file.on('end', (err) => { 
              const ret = {
                  filename: data.file.hapi.filename,
                  headers: data.file.hapi.headers 
              }
              console.log(JSON.stringify(ret))
              return JSON.stringify(ret);
          })
      }
      return 'ok';
  },
  options: {
      payload: {
          output: 'stream',
          parse: true,
          allow: 'multipart/form-data'
      }
  }
});


server.route({
    method: 'GET',
    path: '/{image*}',
    handler(request, h) {
        let picname = request.params.image;
        const path = `./uploads/${picname}`; 
        
        try {
            if (!fs.existsSync(path)) {
                picname = 'nodatafound.png';
            }
        } catch (err) {
            console.error(err)
        }
        console.log( h.file(`./uploads/${picname}`))
        return h.file(`./uploads/${picname}`);
    }
});


await server.start();

    console.log('Server running at:', server.info.uri);
};

start();