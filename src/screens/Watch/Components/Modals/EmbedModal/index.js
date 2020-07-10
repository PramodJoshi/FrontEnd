import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CTInput, CTCheckbox, CTFormRow, CTSelect } from 'layout/CTForm'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { api, uurl, prompt } from 'utils';
import { baseUrl } from 'utils/cthttp/statics'
import { CTPlayerConstants as Constants } from 'components/CTPlayer';
import Modal from 'layout/CTModal/Modal';
import { timeStrToSec, videoControl, parseSec } from '../../../Utils';

const useStyles = makeStyles({
  cancelBtn: {
    fontWeight: 'bold'
  },
  confirmBtn: {
    fontWeight: 'bold',
    marginLeft: 5,
    '&:not(.MuiButton-outlined)': {
      background: 'teal',
      color: 'white',
      '&:hover': {
        background: 'var(--ct-green-normal)',
      }
    }
  },
  modal: {
    width: '40vw',
    marginLeft: '58vw',
  },
  beginText: {
    width: '18em'
  },
  beginTime: {
    width: '8em',
    height: '1em'
  },

});

function EmbedModal(props) {
  const {
    open = false,
    responsive = true,
    title = 'Embed Video',
    text,
    children,
    onClose,
    cancelButtonText = 'Cancel',
    onConfirm,
    ...otherProps
  } = props;

  const classes = useStyles();
  const inputRef = useRef();
  const [confirmButtonText, setconfirmButtonText] = useState('Copy')
  const [ccLanguage, setCCLanguage] = useState('en-US')
  const [playbackRate, setplaybackRate] = useState(4)
  const [width, setWidth] = useState(380);
  const [height, setHeight] = useState(220);
  const [embedHTML, setEmbedHTML] = useState('')
  const [enableBeginTime, setEnableBeginTime] = useState(false)
  const [beginTime, setBeginTime] = useState(0)
  const [enableCaption, setEnableCaption] = useState(false)
  const [enablePadded, setEnablePadded] = useState(false)
  const [URL, setURL] = useState('');

  const handleWidthChange =
    ({ target: { value } }) => setWidth(value)

  const handleHeightChange =
    ({ target: { value } }) => setHeight(value)

  const handleCCLanguageChange =
    ({ target: { value } }) => setCCLanguage(value)

  const handlePlaybackRateChange =
    ({ target: { value } }) => setplaybackRate(value)

  const handleEnableBeginTime =
    ({ target: { checked } }) => setEnableBeginTime(checked)

  const handleBeginTime =
    ({ target: { value } }) => setBeginTime(value)

  const handleEnableCaption =
    ({ target: { checked } }) => setEnableCaption(checked)

  const handleEnablePadded =
    ({ target: { checked } }) => setEnablePadded(checked)

  // used for change the confirmButton text from 'copied' to 'copy'
  let temp_confirmButton;

  const handleConform = () => {
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
    temp_confirmButton = embedHTML;
    setconfirmButtonText('Copied');
    inputRef.current.select();
    document.execCommand('copy');
    setTimeout(() => {
      setconfirmButtonText('Copy');
    }, 2000);
  }

  const ccLanguageOptions = [
    { text: 'English', value: 'en-US' },
    { text: 'Simplified Chinese', value: 'zh-Hans' },
    { text: 'Korean', value: 'ko' },
    { text: 'Spanish', value: 'es' },
    { text: 'French', value: 'fr' }
  ]
  const playbackRatesOptions = [
    { text: '2', value: 0 },
    { text: '1.75', value: 1 },
    { text: '1.5', value: 2 },
    { text: '1.25', value: 3 },
    { text: '1', value: 4 },
    { text: '0.75', value: 5 },
    { text: '0.5', value: 6 },
    { text: '0.25', value: 7 },
  ]

  const actionElement = (
    <>
      <Button size="large" className={classes.confirmBtn} onClick={handleConform}>
        {confirmButtonText}
      </Button>
    </>
  );

  const closeButton = (
    <button size="large" className="plain-btn wml-close-btn" aria-label="Close" onClick={onClose}>
      <span tabIndex="-1">
        <i className="material-icons">close</i>
      </span>
    </button>
  );

  const modalProps = {
    open,
    title,
    size: 'xs',
    responsive,
    onClose,
    action: actionElement,
    closeForkIcon: closeButton,
    ...otherProps
  };

  useEffect(() => {
    if (videoControl.duration < timeStrToSec(beginTime)) {
      setBeginTime(parseSec(parseInt(videoControl.duration, 10)))
    }
  }, [beginTime])

  useEffect(() => {
    setURL(`${window.location.origin}/embed/${uurl.useSearch().id}`
      + `?begin=${enableBeginTime ? timeStrToSec(beginTime) : timeStrToSec(0)}&`
      + `playbackRate=${playbackRate.toString()}&`
      + `openCC=${enableCaption.toString()}&`
      + `lang=${ccLanguage}&`
      + `padded=${enablePadded.toString()}&`)
  }
    , [enableCaption, enableBeginTime, ccLanguage, playbackRate, beginTime,
      enablePadded])

  useEffect(() => {
    setEmbedHTML(`<iframe width="${width}" height="${height}" 
    src="${
      URL
      }" allowfullscreen ></iframe>`)
    if (embedHTML !== temp_confirmButton) setconfirmButtonText('Copy');
  }, [URL, width, height])


  useEffect(() => {
    setBeginTime(parseSec(parseInt(videoControl.currTime(), 10)))
  },
    [enableBeginTime])

  return (
    <>
      <Modal {...modalProps} className={classes.modal} darkMode>
        {(URL === '') ? <div /> :
        <iframe width="400" height="220" title="preview" src={URL} />}
        <CTFormRow>
          <CTInput
            inputRef={inputRef}
            textarea
            underlined
            value={embedHTML}
          />
        </CTFormRow>
        <CTFormRow>
          <CTCheckbox
            id="begin-time"
            label="Set begin time"
            checked={enableBeginTime}
            onChange={handleEnableBeginTime}
          />
          <CTInput
            underlined
            disabled={!enableBeginTime}
            value={beginTime}
            onChange={handleBeginTime}
            className={classes.beginTime}
          />
        </CTFormRow>
        <CTFormRow>
          <CTInput
            label="Width"
            value={width}
            onChange={handleWidthChange}
          />
          <CTInput
            label="Height"
            value={height}
            onChange={handleHeightChange}
          />
        </CTFormRow>
        <CTFormRow>
          <CTCheckbox
            id="open-cc"
            label="Default open caption"
            checked={enableCaption}
            onChange={handleEnableCaption}
          />
        </CTFormRow>
        <CTFormRow>
          <CTSelect
            id="sel-lang"
            label="Choose caption language"
            options={ccLanguageOptions}
            value={ccLanguage}
            onChange={handleCCLanguageChange}
          />
        </CTFormRow>
        <CTFormRow>
          <CTSelect
            id="sel-rate"
            label="Playback rate"
            options={playbackRatesOptions}
            value={playbackRate}
            onChange={handlePlaybackRateChange}
          />
        </CTFormRow>
        <CTFormRow>
          <CTCheckbox
            id="padded"
            label="Padded video player"
            checked={enablePadded}
            onChange={handleEnablePadded}
          />
        </CTFormRow>

      </Modal>
    </>
  );
}

EmbedModal.propTypes = {
  /** True if open the modal */
  open: Modal.propTypes.open,

  /** The size of the modal can be responsive to window's width */
  responsive: Modal.propTypes.responsive,

  /** The confirmation title */
  title: PropTypes.node,

  /** The confirmation text */
  text: PropTypes.node,

  /** Primary content */
  children: PropTypes.node,

  /** callback on close */
  onClose: PropTypes.func,

  /** callback on confirm */
  onConfirm: PropTypes.func,

  /** Customize the cancel-button's text */
  cancelButtonText: PropTypes.string,

  /** Customize the confirm-button's text */
  confirmButtonText: PropTypes.string,
};

export default EmbedModal;

