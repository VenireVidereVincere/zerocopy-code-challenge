export interface User {
    _id: string;
    guid: string;
    isActive: boolean;
    balance: string;
    picture: string;
    age: number;
    eyeColor: string;
    name: {
      first: string;
      last: string;
    };
    company: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }
  
  export interface UserDatabase {
    users: User[];
  }

  export type UserDetails = {
    name: {
      first: string,
      last: string
    };
    email: string;
    address: string;
    picture: string;
    age: number;
    phone: string;
  };