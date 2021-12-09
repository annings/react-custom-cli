import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    return <></>;
};

const render = (Component) => {
    ReactDOM.render(Component, document.getElementById('app'));
};

const hotDev = (module) => {
    if (process.env.NODE_ENV !== 'production' && module.hot) {
        module.hot.accept(() => {
            render(<App />);
        });
    }
};

hotDev(module);

render(<App />);
