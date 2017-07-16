import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from '../imports/ui/App';

Meteor.startup(() => {
  console.log(this);
  render(<App />, document.getElementById('render-target'));
});
