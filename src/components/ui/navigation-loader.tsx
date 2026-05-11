"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useIsMutating } from "@tanstack/react-query";
import { useEffect, useState, Suspense, useRef } from "react";
import Loader from "@/components/ui/loader";

/**
 * Professional Navigation Loader - Snappy & Balanced
 * Optimized to ONLY trigger on actual navigation clicks or pushState calls.
 */
function NavigationLoaderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeMutations = useIsMutating();
  const [loading, setLoading] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const pageHandlesOwnMutationLoader = false;
  const loadingStartTimeRef = useRef<number>(0);
  const mutationLoadingStartTimeRef = useRef<number>(0);
  const showDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loaderDotColors = [
    "#2563eb",
    "#0f766e",
    "#f8fafc",
    "#111827",
    "#475569",
    "#dbeafe",
  ];

  // Stop loading when pathname or params change
  useEffect(() => {
    if (showDelayTimerRef.current) {
      clearTimeout(showDelayTimerRef.current);
      showDelayTimerRef.current = null;
    }

    if (!loading) return;
    const elapsed = Date.now() - loadingStartTimeRef.current;
    const MINIMUM_DISPLAY_TIME = 120; 
    
    const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME - elapsed);

    const timer = setTimeout(() => {
      setLoading(false);
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (pageHandlesOwnMutationLoader) {
      setMutationLoading(false);
      return;
    }

    if (activeMutations > 0) {
      mutationLoadingStartTimeRef.current = Date.now();
      setMutationLoading(true);
      return;
    }

    if (!mutationLoading) return;
    const elapsed = Date.now() - mutationLoadingStartTimeRef.current;
    const MINIMUM_DISPLAY_TIME = 180;
    const timer = setTimeout(() => {
      setMutationLoading(false);
    }, Math.max(0, MINIMUM_DISPLAY_TIME - elapsed));

    return () => clearTimeout(timer);
  }, [activeMutations, mutationLoading, pageHandlesOwnMutationLoader]);

  // Intercept links to start loader INSTANTLY
  useEffect(() => {
    const startLoading = () => {
      if (showDelayTimerRef.current) {
        clearTimeout(showDelayTimerRef.current);
      }

      // Show loader only if navigation is not instant.
      showDelayTimerRef.current = setTimeout(() => {
        loadingStartTimeRef.current = Date.now();
        setLoading(true);
      }, 120);
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href &&
        anchor.target !== "_blank" &&
        anchor.href.startsWith(window.location.origin) &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        anchor.href !== window.location.href // Only for new URLs
      ) {
        startLoading();
      }
    };

    // ONLY monkey-patch pushState (Actual Navigations)
    // Avoid replaceState to prevent flickering on background state updates
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      const url = args[2];
      if (url && typeof url === 'string' && url !== window.location.pathname + window.location.search) {
         startLoading();
      }
      return originalPushState.apply(window.history, args);
    };

    document.addEventListener("click", handleAnchorClick);
    
    return () => {
      if (showDelayTimerRef.current) {
        clearTimeout(showDelayTimerRef.current);
      }
      document.removeEventListener("click", handleAnchorClick);
      window.history.pushState = originalPushState;
    };
  }, []);

  return (
    <>
      {(loading || mutationLoading) && <Loader dotColors={loaderDotColors} />}
      <div
        className={`transition-opacity duration-300 ease-in-out ${
          loading || mutationLoading ? "opacity-70 pointer-events-none" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}

export function NavigationLoader({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <NavigationLoaderInner>{children}</NavigationLoaderInner>
    </Suspense>
  );
}
