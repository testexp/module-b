import autobind from 'autobind-decorator';
import CanvasLayout from './CanvasLayout';
import CanvasViewDataSource from '../datasources/CanvasViewDataSource';
import dataSource from '@engage/utils/datasource-decorator';
import DropZone from '@react/react-spectrum/DropZone';
import {EditableCollectionView} from '@react/collection-view';
import IllustratedMessage from '@react/react-spectrum/IllustratedMessage';
import * as React from 'React'
import UploadIcon from '@engage/illustrations/Upload';
import '../style/CanvasView.styl';

@dataSource(CanvasViewDataSource)
@autobind
export default class CanvasView extends React.Component {
  constructor(props) {
    super(props);
    this.layout = new CanvasLayout();
  }

  renderItemView(type, content) {
    return (
      <DropZone className="canvas-drop-zone">
        <div className="canvas-item">
          {this.props.renderCell(type, content)}
        </div>
      </DropZone>
    );
  }

  renderSupplementaryView(type: string, section: number, index: number) {
    switch (type) {
      case 'no-results':
        return (
          <DropZone className="canvas-drop-zone">
            <IllustratedMessage
              illustration={<UploadIcon />}
              heading="Drag and Drop Fields and Components"
              description="Select a component from your library or create a new one" />
          </DropZone>
        );
      case 'row-delimiter':
      case 'cell-delimiter':
      case 'footer':
        return <DropZone className="canvas-drop-zone" />;
      case 'section':
        let content = this.collection.getItem(section, index);
        return this.renderItemView(type, content);
    }
  }

  render() {
    return (
      <EditableCollectionView
        className="canvas-view"
        ref={r => this.collection = r}
        delegate={this}
        layout={this.layout}
        dataSource={this.dataSource}
        acceptsDrops
        canReorderItems
        canReorderSections />
    );
  }
}
