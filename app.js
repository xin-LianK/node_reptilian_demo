const async = require('async');
const cheerio = require('cheerio');
const request = require('request');
const superagent = require('superagent');
const path = require('path');
const fs = require('fs');
const url = require('url');
const iconv = require('iconv-lite');
var http = require('http')

// const target_url = 'http://www.yaojingweiba.com/manhua/fairytail423_2.shtml';
const img_list = [];

for (let chapter = 423; chapter <= 545; chapter++) {
    target_url = `http://www.yaojingweiba.com/manhua/fairytail${chapter}.shtml`;
    superagent.get(target_url).end(function (err, res) {
        const html = iconv.decode(res.text, 'GBK');
        let $ = cheerio.load(html, { decodeEntities: false });
        const title = $('.w886 h1').text();
        const page = $('.w966 ul li').length;
        for (let index = 2; index <= page - 4; index++) {
            target_item_url = `http://www.yaojingweiba.com/manhua/fairytail${chapter}_${index}.shtml`;
            superagent.get(target_item_url).end(function (err, res) {
                if (err) {
                    fs.appendFile('error.json', JSON.stringify(err), 'utf-8', function (err) {
                        if (err) {
                            console.log('数据写入fail...')
                        };
                        console.log("数据写入success...");
                    })
                    return console.error(err);
                }
                let $ = cheerio.load(res.text);
                const img = $('.w970>p>a>img').attr('src');
                img_list.push(img);

                download(img, `dist/${pageIndex}`).then(() => {
                    console.log(`正在下载第${pageIndex}章中的第${index}张`);
                });
                // fs.exists('data/image', function (exists) {
                //     if (!exists) {
                //         fs.mkdir(`data/image`, function (err) {
                //             if (err) {
                //                 throw err;
                //             }
                //             async.mapSeries(img_list, function (item, callback) {
                //                 setTimeout(function () {
                //                     //downloadPic方法下载图片
                //                     if (item !== undefined) {
                //                         downloadPic(item, '1', `data_${index}.jpg`);
                //                     }
                //                     callback(null, item);
                //                 }, 2000);
                //             }, function (err, results) { });
                //         });
                //         console.log('ye')
                //     } else {
                //         async.mapSeries(img_list, function (item, callback) {
                //             setTimeout(function () {
                //                 //downloadPic方法下载图片
                //                 if (item !== undefined) {
                //                     downloadPic(item, '1', `data_${chapter}_${index}.jpg`);
                //                 }
                //                 callback(null, item);
                //             }, 2000);
                //         }, function (err, results) { });
                //     }
                // })
            })
        }
    })
}

function downloadPic(item, num, name) {
    request(item).pipe(fs.createWriteStream(path.join(`${__dirname}/data/image`, name)));
}


// http.get(target_url, (res) => {
//     let html = ''
//     res.on('data', (chunk) => {
//         html += iconv.decode(chunk, 'GBK');
//         let $ = cheerio.load(html);
//         const title = $('.w886 h1').text();
//         const page = $('.w966 ul li').length;
//         for (let index = 2; index <= 3; index++) {
//             http.get(`${target_item_url}${index}.shtml`,(res)=>{
//                 res.on('data',()=>{
//                     const img = $('.w970>p>a>img').attr('src');
//                     img_list.push(img);
//                 })
//                 res.on('end',()=>{
//                     console.log(img_list)
//                 })
//             });
//         }

//     })
//     res.on('end', () => {
//         res.on('end', () => {
//             //
//         })
//     })
// }).on('error', (e) => {
//     console.log(`http error: ${e.message}`)
// })