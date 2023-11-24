import { useEffect } from 'react';
import WorkOrders from './work-orders/work-orders';

function App() {
  useEffect(() => {
    document.title = 'Work Orders';
  }, []);

  return (
    <div className="app">
      <WorkOrders />
    </div>
  );
}

export default App;
