  moveItem(from, to, animated) {
    let {column, fieldIndex} = this.getFieldIndex(from.section, from.index);
    from.column = column;
    from.fieldIndex = fieldIndex;
    let toFieldIndex = this.getFieldIndex(to.section, to.index);
    to.column = toFieldIndex.column;
    to.fieldIndex = toFieldIndex.fieldIndex;

    let item = this.getItemsInColumn(from.section, from.column).splice(from.fieldIndex, 1)[0];
    this.getItemsInColumn(to.section, to.column).splice(to.fieldIndex, 0, item);
    this.emit('moveItem', from, to, animated);
  }

  moveSection(from, to, animated) {
    let section = this.items.splice(from, 1)[0];
    this.items.splice(to, 0, section);
    this.emit('moveSection', from, to, animated);
  }

  removeItem(indexPath, animated) {
    let {column, fieldIndex} = this.getFieldIndex(indexPath.section, indexPath.index);
    this.getItemsInColumn(indexPath.section, column).splice(fieldIndex, 1);
    this.emit('removeItem', indexPath, animated);
  }
  
  removeSection(section, animated) {
    this.items.splice(section, 1);
    this.emit('removeSection', section, animated);
  }