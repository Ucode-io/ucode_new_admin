import {useLocation, useNavigate} from "react-router-dom";
import useTabRouter from "../../../../hooks/useTabRouter";
import BackButton from "../../../../components/BackButton";

const FormPageBackBtn = () => {
  const {deleteTab} = useTabRouter();
  const {pathname} = useLocation();
  const navigate = useNavigate();

  const clickHandler = async () => {
    navigate(-1);
  };

  return <BackButton className="" onClick={clickHandler} />;
};

export default FormPageBackBtn;
