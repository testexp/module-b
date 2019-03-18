import {assert} from 'chai';
import DraggableList from '../../src/components/DraggableList';
import {EditableCollectionView, StackLayout} from '@react/collection-view';
import React from 'react';
import {shallow} from 'enzyme';

describe('DraggableList', function () {
  const items = {},
    renderItem = () => {};
  let wrapper = shallow(<DraggableList
    items={items}
    renderItem={renderItem} />);

  it('should render EditableCollectionView as its first element', function () {
    assert.equal(wrapper.type(), EditableCollectionView);
    assert(wrapper.hasClass('draggable-list-view'));
  });

  it('should render elements in StackLayout', function () {
    assert.instanceOf(wrapper.instance().layout, StackLayout);
    assert.equal(wrapper.instance().layout.showHeaders, false);
  });

  it('should render an element in rail', function () {
    let returnType = wrapper.instance().renderItemView('item', {});
    assert.equal(returnType.props.className, 'draggable-list-item');
  });
});
