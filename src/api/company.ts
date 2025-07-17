export const inviteSupplier = (
  data: CompanyManagement.InviteSupplierData
): Promise<void> =>
  useHttpRequest({ url: "/companies/send-invite", method: "POST", data });

export const searchCompanies = (params: {
  name: string;
}): Promise<{ id: string; name: string }[]> =>
  useHttpRequest({ url: "/companies/quick-search", params });
