import React, { useState } from 'react';
import './App.css';
import CanvasStage from './components/easeljs/CanvasStage';
import Code from './components/easeljs/Code';
import CodeType from './components/easeljs/CodeType';
import Network from './components/react/Network';
import Sidebar from './components/react/Sidebar';

function App() {
  const [stage, setStage] = useState<CanvasStage|undefined>();
  const [typeList, setTypeList] = useState<(CodeType | null)[]>([]);
  const [codeList, setCodeList] = useState<(Code | null)[]>([]);

  const updateStage = (newStage: CanvasStage) => setStage(newStage);
  const updateTypeList = (typeList: (CodeType | null)[]) => setTypeList(typeList);
  const updateCodeList = (codeList: (Code | null)[]) => setCodeList(codeList);

  return (
    <div className="App">
      <Sidebar stage={stage} typeList={typeList} setTypeList={updateTypeList} codeList={codeList} setCodeList={updateCodeList}/>
      <Network updateStage={updateStage}/>
    </div>
  );
}

export default App;
