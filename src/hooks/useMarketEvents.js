import { useState, useRef } from "react";
import { MARKET_EVENTS } from "../data/events.js";

export function useMarketEvents() {
  const [activeEvents, setActiveEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const activeEventsRef = useRef([]);

  // Returns array of event definitions that were triggered (for caller to notify)
  const checkRandomEvent = (simSeconds, simTime) => {
    const triggered = [];
    const currentActive = activeEventsRef.current;

    MARKET_EVENTS.forEach(event => {
      if (currentActive.some(e => e.id === event.id)) return;
      if (triggered.some(e => e.id === event.id)) return;
      const prob = 1 - Math.pow(1 - event.probability, simSeconds);
      if (Math.random() < prob) triggered.push(event);
    });

    if (triggered.length > 0) {
      const ts = simTime instanceof Date ? simTime.toISOString() : String(simTime);
      const newInstances = triggered.map(ev => ({
        ...ev,
        instanceId: `${ev.id}_${Date.now()}`,
        remainingSeconds: ev.duration,
        totalDuration: ev.duration,
        triggeredAt: ts,
      }));

      // Update ref immediately so same-tick checks see the new events
      activeEventsRef.current = [...currentActive, ...newInstances];
      setActiveEvents(prev => [...prev, ...newInstances]);
      setPastEvents(prev => [...newInstances, ...prev].slice(0, 50));
    }

    return triggered;
  };

  const tickEvents = (simSeconds) => {
    if (activeEventsRef.current.length === 0) return;
    setActiveEvents(prev => {
      const next = prev
        .map(e => ({ ...e, remainingSeconds: e.remainingSeconds - simSeconds }))
        .filter(e => e.remainingSeconds > 0);
      activeEventsRef.current = next;
      return next;
    });
  };

  // Returns combined drift + volMult for a given sector from all active events
  const getEventModForSector = (sector) => {
    const events = activeEventsRef.current;
    if (!events.length || !sector) return null;
    let drift = 0;
    let volMult = 1;
    let hasEffect = false;
    events.forEach(e => {
      const fx = e.sectorEffects?.[sector];
      if (fx) {
        drift += fx.drift || 0;
        volMult *= fx.volMult || 1;
        hasEffect = true;
      }
    });
    return hasEffect ? { drift, volMult } : null;
  };

  const resetEvents = () => {
    setActiveEvents([]);
    setPastEvents([]);
    activeEventsRef.current = [];
  };

  return {
    activeEvents,
    pastEvents,
    checkRandomEvent,
    tickEvents,
    getEventModForSector,
    resetEvents,
  };
}
