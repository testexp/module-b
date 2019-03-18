import Button from '@react/react-spectrum/Button';
import Calendar from '@react/react-spectrum/Icon/Calendar';
import canvasJSON from './canvas.json';
import CanvasView from '../components/CanvasView';
import DraggableList from '../components/DraggableList';
import fieldsJSON from './fields.json';
import Label from '@react/react-spectrum/Icon/Label';
import * as React from 'react';
import {Component} from 'react';
import ShowMenu from '@react/react-spectrum/Icon/ShowMenu';
import TextArea from '@react/react-spectrum/Textarea';
import TextSize from '@react/react-spectrum/Icon/TextSize';
import User from '@react/react-spectrum/Icon/User';
import './example.styl';

class TemplateBuilder extends Component {
  getIcon = (fieldName: object) => {
    switch (fieldName.split(':')[0].trim()) {
      case 'Description':
        return <TextSize />;
      case 'Region':
        return <Label />;
      case 'Event Date Range':
        return <Calendar />;
      case 'User':
        return <User />;
      case 'Tag':
        return <Label />;
      case 'Section Header':
        return <Label />;
      default: return <Label />;
    }
  }

  renderRailItem = (item) => (
    <div>
      <Button
        icon={<ShowMenu />}
        variant="action"
        quiet />
      <Button
        icon={this.getIcon(item.name)}
        variant="action"
        quiet />
      {item.name}
    </div>
  );

  renderCanvasCell = (type, item) => (
    <div className="text-modal">
      <span >{item.name}</span>
      <TextArea
        className="text-content"
        quiet
        readonly
        onChange={this.onTextChange} />
    </div>
  );

  render() {
    return (
      <div className="main-page">
        <DraggableList
          items={fieldsJSON}
          renderItem={this.renderRailItem} />
        <CanvasView
          items={canvasJSON}
          renderCell={this.renderCanvasCell} />
      </div>
    );
  }
}

export default TemplateBuilder;
