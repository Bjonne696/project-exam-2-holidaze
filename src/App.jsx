import { Routes, Route } from 'react-router-dom';
import Layout from "./components/layout/Layout";
import NotFound from "./components/layout/NotFound";
import HomePage from "./pages/HomePage";
import VenuePage from "./pages/VenuePage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ManagerProfilePage from './pages/ManagerProfilePage';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
        		<Route path="/register" element={<RegisterPage />} />
				<Route path="venue/:id" element={<VenuePage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="manager-profile" element={<ManagerProfilePage />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}

export default App;
