import styled from 'styled-components';
import Main from './components/Main';
import History from './components/History';


function App() {
  return (
    <AppDiv>
      <Main/>
    </AppDiv>
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