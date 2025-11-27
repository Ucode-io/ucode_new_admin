import {Suspense} from "react";
import {lazy} from "react";
// import empty from "remote_empty_app/empty";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import SafeComponent from "../SafeComponent";

const empty = lazy(() => import("remote_empty_app/empty"));

const EMPTY = empty;

const MicrofrontendComponent = ({link, loginAction}) => {
  const RemoteButton = lazy(async () => {
    window.remotesMap[`remote_app_${link}`] = {
      url: link,
      format: "esm",
      from: "vite",
    };

    const comp = await window.__federation_method_getRemote(
      `remote_app_${link}`,
      "./Page"
    );
    return comp;
  });

  return (
    <SafeComponent>
      <Suspense fallback={<RingLoaderWithWrapper style={{height: "100vh"}} />}>
        <RemoteButton loginAction={loginAction} />
      </Suspense>
    </SafeComponent>
  );
};
export default MicrofrontendComponent;
