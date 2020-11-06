import React, {useState, FormEvent, useEffect} from 'react';
import {Radio, RadioProps, Select, MenuItem, FormControl, TextField} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { green, red, blue, brown, cyan } from '@material-ui/core/colors';

import '../styles/form.css';

import CodeType from '../easeljs/CodeType';
import Code from '../easeljs/Code';
import CanvasStage from '../easeljs/CanvasStage';
import Autocomplete from './Autocomplete';

interface ColorRadioProps extends RadioProps {
  newcolor: {[key: number]: string};
}

interface FormProps {
  stage: CanvasStage | undefined,
  setOpen: Function,
  typeList: ({type: CodeType, codes: Code[]} | null)[],
  setTypeList: Function,
  activeModalTab: number,
  vertexName: string,
  setVertexName: Function,
}

export default function MyForm(props: FormProps) {
  const [selectedValue, setSelectedValue] = React.useState('a');
  const [codeType, setCodeType] = React.useState<CodeType | null>();
  const [codeTypeName, setCodeTypeName] = React.useState('');
  const [color, setColor] = useState(green[300] as string);
  const [formPristine, setFormPristine] = useState(true);

  const colorMap: {[key: string]: string} = {
    a: green[300],
    b: red[300],
    c: brown[300],
    d: cyan[300],
    e: blue[300]
  }

  useEffect(() => {
    setFormPristine(true);
  }, [props.activeModalTab])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formChildren = (event.target as HTMLFormElement).children;
    const formType = (formChildren.item(formChildren.length - 1) as HTMLButtonElement).value;
    setFormPristine(false);
    if (formType === 'Code') {
      if (!props.vertexName || !codeType) {
        console.log('invalid');
        return;
      }
      const code = new Code(props.stage as CanvasStage, props.vertexName, codeType as CodeType);

      const type = props.typeList.find(type => type?.type.name === codeType?.name);
      if (type) type.codes = [...type?.codes as Code[], code];
      // props.setTypeList([...props.typeList]);
      props.setOpen(false);

    } else if (formType === 'Code Type') {
      if (!props.vertexName || !color) {
        console.log(props.vertexName, color);
        return;
      }
      const type = new CodeType(props.vertexName, color)
      props.setTypeList([...props.typeList, {type, codes: []}]);
    }
  }

  const selectRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    setColor(colorMap[event.target.value]);
  };

  const changeType = (event: React.ChangeEvent<{name?: string | undefined;value: unknown;}>) => {
    setCodeTypeName(event.target.value as string);
    setCodeType(props.typeList.find(type => type?.type.name === event.target.value)?.type);
  }


  const checked = {
    color: (props: ColorRadioProps) => props.newcolor[600],
  };
  const radioStyle = {
    root: {
      color: (props: ColorRadioProps) => props.newcolor[400],
      checked
    },
    checked: {},
  }

  const ColorRadio = withStyles(radioStyle)((props: RadioProps) => <Radio color="default" {...props} />);

  if (props.activeModalTab === 0 ) {
    return (
      <form className='form' onSubmit={handleSubmit}>
        <label htmlFor="">
          Name
          <TextField
            style={{fontSize: '14px'}}
            helperText="Must have some non-used name"
            className='text-input'
            error={!formPristine && !props.vertexName}
            value={props.vertexName}
            onChange={(event) => {props.setVertexName(event.target.value); setFormPristine(false)}}
            onBlur={(event) => setFormPristine(false)}
          />
        </label>
        <label htmlFor="">
          Type
          <FormControl className="form-control">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={codeTypeName as string}
              onChange={changeType}
              className="select"
              MenuProps={{
                getContentAnchorEl: null,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                }
              }}
            >
              {props.typeList.map((type, index) => (
                <MenuItem value={type?.type.name} key={index}>{type?.type.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </label>
        <button className='submit-button' type="submit" value="Code">Create</button>
      </form>
    );
  } else {
    return (
      <form className='form' onSubmit={handleSubmit}>
        <label htmlFor="">
          Name
          {/* <input className='text-input' type="text"
            value={vertexName}
            onChange={(event) => setVertexName(event.target.value)}/> */}
          <Autocomplete setVertexName={props.setVertexName} typeList={props.typeList} vertexName={props.vertexName}/>
        </label>
        <label htmlFor="">
          Color
          <div className='color-picker'>
            <ColorRadio
              checked={selectedValue === 'a'}
              onChange={selectRadio}
              value='a'
              name='radio-button'
              newcolor={green}
            />
            <ColorRadio
              checked={selectedValue === 'b'}
              onChange={selectRadio}
              value='b'
              name='radio-button'
              newcolor={red}
            />
            <ColorRadio
              checked={selectedValue === 'c'}
              onChange={selectRadio}
              value='c'
              name='radio-button'
              newcolor={brown}
            />
            <ColorRadio
              checked={selectedValue === 'd'}
              onChange={selectRadio}
              value='d'
              name='radio-button'
              newcolor={cyan}
            />
            <ColorRadio
              checked={selectedValue === 'e'}
              onChange={selectRadio}
              value='e'
              name='radio-button'
              newcolor={blue}
            />
          </div>
        </label>
        <button className='submit-button' type="submit" value="Code Type">Create</button>
      </form>
    );
  }
}
