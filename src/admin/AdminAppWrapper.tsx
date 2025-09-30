// This component is guaranteed to only run on the client
import { HashRouter } from 'react-router-dom';
import AdminApp from './App';

export default function AdminAppWrapper() {
  return (
    <HashRouter>
      <AdminApp />
    </HashRouter>
  );
}
