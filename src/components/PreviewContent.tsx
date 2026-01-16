interface PreviewContentProps {
  type: "landing" | "pricing" | "dashboard" | "empty";
}

const PreviewContent = ({ type }: PreviewContentProps) => {
  if (type === "empty") {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No Preview Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Start a conversation to generate your website. Describe what you want and watch it appear here.
        </p>
      </div>
    );
  }

  if (type === "landing") {
    return (
      <div className="bg-background">
        {/* Hero Section */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-border">
          <div className="font-bold text-lg">Startup</div>
          <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Features</a>
            <a href="#" className="hover:text-foreground">Pricing</a>
            <a href="#" className="hover:text-foreground">About</a>
          </nav>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            Get Started
          </button>
        </header>

        <main className="px-6 py-16 text-center">
          <div className="inline-flex px-3 py-1 rounded-full bg-secondary text-sm mb-6">
            ✨ Now in Beta
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Build Something<br />Amazing Today
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
            The fastest way to turn your ideas into reality. No code required.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
              Start Free
            </button>
            <button className="px-6 py-3 border border-border rounded-lg font-medium">
              Learn More
            </button>
          </div>
        </main>

        {/* Features */}
        <section className="px-6 py-12 border-t border-border">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {["Lightning Fast", "Secure", "Scalable"].map((feature) => (
              <div key={feature} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-foreground/20" />
                </div>
                <h3 className="font-semibold mb-2">{feature}</h3>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet consectetur adipisicing.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (type === "pricing") {
    return (
      <div className="bg-background p-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Simple Pricing</h2>
          <p className="text-muted-foreground">Choose the plan that works for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Starter", price: "$9", features: ["5 Projects", "Basic Support", "1GB Storage"] },
            { name: "Pro", price: "$29", features: ["Unlimited Projects", "Priority Support", "10GB Storage", "API Access"] },
            { name: "Enterprise", price: "$99", features: ["Everything in Pro", "Dedicated Support", "Unlimited Storage", "Custom Integrations"] },
          ].map((plan, i) => (
            <div
              key={plan.name}
              className={`p-6 rounded-xl border ${
                i === 1 ? "border-foreground bg-secondary" : "border-border"
              }`}
            >
              <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
              <div className="text-3xl font-bold mb-4">
                {plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-foreground/10 flex items-center justify-center text-xs">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2 rounded-lg text-sm font-medium ${
                i === 1 ? "bg-primary text-primary-foreground" : "border border-border"
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="bg-background min-h-[400px]">
        {/* Sidebar + Content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 border-r border-border p-4 space-y-1">
            <div className="font-bold mb-6">Dashboard</div>
            {["Overview", "Analytics", "Projects", "Settings"].map((item, i) => (
              <div
                key={item}
                className={`px-3 py-2 rounded-lg text-sm ${
                  i === 0 ? "bg-secondary font-medium" : "text-muted-foreground"
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6">Overview</h2>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Users", value: "12,345" },
                { label: "Revenue", value: "$45,678" },
                { label: "Active Projects", value: "89" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl border border-border">
                  <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <div className="h-48 rounded-xl bg-secondary flex items-center justify-center">
              <span className="text-muted-foreground">Chart Visualization</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PreviewContent;
