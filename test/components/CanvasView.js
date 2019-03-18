/**
 * @fileoverview Canvas View unit tests
 */

import {assert} from 'chai';
import canvasJSON from '../fixtures/canvas.json';
import CanvasLayout from '../../src/components/CanvasLayout';
import CanvasView from '../../src/components/CanvasView';
import DropZone from '@react/react-spectrum/DropZone';
import {EventEmitter} from 'events';
import IllustratedMessage from '@react/react-spectrum/IllustratedMessage';
import React from 'react';
import {shallow} from 'enzyme';
import UploadIcon from '@engage/illustrations/Upload';


describe('Canvas View', function () {
  let wrapper;
  const renderCell = () => 'I am rendering Cell';

  class TestDataSource extends EventEmitter {
    constructor(props) {
      super();
      this.items = props.items || [];
    }
    getState() {
      return {
        items: this.items
      };
    }
  }
  before(function () {
    wrapper = shallow(<CanvasView
      items={canvasJSON}
      renderCell={renderCell}
      dataSource={new TestDataSource({items: canvasJSON})} />);
  });

  it('should set the layout to CanvasLayout for Canvas View', function () {
    assert.instanceOf(wrapper.find('EditableCollectionView').prop('layout'), CanvasLayout);
  });

  it('should set the datasource to TestDataSource for Canvas View', function () {
    assert.instanceOf(wrapper.find('EditableCollectionView').prop('dataSource'), TestDataSource);
  });

  it('should have prop acceptsDrop', function () {
    assert.isTrue(wrapper.find('EditableCollectionView').prop('acceptsDrops'));
  });

  it('should call renderItemView and render it with renderCell prop', function () {
    let item = wrapper.instance().renderItemView();

    assert.equal(item.type, DropZone);
    assert.equal(item.props.className, 'canvas-drop-zone');
    assert.equal(item.props.children.type, 'div');
    assert.equal(item.props.children.props.className, 'canvas-item');
    assert.equal(item.props.children.props.children, 'I am rendering Cell');
  });

  it('should call renderSupplementaryView that renders no-results', function () {
    let item = wrapper.instance().renderSupplementaryView('no-results');

    assert.equal(item.type, DropZone);
    assert.equal(item.props.className, 'canvas-drop-zone');
    assert.equal(item.props.children.type, IllustratedMessage);
    assert.equal(item.props.children.props.illustration.type, UploadIcon);
    assert.equal(item.props.children.props.heading, 'Drag and Drop Fields and Components');
    assert.equal(item.props.children.props.description, 'Select a component from your library or create a new one');
  });

  it('should call renderSupplementaryView that renders row-delimiter', function () {
    let item = wrapper.instance().renderSupplementaryView('row-delimiter');

    assert.equal(item.type, DropZone);
    assert.equal(item.props.className, 'canvas-drop-zone');
    assert.isUndefined(item.props.children);
  });

  it('should call renderSupplementaryView that renders cell-delimiter', function () {
    let item = wrapper.instance().renderSupplementaryView('cell-delimiter');

    assert.equal(item.type, DropZone);
    assert.equal(item.props.className, 'canvas-drop-zone');
    assert.isUndefined(item.props.children);
  });

  it('should call renderSupplementaryView that renders footer', function () {
    let item = wrapper.instance().renderSupplementaryView('footer');

    assert.equal(item.type, DropZone);
    assert.equal(item.props.className, 'canvas-drop-zone');
    assert.isUndefined(item.props.children);
  });

  it('should set the items in state in Canvas View', function () {
    assert.equal(wrapper.instance().state.items, canvasJSON);
  });
});

