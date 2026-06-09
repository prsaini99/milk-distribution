/**
 * Delivery address. Kept as a flat value object so it can be both
 * stored on the user and snapshotted onto an order.
 */
export interface Address {
  line1: string;
  city: string;
  pincode: string;
  phone: string;
}

/**
 * A customer. Auth is mocked in the demo phase — there is no password
 * here; a user is "logged in" simply by being selected.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  address: Address;
}
