class InvertedIndex {
  /**
     * Create an Inverted Index.
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
      return err;
    }
  }
  /*
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
      }
    } else { dataValid = false; }
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
        const words = JSON.stringify(book)
          .replace(/,(?=\S)/g, ' ')
          .replace(/\btitle\b|\btext\b|,(?=\s)|[:.{}""]/g, '')
          .split(' ');
        words.forEach((word) => {
          rawData.push([word.toLowerCase(), index]);
        });
      });
    } else {
      return 'false';
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
    if (dataVerified !== 'false' || dataVerified.includes('File Empty')) {
      return true;
    } else {
      return false;
    }
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
    if (this.checkErrors(cleanedData)) {
      cleanedData.forEach((item) => {
        if (indexData.length === 0) {
          const tokenobject = {
            name: item[0],
            loc: [item[1]]
          };
          indexData.push(tokenobject); // {name:'alice', loc:[1]}
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
            const tokenobject = {
              name: item[0],
              loc: [item[1]]
            };
            indexData.push(tokenobject);
          }
        }
      });
    }
    this.indexes[file] = indexData;
  }
  /**
   * getIndex
   *
   * return the index whose key is the passed filepath.
   *
   * @return {Object} - [name: '', location: [0 || 1 || 0, 1] ].
   */
  getIndex(filepath) {
    return this.indexes[filepath];
  }
  /**
   * searchTerms
   *
   * process search terms in recursive arrays.
   *
   * @param {string} - search terms
   * @return {Array} - [search terms].
   */
  searchTerms(terms) {
    return terms.split(/\W/);
  }
  /**
   * setUpSearch
   *
   * set up filename and search terms.
   *
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
   * searchIndex
   *
   * search the created index.
   *
   * @param {string} - filename.json - optional
   * @param {string} - search terms
   * @return {Object} - [filename: '.json', results: [name: '', location: [0 || 1 || 0, 1]].
   */
  searchIndex(filename, terms) {
    const searchterms = this.searchTerms(terms);
    const searchresults = {};
    if (filename === 'All') {
      (Object.keys(this.indexes)).forEach((index) => {
        const indexobj = [];
        const termlist = [];
        searchterms.forEach((term) => {
          this.indexes[index].forEach((token) => {
            termlist.push(token.name);
          });
          if (termlist.indexOf(term) !== -1) {
            this.indexes[index].forEach((token) => {
              if (token.name === term) {
                indexobj.push({ name: term, loc: token.loc });
              }
            });
          } else {
            indexobj.push({ name: term, loc: [] });
          }
        });
        searchresults[index] = indexobj;
      });
    } else {
      (Object.keys(this.indexes)).forEach((index) => {
        if (index === filename) {
          const indexobj = [];
          const termlist = [];
          searchterms.forEach((term) => {
            this.indexes[index].forEach((token) => {
              termlist.push(token.name);
            });
            if (termlist.indexOf(term) !== -1) {
              this.indexes[index].forEach((token) => {
                if (token.name === term) {
                  indexobj.push({ name: term, loc: token.loc });
                }
              });
            } else {
              indexobj.push({ name: term, loc: [] });
            }
          });
          searchresults[index] = indexobj;
        }
      });
    }
    return searchresults;
  }
}
