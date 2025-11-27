import {useLocation, useNavigate} from "react-router-dom";
import BackButton from "../../../../components/BackButton";
import useTabRouter from "../../../../hooks/useTabRouter";
import {relationTabActions} from "../../../../store/relationTab/relationTab.slice";
import {useDispatch} from "react-redux";

const FormPageBackButton = () => {
  const {deleteTab} = useTabRouter();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clickHandler = () => {
    deleteTab(pathname);
    navigate(-1);
    dispatch(relationTabActions.clear());
  };

  return <BackButton className="ml-1" onClick={clickHandler} />;
};

export default FormPageBackButton;
