console.log("Doribot starting :D")

const Twit = require("twit");
const http = require("http");
const schedule = require("node-schedule");
const config = require("./config");
const fs = require("fs");
const T = new Twit(config);
const currencyConfig = require("./currencyconfig");

schedule.scheduleJob({hour: 22, minute: 00}, () => {
    http.get(currencyConfig.url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
            var BRL = parseFloat(JSON.parse(data).rates.BRL);
            var USD = parseFloat(JSON.parse(data).rates.USD);
            var b64content = fs.readFileSync('bolso.jpg', { encoding: 'base64' })
            T.post('media/upload', { media_data: b64content }, function (err, data, response) {
              var mediaIdStr = data.media_id_string
              var altText = "Bolsominion"
              var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
            
              T.post('media/metadata/create', meta_params, function (err, data, response) {
                if (!err) {
                  var params = { status: 'O Dollar está: ' + String(Math.round((BRL/USD) * 100) / 100) + '\nGrande dia.\n#doribot #dollarhoje #bolsonaro', media_ids: [mediaIdStr] }     
                  T.post('statuses/update', params, function (err, data, response) {
                    console.log(data)
                  })
                }
              })
            })
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
})