import type { Address } from '@arviora/shared';
import { apiFetch } from '../lib/http';

export type AddressInput = Omit<Address, 'id'>;

export const fetchAddresses = (): Promise<Address[]> =>
  apiFetch<Address[]>('/addresses');

export const createAddress = (input: AddressInput): Promise<Address> =>
  apiFetch<Address>('/addresses', {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const updateAddress = (
  id: string,
  input: AddressInput,
): Promise<Address> =>
  apiFetch<Address>(`/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });

export const deleteAddress = (id: string): Promise<void> =>
  apiFetch<void>(`/addresses/${id}`, { method: 'DELETE' });
