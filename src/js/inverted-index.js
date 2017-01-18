/**
 * Created by boswellgathu on 13/12/2016.
 */
'use strict';
module.exports = class InvertedIndex {
    constructor(path) {
        this.path = path
    }
    readFile() {
        let dataFile = [];
        try {
            let fs = require('fs');
            let filedata = fs.readFileSync(this.path);
            let jsondata = JSON.parse(filedata);
            dataFile.push(...jsondata);
        } catch (e) {
            if (e instanceof SyntaxError) {
                dataFile = 'file empty';
            }
        }
        return dataFile;
    }

    rawIndex() {
        let rawData = [];
        let books = this.readFile();
        // check if the json is the expected
        let keys = [];
        if (books.length != 0) {
            books.forEach((book) => {
                keys.push(...Object.keys(book));
            })
            let k = new Set(keys);
            keys = Array.from(k);
            if (keys[0] == "title" || keys[0] == "text") {
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
            } else {
                return 'wrong data';
            }
        } else {
            return 'read data is empty';
        }
    }
    createIndex() {
            let indexData = [];
            let data = this.rawIndex(); // list of list
            if (data != 'wrong data' || data != 'read data is empty') {
                data.forEach((item) => {
                    if (indexData.length == 0) {
                        let tokenObj = {
                            name: item[0],
                            loc: [item[1]]
                        };
                        indexData.push(tokenObj); // {name:'alice', loc:[1]}
                    } else {
                        let tokensList = [];
                        indexData.forEach((token) => {
                            tokensList.push(token.name);
                        })
                        if (tokensList.indexOf(item[0]) != -1) {
                            indexData.forEach((token) => {
                                if (token.name == item[0]) {
                                    token.loc.push(item[1]);
                                    let t = new Set(token.loc);
                                    token.loc = Array.from(t);
                                }
                            })
                        } else {
                            let tokenObj = {
                                name: item[0],
                                loc: [item[1]]
                            };
                            indexData.push(tokenObj);
                        }
                    }
                })
                return indexData;
            } else {
                return ('empty index');
            }
        }
        // returns the Index
    getIndex() {
        this.searchData = this.createIndex();
        return this.searchData;
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
        let index = this.searchData;
        let searchResults = [];
        if (index != 'empty index') {
            this.search_terms.forEach(term => {
                if (!Array.isArray(term)) {
                    index.forEach(obj => {
                        if (obj.name == term) {
                            searchResults.push(obj);
                        }
                    });
                } else {
                    term.forEach(item => {
                        index.forEach(obj => {
                            if (obj.name == item) {
                                searchResults.push(obj);
                            }
                        });
                    })
                }
            })
            return searchResults;
        } else {
            return ('Index is empty');
        }
    }
}