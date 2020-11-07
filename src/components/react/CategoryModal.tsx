import React, { useState } from "react";
import { Modal } from '@material-ui/core';

import CanvasStage from '../easeljs/CanvasStage';
import MyForm from './MyForm';

import '../styles/codeModal.css';
import Category from "../easeljs/Category";

interface ModalProps {
  stage: CanvasStage | undefined,
  open: boolean,
  setOpen: Function,
  categoryList: Category[],
  setCategoryList: Function,
}

export default function CategoryModal(props:  ModalProps) {
  const [vertexName, setVertexName] = useState('');
  return (
    <Modal
      className="modal"
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className='modal-content no-tabs'>
        <span className='first-description'>Create a Category</span>
        <MyForm
          formType='Category' setOpen={props.setOpen}
          setCategoryList={props.setCategoryList} categoryList={props.categoryList}
          setVertexName={setVertexName} stage={props.stage} vertexName={vertexName}
        />
      </div>
    </Modal>

  )
}