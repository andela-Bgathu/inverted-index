'use strict';
const Index = require('../../src/js/inverted-index');
const path = './books.json';
var indexInstance = new InvertedIndex(path);
describe('Inverted Index Tests', () => {

    describe('Read book data', () => {
        let data = indexInstance.readFile()
        it('Asserts that JSON file is not empty', (done) => {
            expect(indexInstance.readFile().length).toBeGreaterThan(0);
            done();
        });
    });

    describe('Populate Index', () => {
        it('Asserts that index is created once JSON file is read', (done) => {
            expect(indexInstance.getIndex()).toEqual(jasmine.any(Object));
            done();
        });
        it('Asserts that the created index is not empty', () => {
            expect(indexInstance.getIndex().length).not.toBe(0);
        });
        it('Verifies that all strig keys are mapped to their objects', () => {
            expect(indexInstance.getIndex()[0]).toEqual({ Alice: [0] });
        });
    });

    describe('Search Index', () => {
        it('verifies searchindex returns the corect array of indices', () => {
            expect(indexInstance.searchIndex('of')[0]).toEqual({ of: [0, 1] });
        })
    })
})