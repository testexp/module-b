import autobind from 'autobind-decorator';
import {DataSource, IndexPath} from '@react/collection-view';

const DEFAULT_CELL_HEIGHT = 100;

@autobind
export default class CanvasViewDataSource extends DataSource {
  constructor(props) {
    super(props);
    this.items = props.items || [];
  }

  performDrop(dropTarget, dropOperation, items) {
    let {section = 0, index = 0} = dropTarget.indexPath,
      item = items[0];

    switch (dropTarget.type) {
      case 'no-results':
      case 'row-delimiter':
        this.insertSection(section, item, false);
        return;
      case 'footer':
        let sectionCount = this.getNumberOfSections();
        this.insertSection(sectionCount, item);
        return;
      case 'section': // no drop allowed on section as it cannot be split in two columns
        return;
      default:
        !item.expand && this.insertItem(section, index, item);
        return;
    }
  }

  insertItem(section, index, item, animated) {
    if (this.insertColumn(section, item, animated)) {
      return;
    }
    let {column, fieldIndex} = this.getFieldIndex(section, index);
    
    this.startTransaction();
    this.items[section].fields[column].splice(fieldIndex, 0, this.normalizeItem(item));
    this.emit('insertItem', new IndexPath(section, index), animated);
    this.endTransaction(animated);
  }

  insertColumn(section, item, animated) {
    // insert column if only 1 column exists
    if (this.items[section] && this.items[section].fields.length !== 1) {
      return false;
    }
    this.startTransaction();
    this.items[section].fields.push([this.normalizeItem(item)]);
    this.emit('insertItem', new IndexPath(section, this.getItemsInColumn(section, 0).length), animated);
    this.endTransaction(animated);
    return true;
  }

  insertSection(section, item, animated) {
    let sectionData = {
      'fields': [[this.normalizeItem(item)]]
    };
    this.items.splice(section, 0, sectionData);
    this.emit('insertSection', section, animated);
  }

  getNumberOfSections() {
    return this.items && this.items.length;
  }

  getItemsInColumn(section, column) {
    return this.items[section].fields.length > column && this.items[section].fields[column];
  }

  getNumberOfColumns(section) {
    return this.items[section] && this.items[section].fields.length;
  }

  getSectionLength(section) {
    let numFields = 0;
    for (let column in this.items[section] && this.items[section].fields) {
      numFields += this.items[section].fields[column].length;
    }
    return numFields;
  }

  getItem(section, index) {
    let item = null;
    if (!this.items[section]) {
      return null;
    }
    let {column, fieldIndex} = this.getFieldIndex(section, index);
    item = this.items[section].fields[column] && this.items[section].fields[column][fieldIndex];
    return item;
  }

  /**
   * Returns the column and index of an items in fields array from indexPath.
   * @param {int} section - section
   * @param {int} index - index
   * @return {Object}
   */
  getFieldIndex(section, index) {
    for (let column in this.items[section] && this.items[section].fields) {
      if (index < this.items[section].fields[column].length) {
        return {column: column, fieldIndex: index};
      } else {
        index -= this.items[section].fields[column].length;
      }
    }
    return {};
  }

  normalizeItem(item) {
    return {
      ...item, 
      height: parseInt(item.height, 10) || parseInt(item.minHeight, 10) || DEFAULT_CELL_HEIGHT
    };
  }

  startTransaction() {
    this.emit('startTransaction');
  }

  endTransaction(animated) {
    this.emit('endTransaction', animated);
  }

  getState() {
    return {
      items: this.items
    };
  }
}
