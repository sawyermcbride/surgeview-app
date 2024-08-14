import React, {useState} from "react";
import { Alert } from "antd";

interface MessageBoxProps {
    title: string,
    text: string
}

const MessageBox: React.FC<MessageBoxProps> = (props) => {
    return (
        <Alert
        message = {props.title}
        description = {props.text}
        type="info"
        showIcon
        style={{marginBottom: "20px"}}
        />
    )
}

export default MessageBox;