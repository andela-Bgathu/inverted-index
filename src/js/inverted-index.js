/**
 * Created by boswellgathu on 13/12/2016.
 */
'use strict';
class InvertedIndex {
    constructor() {
        this.dataFile = [];
    }
    readFile(jsondata) {
        try {
            let data = JSON.parse(jsondata);
            this.dataFile.push(...data);
        } catch (e) {
            this.dataFile = [];
        }
        return this.dataFile;
    }
    rawIndex(jsondata) {
        let rawData = [];
        let books = this.readFile(jsondata);
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
    createIndex(jsondata) {
            let indexData = [];
            let data = this.rawIndex(jsondata); // list of lists
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
        }
        // returns the Index 
    getIndex(jsondata) {
        this.searchData = this.createIndex(jsondata);
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
        console.log(this.search_terms);
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
    }

}
//export default InvertedIndex;
// var fs = require('fs');
// const path = '../../books.json';
// var test = new InvertedIndex(path);
// console.log(test.getIndex());
// console.log(test.searchIndex('file.json', 'of', 'a', 'Lord', 'rings', 'dwarf', 'and', ['Alice', 'alliance']));