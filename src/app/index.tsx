import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

import { createRenderer } from 'fela';

const is_production = process.env.NODE_ENV === 'production';
const fela_renderer = createRenderer({ devMode: !is_production });

ReactDOM.hydrate(
    <App fela_renderer={fela_renderer} />,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept();
}