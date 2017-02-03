class InvertedIndex {

  /**
   * Create an Inverted Index.
   *
   * @param {Object} Indexes - holds each index as value and key as the index's file name.
   */
  constructor() {
    this.indexes = {}; // holds all indexes created
  }

  /**
   * getJson
   *
   * Convert data to JSON Object.
   *
   * @param {string} readData - read from a file in byte or other form.
   * @returns {Object}  - json object from the file.
   */
  getJson(readData) {
    try {
      return JSON.parse(readData);
    } catch (err) {
      if (err instanceof SyntaxError) {
        return false;
      }
    }
  }

  /**
   * validateJsonData
   *
   * Verify data is valid and has both 'text' and 'title' as keys for each object.
   *
   * @param {Object} JsonData - JSON read from a json file.
   * @returns {bool} - true || false.
   */
  validateJsonData(JsonData) {
    let dataValid = false;
    const keyArray = []; // hold all the objects keys
    if (Array.isArray(JsonData)) {
      JsonData.forEach((book) => {
        keyArray.push(...(Object.keys(book)));
      });
      const keys = Array.from(new Set(keyArray));
      if (keys.length === 2 && keys.includes('text', 'title')) {
        dataValid = true;
      } else {
        dataValid = false;
      }
    } else {
      dataValid = false;
    }
    return dataValid;
  }

  /**
   * cleanData
   *
   * return an array of each word and its location.
   *
   * @param {Object} JsonData - JSON read from a json file.
   * @returns {Object} - [word, location: [0 || 1 || 0, 1] ].
   */
  cleanData(JsonData) {
    const rawData = [];
    if (this.validateJsonData(JsonData)) {
      JsonData.forEach((book, index) => {
        const words = `${book.text} ${book.title}`.split(/\W/);
        words.forEach((word) => {
          if (word.trim().length !== 0) {
            rawData.push([word.toLowerCase(), index]);
          }
        });
      });
    } else {
      rawData = 'false';
    }
    return rawData;
  }

  /**
   * checkErrors
   *
   * Check if an error string is passed into it instead of an array or object.
   *
   * @param {object}  - from cleanData or getJson.
   * @returns {bool} - true or false.
   */
  checkErrors(dataVerified) {
    let hasError;
    if (dataVerified !== 'false' || dataVerified.includes('File Empty')) {
      hasError = true;
    } else {
      hasError = false;
    }
    return hasError;
  }

  /**
   * createIndex
   *
   * Creates an index for each file passed to it.
   *
   * @param {Array}  - from cleanData.
   * @return {Object} - [word: '', location: [0 || 1 || 0, 1] ].
   */
  createIndex(file, data) {
    const cleanedData = this.cleanData(this.getJson(data));
    const indexData = [];
    const tokensList = [];
    if (this.checkErrors(cleanedData)) {
      cleanedData.forEach((item) => {
        if (tokensList.indexOf(item[0]) !== -1) {
          indexData.forEach((token) => {
            if (token.name === item[0]) {
              token.loc.push(item[1]);
              const temp = new Set(token.loc);
              token.loc = Array.from(temp);
            }
          });
        } else {
          const tokenobject = {
            name: item[0],
            loc: [item[1]]
          };
          tokensList.push(item[0]);
          indexData.push(tokenobject);
        }
      });
    }
    this.indexes[file] = indexData;
  }

  /**
   * getIndex
   *
   * return the index whose key is the passed filename.
   *
   * @return {Object} - [name: '', location: [0 || 1 || 0, 1] ].
   */
  getIndex(filename) {
    return this.indexes[filename];
  }

  /**
   * searchTerms
   *
   * process search terms in recursive arrays.
   *
   * @param {string} - search terms
   * @return {Array} - [search terms].
   */
  getSearchTerms(terms) {
    return terms.split(/\W/);
  }

  /**
   * getIndexResult
   *
   * search the passed index.
   *
   * @param {string} - index - name of a specific index being searched
   * @param {string} - search terms
   * @return {Object} - [name: '', location: [0 || 1 || 0, 1].
   */
  getIndexResult(index, searchterms) {
    const resultObj = [];
    searchterms.forEach((term) => {
      let termfound = false;
      this.indexes[index].forEach((token) => {
        if (token.name === term) {
          termfound = true;
          resultObj.push({
            name: term,
            loc: token.loc
          });
        }
      });
      if (termfound === false) {
        resultObj.push({
          name: term,
          loc: []
        });
      }
    });
    return resultObj;
  }

  /**
   * searchIndex
   *
   * search the created index.
   *
   * @param {string} - filename.json  or 'All'
   * @param {string} - search terms
   * @return {Object} - [filename: '.json', results: [name: '', location: [0 || 1 || 0, 1]].
   */
  searchIndex(filename, terms) {
    const searchterms = this.getSearchTerms(terms);
    const searchresults = {};
    if (filename === 'All') {
      (Object.keys(this.indexes)).forEach((index) => {
        searchresults[index] = this.getIndexResult(index, searchterms);
      });
    } else {
      (Object.keys(this.indexes)).forEach((index) => {
        if (index === filename) {
          searchresults[index] = this.getIndexResult(index, searchterms);
        }
      });
    }
    return searchresults;
  }
}
