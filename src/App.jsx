import './App.css';
import {Title, Workspace, Footer} from './components/index';

const App = () => {
  return (
    <>
      <Title /> { /* Title of the App 'Truth Table Calculator' */ }
      <Workspace /> { /* Text Field, Submit button and result tables */ }
      <Footer /> { /* Footer with information about the app's developer and the app itself */ }
    </>
  );
}

export default App;
