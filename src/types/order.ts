export type Order = {
  id: number;
  userName: string;
  totalSum: number;
  status: "NEW" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    options?: string[];
  }[];
};
