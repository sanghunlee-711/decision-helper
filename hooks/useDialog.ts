import { useState } from "react";

const useDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const handleVisible = (visibility: boolean) => {
    setDialogOpen(visibility);
  };
  const handleMessage = (message: string) => {
    setDialogMessage(message);
  };
  return {
    dialogOpen,
    dialogMessage,
    handleVisible,
    handleMessage,
  };
};

export default useDialog;
