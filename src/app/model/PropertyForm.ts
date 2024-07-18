export interface PropertyForm {
    id?:number;
    ownerName: string;
    contact: string;
    state: string;
    city: string;
    area: string;
    propertyType: string;
    bhkType?: string;
    areaSqft: number;
    transactionType: string;
    amount: number;
    status: 'Rented' | 'Sold' | null;
    action : boolean;
  }