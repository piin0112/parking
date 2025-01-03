import { useDispatch } from 'react-redux';
import { myPositionActions } from "../store/store";
import Icons from "../assets/images/icons"

function Position() {
  const dispatch = useDispatch()

  // 不同情況dispatch不同type
  const myPositionHandler = () => {
    dispatch(myPositionActions.myPosition()) // 透過 Redux 更新使用者位置
  }
  return (
    <button>
      <Icons.SVGPosition onClick={(e)=>{
      e.preventDefault()
      myPositionHandler()
    }} />
    </button>
  );
}


export default Position
