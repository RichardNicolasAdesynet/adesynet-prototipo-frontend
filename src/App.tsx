// src/App.tsx 
import { AuthProvider } from './context/AuthContext'; // ← Este es el real
import { AppRouter } from './routers/AppRouter';

function App() {
    return (
        <AuthProvider> {/* ← Provider real, no el mock */}
            <AppRouter />
        </AuthProvider>
    );
}

export default App;