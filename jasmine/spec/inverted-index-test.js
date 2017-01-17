const Index = require('../../src/js/inverted-index');
const path = './books.json';
let indexInstance = new Index(path);
let jsonData = indexInstance.readFile();
describe('Inverted Index Tests', () => {
    describe('Read book data', () => {
        it('Asserts that JSON file is not empty', () => {
            expect(jsonData.length).toBeGreaterThan(0);
        });
    });

    describe('Populate Index', () => {
        it('Asserts that index is created once JSON file is read', () => {
            expect(indexInstance.getIndex()).toEqual(jasmine.any(Object));
        });
        it('Asserts that the created index is not empty', () => {
            expect(indexInstance.createIndex().length).not.toBe(0);
        });
        it('Verifies that all strig keys are mapped to their objects', () => {
            expect(indexInstance.getIndex()[0]).toEqual({ name: 'Alice', loc: [ 0 ] });
        });
    });
    describe('Search Index', () => {
        it('verifies searchindex returns the corect array of indices', () => {
            expect(indexInstance.searchIndex('of')[0]).toEqual({ name: 'of', loc: [ 0, 1 ] });
        })
    })
})
