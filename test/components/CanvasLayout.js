import {assert} from 'chai';
import CanvasLayout from '../../src/components/CanvasLayout';
import {
  LayoutInfo,
  Rect,
  Size
} from '@react/collection-view/react';

describe('CanvasLayout', function () {
  let canvasLayout, collectionViewMock;

  beforeEach(function () {
    collectionViewMock = {
      size: new Size(1120, 600),
      dataSource: {
        getSectionLength: () => 4,
        getNumberOfSections: () => 1,
        getNumberOfColumns: () => 2,
        getItemsInColumn: () => [{}, {}],
        getItem: () => ({
          height: 100,
          id: '1',
          minHeight: 100,
          name: 'Description'
        })
      }
    };
    canvasLayout = new CanvasLayout();
  });

  it('has correct functions', function () {
    assert.isFunction(canvasLayout.getLayoutInfo);
    assert.isFunction(canvasLayout.getVisibleLayoutInfos);
    assert.isFunction(canvasLayout.validate);
    assert.isFunction(canvasLayout.getDropTarget);
    assert.isFunction(canvasLayout.getContentSize);
  });

  it('initialized with expected values', function () {
    assert.deepEqual(canvasLayout.layoutInfos, []);
    assert.deepEqual(canvasLayout.rowDelimiters, []);
    assert.isNull(canvasLayout.noResults);
    assert.isNull(canvasLayout.footer);
  });

  it('getLayoutInfo returns no-results as LayoutInfo instance when no items are present in layout', function () {
    collectionViewMock.dataSource.getNumberOfSections = () => 0;
    canvasLayout.collectionView = collectionViewMock;
    canvasLayout.validate({});
    assert.instanceOf(canvasLayout.getLayoutInfo('no-results'), LayoutInfo);
    assert.isUndefined(canvasLayout.getLayoutInfo('item'));
    assert.isUndefined(canvasLayout.getLayoutInfo('row-delimiter'));
    assert.isUndefined(canvasLayout.getLayoutInfo('cell-delimiter'));
    assert.isNull(canvasLayout.getLayoutInfo('footer'));
  });

  it('getLayoutInfo returns item, row-delimiter, cell-delimiter and footer as LayoutInfo instance when items are present in layout', function () {
    canvasLayout.collectionView = collectionViewMock;
    canvasLayout.validate({});
    assert.instanceOf(canvasLayout.getLayoutInfo('item', 0, 0), LayoutInfo);
    assert.instanceOf(canvasLayout.getLayoutInfo('cell-delimiter', 0, 0), LayoutInfo);
    assert.instanceOf(canvasLayout.getLayoutInfo('row-delimiter', 0), LayoutInfo);
    assert.instanceOf(canvasLayout.getLayoutInfo('footer'), LayoutInfo);
    assert.isNull(canvasLayout.getLayoutInfo('no-results'));
  });

  it('getVisibleLayoutInfos returns an Array of LayoutInfos, RowDelimiters and a footer when items are present in layout', function () {
    canvasLayout.collectionView = collectionViewMock;
    canvasLayout.validate({});
    let res = canvasLayout.getVisibleLayoutInfos(new Rect(0, 0, 1120, 600));
    assert.isDefined(res.find(l => l.type === 'item'));
    assert.isDefined(res.find(l => l.type === 'cell-delimiter'));
    assert.isDefined(res.find(l => l.type === 'row-delimiter'));
    assert.isDefined(res.find(l => l.type === 'footer'));
    assert.isUndefined(res.find(l => l.type === 'no-results'));
  });

  it('getVisibleLayoutInfos returns no-results when no items are present in layout', function () {
    collectionViewMock.dataSource.getNumberOfSections = () => 0;
    canvasLayout.collectionView = collectionViewMock;
    canvasLayout.validate({});
    let res = canvasLayout.getVisibleLayoutInfos(new Rect(0, 0, 1120, 600));
    assert.isDefined(res.find(l => l.type === 'no-results'));
    assert.isUndefined(res.find(l => l.type === 'item'));
    assert.isUndefined(res.find(l => l.type === 'cell-delimiter'));
    assert.isUndefined(res.find(l => l.type === 'row-delimiter'));
    assert.isUndefined(res.find(l => l.type === 'footer'));
  });

  it('getDropTarget returns correct DragTarget instance', function () {
    canvasLayout.collectionView = collectionViewMock;
    canvasLayout.validate({});

    let layoutInfo = canvasLayout.getLayoutInfo('item', 0, 0);
    let dropTarget = canvasLayout.getDropTarget({x: layoutInfo.rect.x, y: layoutInfo.rect.y});
    assert.isDefined(dropTarget);
    assert.equal(dropTarget.type, 'item');

    layoutInfo = canvasLayout.getLayoutInfo('cell-delimiter', 0, 0);
    dropTarget = canvasLayout.getDropTarget({x: layoutInfo.rect.x, y: layoutInfo.rect.y + 1});
    assert.isDefined(dropTarget);
    assert.equal(dropTarget.type, 'cell-delimiter');

    layoutInfo = canvasLayout.getLayoutInfo('row-delimiter', 0);
    dropTarget = canvasLayout.getDropTarget({x: layoutInfo.rect.x, y: layoutInfo.rect.y});
    assert.isDefined(dropTarget);
    assert.equal(dropTarget.type, 'row-delimiter');

    layoutInfo = canvasLayout.getLayoutInfo('footer');
    dropTarget = canvasLayout.getDropTarget({x: layoutInfo.rect.x, y: layoutInfo.rect.y + 1});
    assert.isDefined(dropTarget);
    assert.equal(dropTarget.type, 'footer');
  });
});
