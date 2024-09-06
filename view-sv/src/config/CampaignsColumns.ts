import React, {useContext} from "react";
import {Tooltip, Typography} from "antd";

import { CampaignsContext } from "../contexts/CampaignsContext";

export const getCampaignsColumns = () => {
  const {campaignsStateData} = useContext(CampaignsContext);

}