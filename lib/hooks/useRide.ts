import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchRideById,
  updateRideStatus,
  persistRide,
  offerRide,
  fetchAvailableRides,
  fetchRideHistory,
  fetchRiderHistory,
  fetchCustomerHistory,
  clearRides,
  clearHistory,
  setCurrentRide,
  clearCurrentRide,
} from '../store/slices/rideSlice';

export const useRide = () => {
  const dispatch = useAppDispatch();
  const {
    rides,
    currentRide,
    availableRides,
    rideHistory,
    riderHistory,
    customerHistory,
    loading,
    error,
    totalRides,
    totalHistory,
  } = useAppSelector((state) => state.rides);

  const getRide = useCallback(
    async (device: string, rideId: string) => {
      return dispatch(fetchRideById({ device, rideId }));
    },
    [dispatch]
  );

  const updateStatus = useCallback(
    async (device: string, rideId: string, status: string) => {
      return dispatch(updateRideStatus({ device, rideId, status }));
    },
    [dispatch]
  );

  const persist = useCallback(
    async (device: string, data: any) => {
      return dispatch(persistRide({ device, data }));
    },
    [dispatch]
  );

  const offer = useCallback(
    async (device: string, data: any) => {
      return dispatch(offerRide({ device, data }));
    },
    [dispatch]
  );

  const getAvailableRides = useCallback(
    async (device: string, params?: any) => {
      return dispatch(fetchAvailableRides({ device, params }));
    },
    [dispatch]
  );

  const getRideHistory = useCallback(
    async (device: string, params?: any) => {
      return dispatch(fetchRideHistory({ device, params }));
    },
    [dispatch]
  );

  const getRiderHistory = useCallback(
    async (device: string, params?: any) => {
      return dispatch(fetchRiderHistory({ device, params }));
    },
    [dispatch]
  );

  const getCustomerHistory = useCallback(
    async (device: string, params?: any) => {
      return dispatch(fetchCustomerHistory({ device, params }));
    },
    [dispatch]
  );

  const clearAllRides = useCallback(() => {
    dispatch(clearRides());
  }, [dispatch]);

  const clearAllHistory = useCallback(() => {
    dispatch(clearHistory());
  }, [dispatch]);

  const setRide = useCallback(
    (ride: any) => {
      dispatch(setCurrentRide(ride));
    },
    [dispatch]
  );

  const clearRide = useCallback(() => {
    dispatch(clearCurrentRide());
  }, [dispatch]);

  return {
    // State
    rides,
    currentRide,
    availableRides,
    rideHistory,
    riderHistory,
    customerHistory,
    loading,
    error,
    totalRides,
    totalHistory,

    // Actions
    getRide,
    updateRideStatus: updateStatus,
    persistRide: persist,
    offerRide: offer,
    getAvailableRides,
    getRideHistory,
    getRiderHistory,
    getCustomerHistory,
    clearRides: clearAllRides,
    clearHistory: clearAllHistory,
    setCurrentRide: setRide,
    clearCurrentRide: clearRide,
  };
};