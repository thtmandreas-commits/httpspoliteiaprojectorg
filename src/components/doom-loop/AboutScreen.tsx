export function AboutScreen() {
  return (
    <div className="space-y-6 text-sm">
      {/* What this is */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          What this is
        </h3>
        <p className="text-foreground/90 leading-relaxed">
          A systems visualization tool that aggregates publicly observable signals 
          related to AI, work, demographics, and state capacity.
        </p>
      </section>

      {/* What this is not */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          What this is not
        </h3>
        <ul className="space-y-1 text-foreground/90">
          <li>Not a news app</li>
          <li>Not a forecasting tool</li>
          <li>Not financial, political, or personal advice</li>
          <li>Not personalized predictions</li>
        </ul>
      </section>

      {/* How it works */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          How it works
        </h3>
        <div className="space-y-2 text-foreground/90 leading-relaxed">
          <p>
            The app processes large volumes of public headlines to extract abstract, 
            anonymized signals.
          </p>
          <p>
            Only aggregated trends are retained. Raw content is discarded.
          </p>
          <p>
            Outputs are directional and uncertain by design.
          </p>
        </div>
      </section>

      {/* Data & access */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Data & access
        </h3>
        <ul className="space-y-1 text-foreground/90">
          <li>No sign-ups</li>
          <li>No accounts</li>
          <li>No paywalls</li>
          <li>No personal data collection</li>
        </ul>
        <p className="mt-3 text-foreground/70 text-xs">
          Some screens may contain clearly separated advertising to support continued development.
        </p>
      </section>

      {/* End marker */}
      <div className="pt-4 text-center">
        <span className="text-xs text-muted-foreground/50">—</span>
      </div>
    </div>
  );
}
