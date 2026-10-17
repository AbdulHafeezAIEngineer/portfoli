/** The FAQ is the brief's deliberate height-animation exception; other effects use transforms/opacity. */
export function enhanceFaq(root: HTMLElement) {
  root.dataset.faqEnhanced = "true";
  const active = new Map<
    HTMLDetailsElement,
    { animation: Animation; expanded: boolean }
  >();
  const cleanups: (() => void)[] = [];
  for (const details of root.querySelectorAll("details")) {
    const summary = details.querySelector("summary");
    const answer = details.querySelector<HTMLElement>(".faq-answer");
    if (!summary || !answer || !answer.animate) continue;
    const click = (event: MouseEvent) => {
      event.preventDefault();
      const prior = active.get(details);
      const expanded = !(prior?.expanded ?? details.open);
      const currentHeight = details.open
        ? answer.getBoundingClientRect().height
        : 0;
      prior?.animation.cancel();
      details.open = true;
      const fullHeight = answer.getBoundingClientRect().height;
      const animation = answer.animate(
        [
          { height: `${currentHeight}px`, opacity: expanded && !prior ? 0 : 1 },
          {
            height: `${expanded ? fullHeight : 0}px`,
            opacity: expanded ? 1 : 0,
          },
        ],
        { duration: 280, easing: "cubic-bezier(.22,1,.36,1)" },
      );
      active.set(details, { animation, expanded });
      animation.onfinish = () => {
        if (active.get(details)?.animation !== animation) return;
        details.open = expanded;
        active.delete(details);
      };
    };
    summary.addEventListener("click", click);
    cleanups.push(() => summary.removeEventListener("click", click));
  }
  return () => {
    delete root.dataset.faqEnhanced;
    for (const [details, { animation, expanded }] of active) {
      animation.cancel();
      details.open = expanded;
    }
    for (const cleanup of cleanups) cleanup();
    active.clear();
  };
}
