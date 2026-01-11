import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './Components/LayoutArea/Layout/Layout.tsx'
import './index.css'
import { interceptor } from './Utils/Interceptor.ts';
import { Provider } from "react-redux";
import { store } from './Redux/Store.ts';

/**
 * Main frontend entry point.
 * - Sets up Redux store provider and React Router.
 * - Registers Axios interceptor for JWT authentication.
 * - Renders the root Layout component.
 */

interceptor.create();

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    </Provider>
)
