// src/App.tsx 
import { AuthProvider } from './context/AuthContext'; // ← Este es el real
import { AlertProvider } from './context/AlertContext';
import { AppRouter } from './routers/AppRouter';
import { AlertContainer } from './components/shared/alert/AlertContainer';
import { NotificacionCambiosAutomatica } from './components/shared/notificacionCambios/NotificacionCambiosAutomatica';
import { ModalReconexion } from './components/shared/modalReconexion/ModalReconexion';
import { registerLicense } from '@syncfusion/ej2-base';


// ✅ NUEVO: Componente que usa los hooks DENTRO del AuthProvider
const AppWithAuth: React.FC = () => {
    registerLicense('Ngo9BigBOggjHTQxAR8/V1JFaF1cX2hIfEx3QXxbf1x1ZFZMZV9bQHFPIiBoS35Rc0RiWHpfcXdcQmlcUkxyVEFc');
    return (
        <>
            <NotificacionCambiosAutomatica />
            <ModalReconexion />
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
        </>
    );
};


function App() {
    return (
        <AlertProvider> {/* ✅ ENVOLVER CON AlertProvider */}
            <AuthProvider>
                <AppWithAuth />
            </AuthProvider>
        </AlertProvider>
    );
}

export default App;