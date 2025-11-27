import {Outlet} from "react-router-dom";
import styles from "./styles.module.scss"
import config from "../../../builder_config/config.json";
import {useLoginMicrofrontendQuery} from "../../services/loginMicrofrontendService";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import Microfrontend from "../../views/Microfrontend";
import MicrofrontendComponent from "../../components/MicrofrontendComponent";
import {useDispatch, useSelector} from "react-redux";
import {store} from "../../store";
import {loginAction} from "../../store/auth/auth.thunk";
import LanguageSelector from "../../components/LanguageSelector";

const AuthLayoutDesign = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const subdomain =
    window.location.hostname === "localhost"
      ? "ett.u-code.io"
      : window.location.hostname;

  const {data, isLoading} = useLoginMicrofrontendQuery({
    params: {
      subdomain,
      enabled: Boolean(!isAuth),
    },
  });

  const dispatch = useDispatch();

  const microfrontendUrl = data?.function?.url;
  const microfrontendLink = microfrontendUrl
    ? `https://${microfrontendUrl}/assets/remoteEntry.js`
    : undefined;

  if (isLoading) return <RingLoaderWithWrapper style={{height: "100vh"}} />;

  if (microfrontendUrl && window.location.hostname !== "localhost")
    return (
      <>
        <MicrofrontendComponent
          loginAction={(authData) => dispatch(loginAction(authData))}
          key={microfrontendLink}
          link={microfrontendLink}
        />
        <Outlet />
      </>
    );

  return (
    <div className={styles.layout}>
      <div className={styles.leftSide}>
        <div></div>
        <div className={styles.logoBlock}>
          <h1 className={styles.logoTitle}>{config?.company_name}</h1>
          <div style={{ marginLeft: "auto" }}>
            <LanguageSelector />
          </div>
        </div>


      </div>
      <div className={styles.outlet}>
        <Outlet />
      </div>


      <div className={styles.footerImage}></div>

    </div>
  );
};

export default AuthLayoutDesign;
