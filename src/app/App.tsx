import React from 'react';

interface AppProps { }

interface AppState { }

export class App extends React.PureComponent<AppProps, AppState> {
    public render(): JSX.Element {
        return (
            <div>Fancy that this still works?</div>
        );
    }
}