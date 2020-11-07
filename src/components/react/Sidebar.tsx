import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddRounded';

import CodeModal from './CodeModal';
import CanvasStage from '../easeljs/CanvasStage';
import CodeType from '../easeljs/CodeType';
import Code from '../easeljs/Code';

import '../styles/sidebar.css'
import CategoryModal from './CategoryModal';
import Category from '../easeljs/Category';

interface SidebarProps {
  stage: CanvasStage | undefined,
  typeList: ({ type: CodeType, codes: Code[] } | null)[],
  setTypeList: Function,
  categoryList: Category[],
  setCategoryList: Function,
}

export default function Sidebar(props: SidebarProps) {
  const [codeOpen, setCodeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  // const [quotationOpen, setQuotationOpen] = useState(false);

  // const handleOpenModal = (openCallback) => {
  //   if (codeOpen) setCodeOpen(false);
  //   if (categoryOpen) setCategoryOpen(false);

  //   openCallback(true);
  // }


  return (
    <div className="root">
      <Accordion className="accordion">
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="heading">Categories</Typography>
          <AddIcon className="icon"
            aria-label="Button"
            onClick={(event) => {event?.stopPropagation(); setCategoryOpen(true)}}
            onFocus={(event) => event?.stopPropagation()} />
        </AccordionSummary>
        <AccordionDetails>
          {
            props.categoryList.length === 0
              ? <Typography className='heading'>No categories created</Typography>
              : props.categoryList.map(category => (
                <div key={category.name} className='hover-add'>
                  <span>{category.name}</span>
                  <div className='hover-add-icon' onClick={() => category.renderVertex(300, 300)}><AddIcon /></div>
                </div>
              ))
          }
        </AccordionDetails>
      </Accordion>
      <Accordion className="accordion">
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="heading">Codes</Typography>
          <AddIcon className="icon"
            aria-label="Button"
            onClick={(event) => { event?.stopPropagation(); setCodeOpen(true) }}
            onFocus={(event) => event?.stopPropagation()} />
        </AccordionSummary>
        <AccordionDetails className="secondary-accordion">
          {
            props.typeList.length === 0
              ? <Typography className="heading">No types created</Typography>
              : props.typeList.map(type => (
                <Accordion key={type?.type.name} className="type-accordion" style={{ borderRightColor: type?.type.color, width: '100%' }}>
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    key={type?.type.name}
                  >
                    <Typography className="heading">{type?.type.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails className="third-accordion">
                    {
                      type?.codes.length === 0
                        ? <Typography>No codes created</Typography>
                        : type?.codes.filter(code => code?.type === type.type).map(code => (
                          <div key={code.name} className="hover-add">
                            <span>{code?.name}</span>
                            <div className="hover-add-icon" onClick={() => code.renderVertex(500, 500)}><AddIcon /></div>
                          </div>
                        ))
                    }
                  </AccordionDetails>
                </Accordion>
              ))
          }
        </AccordionDetails>
      </Accordion>
      <Accordion className="accordion">
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="heading">Quotations</Typography>
          <AddIcon className="icon"
            aria-label="Button"
            onClick={(event) => { event?.stopPropagation(); alert('hi') }}
            onFocus={(event) => event?.stopPropagation()} />
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="heading">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <CodeModal open={codeOpen} stage={props.stage} setOpen={setCodeOpen} typeList={props.typeList} setTypeList={props.setTypeList} />
      <CategoryModal open={categoryOpen} stage={props.stage} setOpen={setCategoryOpen} categoryList={props.categoryList} setCategoryList={props.setCategoryList} />
    </div>
  )
}

