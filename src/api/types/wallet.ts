export interface PlansResponse {
  message: string;
  data: {
    pricePlans: Plan[];
  };
}

export interface BuyPlanResponse {
  message: string;
  data: {
    transaction: Plan;
  };
}

export interface Plan {
  ID: string;
  Amount: number;
  Price: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}
