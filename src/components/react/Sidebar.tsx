import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography} from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddRounded';

import CodeModal from './CodeModal';
import CanvasStage from '../easeljs/CanvasStage';
import CodeType from '../easeljs/CodeType';
import Code from '../easeljs/Code';

import '../styles/sidebar.css'

interface SidebarProps {
  stage: CanvasStage | undefined,
  typeList: ({type: CodeType, codes: Code[]} | null)[],
  setTypeList: Function,
}

export default function Sidebar(props: SidebarProps) {
  const [codeOpen, setCodeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  // const [quotationOpen, setQuotationOpen] = useState(false);

  const codeSetOpen = (open: boolean) => setCodeOpen(open);
  const categorySetOpen = (open: boolean) => setCategoryOpen(open);
  // const quotationSetOpen = (open: boolean) => setQuotationOpen(open);

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
            onClick={(event) => {event?.stopPropagation(); categorySetOpen(true)}}
            onFocus={(event) => event?.stopPropagation()}/>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="heading">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
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
            onClick={(event) => {event?.stopPropagation(); codeSetOpen(true)}}
            onFocus={(event) => event?.stopPropagation()}/>
        </AccordionSummary>
        <AccordionDetails className="secondary-accordion">
          {
            props.typeList.length === 0
            ? <Typography className="heading">No types created</Typography>
            : props.typeList.map(type => (
              <Accordion key={type?.type.name} className="type-accordion" style={{background: type?.type.color, width: '100%'}}>
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
                        <div className="hover-add-icon" onClick={() => code.renderVertex(500, 500)}><AddIcon /></div>
                        <span>{code?.name}</span>
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
            onClick={(event) => {event?.stopPropagation(); alert('hi')}}
            onFocus={(event) => event?.stopPropagation()}/>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="heading">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <CodeModal open={codeOpen} stage={props.stage} setOpen={codeSetOpen} typeList={props.typeList} setTypeList={props.setTypeList}/>
    </div>
  )
}

