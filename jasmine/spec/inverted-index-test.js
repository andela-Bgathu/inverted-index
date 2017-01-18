const Index = require('../../src/js/inverted-index');
describe('Inverted Index Tests', () => {
    const path = './books.json';
    let indexInstance = new Index(path);
    describe('Read book data', () => {
        it('Asserts that JSON file is not empty', () => {
            expect(indexInstance.readFile().length).toBeGreaterThan(0);
        });
    });

    describe('Populate Index', () => {
        it('Asserts that index is created once JSON file is read', () => {
            expect(indexInstance.rawIndex()).toEqual(jasmine.any(Object));
        });
        it('Asserts that the created index is not empty', () => {
            expect(indexInstance.createIndex().length).not.toBe(0);
        });
        it('Verifies that all strig keys are mapped to their objects', () => {
            expect(indexInstance.getIndex()[0]).toEqual({ name: 'Alice', loc: [0] });
        });
    });
    describe('Search Index', () => {
        it('verifies searchindex returns the corect array of indices', () => {
            expect(indexInstance.searchIndex('of')[0]).toEqual({ name: 'of', loc: [0, 1] });
        })
        it('should be able to process search query with multiple words and arrays', () => {
            expect(indexInstance.searchIndex('of', ['Alice', 'ring'])[2]).toEqual({ name: 'ring', loc: [1] });
        })
        it('should return a message when a serch term is not found', () => {
            expect(indexInstance.searchIndex('grace')[0]).toBe(undefined);
        })
    })

})

describe('Inverted Index Tests', () => {
    const path1 = './empty1.json';
    let indexInstance1 = new Index(path1);
    describe('Read book data', () => {
        it('Asserts that JSON file is empty', () => {
            expect(indexInstance1.readFile()).toBe('file empty');
        });
    });
    describe('Search Index', () => {
        it('verifies searchindex returns nothing when index is empty', () => {
            expect(indexInstance1.searchIndex('of.json')).toEqual([]);
        })
    })

})