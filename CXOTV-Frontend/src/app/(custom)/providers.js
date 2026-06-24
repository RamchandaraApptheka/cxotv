"use client";

import { createStore } from "../../redux/store";
import { Provider } from "react-redux";

const store = createStore();

export function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}