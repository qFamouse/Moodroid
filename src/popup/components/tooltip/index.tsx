import { useCallback, useState } from 'react';

import { classNames } from '~popup/utils/class-names'; 

import styles from "./tooltip.module.scss"


interface ITooltipRequiredProps {
  children: any
  text: string
}

interface ITooltipOptionalProps {
  delay?: number
}

const defaultProps: ITooltipOptionalProps = {
  delay: 0
}

interface ITooltipProps
  extends ITooltipRequiredProps,
    ITooltipOptionalProps {}

const Tooltip = (props: ITooltipProps) => {
  const [show, setShow] = useState(false);
  const { text, children, delay } = props;
  let timeout = null;

  const setShowTrue = useCallback(() => {
      clearTimeout(timeout);
      timeout = setTimeout( () => setShow(true), delay);
    },
    [show]
  )

  const setShowFalse = useCallback(() => {
      clearTimeout(timeout);
      setShow(false);
    },
    [show])


  return (
    <div className={styles.tooltip}>
      <div className={classNames({
        [styles.tooltip__box] : true,
        [styles.tooltip__box_visible]: show,
      })}>
        {text}
        <span className={styles.tooltip__arrow} />
      </div>
       <div
        onMouseEnter={() => setShowTrue()}
        onMouseLeave={() => setShowFalse()}
      >
        {children}
      </div>
    </div>
  )
}

Tooltip.defaultProps = defaultProps

export default Tooltip
