declare namespace CompanyManagement {
  interface InviteSupplierData {
    name: string;
    email: string;
    productCategory: string;
    notes: string;
    shouldNotify?: boolean;
  }

  interface Company extends App.Entity {
    name: string;
  }
}
