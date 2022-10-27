import styles from './select-button.module.scss';

export interface ISelectOption {
    name: string
    value: string
    ico?: any;
}

interface ISelectButtonRequiredProps {
    options: ISelectOption[];
}

interface ISelectButtonOptionalProps {
    onSelect?: any;
}

const defaultProps: ISelectButtonOptionalProps = {

}

interface ISelectButtonProps extends ISelectButtonRequiredProps, ISelectButtonOptionalProps {}

const SelectButton = (props: ISelectButtonProps) => {
    const { onSelect, options } = props;

    return (
      <select onSelect={(e) => onSelect(e)} className={styles.select}>
        <option selected hidden disabled>Select active mode...</option>
        { 
          options.map(({name, value, ico}, index) => 
              <option 
                key={index} 
                className={styles.select__option} 
                value={value}
                > {name} </option>
          ) || '' 
        }
      </select>
    )
}

SelectButton.defaultProps = defaultProps;

export default SelectButton;
