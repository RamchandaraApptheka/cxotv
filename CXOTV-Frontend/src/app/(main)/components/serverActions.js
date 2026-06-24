import { createStore } from '../../../redux/store';

export async function createServerComponentClient() {
    // Create a new store instance for the server component
    const store = createStore();

    return { store };
}