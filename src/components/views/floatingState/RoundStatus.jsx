import React, { useEffect, useState } from 'react';
import { Form, Switch, message, Progress } from 'antd';
import { CarOutlined, FolderAddOutlined } from '@ant-design/icons';
import useLongPress from '../../../../utils/useLongPress';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { mutatePhase } from '../../../../store/phase';

const TIMER = process.env.REACT_APP_ENV === 'development' ? 3 : 300;

/* round switch */
const RoundStatus = ({ phase }) => {
  const [round, setRound] = useState(false);
  const [timer, setTimer] = useState(TIMER);
  const [timeTick, setTimeTick] = useState(null);
  const [percent, setPercent] = useState(0);

  const socket = useSelector((state) => state.socket, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('!phase.status:', !phase.status);
    !phase.status && setTimer(TIMER);
    setRound(!!phase.status || phase.recording);
  }, [phase]);

  // useEffect(() => {
  //   if (sensors.gnss && timeTick && !round) {
  //     if (sensors.gnss.status?.speed * 1 > 0) {
  //       message.info('Do not move while preparing for the round.', 5);
  //       pauseTimer();
  //     }
  //   }
  // }, [sensors, timeTick]);

  useEffect(() => {
    let percent = (100 - (timer / TIMER) * 100).toFixed();
    setPercent(percent);
  }, [timer]);

  const onLongPress = () => {
    onChangeRound();
  };

  const onClick = () => {
    onChangeRound();
  };

  const onChangeRound = () => {
    // console.log('round:', round);
    let msg = '';

    if (!round) {
      msg = '#change_dr,round';
      startTimer();
      message.info('Round start.');
    } else {
      msg = '#recorded,off,all';
      dispatch(mutatePhase(null));
      stopTimer();
      setTimer(TIMER);
      message.info('Round stop.');
    }
    socket.socket?.send(JSON.stringify(msg));
    setRound(!round);
  };

  /* timer */
  const startTimer = () => {
    let seconds = timer;
    const timeTick = setInterval(() => {
      if (seconds === 0) {
        dispatch(mutatePhase('round'));
        clearInterval(timeTick);
      }
      setTimer(seconds--);
    }, 1000);
    setTimeTick(timeTick);
  };

  const pauseTimer = () => {
    if (timeTick) clearInterval(timeTick);
  };

  const stopTimer = () => {
    pauseTimer();
    setTimer(TIMER);
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500
  };

  const roundLongPressEvent = useLongPress(
    onLongPress,
    onClick,
    defaultOptions
  );

  return (
    <>
      <Form.Item label="ROUND">
        <Switch
          checked={round}
          checkedChildren={<CarOutlined id="ROUND" />}
          unCheckedChildren={<FolderAddOutlined id="ROUND" />}
          className="btnRound large"
          disabled={!phase.ready}
          id="ROUND"
          {...roundLongPressEvent}
        />
      </Form.Item>
      <Progress type="circle" percent={percent} width={30} />
    </>
  );
};

export default RoundStatus;
