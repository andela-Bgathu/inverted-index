class InvertedIndex {

  /**
     * Create an Inverted Index.
     * @param {string} path - path to file.
     */
  constructor() {
    this.indexes = {}; // holds all indexes created
    this.path = require('path');
  }
  /**
     * Read a File.
     * @param {string} path - path to file.
     * @return {string} fileData - read from a file.
     */
  readFile(filepath) {
    if (filepath) {
      const fs = require('fs');
      try {
        const fileData = fs.readFileSync(filepath, 'utf-8');
        return fileData;
      } catch (err) {
        if (err.code === 'ENOENT') {
          return 'file Not Found';
        }
      }
    }
  }

  /**
     * Convert data to JSON.
     * @param {string} readData - read from a file in byte or other form.
     * @return {Object} json object from the file.
     */
  getJson(readData) {
    try {
      return JSON.parse(readData);
    } catch (err) {
      if (err instanceof SyntaxError) {
        return 'File Empty or Invalid Json object';
      }
    }
  }

  /**
   * Verify data is valid.
   * @param {Object} JsonData - JSON read from a json file.
   * @return {bool} - true || false.
   */
  validateJsonData(JsonData) {
    let dataValid;
    const keyArray = []; // hold all the objects keys
    if (Array.isArray(JsonData)) {
      JsonData.forEach((book) => {
        keyArray.push(...(Object.keys(book)));
      });
      const keys = Array.from(new Set(keyArray));
      if (keys.length === 2 && keys.includes('title', 'text')) {
        dataValid = true;
      } else { dataValid = false; }
    } else { dataValid = false; }
    return dataValid;
  }

  /**
   * return cleaned data.
   * @param {Object} JsonData - JSON read from a json file.
   * @return {Object} - [word, location: [0 || 1 || 0, 1] ].
   */
  cleanData (JsonData) {
    if (this.validateJsonData(JsonData)) {
      const rawData = [];
      JsonData.forEach((book, index) => {
        const words = JSON.stringify(book)
          .replace(/,(?=\S)/g, ' ')
          .replace(/\btitle\b|\btext\b|,(?=\s)|[:.{}""]/g, '')
          .split(' ');
        words.forEach((word) => {
          rawData.push([word.toLowerCase(), index]);
        });
      });
      return rawData;
    } else {
      return 'false';
    }
  }

  /**
   * Verify data sent back if an error retur false.
   * @param {object}  - from cleanData or getJson.
   * @return {bool} - true or false.
   */
  checkErrors(dataVerified) {
    if (dataVerified !== 'false' || dataVerified.includes('File Empty')) {
      return true;
    } else {
      return false;
    }
  }

    /**
   * Create an index.
   * @param {Array}  - from cleanData.
   * @return {Object} - [word: '', location: [0 || 1 || 0, 1] ].
   */
  createIndex(filepath) {
    const cleanedData = this.cleanData(this.getJson(this.readFile(filepath)));
    const indexData = [];
    if (this.checkErrors(cleanedData)) {
      cleanedData.forEach((item) => {
        if (indexData.length === 0) {
          const tokenObj = {
            name: item[0],
            loc: [item[1]]
          };
          indexData.push(tokenObj); // {name:'alice', loc:[1]}
        } else {
          const tokensList = [];
          indexData.forEach((token) => {
            tokensList.push(token.name);
          });
          if (tokensList.indexOf(item[0]) !== -1) {
            indexData.forEach((token) => {
              if (token.name === item[0]) {
                token.loc.push(item[1]);
                const t = new Set(token.loc);
                token.loc = Array.from(t);
              }
            });
          } else {
            const tokenObj = {
              name: item[0],
              loc: [item[1]]
            };
            indexData.push(tokenObj);
          }
        }
      });
    }
    this.indexes[this.path.basename(filepath)] = indexData;
  } // end of createIndex

  /**
   * return Index.
   * @return {Object} - [name: '', location: [0 || 1 || 0, 1] ].
   */
  getIndex(filepath) {
    return this.indexes[this.path.basename(filepath)];
  }
  /**
   * process search terms in recursive arrays.
   * @param {string} - filename.json
   * @param {string} - search terms
   * @return {Array} - [search terms].
   */
  searchTerms(terms) {
    const termsList = [];
    function getTerms(terms) {
      terms.forEach((term) => {
        if (Array.isArray(term)) {
          getTerms(term);
        } else {
          termsList.push(term);
        }
      });
    }
    getTerms(terms);
    return termsList;
  }

    /**
   * set up filename and search terms.
   * @param {string} - filename.json - optional
   * @param {string} - search terms
   * @return {Array} - [filename, [terms]].
   */
  setUpSearch(terms) {
    let filename = undefined;
    const termsList = [];
    if (terms[0].includes('.json')) {
      filename = terms[0];
      delete terms[0];
      termsList.push(...this.searchTerms(terms));
    } else {
      termsList.push(...this.searchTerms(terms));
    }
    return [filename, termsList];
  }
  /**
   * search the created index.
   * @param {string} - filename.json - optional
   * @param {string} - search terms
   * @return {Object} - [filename: '.json', results: [name: '', location: [0 || 1 || 0, 1]].
   */
  searchIndex(...terms) {
    const termslist = this.setUpSearch(terms);
    const filename = termslist[0];
    const searchterms = termslist[1];
    const searchresults = [];
    if (filename === undefined) {
      for (const index of Object.keys(this.indexes)) {
        const indexobj = [];
        this.indexes[index].forEach((indexvalues) => {
          if (searchterms.indexOf(indexvalues.name) !== -1) {
            indexobj.push(indexvalues);
          }
        });
        searchresults.push({ file: index, results: indexobj });
      }
    } else {
      for (const index of Object.keys(this.indexes)) {
        if (index === filename) {
          const indexobj = [];
          this.indexes[filename].forEach((indexvalues) => {
            if (searchterms.indexOf(indexvalues.name) !== -1) {
              indexobj.push(indexvalues);
            }
          });
          searchresults.push({ file: filename, results: indexobj });
        }
      }
    }
    return searchresults;
  }
}

module.exports = InvertedIndex;
