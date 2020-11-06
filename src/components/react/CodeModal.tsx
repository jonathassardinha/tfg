import React, { useState } from "react";
import { Modal, AppBar, Tabs, Tab } from '@material-ui/core';

import CodeType from '../easeljs/CodeType';
import Code from '../easeljs/Code';
import CanvasStage from '../easeljs/CanvasStage';
import MyForm from './MyForm';

import '../styles/codeModal.css';

interface ModalProps {
  stage: CanvasStage | undefined,
  open: boolean,
  setOpen: Function,
  typeList: ({type: CodeType, codes: Code[]} | null)[],
  setTypeList: Function,
}

export default function CodeModal(props:  ModalProps) {
  const [vertexName, setVertexName] = useState('');
  const [activeModalTab, setActiveModalTab] = useState(props.typeList.length === 0 ? 1 : 0);
  return (
    <Modal
      className="modal"
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={`${!props.typeList.length ? 'modal-content no-tabs' : 'modal-content'}`}>
        <AppBar className="tabs">
          <Tabs
            value={activeModalTab} aria-label="simple tabs example"
            onChange={(event, value) => {setActiveModalTab(value); setVertexName('')}}
            variant="fullWidth" indicatorColor='secondary'
          >
            <Tab label="Code" id="code-tab" aria-controls="code-tab" />
            <Tab label="Code Type" id="codetype-tab" aria-controls="codetype-tab"/>
          </Tabs>
        </AppBar>
        <span className='first-description'>Create a Code Type</span>
        <MyForm
          activeModalTab={activeModalTab} setOpen={props.setOpen}
          setTypeList={props.setTypeList} setVertexName={setVertexName}
          stage={props.stage} typeList={props.typeList} vertexName={vertexName}
        />
      </div>
    </Modal>

  )
}