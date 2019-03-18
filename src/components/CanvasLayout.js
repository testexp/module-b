import {
  DragTarget,
  IndexPath,
  Layout,
  LayoutInfo,
  Rect,
  Size
} from '@react/collection-view/react';

const CELL_SPACING = new Size(20, 20),
  TOP_OFFSET = 10,
  BOTTOM_OFFSET = 10,
  LEFT_OFFSET = 10,
  RIGHT_OFFSET = 10,
  ROW_DELIMITER_HEIGHT = 20,
  FOOTER_HEIGHT = 20;

export default class CanvasLayout extends Layout {
  constructor(options = {}) {
    super();
    this.resetLayouts();
  }

  resetLayouts() {
    this.layoutInfos = [];
    this.rowDelimiters = [];
    this.cellDelimiters = [];
    this.noResults = null;
    this.footer = null;
  }

  getLayoutInfo(type, section, index) {
    switch (type) {
      case 'item':
      case 'section':
        return this.layoutInfos[section] && this.layoutInfos[section][index];
      case 'no-results':
        return this.noResults;
      case 'row-delimiter':
        return this.rowDelimiters[section];
      case 'cell-delimiter':
        return this.cellDelimiters[section] && this.cellDelimiters[section][index];
      case 'footer':
        return this.footer;
    }
  }

  getVisibleLayoutInfos(rect) {
    if (this.noResults) {
      return [this.noResults];
    }

    let res = [];
    for (let section of this.layoutInfos) {
      for (let layoutInfo of section) {
        if (layoutInfo.rect.intersects(rect)) {
          res.push(layoutInfo);
        }
      }
    }

    for (let rowDelimiter of this.rowDelimiters) {
      if (rowDelimiter.rect.intersects(rect)) {
        res.push(rowDelimiter);
      }
    }

    for (let section of this.cellDelimiters) {
      for (let cellDelimiter of section) {
        if (cellDelimiter && cellDelimiter.rect.intersects(rect)) {
          res.push(cellDelimiter);
        }
      }
    }

    if (this.footer) {
      res.push(this.footer);
    }
    
    return res;
  }

  validate(invalidationContext) {
    let sectionY = TOP_OFFSET, 
      cellY,
      cellX, 
      rowDelimiter,
      layoutInfo,
      sectionCount = this.collectionView.dataSource.getNumberOfSections();

    this.resetLayouts();

    let availableWidth = this.collectionView.size.width - LEFT_OFFSET - RIGHT_OFFSET;

    this.contentWidth = this.collectionView.size.width;

    for (let section = 0; section < sectionCount; section++) {
      // Adding row-deliminitor
      rowDelimiter = new LayoutInfo('row-delimiter', section);
      rowDelimiter.rect = new Rect(LEFT_OFFSET, sectionY, availableWidth, sectionY + ROW_DELIMITER_HEIGHT);
      rowDelimiter.rect.height = ROW_DELIMITER_HEIGHT;
      this.rowDelimiters[section] = rowDelimiter;

      sectionY += ROW_DELIMITER_HEIGHT;

      // Adding items
      this.layoutInfos[section] = [];
      this.cellDelimiters[section] = [];

      let colCount = this.collectionView.dataSource.getNumberOfColumns(section);
      let cellWidth = (availableWidth - (colCount - 1) * CELL_SPACING.width) / colCount;
      cellX = LEFT_OFFSET;
      let maxColHeight = 0;
      let index = 0; // for index of fields in a section
      for (let column = 0; column < colCount; column++) {
        let items = this.collectionView.dataSource.getItemsInColumn(section, column);
        cellY = sectionY;
        for (let fieldIndex = 0; fieldIndex < items.length; fieldIndex++) {
          let item = this.collectionView.dataSource.getItem(section, index);
          let layoutType = item.expand ? 'section' : 'item';
          layoutInfo = new LayoutInfo(layoutType, section, index);
          layoutInfo.rect = new Rect(cellX, cellY, cellWidth, cellY + item.height);
          layoutInfo.rect.height = item.height;
          this.layoutInfos[section][index] = layoutInfo;
          cellY += item.height;

          // adding cell delimitors
          if (fieldIndex + 1 !== items.length) {
            let cellDelimiter = new LayoutInfo('cell-delimiter', section, index);
            cellDelimiter.rect = new Rect(cellX, cellY, cellWidth, cellY + CELL_SPACING.height);
            cellDelimiter.rect.height = CELL_SPACING.height;
            this.cellDelimiters[section][index] = cellDelimiter;
            cellY += CELL_SPACING.height;
          }

          index++;
        }
        cellX += cellWidth + CELL_SPACING.width;
        if (maxColHeight < cellY) {
          maxColHeight = cellY;
        }
      }
      // normalizing last cell height in a column
      index = -1;
      for (let column = 0; column < colCount; column++) {
        index += this.collectionView.dataSource.getItemsInColumn(section, column).length;
        let rect = this.layoutInfos[section][index].rect;
        if (maxColHeight > rect.maxY) {
          rect.height = maxColHeight - rect.y;
        }
      }
      sectionY = maxColHeight;
    }

    if (sectionCount === 0) {
      this.noResults = new LayoutInfo('no-results');
      this.noResults.rect = new Rect(LEFT_OFFSET, TOP_OFFSET, availableWidth, this.collectionView.size.height - BOTTOM_OFFSET);
    } else {
      let effectiveFooterHeight = sectionY > this.collectionView.size.height ? sectionY + FOOTER_HEIGHT : this.collectionView.size.height - BOTTOM_OFFSET;
      this.footer = new LayoutInfo('footer');
      this.footer.rect = new Rect(LEFT_OFFSET, sectionY, availableWidth, effectiveFooterHeight);
      sectionY = effectiveFooterHeight;
    }

    this.contentHeight = sectionY + BOTTOM_OFFSET;
  }

  getDropTarget(point) {
    let target = this.getVisibleLayoutInfos(new Rect(point.x, point.y, 1, 1));
    if (target.length === 0) {
      return null;
    }
    let {section = 0, index = 0, type} = target[0];
    return new DragTarget(type, new IndexPath(section, index));
  }

  getContentSize() {
    return new Size(this.contentWidth, this.contentHeight);
  }
}
