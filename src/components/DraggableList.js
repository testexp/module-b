import {
  ArrayDataSource, 
  EditableCollectionView, 
  Size,
  StackLayout
} from '@react/collection-view';
import React from 'react';
import '../style/DraggableList.styl';

/**
 * This component renders items in a draggable list. The fields can be dragged from this list.
 * 
 */
export default class DraggableList extends React.Component {
  constructor(props) {
    super(props);
    this.layout = new StackLayout({
      showHeaders: false
    });
    this.items = props.items || [];
    this.dataSource = new ArrayDataSource([[...this.items]]);
  }

  estimateSize(content) {
    return new Size(100, 100);
  }

  renderDragView(target) {
    let item = this.collection.getItem(target.indexPath);
    return (
      <div
        key={item.id}
        className="dragged-item">
        {this.props.renderItem(item)}
      </div>
    );
  }

  renderItemView(type, content) {
    return (
      <div
        key={content.id}
        className="draggable-list-item">
        {this.props.renderItem(content)}
      </div>
    );
  }

  render() {
    return (
      <EditableCollectionView
        ref={r => this.collection = r}
        dataSource={this.dataSource}
        className="draggable-list-view"
        layout={this.layout}
        canDragItems
        delegate={this} />
    );
  }
}
