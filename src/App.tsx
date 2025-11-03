// src/App.tsx 
import { AuthProvider } from './context/AuthContext'; // ← Este es el real
import { AlertProvider } from './context/AlertContext';
import { AppRouter } from './routers/AppRouter';
import { AlertContainer } from './components/shared/alert/AlertContainer';

function App() {
    return (
        <AlertProvider> {/* ✅ ENVOLVER CON AlertProvider */}
            <AuthProvider>
                <div className="
                    App
                    min-h-screen
                    bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10
                    text-slate-900
                    antialiased
                    font-sans
                ">
                    <AlertContainer />
                    <AppRouter />
                </div>
            </AuthProvider>
        </AlertProvider>
    );
}

export default App;