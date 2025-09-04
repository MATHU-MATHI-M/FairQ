import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface QueueEntry {
  id: string;
  userId: string;
  queueType: 'transport' | 'exam';
  service: string;
  position: number;
  estimatedWaitTime: number;
  status: 'waiting' | 'processing' | 'completed' | 'cancelled';
  blockchainHash: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

interface QueueContextType {
  queues: QueueEntry[];
  joinQueue: (queueData: Omit<QueueEntry, 'id' | 'position' | 'blockchainHash' | 'timestamp'>) => Promise<string>;
  leaveQueue: (queueId: string) => void;
  getQueuePosition: (queueId: string) => QueueEntry | null;
  updateQueueStatus: (queueId: string, status: QueueEntry['status']) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queues, setQueues] = useState<QueueEntry[]>(() => {
    try {
      const raw = localStorage.getItem('fairq_queues');
      if (raw) {
        const parsed = JSON.parse(raw) as (Omit<QueueEntry, 'timestamp'> & { timestamp: string })[];
        return parsed.map(item => ({ ...item, timestamp: new Date(item.timestamp) }));
      }
    } catch {}
    // Inject demo queues if none exist
    const now = new Date();
    const demoQueues: QueueEntry[] = [
      {
        id: 'q1',
        userId: 'demo1',
        queueType: 'transport',
        service: 'Flight 101',
        position: 2,
        estimatedWaitTime: 15,
        status: 'waiting',
        blockchainHash: '0xabc123',
        timestamp: new Date(now.getTime() - 60 * 60 * 1000),
        priority: 'high'
      },
      {
        id: 'q2',
        userId: 'demo1',
        queueType: 'exam',
        service: 'Math Exam',
        position: 1,
        estimatedWaitTime: 5,
        status: 'processing',
        blockchainHash: '0xdef456',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000),
        priority: 'medium'
      },
      {
        id: 'q3',
        userId: 'demo1',
        queueType: 'transport',
        service: 'Train 202',
        position: 5,
        estimatedWaitTime: 40,
        status: 'waiting',
        blockchainHash: '0xghi789',
        timestamp: new Date(now.getTime() - 10 * 60 * 1000),
        priority: 'low'
      }
    ];
    localStorage.setItem('fairq_queues', JSON.stringify(demoQueues.map(q => ({ ...q, timestamp: q.timestamp.toISOString() }))));
    return demoQueues;
  });

  // Simulate blockchain hash generation
  const generateBlockchainHash = () => {
    return '0x' + Math.random().toString(16).substr(2, 64);
  };

  const joinQueue = useCallback(async (queueData: Omit<QueueEntry, 'id' | 'position' | 'blockchainHash' | 'timestamp'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    let createdId = '';
    setQueues(prev => {
      const position = prev.filter(q => q.service === queueData.service && q.status === 'waiting').length + 1;
      const newEntry: QueueEntry = {
        ...queueData,
        id: Math.random().toString(36).substr(2, 9),
        position,
        blockchainHash: generateBlockchainHash(),
        timestamp: new Date()
      };
      createdId = newEntry.id;
      return [...prev, newEntry];
    });
    return createdId;
  }, []);

  const leaveQueue = useCallback((queueId: string) => {
    setQueues(prev => prev.filter(q => q.id !== queueId));
  }, []);

  const getQueuePosition = useCallback((queueId: string) => {
    return queues.find(q => q.id === queueId) || null;
  }, [queues]);

  const updateQueueStatus = useCallback((queueId: string, status: QueueEntry['status']) => {
    setQueues(prev => prev.map(q => 
      q.id === queueId ? { ...q, status } : q
    ));
  }, []);

  // Simulate queue progression
  useEffect(() => {
    const interval = setInterval(() => {
      setQueues(prev => prev.map(queue => {
        if (queue.status === 'waiting' && queue.estimatedWaitTime > 0) {
          return {
            ...queue,
            estimatedWaitTime: Math.max(0, queue.estimatedWaitTime - 1)
          };
        }
        return queue;
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Persist to localStorage whenever queues change
  useEffect(() => {
    try {
      const serializable = queues.map(q => ({ ...q, timestamp: q.timestamp.toISOString() }));
      localStorage.setItem('fairq_queues', JSON.stringify(serializable));
    } catch {}
  }, [queues]);

  return (
    <QueueContext.Provider value={{ queues, joinQueue, leaveQueue, getQueuePosition, updateQueueStatus }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within QueueProvider');
  }
  return context;
};