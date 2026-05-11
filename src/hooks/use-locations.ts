import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface LocationItem {
  id: number;
  name: string;
}

export const useCountries = () =>
  useQuery({
    queryKey: ['locations', 'countries'],
    queryFn: async () => {
      const res = await apiClient.get('/locations/countries', { params: { limit: 1000 } });
      return (res.data.data ?? []) as LocationItem[];
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

export const useStates = (countryId: number | null | undefined) =>
  useQuery({
    queryKey: ['locations', 'states', countryId],
    queryFn: async () => {
      const res = await apiClient.get(`/locations/states/${countryId}`, { params: { limit: 1000 } });
      return (res.data.data ?? []) as LocationItem[];
    },
    enabled: !!countryId,
    staleTime: Infinity,
    gcTime: Infinity,
  });

export const useDistricts = (stateId: number | null | undefined) =>
  useQuery({
    queryKey: ['locations', 'districts', stateId],
    queryFn: async () => {
      const res = await apiClient.get(`/locations/districts/${stateId}`, { params: { limit: 1000 } });
      return (res.data.data ?? []) as LocationItem[];
    },
    enabled: !!stateId,
    staleTime: Infinity,
    gcTime: Infinity,
  });

export const useCities = (districtId: number | null | undefined) =>
  useQuery({
    queryKey: ['locations', 'cities', districtId],
    queryFn: async () => {
      const res = await apiClient.get(`/locations/cities/${districtId}`, { params: { limit: 1000 } });
      return (res.data.data ?? []) as LocationItem[];
    },
    enabled: !!districtId,
    staleTime: Infinity,
    gcTime: Infinity,
  });
