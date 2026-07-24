"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.add("reveal-ready");

    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll("[data-reveal]")
        .forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    function observeElement(element) {
      if (!(element instanceof Element)) return;
      if (!element.matches("[data-reveal]")) return;
      if (element.classList.contains("is-visible")) return;

      observer.observe(element);
    }

    function observeTree(root) {
      if (root instanceof Element) {
        observeElement(root);
        root.querySelectorAll("[data-reveal]").forEach(observeElement);
        return;
      }

      document.querySelectorAll("[data-reveal]").forEach(observeElement);
    }

    observeTree(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => observeTree(node));
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
