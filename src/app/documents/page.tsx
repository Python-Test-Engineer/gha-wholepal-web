"use client";

import SupplierDocuments from "./supplier-documents";
import WholesalerDocuments from "./wholesaler-documents";
import { UserTypeEnum } from "@/enums/user";

const Documents: FunctionComponent = () => {
  const { userInfo: currentUser } = useUser();
  const userType = get(currentUser, "type", UserTypeEnum.SUPPLIER);

  if (userType === UserTypeEnum.SUPPLIER) {
    return <SupplierDocuments />;
  }

  return <WholesalerDocuments />;
};

export default Documents;
