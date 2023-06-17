
import React, { useRef } from 'react'
import { useIsVisible } from 'react-is-visible'
import CountUp from 'react-countup';

const CountUpComponent = () => {  

  const nodeRef = useRef()
  const isVisible = useIsVisible(nodeRef)
  return <h1 className="counter" ref={nodeRef}>
    {isVisible && <CountUp
        start={0}
        end={325489}
        duration={10}
        decimals={0}
        decimal=","
        // prefix="EUR "        
        // onEnd={() => console.log('Ended! 👏')}
        // onStart={() => console.log('Started! 💨')}
  />}
  🌲 Trees Planted
  </h1>

}

export default CountUpComponent;