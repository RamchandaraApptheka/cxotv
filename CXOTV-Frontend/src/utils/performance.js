// Performance monitoring and Web Vitals tracking
export function trackWebVitals(metric) {
  if (process.env.NODE_ENV === 'production') {
    // You can replace this with your analytics service
    const analyticsEndpoint = '/api/analytics';
    
    const body = {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
      entries: metric.entries,
      navigationType: metric.navigationType,
    };

    // Use navigator.sendBeacon if available, falling back to fetch
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
      navigator.sendBeacon(analyticsEndpoint, blob);
    } else {
      fetch(analyticsEndpoint, {
        body: JSON.stringify(body),
        method: 'POST',
        keepalive: true,
      });
    }
  }
}

// Log performance metrics
export function logMetric(metric) {
  console.log(`[${metric.name}]`, metric.value);
}

// Measure time for a function execution
export async function measurePerf(fn, name) {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`⏱️  ${name || 'Operation'} took: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

// Monitor long tasks
export function monitorLongTasks() {
  if ('PerformanceLongTaskTiming' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Long task detected:', entry);
        // Report long tasks to your analytics
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
    return observer;
  }
  return null;
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window !== 'undefined') {
    // Monitor long tasks
    const longTaskObserver = monitorLongTasks();
    
    // Cleanup function
    return () => {
      if (longTaskObserver) {
        longTaskObserver.disconnect();
      }
    };
  }
  return () => {};
}
