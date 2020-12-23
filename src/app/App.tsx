import React from 'react';

import { IRenderer } from 'fela';
import { FelaComponent, RendererProvider, ThemeProvider } from 'react-fela';

interface AppProps {
    fela_renderer: IRenderer;
}

interface AppState { }

export class App extends React.PureComponent<AppProps, AppState> {
    public render(): JSX.Element {
        return (
            <RendererProvider renderer={this.props.fela_renderer}>
                <ThemeProvider theme={{ main_color: '#1d3c8d' }}>
                    <React.Fragment>
                        <FelaComponent as="h1" style={{ color: 'firebrick' }}>Welcome back!</FelaComponent>
                        <div>Fancy that this still works?</div>
                    </React.Fragment>
                </ThemeProvider>
            </RendererProvider >
        );
    }
}