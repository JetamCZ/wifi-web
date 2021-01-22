import React, { useState } from "react";
import T from "../../components/T";
import AxiosInstance from "../../utils/AxiosInstance";
import config from "../../config";

const GenerateInv = () => {
  const states = {
    WAITING_FOR_INTERACTION: 0,
    GETTING_TOKEN: 1,
    DONE: 2,
    ERROR: 3,
  };

  const [state, setState] = useState(states.WAITING_FOR_INTERACTION);
  const [token, setToken] = useState("");

  const getToken = () => {
    setState(states.GETTING_TOKEN);

    AxiosInstance.get("/organization/newInvitation")
      .then((res) => {
        setState(states.DONE);
        setToken(res.data);
      })
      .catch(() => {
        setState(states.ERROR);
      });
  };

  if (state === states.WAITING_FOR_INTERACTION) {
    return (
      <div className="generateInv click-me" onClick={getToken}>
        <T id="page.pageOrganization.members.modal.newToken.clickme" />
      </div>
    );
  } else if (state === states.GETTING_TOKEN) {
    return (
      <div className="generateInv">
        <T id="page.pageOrganization.members.modal.newToken.getting" />
      </div>
    );
  } else if (state === states.DONE) {
    return (
      <>
        <div className="generateInv">
          {config.ownBaseURL}auth/register/{token}
        </div>
        <div className="text-center">
          <T id="page.pageOrganization.members.modal.newToken.done" />
        </div>
      </>
    );
  } else {
    return (
      <div className="generateInv">
        <T id="page.pageOrganization.members.modal.newToken.error" />
      </div>
    );
  }
};

export default GenerateInv;
