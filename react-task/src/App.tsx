import Home from './pages/Home';
import './App.css';
// import AppRoute from './AppRoute';

function App() {
  return (
    <div className="app">
      {/* Without Route */}
      <Home />

      {/* With Route */}
      {/* <AppRoute /> */}
    </div>
  );
}

export default App;