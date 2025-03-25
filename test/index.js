/* eslint-disable no-undef */
const diff = require('../lib/diff');
const assert = require('assert');

describe('arc-diff.js', function () {
  it('Basic Empty Object', () => {
    const a = null;
    const b = null;
    const result = diff(a, b);
    assert.equal(result.length, 0);
  });

  it('Basic Equal Object', () => {
    const a = {
      name: 'val',
    };
    const b = {
      name: 'val',
    };
    const result = diff(a, b);
    assert.equal(result.length, 0);
  });

  it('Basic Object Diff', () => {
    const a = {
      name: 'From',
    };
    const b = {
      name: 'To',
    };
    const result = diff(a, b);
    assert.equal(result.length, 1);
    assert.equal(result[0].action, 'UPDATED');
    assert.equal(result[0].dataType, 'string');
    assert.equal(result[0].path, 'name');
    assert.equal(result[0].left, 'From');
    assert.equal(result[0].right, 'To');
  });

  it('Basic Array diff', () => {
    const a = {
      values: [1, 2],
    };
    const b = {
      values: [1, 3],
    };
    const result = diff(a, b);
    assert.equal(result.length, 2);
    assert.equal(result[0].action, 'ADDED');
    assert.equal(result[0].right, 3);

    assert.equal(result[1].action, 'DELETED');
    assert.equal(result[1].left, 2);
  });

  it('Test Property ignore diff', () => {
    const a = {
      id: 123,
      name: 'Monkey',
    };
    const b = {
      id: 567,
      name: 'Monkey',
    };
    const result = diff(a, b, {
      ignore: ['id'],
    });

    assert.equal(result.length, 0);
  });

  it('Test Array Object Ignore diff', () => {
    const a = [
      {
        id: 41995,
        website: 'https://www.google.com/',
        test: null,
      },
    ];

    const b = [
      {
        id: 1560,
        website: 'https://www.google.com/',
        test: null,
      },
    ];

    const result = diff(a, b, {
      ignore: ['id'],
    });

    assert.equal(result.length, 0);
  });
  it('Test Array Object path diff', () => {
    const a = [
      {
        id: 41995,
        website: 'https://www.google.com/',
        test: null,
      },
    ];

    const b = [
      {
        id: 1560,
        website: 'https://www.google.com/',
        test: null,
      },
    ];

    const result = diff(a, b, {
      path: 'website',
      ignore: ['id'],
    });

    assert.equal(result.length, 0);
  });

  it('blabla', () => {
    const a = {
      name: 'John',
      roles: [{ id: 1, role: 'admin' }, { id: 2, role: 'user' }],
      meta: { active: true },
    };

    const b = {
      name: 'Jane',
      roles: [{ id: 4, role: 'superadmin' }, { id: 3, role: 'guest' }],
      meta: { active: false },
    };

    console.log(diff(a, b, { arrayKey: 'id' }));

  });
});
