console.log("Doribot starting :D")

const Twit = require("twit");
const http = require("http");
const schedule = require("node-schedule");
const config = require("./config");
const nameFilter = require("./nameFilter");
const fs = require("fs");
const T = new Twit(config);
const currencyConfig = require("./currencyconfig");

function filterHashtag(data){
  var ret = [];
  data[0].trends.forEach((element) => {
    if(element.name.indexOf("#") != -1){
      var adic = ret.length;
      nameFilter.forEach((name) => {
        if(adic == ret.length && element.name.toLowerCase().indexOf(name.toLowerCase()) != -1 ){
          ret.push(element.name);
        }
      });
    }
  });
  return ret;
}

function generateMessage(dolar, hashtags){
  var msg = 'O dólar está: ' + String(dolar) + '\nGrande dia\n'
  hashtags.forEach((element) => {
    msg += element + ' ';
  });
  msg += '#doribot'
  return msg;
}

schedule.scheduleJob('0 */2 * * *', () => {
    http.get(currencyConfig.url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
            var BRL = parseFloat(JSON.parse(data).rates.BRL);
            var USD = parseFloat(JSON.parse(data).rates.USD);
            var real = Math.round((BRL/USD) * 100) / 100;
            if (real >= 4.00){
              var b64content = fs.readFileSync('bolso.jpg', { encoding: 'base64' });
              T.get('trends/place', {id : '23424768'}, (err, data, res) => {
                var tweets = data;
                T.post('media/upload', { media_data: b64content }, function (err, data, response) {
                  var mediaIdStr = data.media_id_string
                  var altText = "Bolsominion"
                  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
                  T.post('media/metadata/create', meta_params, function (err, data, response) {
                    if (!err) {
                      var params = { status: generateMessage(real, filterHashtag(tweets)), media_ids: [mediaIdStr] }     
                      T.post('statuses/update', params, function (err, data, response) {
                        console.log(data);
                      });
                    }
                  });
                });
              });
            }
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
})