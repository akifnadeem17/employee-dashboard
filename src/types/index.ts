export type ViewMode = "grid" | "tiles";
export type SortField = "name" | "email" | "age";
export type SortOrder = "asc" | "desc";

export type Employee = {
  name: {
    first: string;
    last: string;
  };
  email: string;
  dob: {
    age: number;
  };
  picture: {
    large: string;
  };
  login: {
    uuid: string;
  };
  phone: string;
  location: {
    city: string;
    country: string;
  };
  gender: string;
  nat: string;
};
