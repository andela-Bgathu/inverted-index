/**
 * Created by boswellgathu on 13/12/2016.
 */
'use strict';
class InvertedIndex {
    constructor(path) {
        this.path = path;
    }
    readFile() {
        var file;
        file = fs.readFileSync(this.path, 'utf8');
        return JSON.parse(file);
    }
    rawIndex() {
        let rawData = [];
        let books = this.readFile(this.path);
        books.forEach(function(book, index) {
            let words = JSON.stringify(book)
                .replace(/,(?=\S)/g, ' ')
                .replace(/\btitle\b|\btext\b|,(?=\s)|[:.{}""]/g, '')
                .split(' ');
            words.forEach(function(word) {
                rawData.push([word, index]);
            })
        })
        return rawData;
    }
    createIndex() {
        let indexData = [];
        let data = this.rawIndex(); // list of lists
        data.forEach(function(item) {
            if (indexData.length == 0) {
                let tokenObj = {};
                tokenObj[item[0]] = [item[1]];
                indexData.push(tokenObj); // {'alice': [1]}
            } else {
                let tokensList = [];
                indexData.forEach(function(token) {
                    tokensList.push(Object.keys(token)[0]);
                })
                if (tokensList.indexOf(item[0]) != -1) {
                    indexData.forEach(function(token) {
                        if (Object.keys(token)[0] == item[0]) {
                            token[item[0]].push(item[1]);
                            let t = new Set(token[item[0]]);
                            token[item[0]] = Array.from(t);
                        }
                    })
                } else {
                    let tokenObj = {};
                    tokenObj[item[0]] = [item[1]];
                    indexData.push(tokenObj);
                }
            }
        })
        return indexData;
    }

}

var fs = require('fs');
const path = '../../books.json';
var test = new InvertedIndex(path);
console.log(test.createIndex());