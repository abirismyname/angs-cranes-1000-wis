// Custom hook for Cloudflare Pages API integration
import { useState, useEffect, useCallback } from 'react';

interface Pledge {
  id: string;
  name: string;
  craneCount: number;
  timestamp: number;
}

interface PledgeData {
  pledges: Pledge[];
  totalReceived: number;
  totalPledged: number;
  stats: {
    totalPledgers: number;
    goalProgress: number;
    receivedProgress: number;
  };
}

export function useCloudflareKV() {
  const [pledgeData, setPledgeData] = useState<PledgeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPledges = useCallback(async () => {
    try {
      console.log('🔍 [DEBUG] Fetching pledges from /api/pledges');
      setLoading(true);
      const response = await fetch('/api/pledges');
      console.log('🔍 [DEBUG] Response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ [DEBUG] Response not ok:', response.statusText);
        throw new Error('Failed to fetch pledges');
      }
      
      const data = await response.json();
      console.log('✅ [DEBUG] Fetched data:', data);
      setPledgeData(data);
      setError(null);
    } catch (err) {
      console.error('❌ [DEBUG] Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pledges');
    } finally {
      setLoading(false);
    }
  }, []);

  const addPledge = useCallback(async (pledge: Omit<Pledge, 'id' | 'timestamp'>) => {
    try {
      console.log('🔍 [DEBUG] Adding pledge:', pledge);
      const response = await fetch('/api/pledges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pledge,
          id: Date.now().toString(),
          timestamp: Date.now(),
        }),
      });

      console.log('🔍 [DEBUG] Add pledge response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [DEBUG] Add pledge failed:', errorText);
        throw new Error('Failed to add pledge');
      }

      const result = await response.json();
      console.log('✅ [DEBUG] Pledge added successfully:', result);

      // Refresh data after successful addition
      await fetchPledges();
      return { success: true };
    } catch (err) {
      console.error('❌ [DEBUG] Add pledge error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add pledge');
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [fetchPledges]);

  const updateTotalReceived = useCallback(async (totalReceived: number) => {
    try {
      const response = await fetch('/api/pledges', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalReceived }),
      });

      if (!response.ok) {
        throw new Error('Failed to update total received');
      }

      // Refresh data after successful update
      await fetchPledges();
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update total received');
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [fetchPledges]);

  useEffect(() => {
    fetchPledges();
  }, [fetchPledges]);

  return {
    pledges: pledgeData?.pledges || [],
    totalReceived: pledgeData?.totalReceived || 0,
    totalPledged: pledgeData?.totalPledged || 0,
    stats: pledgeData?.stats || { totalPledgers: 0, goalProgress: 0, receivedProgress: 0 },
    loading,
    error,
    addPledge,
    updateTotalReceived,
    refetch: fetchPledges,
  };
}