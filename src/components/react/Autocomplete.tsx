import { Popper, TextField } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import Category from '../easeljs/Category';

import Code from '../easeljs/Code';
import CodeType from '../easeljs/CodeType';

import '../styles/autocomplete.css';

interface AutocompleteProps {
  vertexName: string,
  setVertexName: Function,
  typeList?: ({type: CodeType, codes: Code[]} | null)[],
  categoryList?: Category[],
}

export default function Autocomplete(props: AutocompleteProps) {
  const [formPristine, setFormPristine] = useState(true);
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popperList, setPopperList] = useState<(string|undefined)[]>([]);
  const [error, setError] = useState(false);

  const textField = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.typeList) {
      let list = props.typeList.map(type => type?.type.name).filter(codeName => !props.vertexName || codeName?.includes(props.vertexName));
      setPopperList(list);
    } else if (props.categoryList) {
      let list = props.categoryList.map(category => category.name).filter(categoryName => !props.vertexName || categoryName?.includes(props.vertexName));
      setPopperList(list);
    }
  }, [props.vertexName, props.typeList, props.categoryList]);

  const openPopper = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setAnchorEl(event.target);
    setPopperOpen(!!event.target.value);
  }

  const handleError = (onBlur: boolean) => {
    if (!formPristine && !props.vertexName) {
      setError(true);
    } else if (onBlur && !!popperList.find(name => name === props.vertexName)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div className="autocomplete">
      <TextField
        ref={textField}
        style={{fontSize: '14px'}}
        helperText="Must have some non-used name"
        className='text-input'
        error={error}
        value={props.vertexName}
        onFocus={(event) => openPopper(event)}
        onChange={(event) => {
          props.setVertexName(event.target.value);
          setFormPristine(false);
          openPopper(event);
          handleError(false);
        }}
        onBlur={(event) => {
          setFormPristine(false);
          setPopperOpen(false);
          handleError(true);
        }}
      />
      <Popper
        className='popper'
        style={{zIndex: 10000, width: `${textField.current?.clientWidth}px`}}
        anchorEl={anchorEl}
        open={popperOpen}
      >
        {popperList.map(typeName => (
          <div key={typeName}>
            {typeName}
          </div>
        ))}
      </Popper>
    </div>
  )
}