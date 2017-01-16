app.factory('InvertedIndex', () => {
    'use strict';
    class InvertedIndex {
        constructor(path) {
            this.path = path;
        }
        readFile() {
            let file = this.path;
            if (typeof file !== 'undefined') {
                let data = [];
                let reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        let json = JSON.parse(e.target.result);
                        data.push(...json);
                    } catch (e) {
                        console.log('not a valid json file');
                    }
                }
                reader.readAsText(file);
                return data;
            } else {
                console.log('file is empty');
            }
        }
        rawIndex() {
                let rawData = [];
                let books = this.readFile(this.path);
                return books;
                // books.forEach((book, index) => {
                //     let words = JSON.stringify(book)
                //         .replace(/,(?=\S)/g, ' ')
                //         .replace(/\btitle\b|\btext\b|,(?=\s)|[:.{}""]/g, '')
                //         .split(' ');
                //     words.forEach((word) => {
                //         rawData.push([word, index]);
                //     });
                //     console.log(rawData);
                // })
                // return rawData;
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
    return { InvertedIndex: InvertedIndex };
});