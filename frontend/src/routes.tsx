export const ROUTES = {
  apex: "/",
  bills: {
    apexList: "/",
    list: "/bills",
    create: "/bills/create",
    getById: (id: string) => `/bills/${id}`,
  },
};
