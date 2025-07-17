"use client";

import SupplierProducts from "./supplier-products";
import WholeSalerProducts from "./wholesaler-products";
import { UserTypeEnum } from "@/enums/user";

const Products: FunctionComponent = () => {
  const { userInfo: currentUser } = useUser();
  const userType = get(currentUser, "type", UserTypeEnum.SUPPLIER);

  if (userType === UserTypeEnum.SUPPLIER) {
    return <SupplierProducts />;
  }

  return <WholeSalerProducts />;
};

export default Products;
