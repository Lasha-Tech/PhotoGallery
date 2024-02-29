import styled from 'styled-components';
import Header from './components/Header';


function App() {
  return (
    <AppDiv>
      <Header/>
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
`