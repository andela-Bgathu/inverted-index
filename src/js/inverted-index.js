/**
 * Created by boswellgathu on 13/12/2016.
 */
'use strict';
class InvertedIndex {
    constructor(path) {
        this.path = path;
        //this.fs = require('fs');
    }
    readFile() {
        let dataFile;
        try {
            let file = this.fs.readFileSync(this.path, 'utf8');
            dataFile = JSON.parse(file);
        } catch (e) {
            dataFile = [];
        }
        return dataFile;
    }
    rawIndex() {
            let rawData = [];
            let books = this.readFile(this.path);
            books.forEach((book, index) => {
                let words = JSON.stringify(book)
                    .replace(/,(?=\S)/g, ' ')
                    .replace(/\btitle\b|\btext\b|,(?=\s)|[:.{}""]/g, '')
                    .split(' ');
                words.forEach((word) => {
                    rawData.push([word, index]);
                })
            })
            return rawData;
        }
        // sets the indexData variable
    createIndex() {
            let indexData = [];
            let data = this.rawIndex(); // list of lists
            data.forEach((item) => {
                if (indexData.length == 0) {
                    let tokenObj = {};
                    tokenObj[item[0]] = [item[1]];
                    indexData.push(tokenObj); // {'alice': [1]}
                } else {
                    let tokensList = [];
                    indexData.forEach((token) => {
                        tokensList.push(Object.keys(token)[0]);
                    })
                    if (tokensList.indexOf(item[0]) != -1) {
                        indexData.forEach((token) => {
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
        // returns the Index 
    getIndex() {
        return this.createIndex();
    }

    searchIndex() {
        // set up search terms and file
        if ((arguments[0]).includes('.json')) {
            this.file_to_search = arguments[0];
            delete arguments[0];
            this.search_terms = Object.values(arguments);
        } else {
            this.search_terms = Object.values(arguments);
        }
        // do the actual searching
        let index = this.getIndex();
        let term = this.search_terms[0];
        let searchResults = [];
        this.search_terms.forEach(term => {
            if (!Array.isArray(term)) {
                index.forEach(obj => {
                    if (Object.keys(obj)[0] == term) {
                        searchResults.push(obj);
                    }
                });
            } else {
                term.forEach(item => {
                    index.forEach(obj => {
                        if (Object.keys(obj)[0] == item) {
                            searchResults.push(obj);
                        }
                    });
                })
            }
        })
        return searchResults;
    }

}
// module.exports = InvertedIndex;
// var fs = require('fs');
// const path = '../../books.json';
// var test = new InvertedIndex(path);
//console.log(test.searchIndex('of'));
//console.log(test.searchIndex('file.json', 'of', 'a', 'Lord', 'rings', 'dwarf', 'and', ['Alice', 'alliance']));