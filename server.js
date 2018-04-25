const express = require('express')
const cheerio = require('cheerio')
var fs = require('fs');
const app = express();
var _ = require('underscore');
const jsdom = require("jsdom");
const html = fs.readFileSync('./watch-history.html', {encoding: 'utf8'})

const $ = cheerio.load(html);
let textArr = []

$('a').each(function(i, elem) {
    textArr[i] = {
        name: $(this).text(),
        url: $(this).attr('href')
    };
});

const group = {}

textArr.forEach(function(item){
    if(item.url.includes('watch')) {
        const name = item.name;
        if(group[name]) {
            group[name].count = group[name].count + 1;
            group[name].name = item;
        } else {
            group[name] = {
                count: 1,
                name: item
            };
        }
    }
});

let test = _.groupBy(group, 'count');

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.send(test);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))