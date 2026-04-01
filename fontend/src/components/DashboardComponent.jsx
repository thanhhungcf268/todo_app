import { useEffect } from "react";

import useStoreAuth from "../zustand_store/storeAuth";

const DashboardComponent = () => {
  const permissions = useStoreAuth((state) => state.permissions);

  useEffect(() => {
    console.log("Permissions hiện tại trong Store:", permissions);
  }, [permissions]);
  return (
    <>
      <h1>Dashboard Component</h1>
    </>
  );
};

export default DashboardComponent;
