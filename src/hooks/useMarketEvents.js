import { useState, useRef } from "react";
import { MARKET_EVENTS } from "../data/events.js";

const SIM_START_MS = new Date("2025-01-02T09:00:00").getTime();
const WEEK_SIM_MS  = 7 * 24 * 3600 * 1000;
const MAX_CONCURRENT = 5;
const MAX_PER_WEEK   = 2;

export function useMarketEvents() {
  const [activeEvents, setActiveEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const activeEventsRef = useRef([]);
  // tracks how many events triggered in the current in-game week
  const weeklyRef = useRef({ weekKey: -1, count: 0 });

  // Returns array of event definitions that were triggered (for caller to notify)
  const checkRandomEvent = (simSeconds, simTime) => {
    const currentActive = activeEventsRef.current;

    // Hard cap: never exceed MAX_CONCURRENT simultaneous events
    if (currentActive.length >= MAX_CONCURRENT) return [];

    // Weekly cap: at most MAX_PER_WEEK new events per in-game week
    const simMs  = simTime instanceof Date ? simTime.getTime() : SIM_START_MS;
    const weekKey = Math.floor((simMs - SIM_START_MS) / WEEK_SIM_MS);
    if (weeklyRef.current.weekKey !== weekKey) {
      weeklyRef.current = { weekKey, count: 0 };
    }
    if (weeklyRef.current.count >= MAX_PER_WEEK) return [];

    const triggered = [];

    MARKET_EVENTS.forEach(event => {
      // re-check limits as triggered grows
      if (currentActive.length + triggered.length >= MAX_CONCURRENT) return;
      if (weeklyRef.current.count + triggered.length >= MAX_PER_WEEK) return;
      if (currentActive.some(e => e.id === event.id)) return;
      if (triggered.some(e => e.id === event.id)) return;
      const prob = 1 - Math.pow(1 - event.probability, simSeconds);
      if (Math.random() < prob) triggered.push(event);
    });

    if (triggered.length > 0) {
      const ts = simTime instanceof Date ? simTime.toISOString() : String(simTime);
      // Variable duration: 60 %–140 % of the base duration
      const newInstances = triggered.map(ev => {
        const factor = 0.6 + Math.random() * 0.8;
        const varDuration = Math.round(ev.duration * factor);
        return {
          ...ev,
          instanceId: `${ev.id}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          remainingSeconds: varDuration,
          totalDuration: varDuration,
          triggeredAt: ts,
        };
      });

      weeklyRef.current = { weekKey, count: weeklyRef.current.count + triggered.length };
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
    weeklyRef.current = { weekKey: -1, count: 0 };
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
