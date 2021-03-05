import React from 'react';

import { IRenderer } from 'fela';
import { FelaComponent, RendererProvider, ThemeProvider } from 'react-fela';

interface AppProps {
    fela_renderer: IRenderer;
}

interface AppState { }


const DemoModal: React.FunctionComponent<{}> = () => {
    return (
        <FelaComponent as="div" style={{
            backgroundColor: 'white',
            maxWidth: '600px',
            boxShadow: '0 0 2em gray',
            marginTop: '3em',
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
            <FelaComponent as="div" style={{ backgroundColor: '#324c59', color: 'lightgray', minHeight: '4em' }}>
                Überschrift
            </FelaComponent>
            <FelaComponent as="div" style={{ backgroundColor: 'meganta' }}>
                Quickinfo
            </FelaComponent>
            <FelaComponent as="div" style={{ backgroundColor: 'lime' }}>
                content
            </FelaComponent>
        </FelaComponent>
    );
}


export class App extends React.PureComponent<AppProps, AppState> {
    public render(): JSX.Element {
        return (
            <RendererProvider renderer={this.props.fela_renderer}>
                <ThemeProvider theme={{ main_color: '#1d3c8d' }}>
                    <React.Fragment>
                        <FelaComponent as="h1" style={{ color: 'firebrick' }}>Welcome back!</FelaComponent>
                        <div>Fancy that this still works?</div>
                        <DemoModal />
                    </React.Fragment>
                </ThemeProvider>
            </RendererProvider >
        );
    }
}