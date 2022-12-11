import { useId } from "react"

import styles from "./toggle-button.module.scss"

interface IToggleButtonRequiredProps {}

interface IToggleButtonOptionalProps {
  text?: string
  checked?: boolean

  onChange?: any
}

const defaultProps: IToggleButtonOptionalProps = {}

interface IToggleButtonProps
  extends IToggleButtonRequiredProps,
    IToggleButtonOptionalProps {}

const ToggleButton = (props: IToggleButtonProps) => {
  const { text, checked, onChange } = props
  const toggleId = useId()

  return (
    <div className={styles.toggle}>
      <label htmlFor={toggleId} className={styles.toggle__label}>
        {text}
      </label>
      <label className={styles.toggle__switch}>
        <input
          id={toggleId}
          className={styles.toggle__input}
          type="checkbox"
          onChange={(e) => onChange(e)}
          checked={checked}
        />
        <span className={styles.toggle__slider} />
      </label>
    </div>
  )
}

ToggleButton.defaultProps = defaultProps

export default ToggleButton
