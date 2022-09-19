const diff = require('./lib/diff');
const assert = require('assert')

describe('arc-diff.js', function() {
    it('Basic Object', () => {
        const a = {
            name: 'From',
        }
        const b = {
            name: 'To',
        }
        const result = diff(a, b)
        assert.equal(result.length, 1);
        assert.equal(result[0].action, 'UPDATED')
        assert.equal(result[0].dataType, 'string')
        assert.equal(result[0].path, 'name')
        assert.equal(result[0].left, 'From')
        assert.equal(result[0].right, 'To')
    })

    it('Basic Array', () => {
        const a = {
            values: [1,2]
        }
        const b = {
            values: [1,3]
        }
        const result = diff(a, b)
        assert.equal(result.length, 2);
        assert.equal(result[0].action, 'ADDED')
        assert.equal(result[0].right, 3)

        assert.equal(result[1].action, 'DELETED')
        assert.equal(result[1].left, 2)
    })
})