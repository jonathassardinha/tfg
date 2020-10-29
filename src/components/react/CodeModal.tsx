import React, { FormEvent, useState } from "react";
import { Modal, AppBar, Tabs, Tab, Radio, RadioProps, Select, MenuItem, FormControl } from '@material-ui/core';
import { green, red, blue, brown, cyan } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

import CodeType from '../easeljs/CodeType';
import Code from '../easeljs/Code';
import CanvasStage from '../easeljs/CanvasStage';


interface ColorRadioProps extends RadioProps {
  newcolor: {[key: number]: string};
}

interface ModalProps {
  stage: CanvasStage | undefined,
  open: boolean,
  setOpen: Function,
  typeList: (CodeType | null)[],
  setTypeList: Function,
  codeList: (Code | null)[],
  setCodeList: Function,
}

export default function CodeModal(props:  ModalProps) {
  const [color, setColor] = useState(green[600] as string);
  const [vertexName, setVertexName] = useState('');
  const [activeModalTab, setActiveModalTab] = useState(0);
  const [selectedValue, setSelectedValue] = React.useState('a');
  const [codeType, setCodeType] = React.useState<CodeType | null>();
  const [codeTypeName, setCodeTypeName] = React.useState('');

  const colorMap: {[key: string]: string} = {
    a: green[600],
    b: red[600],
    c: brown[600],
    d: cyan[600],
    e: blue[600]
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formChildren = (event.target as HTMLFormElement).children;
    const formType = (formChildren.item(formChildren.length - 1) as HTMLButtonElement).value;

    if (formType === 'Code') {
      const code = new Code(props.stage as CanvasStage, vertexName, codeType as CodeType);
      code.renderVertex(500, 500);
      props.setCodeList([...props.codeList, code]);
      props.setOpen(false);

    } else if (formType === 'Code Type') {
      const type = new CodeType(vertexName, color)
      props.setTypeList([...props.typeList, type]);
    }
  }

  const selectRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    setColor(colorMap[event.target.value]);
    console.log(color)
  };

  const changeType = (event: React.ChangeEvent<{name?: string | undefined;value: unknown;}>) => {
    setCodeTypeName(event.target.value as string);
    setCodeType(props.typeList.find(type => type?.name === event.target.value));
  }

  return (
    <Modal
      className="modal"
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className="modal-content">
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
        { activeModalTab === 0 &&
          <form className='form' onSubmit={handleSubmit}>
            <label htmlFor="">
              Name
              <input className='text-input' type="text"
                value={vertexName}
                onChange={(event) => setVertexName(event.target.value)}/>
            </label>
            <label htmlFor="">
              <FormControl className="form-control">
                Type
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={codeTypeName as string}
                  onChange={changeType}
                  className="select"
                >
                  {props.typeList.map((type, index) => (
                    <MenuItem value={type?.name} key={index}>{type?.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </label>
            <button className='submit-button' type="submit" value="Code">Create</button>
          </form>
        }
        { activeModalTab === 1 &&
          <form className='form' onSubmit={handleSubmit}>
            <label htmlFor="">
              Name
              <input className='text-input' type="text"
                value={vertexName}
                onChange={(event) => setVertexName(event.target.value)}/>
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
        }
      </div>
    </Modal>

  )
}