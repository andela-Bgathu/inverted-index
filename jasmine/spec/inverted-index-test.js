const InvertedIndex = require("../../src/js/inverted-index.js");

describe('test functionality', () => {

  const path1 = [
    {
      "text": "Alice falls into a rabbit hole and enters a world full of imagination.",
      "title": "Alice in Wonderland"
    },
    {
      "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.",
      "title": "The Lord of the Rings: The Fellowship of the Ring."
    }
  ];

  const path2 = __dirname + '/books.json';
  const path3 = __dirname + '/wysla.json';
  const path4 = __dirname + '/invalid.json';
  const path5 = __dirname + '/empty.json';
  const path6 = __dirname + '/notExist.json';
  const path7 = __dirname + '/incomplete.json';
  const path8 = __dirname + '/invalidjson.json';

  const index = new InvertedIndex();

  describe('tests readFile function', () => {
    it('tests readFile returns data in file', () => {
      expect(index.readFile(path2).includes('"title": "Alice in Wonderland"')).toBe(true);
    });

    it('tests readFile checks if a file does not exist', () => {
      expect(index.readFile(path6)).toBe('file Not Found');
    });
  });

  describe('tests getJson function', () => {
    it('tests getJson returns Json object', () => {
      const data = index.readFile(path2);
      expect(index.getJson(data).length).toBe(2);
    });

    it('tests getJson returns a message when file is empty or has ivalid json', () => {
      const empty = index.readFile(path5);
      const invalidjson = index.readFile(path7);
      expect(index.getJson(empty)).toBe('File Empty or Invalid Json object');
      expect(index.getJson(invalidjson)).toBe('File Empty or Invalid Json object');
    });
  });

  describe('tests validateJsonData function', () => {
    it('tests validateJsonData returns true when book data is valid', () => {
      expect(index.validateJsonData(path1)).toBe(true);
    });

    it('tests validateJsonData returns false when book data is invalid', () => {
      const bookdata = index.getJson(index.readFile(path4));
      expect(index.validateJsonData(bookdata)).toBe(false);
    });

    it('tests validateJsonData returns false when book data is invalid', () => {
      const bookdata = index.getJson(index.readFile(path8));
      expect(index.validateJsonData(bookdata)).toBe(false);
    });
  });

  describe('tests cleanData function', () => {
    it('tests cleanData returns false when data is not valid json', () => {
      const bookdata = index.getJson(index.readFile(path4));
      expect(index.cleanData(bookdata)).toBe('false');
    });

    it('tests cleanData returns rawData', () => {
      expect(index.cleanData(path1).length).toEqual(42);
    });
  });

  describe('tests checkErrors function', () => {
    it('tests checkErrors returns true when no errors', () => {
      expect(index.checkErrors([{}])).toBe(true);
    });

    it('tests checkErrors returns false when no errors', () => {
      expect(index.checkErrors('false')).toBe(false);
    });
  });

  describe('tests searchTerms function', () => {
    it('tests searchTerms returns expected terms', () => {
      const terms = index.searchTerms(['of', 'alice']);
      expect(terms).toBeDefined(true);
      expect(terms).toEqual(['of', 'alice']);
    });

    it('tests searchTerms returns individual terms when using recursive arrays', () => {
      const terms = index.searchTerms([
        ['a', 'alice'], 'me', [
          ['help', ['me', 'out']], 'help'
        ]
      ]);

      expect(terms).toEqual(['a', 'alice', 'me', 'help', 'me', 'out', 'help']);
    });
  });

  describe('Read book data', () => {
    it('Asserts that a read Json file is not empty', () => {
      expect(index.getJson(index.readFile(path2)).length).toEqual(2);
    });

    it('Asserts that if a file has invalid Json there is a msg', () => {
      expect(index.getJson(index.readFile(path7))).toBe('File Empty or Invalid Json object');
    });
  });

  describe('Populate Index', () => {
    it('Verifies that Index is created once a Json file is read', () => {
      index.createIndex(path2);
      expect(Object.keys(index.indexes).length).toBeGreaterThan(0);
    });

    it('Ensure each object in JSON array contains a property whose value is a string', () => {
      const indexData = index.getJson(index.readFile(path3));
      expect(typeof indexData[0].text).toBe('string');
      expect(typeof indexData[0].title).toBe('string');
    });

    it('verifies the index maps string keys to correct objects in the Json array', () => {
      index.createIndex(path2);
      expect(index.indexes['books.json'][0].loc).toEqual([0]);
      expect(index.indexes['books.json'][5].loc).toEqual([0, 1]);
    });

    it('Ensure index is not overwritten by a new JSON file', () => {
      index.createIndex(path2);
      index.createIndex(path3);
      expect(index.indexes['books.json']).toBeDefined(true);
      expect(index.indexes['wysla.json']).toBeDefined(true);
    });
  });

  describe('GetIndex', () => {
    it('Ensure getIndex takes a string arg specifying the location of the JSON data', () => {
      index.createIndex(path3);
      expect(index.getIndex('wysla.json')).toBeDefined(true);
    });
  });

  describe('Search index', () => {
    it('verifies that a search returns an array of indices of correct objects', () => {
      index.createIndex(path2);
      expect(index.searchIndex('of')[0].results[0].loc).toEqual([0, 1]);
      expect(index.searchIndex('alice')[0].results[0].loc).toEqual([0]);
      expect(index.searchIndex('and')[0].results[0].loc).toEqual([0, 1]);
    });

    it('verifies that a searchresults include filenames', () => {
      index.createIndex(path3);
      const searchresult = index.searchIndex('boswell');
      expect(searchresult[1].file).toEqual('wysla.json');
      expect(searchresult[1].results[0].name).toEqual('boswell');
    });

    it('verifies that if a filename is included as parameter, the correct results are returned', () => {
      index.createIndex(path3);
      const searchresult = index.searchIndex('wysla.json', 'boswell');
      expect(searchresult[0].file).toEqual('wysla.json');
      expect(searchresult[0].results[0].name).toEqual('boswell');
      expect(searchresult[0].results[0].loc).toEqual([0]);
    });

    it('Ensure search does not take too long to execute', () => {
      index.createIndex(path3);
      const now = new Date().getTime();
      const result = (index.searchIndex('wysla.json', 'i', ['a', 'alice'], 'me', [
        ['help', ['me', 'out']], 'help', ['me', ['help', ['me', 'out']], 'out']
      ])[0].results);
      const end = new Date().getTime();
      expect(result).toEqual([{
        name: 'i',
        loc: [0]
      }]);
      expect(end - now).toBeLessThan(2);
    });
  });
});
