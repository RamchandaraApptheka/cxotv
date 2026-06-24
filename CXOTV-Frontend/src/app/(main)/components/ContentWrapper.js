import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import { ReduxProvider } from '../providers';


export default function ContentWrapper({ children }) {
    return (
        <ReduxProvider>
            <div className="flex min-h-screen w-screen flex-col font-roboto">
                <div className="header-container">
                    <Header />
                </div>
                <div className="navbar-container">
                    <Navbar />
                </div>
                <main className="content-container flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </ReduxProvider>
    );
}