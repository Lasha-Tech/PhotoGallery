import styled from 'styled-components';
import Main from './components/Main';
import History from './components/History';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppDiv>
          <Routes>
            <Route
                path="/"
                element={<Main />}
              />
              <Route
                path="/history"
                element={<History />}
              />
          </Routes>
        </AppDiv>
      </Router>
    </QueryClientProvider>
  )
}

export default App;

const AppDiv = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0 80px;
`