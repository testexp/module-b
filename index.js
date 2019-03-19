import {CoreContext} from '@exc/core';
import middleware from '@engage/utils/middleware';
import React from 'react';
import {Route, Router} from '@exc/router';
import TemplateBuilder from './src/TemplateBuilder';

export default function CanvasPackage(props) {
  return (
    <CoreContext.Consumer>
      {(context) => {
        let componentContext = middleware(context);
        return (
          <Router>
            <Route path="/">
              <TemplateBuilder {...props} context={componentContext} />
            </Route>
          </Router>
        );
      }}
    </CoreContext.Consumer>
  );
}
