import { createRoot } from 'react-dom/client';
import styles from './save-button.module.css';

interface ISaveButtonRequiredProps { }

interface ISaveButtonOptionalProps {
    onClick?: any;
}

const defaultProps: ISaveButtonOptionalProps = {

}

interface ISaveButtonProps extends ISaveButtonRequiredProps, ISaveButtonOptionalProps {}

const SaveButton = (props: ISaveButtonProps) => {
  const { onClick } = props;
  
  return (
    <div className={styles['main-wrapper']} onClick={onClick}>
      <i className={styles['material-icons']}>+</i>
    </div>
  )
}

SaveButton.defaultProps = defaultProps;


export function allGood(selector: string, reactElem: any) {
  let testContainer = document.querySelectorAll(selector);
  for(let i of testContainer) {
    let div = document.createElement('div');
    i.append(div);
    let root = createRoot(div);
    root.render(reactElem);
  }

}

export default SaveButton;