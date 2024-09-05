import React, { useEffect, useState, useContext } from "react";
import { SignupProvider } from "../contexts/SignupContext";
import GetStarted from "./GetStarted";

const SignupContainer: React.FC = () => {
    return (
        <SignupProvider>
            <GetStarted/>
        </SignupProvider>
    )
}

export default SignupContainer;