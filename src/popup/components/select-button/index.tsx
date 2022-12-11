import type { ExtensionMode } from "~core/enums/extension-mode"
import styles from "./select-button.module.scss"

export interface ISelectOption {
    name: string
    value: ExtensionMode | 'disabled'
    ico?: any
}

interface ISelectButtonRequiredProps {
    options: ISelectOption[]
    onSelect: any
}

interface ISelectButtonOptionalProps {
    selectedOption?: ISelectOption
}

const defaultProps: ISelectButtonOptionalProps = {}

interface ISelectButtonProps
    extends ISelectButtonRequiredProps,
        ISelectButtonOptionalProps {}

const SelectButton = (props: ISelectButtonProps) => {
    const { onSelect, options, selectedOption } = props

    return (
        <select onInput={(e: any) => onSelect(e.target)} className={styles.select}>
            <option selected={!selectedOption} hidden disabled>
                Select active mode...
            </option>
            {options.map((opt, index) => (
                <option
                    key={index}
                    className={styles.select__option}
                    selected={selectedOption == opt}
                    value={opt.value}>
                    {" "}
                    {opt.name}{" "}
                </option>
            )) || ""}
        </select>
    )
}

SelectButton.defaultProps = defaultProps

export default SelectButton
