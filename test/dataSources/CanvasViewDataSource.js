import {assert} from 'chai';
import canvasItems from '../fixtures/canvas.json';
import CanvasViewDataSource from '../../src/datasources/CanvasViewDataSource';
import sinon from 'sinon';

describe('Canvas View datasource page', function () {
  let dataSource,
    item = {
      id: '71',
      minHeight: 50,
      name: 'Description'
    };

  beforeEach(function () {
    dataSource = new CanvasViewDataSource({
      items: JSON.parse(JSON.stringify(canvasItems))
    });
  });

  it('has correct functions', function () {
    assert.isFunction(dataSource.performDrop);
    assert.isFunction(dataSource.insertItem);
    assert.isFunction(dataSource.insertItem);
    assert.isFunction(dataSource.insertSection);
    assert.isFunction(dataSource.getNumberOfSections);
    assert.isFunction(dataSource.getItemsInColumn);
    assert.isFunction(dataSource.getNumberOfColumns);
    assert.isFunction(dataSource.getSectionLength);
    assert.isFunction(dataSource.getItem);
    assert.isFunction(dataSource.getFieldIndex);
    assert.isFunction(dataSource.normalizeItem);
    assert.isFunction(dataSource.getState);
  });

  it('has successfully executed getNumberOfSections function', function () {
    let getNumberOfSectionsSpy = sinon.spy(dataSource, 'getNumberOfSections');
    dataSource.getNumberOfSections();
    assert.equal(getNumberOfSectionsSpy.firstCall.returnValue, 4);
    getNumberOfSectionsSpy.restore();
  });

  it('has successfully executed getItemsInColumn function', function () {
    let getItemsInColumnSpy = sinon.spy(dataSource, 'getItemsInColumn');
    
    dataSource.getItemsInColumn(0, 0);
    assert.deepEqual(getItemsInColumnSpy.firstCall.returnValue, canvasItems[0].fields[0]);
    
    dataSource.getItemsInColumn(0, 1);
    assert.deepEqual(getItemsInColumnSpy.secondCall.returnValue, canvasItems[0].fields[1]);

    getItemsInColumnSpy.restore();
  });

  it('has successfully executed getNumberOfColumns function', function () {
    let getNumberOfColumnsSpy = sinon.spy(dataSource, 'getNumberOfColumns');
    
    dataSource.getNumberOfColumns(0);
    assert.equal(getNumberOfColumnsSpy.firstCall.returnValue, 2);
    
    dataSource.getNumberOfColumns(1);
    assert.equal(getNumberOfColumnsSpy.secondCall.returnValue, 2);

    dataSource.getNumberOfColumns(2);
    assert.equal(getNumberOfColumnsSpy.thirdCall.returnValue, 2);

    dataSource.getNumberOfColumns(3);
    assert.equal(getNumberOfColumnsSpy.lastCall.returnValue, 1);

    getNumberOfColumnsSpy.restore();
  });

  it('has successfully executed getSectionLength function', function () {
    let getSectionLengthSpy = sinon.spy(dataSource, 'getSectionLength');
    
    dataSource.getSectionLength(0);
    assert.equal(getSectionLengthSpy.firstCall.returnValue, 2);
    
    dataSource.getSectionLength(1);
    assert.equal(getSectionLengthSpy.secondCall.returnValue, 2);

    dataSource.getSectionLength(2);
    assert.equal(getSectionLengthSpy.thirdCall.returnValue, 3);

    dataSource.getSectionLength(3);
    assert.equal(getSectionLengthSpy.lastCall.returnValue, 1);

    getSectionLengthSpy.restore();
  });

  it('has successfully executed getItem function', function () {
    let getItemSpy = sinon.spy(dataSource, 'getItem');
    dataSource.getItem(0, 0);
    assert.deepEqual(getItemSpy.firstCall.returnValue, canvasItems[0].fields[0][0]);
    getItemSpy.restore();
  });

  it('has successfully executed insertSection function', function () {
    let insertSectionSpy = sinon.spy(dataSource, 'insertSection');
    
    assert.equal(dataSource.getNumberOfSections(), 4);
    
    dataSource.insertSection(0, item);
    
    assert.equal(dataSource.getNumberOfSections(), 5);
    insertSectionSpy.restore();
  });

  it('has successfully executed insertColumn function', function () {
    let insertColumnSpy = sinon.spy(dataSource, 'insertColumn'),
      section = 3;

    assert.equal(dataSource.getNumberOfColumns(section), 1);
  
    dataSource.insertColumn(section, item);
  
    assert.equal(dataSource.getNumberOfColumns(section), 2);
    insertColumnSpy.restore();
  });

  it('has successfully executed insertItem function', function () {
    let insertItemSpy = sinon.spy(dataSource, 'insertItem'),
      getFieldIndexSpy = sinon.spy(dataSource, 'getFieldIndex'),
      section = 0, index = 0;

    assert.equal(dataSource.getSectionLength(section), 2);
    assert.equal(dataSource.getItemsInColumn(section, 0).length, 1);
  
    dataSource.insertItem(section, index, item);

    assert(getFieldIndexSpy.calledOnce);
    assert.equal(dataSource.getItemsInColumn(section, 0).length, 2);
    assert.equal(dataSource.getSectionLength(section), 3);
    insertItemSpy.restore();
    getFieldIndexSpy.restore();
  });

  it('has successfully executed getFieldIndex function', function () {
    let getFieldIndexSpy = sinon.spy(dataSource, 'getFieldIndex'),
      section = 2, index = 2;

    dataSource.getFieldIndex(section, index);
    assert.deepEqual(getFieldIndexSpy.firstCall.returnValue, {column: '1', fieldIndex: 1});
    getFieldIndexSpy.restore();
  });

  describe('performs drop', function () {
    it('into no-results when canvas is empty', function () {
      let dropTarget = {
          type: 'no-results',
          indexPath: {section: 0, index: 0}
        },
        insertSectionSpy = sinon.spy(dataSource, 'insertSection');
      dataSource.performDrop(dropTarget, '', [item]);
      assert(insertSectionSpy.calledOnce);
      insertSectionSpy.restore();
    });

    it('into row-delimiter when dropped between rows', async function () {
      let dropTarget = {
          type: 'row-delimiter',
          indexPath: {section: 0, index: 0}
        },
        insertSectionSpy = sinon.spy(dataSource, 'insertSection');
      dataSource.performDrop(dropTarget, '', [item]);
      assert(insertSectionSpy.calledOnce);
      insertSectionSpy.restore();
    });

    it('into footer when dropped in bottom empty space', async function () {
      let dropTarget = {
          type: 'footer',
          indexPath: {section: 0, index: 0}
        },
        getNumberOfSectionsSpy = sinon.spy(dataSource, 'getNumberOfSections'),
        insertSectionSpy = sinon.spy(dataSource, 'insertSection');
      dataSource.performDrop(dropTarget, '', [item]);
      assert(getNumberOfSectionsSpy.calledOnce);
      assert(insertSectionSpy.calledOnce);
      getNumberOfSectionsSpy.restore();
      insertSectionSpy.restore();
    });

    it('into cell-delimiter when dropped on item', async function () {
      let dropTarget = {
          type: 'cell-delimiter',
          indexPath: {section: 0, index: 0}
        },
        insertItemSpy = sinon.spy(dataSource, 'insertItem');
      dataSource.performDrop(dropTarget, '', [item]);
      assert(insertItemSpy.calledOnce);
      insertItemSpy.restore();
    });

    it('into item when dropped on item', async function () {
      let dropTarget = {
          type: 'item',
          indexPath: {section: 0, index: 0}
        },
        insertItemSpy = sinon.spy(dataSource, 'insertItem');
      dataSource.performDrop(dropTarget, '', [item]);
      assert(insertItemSpy.calledOnce);
      insertItemSpy.restore();
    });
  });
});
