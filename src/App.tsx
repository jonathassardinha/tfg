import React, { useState } from 'react';
import './App.css';
import CanvasStage from './components/easeljs/CanvasStage';
import Code from './components/easeljs/Code';
import CodeType from './components/easeljs/CodeType';
import Network from './components/react/Network';
import Sidebar from './components/react/Sidebar';

function App() {
  const [stage, setStage] = useState<CanvasStage|undefined>();
  const [typeList, setTypeList] = useState<({type: CodeType, codes: Code[]} | null)[]>([]);

  const updateStage = (newStage: CanvasStage) => setStage(newStage);
  const updateTypeList = (typeList: ({type: CodeType, codes: Code[]} | null)[]) => setTypeList(typeList);

  return (
    <div className="App">
      <Sidebar stage={stage} typeList={typeList} setTypeList={updateTypeList} />
      <Network updateStage={updateStage}/>
    </div>
  );
}

export default App;
