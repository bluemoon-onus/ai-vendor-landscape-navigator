import { useState, useEffect, useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import {
  X, GitCompare, Layers, Sparkles, Zap, Building2, Wrench,
  ChevronDown, ArrowRight, Check, RotateCcw, MessageSquareQuote,
  Boxes, Shield, Star,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════ */

const LAYERS = [
  { id: "foundation", label: "Foundation Models", icon: "Sparkles", color: "#8B5CF6", gradient: "linear-gradient(135deg, #7C3AED, #6D28D9)", desc: "Core LLMs powering the AI ecosystem", step: "1" },
  { id: "platform",   label: "AI Platforms",      icon: "Zap",       color: "#6366F1", gradient: "linear-gradient(135deg, #6366F1, #4F46E5)", desc: "Cloud infrastructure & model serving", step: "2" },
  { id: "vertical",  label: "Enterprise AI Apps", icon: "Building2", color: "#A78BFA", gradient: "linear-gradient(135deg, #A78BFA, #8B5CF6)", desc: "Industry-specific AI solutions", step: "3" },
  { id: "tooling",   label: "Tooling & Infra",    icon: "Wrench",    color: "#C4B5FD", gradient: "linear-gradient(135deg, #C4B5FD, #A78BFA)", desc: "Developer tools & data infrastructure", step: "4" },
];

const USE_CASES = [
  { id: "customer-service", label: "Customer Service",       emoji: "🎧" },
  { id: "doc-intel",        label: "Document Intelligence",  emoji: "📄" },
  { id: "code-assist",      label: "Code Assistant",         emoji: "💻" },
  { id: "sales-intel",      label: "Sales Intelligence",     emoji: "📊" },
  { id: "content-gen",      label: "Content Generation",     emoji: "✍️" },
  { id: "data-analytics",   label: "Data & Analytics",       emoji: "🔬" },
];

const VENDORS = [
  // ── FOUNDATION MODELS ──────────────────────────────────────────────────
  { id: "gpt4o",    name: "GPT-4o",            org: "OpenAI",        emoji: "🟢", layer: "foundation",
    useCases: ["customer-service","doc-intel","code-assist","sales-intel","content-gen","data-analytics"],
    pricing: "Pay-per-token", bestFit: "Enterprise & Startup",
    strengths: ["Broadest ecosystem & plugin support","Strongest general reasoning","Multimodal (text, image, audio)"],
    limitations: ["Highest cost at scale","Data privacy concerns for regulated industries","Rate limits on peak usage"],
    insight: "Market leader with broadest ecosystem. Best for enterprises already invested in Microsoft stack. Watch for cost escalation at scale — negotiate committed-use discounts early.",
    metrics: { performance: 9, integration: 8, cost: 5, enterprise: 8, scalability: 9, community: 10 } },

  { id: "claude35", name: "Claude 3.5 Sonnet",  org: "Anthropic",    emoji: "🟣", layer: "foundation",
    useCases: ["customer-service","doc-intel","code-assist","content-gen"],
    pricing: "Pay-per-token", bestFit: "Enterprise (regulated)",
    strengths: ["200K context window — best for long documents","Constitutional AI safety framework","Superior instruction following"],
    limitations: ["Smaller plugin ecosystem than GPT","No native image generation","Fewer fine-tuning options"],
    insight: "Strongest in safety-critical & regulated industries. 200K context window is a game-changer for document-heavy workflows. Best choice for financial services, healthcare, and legal.",
    metrics: { performance: 9, integration: 7, cost: 6, enterprise: 9, scalability: 8, community: 7 } },

  { id: "gemini",   name: "Gemini 1.5 Pro",    org: "Google",        emoji: "🔵", layer: "foundation",
    useCases: ["doc-intel","data-analytics","content-gen","customer-service"],
    pricing: "Pay-per-token", bestFit: "Data-heavy Enterprise",
    strengths: ["1M token context — largest in market","Native multimodal (text, image, video, audio)","Deep Google Workspace integration"],
    limitations: ["Perception of lagging behind GPT-4o","Enterprise trust still building","Fewer third-party integrations"],
    insight: "Google's multimodal play. Unmatched for scenarios combining text, image, and video analysis. Natural fit for companies already on GCP with BigQuery data assets.",
    metrics: { performance: 8, integration: 7, cost: 7, enterprise: 7, scalability: 9, community: 7 } },

  { id: "llama",    name: "Llama 3.1 405B",    org: "Meta",          emoji: "🦙", layer: "foundation",
    useCases: ["customer-service","content-gen","code-assist"],
    pricing: "Free (self-hosted)", bestFit: "Tech-savvy Enterprise",
    strengths: ["Open source — full control & customization","No vendor lock-in","Fine-tunable for specific domains"],
    limitations: ["Requires significant infra investment","No managed service from Meta","Smaller context than competitors"],
    insight: "The 'sovereignty' play — ideal for enterprises that cannot send data to external APIs. Pair with AWS/Azure managed hosting to reduce ops burden.",
    metrics: { performance: 8, integration: 5, cost: 9, enterprise: 6, scalability: 7, community: 9 } },

  { id: "mistral",  name: "Mistral Large",      org: "Mistral AI",   emoji: "🌊", layer: "foundation",
    useCases: ["doc-intel","code-assist","content-gen"],
    pricing: "Pay-per-token", bestFit: "EU Enterprise",
    strengths: ["European data sovereignty compliance","Excellent cost-performance ratio","Strong multilingual capability"],
    limitations: ["Smaller ecosystem","Limited enterprise track record","Fewer benchmarks available"],
    insight: "The European champion — critical for EU customers with GDPR sovereignty requirements. Punches above its weight on cost-performance.",
    metrics: { performance: 7, integration: 6, cost: 8, enterprise: 6, scalability: 7, community: 6 } },

  { id: "cohere",   name: "Command R+",         org: "Cohere",       emoji: "🧬", layer: "foundation",
    useCases: ["customer-service","doc-intel","sales-intel"],
    pricing: "Pay-per-token", bestFit: "Enterprise RAG",
    strengths: ["Built-in RAG with citations","Enterprise-grade data connectors","Excellent for search & retrieval"],
    limitations: ["Less capable at general reasoning","Smaller brand recognition","Limited multimodal support"],
    insight: "The RAG specialist. If the primary use case is enterprise search or knowledge base Q&A, Cohere often outperforms GPT-4 at lower cost.",
    metrics: { performance: 7, integration: 7, cost: 7, enterprise: 7, scalability: 7, community: 5 } },

  // ── AI PLATFORMS ───────────────────────────────────────────────────────
  { id: "azure-openai", name: "Azure OpenAI",   org: "Microsoft",    emoji: "☁️", layer: "platform",
    useCases: ["customer-service","doc-intel","code-assist","sales-intel","content-gen","data-analytics"],
    pricing: "Pay-as-you-go + PTU", bestFit: "Microsoft-stack Enterprise",
    strengths: ["Enterprise compliance (SOC2, HIPAA)","Seamless Microsoft 365 integration","Private networking & data residency"],
    limitations: ["Locked to OpenAI models","Complex pricing with PTU commitments","Slower model availability than OpenAI direct"],
    insight: "The enterprise safe choice. If the customer already runs on Azure AD, Teams, and Dynamics — this is the path of least resistance.",
    metrics: { performance: 9, integration: 9, cost: 5, enterprise: 10, scalability: 9, community: 8 } },

  { id: "bedrock",  name: "AWS Bedrock",        org: "Amazon",       emoji: "🏗️", layer: "platform",
    useCases: ["customer-service","doc-intel","content-gen","data-analytics"],
    pricing: "Pay-per-token", bestFit: "Multi-model Enterprise",
    strengths: ["Multi-model marketplace (Claude, Llama, Titan)","Deep AWS service integration","Guardrails & fine-tuning built-in"],
    limitations: ["Steeper learning curve","Some models lag behind direct API","Complex IAM configuration"],
    insight: "The 'don't put all eggs in one basket' play. Access Claude, Llama, and Titan through one API.",
    metrics: { performance: 8, integration: 8, cost: 6, enterprise: 9, scalability: 10, community: 7 } },

  { id: "vertex",   name: "Vertex AI",          org: "Google Cloud", emoji: "🔷", layer: "platform",
    useCases: ["data-analytics","doc-intel","content-gen","customer-service"],
    pricing: "Pay-as-you-go", bestFit: "Data-first Enterprise",
    strengths: ["Native BigQuery & data pipeline integration","MLOps + GenAI unified platform","Gemini + open model garden"],
    limitations: ["Smaller enterprise footprint than Azure","Less intuitive UI","Fewer ISV integrations"],
    insight: "Strongest when the customer's AI strategy is data-centric. If they have petabytes in BigQuery, Vertex makes the data-to-AI pipeline seamless.",
    metrics: { performance: 8, integration: 7, cost: 7, enterprise: 8, scalability: 9, community: 7 } },

  { id: "huggingface", name: "Hugging Face",    org: "Hugging Face", emoji: "🤗", layer: "platform",
    useCases: ["code-assist","content-gen","doc-intel"],
    pricing: "Free + Pro tiers", bestFit: "Developer & Research",
    strengths: ["Largest open model hub (500K+ models)","Inference Endpoints for production","Strong community & collaboration"],
    limitations: ["Not enterprise-hardened","Limited compliance certifications","Support SLAs are basic"],
    insight: "The 'developer love' platform. Great for prototyping. Not where Fortune 500 runs production — but where they discover what to build.",
    metrics: { performance: 7, integration: 6, cost: 9, enterprise: 4, scalability: 6, community: 10 } },

  { id: "databricks", name: "Databricks Mosaic", org: "Databricks",  emoji: "🧱", layer: "platform",
    useCases: ["data-analytics","doc-intel","sales-intel"],
    pricing: "DBU-based", bestFit: "Data Engineering teams",
    strengths: ["Unified data + AI lakehouse","Fine-tuning on proprietary data","Strong governance & lineage"],
    limitations: ["High total cost of ownership","Steep learning curve","Overkill for simple GenAI use cases"],
    insight: "The choice when AI is inseparable from data strategy. Expensive but powerful for mature data engineering teams.",
    metrics: { performance: 8, integration: 7, cost: 4, enterprise: 8, scalability: 8, community: 6 } },

  // ── ENTERPRISE AI APPS (VERTICAL) ──────────────────────────────────────
  { id: "salesforce-einstein", name: "Einstein GPT", org: "Salesforce", emoji: "💙", layer: "vertical",
    useCases: ["sales-intel","customer-service","content-gen"],
    pricing: "Per-user add-on", bestFit: "Salesforce customers",
    strengths: ["Native CRM data integration","Trust Layer for data security","Copilot across Sales, Service, Marketing"],
    limitations: ["Only useful within Salesforce ecosystem","Premium pricing on top of licenses","Customization requires Salesforce expertise"],
    insight: "No-brainer for existing Salesforce shops. The Trust Layer addresses data leakage concerns. AI that already knows your customer data without ETL.",
    metrics: { performance: 7, integration: 9, cost: 4, enterprise: 9, scalability: 8, community: 6 } },

  { id: "servicenow", name: "Now Assist",        org: "ServiceNow",  emoji: "🔧", layer: "vertical",
    useCases: ["customer-service","doc-intel"],
    pricing: "Per-user add-on", bestFit: "IT Service Management",
    strengths: ["ITSM workflow automation","Knowledge base integration","Incident summarization & resolution"],
    limitations: ["Narrow to ServiceNow workflows","Expensive per-seat pricing","Requires mature ITSM processes"],
    insight: "Transforms IT help desks. 30-40% reduction in ticket handling time. Best pitched to CIOs frustrated with L1 support costs.",
    metrics: { performance: 7, integration: 8, cost: 4, enterprise: 9, scalability: 7, community: 5 } },

  { id: "sap-joule", name: "SAP Joule",         org: "SAP",          emoji: "🟦", layer: "vertical",
    useCases: ["data-analytics","doc-intel","sales-intel"],
    pricing: "Included in S/4HANA Cloud", bestFit: "SAP ERP customers",
    strengths: ["Embedded across SAP modules","Business process context awareness","Enterprise data governance"],
    limitations: ["Only relevant for SAP customers","Early maturity stage","Limited third-party AI model support"],
    insight: "Strategic for SAP's 400K+ enterprise customers. Still early but SAP's distribution moat is real. Watch for rapid improvement.",
    metrics: { performance: 6, integration: 8, cost: 6, enterprise: 9, scalability: 7, community: 4 } },

  { id: "github-copilot", name: "GitHub Copilot", org: "GitHub / Microsoft", emoji: "🐙", layer: "vertical",
    useCases: ["code-assist"],
    pricing: "$19-39/user/month", bestFit: "Development teams",
    strengths: ["Best-in-class code completion","IDE-native experience","Enterprise admin & policy controls"],
    limitations: ["Narrow to coding use case","IP/licensing concerns for generated code","Variable quality across languages"],
    insight: "The gateway drug to enterprise AI adoption. Developer teams adopt it bottom-up, then leadership asks 'what else can AI do?'",
    metrics: { performance: 9, integration: 9, cost: 7, enterprise: 7, scalability: 8, community: 9 } },

  { id: "glean",    name: "Glean",              org: "Glean",        emoji: "🔍", layer: "vertical",
    useCases: ["doc-intel","customer-service","sales-intel"],
    pricing: "Per-user SaaS", bestFit: "Knowledge-heavy Enterprise",
    strengths: ["Connects 100+ enterprise apps","Personalized search & answers","Strong data permissions model"],
    limitations: ["Requires broad data connector setup","Premium pricing","ROI harder to quantify initially"],
    insight: "The 'enterprise Google' for internal knowledge. Killer use case: new employee onboarding and cross-team knowledge discovery.",
    metrics: { performance: 8, integration: 8, cost: 5, enterprise: 8, scalability: 7, community: 5 } },

  // ── TOOLING & INFRASTRUCTURE ───────────────────────────────────────────
  { id: "langchain", name: "LangChain",         org: "LangChain Inc.", emoji: "🔗", layer: "tooling",
    useCases: ["customer-service","doc-intel","sales-intel","code-assist"],
    pricing: "Open Source + Cloud", bestFit: "AI Development teams",
    strengths: ["Most popular LLM orchestration framework","Extensive chain & agent templates","LangSmith for observability"],
    limitations: ["Abstraction overhead for simple tasks","Fast-changing API surface","Can encourage over-engineering"],
    insight: "De facto standard for LLM app development. If building custom AI apps, the dev team is probably already using this.",
    metrics: { performance: 7, integration: 8, cost: 9, enterprise: 6, scalability: 7, community: 10 } },

  { id: "pinecone", name: "Pinecone",           org: "Pinecone",     emoji: "🌲", layer: "tooling",
    useCases: ["doc-intel","customer-service","sales-intel"],
    pricing: "Usage-based", bestFit: "RAG Applications",
    strengths: ["Purpose-built vector database","Serverless scaling","Simple API, fast time-to-value"],
    limitations: ["Vendor lock-in for vector storage","Can get expensive at scale","Limited query vs. traditional DB"],
    insight: "The 'easy button' for RAG. Gets to production fastest. Consider Weaviate for complex hybrid search needs.",
    metrics: { performance: 8, integration: 8, cost: 6, enterprise: 7, scalability: 8, community: 7 } },

  { id: "wandb",    name: "Weights & Biases",   org: "W&B",          emoji: "📊", layer: "tooling",
    useCases: ["data-analytics","code-assist"],
    pricing: "Free + Team/Enterprise", bestFit: "ML/AI Research teams",
    strengths: ["Best experiment tracking UI","Model evaluation & comparison","Prompt engineering tools"],
    limitations: ["ML-team focused, not business-user friendly","Overlap with cloud-native MLOps","Learning curve for non-ML engineers"],
    insight: "The 'Figma for ML teams.' If the customer has a serious ML team, W&B is likely already on their radar.",
    metrics: { performance: 7, integration: 6, cost: 7, enterprise: 6, scalability: 7, community: 8 } },

  { id: "llamaindex", name: "LlamaIndex",       org: "LlamaIndex",   emoji: "🦙", layer: "tooling",
    useCases: ["doc-intel","customer-service","data-analytics"],
    pricing: "Open Source + Cloud", bestFit: "Data-centric AI apps",
    strengths: ["Best data ingestion framework","Advanced RAG patterns","LlamaParse for document processing"],
    limitations: ["Overlaps with LangChain","Smaller ecosystem","Less general-purpose"],
    insight: "Complementary to LangChain, not competitive. LlamaIndex excels at data ingestion; LangChain at orchestration. Smart teams use both.",
    metrics: { performance: 7, integration: 7, cost: 9, enterprise: 5, scalability: 7, community: 8 } },

  { id: "weaviate", name: "Weaviate",           org: "Weaviate",     emoji: "🔮", layer: "tooling",
    useCases: ["doc-intel","customer-service","sales-intel"],
    pricing: "Open Source + Cloud", bestFit: "Hybrid Search Apps",
    strengths: ["Hybrid vector + keyword search","Multi-tenancy support","GraphQL API"],
    limitations: ["More complex than Pinecone","Requires more operational knowledge","Smaller community"],
    insight: "Choose over Pinecone when the customer needs hybrid search or multi-tenant architecture. Common in B2B SaaS companies.",
    metrics: { performance: 8, integration: 6, cost: 8, enterprise: 6, scalability: 8, community: 6 } },

  { id: "mlflow",   name: "MLflow",             org: "Databricks",   emoji: "📈", layer: "tooling",
    useCases: ["data-analytics","code-assist"],
    pricing: "Open Source", bestFit: "MLOps teams",
    strengths: ["Open source MLOps standard","Model registry & deployment","Deep Databricks integration"],
    limitations: ["UI less polished than W&B","GenAI features still catching up","Better for traditional ML"],
    insight: "The open-source MLOps backbone. For customers resistant to another SaaS vendor, MLflow is the self-hosted answer.",
    metrics: { performance: 7, integration: 7, cost: 10, enterprise: 6, scalability: 7, community: 8 } },
];

const METRIC_LABELS = {
  performance: "Performance", integration: "Integration", cost: "Cost Efficiency",
  enterprise: "Enterprise Ready", scalability: "Scalability", community: "Community",
};
const RADAR_COLORS = ["#8B5CF6", "#F59E0B", "#10B981", "#F43F5E"];

const STACK_PRESETS = [
  { name: "Enterprise Safe",  desc: "Maximum compliance & integration", picks: { foundation: "claude35",  platform: "azure-openai", vertical: "salesforce-einstein", tooling: "langchain"  } },
  { name: "Cost Optimized",   desc: "Best value for growing companies",  picks: { foundation: "llama",     platform: "huggingface",  vertical: "github-copilot",      tooling: "llamaindex" } },
  { name: "Data-First",       desc: "Analytics & data pipeline focused", picks: { foundation: "gemini",    platform: "vertex",       vertical: "glean",               tooling: "pinecone"   } },
];

/* ═══════════════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#09081A;--bg2:#0E0D20;--card:rgba(18,16,38,0.85);--cardh:rgba(26,23,52,0.95);
  --a:#8B5CF6;--a2:#A78BFA;--a3:#C4B5FD;--adim:rgba(139,92,246,0.12);--aglow:rgba(139,92,246,0.35);
  --txt:#ECE8F7;--dim:#7C7498;--bdr:rgba(139,92,246,0.18);
  --g1:#7C3AED;--g2:#6366F1;
}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--txt)}

.eco-root{
  min-height:100vh;background:var(--bg);
  background-image:
    radial-gradient(ellipse 80% 50% at 10% 90%,rgba(124,58,237,.10) 0%,transparent 60%),
    radial-gradient(ellipse 60% 40% at 90% 10%,rgba(99,102,241,.07) 0%,transparent 60%),
    radial-gradient(ellipse 50% 50% at 50% 50%,rgba(139,92,246,.03) 0%,transparent 80%);
}
.dots{background-image:radial-gradient(rgba(139,92,246,.06) 1px,transparent 1px);background-size:20px 20px}

.vn{transition:all .35s cubic-bezier(.4,0,.2,1);cursor:pointer;border:1px solid var(--bdr);backdrop-filter:blur(10px);background:var(--card);position:relative;border-radius:12px;padding:8px 12px;display:flex;align-items:center;gap:10px}
.vn:hover{transform:translateY(-2px) scale(1.02);border-color:var(--a2);box-shadow:0 6px 24px rgba(139,92,246,.18)}
.vn.dim{opacity:.12;transform:scale(.93);filter:grayscale(.8);pointer-events:none}
.vn.glow{border-color:var(--a);box-shadow:0 0 16px var(--aglow),0 0 32px rgba(139,92,246,.1)}
.vn.sel{border-color:var(--a2);background:rgba(139,92,246,.13);box-shadow:0 0 20px var(--aglow)}

.sn{transition:all .35s cubic-bezier(.4,0,.2,1);cursor:pointer;border:2px dashed var(--bdr);background:var(--card);position:relative;border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:10px}
.sn:hover{border-color:var(--a2);background:var(--cardh);transform:translateY(-1px)}
.sn.pick{border-style:solid;border-color:var(--a);background:rgba(139,92,246,.1);box-shadow:0 0 16px var(--aglow)}

.pill{transition:all .25s ease;cursor:pointer;border:1px solid var(--bdr);font-family:'Outfit',sans-serif;background:var(--card);color:var(--txt);border-radius:100px;padding:6px 14px;font-size:12.5px;font-weight:500;display:inline-flex;align-items:center;gap:5px}
.pill:hover{border-color:var(--a2);background:var(--cardh)}
.pill.on{background:var(--a);border-color:var(--a);color:#fff;box-shadow:0 0 14px rgba(139,92,246,.35)}

.tab{transition:all .25s ease;cursor:pointer;border:none;font-family:'Outfit',sans-serif;background:none;color:var(--dim);padding:8px 18px;font-size:13px;font-weight:600;border-radius:10px;display:flex;align-items:center;gap:6px}
.tab:hover{color:var(--txt);background:var(--adim)}
.tab.on{color:#fff;background:var(--a);box-shadow:0 0 14px rgba(139,92,246,.3)}

.cbtn{background:linear-gradient(135deg,var(--g1),var(--g2));transition:all .3s ease;font-family:'Outfit',sans-serif;border:none;border-radius:10px;padding:8px 20px;color:#fff;cursor:pointer;font-weight:600;font-size:13px;display:flex;align-items:center;gap:6px}
.cbtn:hover{box-shadow:0 0 28px rgba(124,58,237,.5);transform:translateY(-1px)}

.ghost{background:none;border:1px solid var(--bdr);border-radius:8px;padding:6px 12px;cursor:pointer;color:var(--dim);font-size:12px;font-family:'Outfit',sans-serif;display:flex;align-items:center;gap:5px}
.ghost:hover{border-color:var(--a2);color:var(--txt)}

.chk{position:absolute;top:-7px;right:-7px;width:20px;height:20px;border-radius:50%;background:var(--a);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(139,92,246,.5)}

.mb{height:6px;border-radius:3px;background:rgba(139,92,246,.1);overflow:hidden;width:44px}
.mbf{height:100%;border-radius:3px;transition:width .8s cubic-bezier(.4,0,.2,1)}

@keyframes fu{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes sr{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes si{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{opacity:.25}50%{opacity:.7}}

.au{animation:fu .5s cubic-bezier(.4,0,.2,1) both}
.ai{animation:fi .4s ease both}
.asr{animation:sr .4s cubic-bezier(.4,0,.2,1) both}
.asi{animation:si .4s cubic-bezier(.4,0,.2,1) both}
.pls{animation:pulse 2s ease-in-out infinite}

.ns::-webkit-scrollbar{display:none}.ns{-ms-overflow-style:none;scrollbar-width:none}

.stk{background:linear-gradient(135deg,rgba(124,58,237,.08),rgba(99,102,241,.04));border:1px solid rgba(139,92,246,.25);border-radius:16px;padding:20px;transition:all .3s ease}
.stk:hover{border-color:rgba(139,92,246,.4);box-shadow:0 4px 24px rgba(139,92,246,.12)}
`;

/* ═══════════════════════════════════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */

const IconMap = { Sparkles, Zap, Building2, Wrench };

function VendorNode({ vendor, isHighlighted, isDimmed, isSelected, onClick, delay = 0 }) {
  const cls = ["vn", isDimmed && "dim", isHighlighted && !isDimmed && "glow", isSelected && "sel"].filter(Boolean).join(" ");
  return (
    <div className={cls} onClick={() => onClick(vendor)} style={{ animationDelay: `${delay}ms` }}>
      {isSelected && <div className="chk"><Check size={11} color="white" strokeWidth={3}/></div>}
      <span style={{ fontSize: 20 }}>{vendor.emoji}</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{vendor.name}</div>
        <div style={{ fontSize: 11, color: "var(--dim)", lineHeight: 1.2 }}>{vendor.org}</div>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "3px 0" }}>
      <div className="pls" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <div style={{ width: 2, height: 10, background: "linear-gradient(to bottom, var(--a), transparent)", borderRadius: 1 }}/>
        <ChevronDown size={13} color="var(--a)" style={{ opacity: .5 }}/>
      </div>
    </div>
  );
}

function LayerSection({ layer, vendors, selectedUseCase, selectedIds, onVendorClick, index }) {
  const Icon = IconMap[layer.icon] || Layers;
  return (
    <div className="au" style={{ animationDelay: `${index * 100}ms`, padding: "14px 18px", borderRadius: 14,
      background: `linear-gradient(135deg, rgba(${16 + index * 10},${14 + index * 6},${30 + index * 14},0.55), rgba(18,16,38,0.35))`,
      border: `1px solid ${layer.color}18` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${layer.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} color={layer.color}/>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: layer.color }}>{layer.label}</div>
          <div style={{ fontSize: 10.5, color: "var(--dim)" }}>{layer.desc}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 10, color: "var(--dim)", background: "var(--adim)", padding: "2px 8px", borderRadius: 6 }}>
          {vendors.length} vendors
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {vendors.map((v, i) => {
          const rel = !selectedUseCase || v.useCases.includes(selectedUseCase);
          return <VendorNode key={v.id} vendor={v} isHighlighted={selectedUseCase && rel}
            isDimmed={selectedUseCase && !rel} isSelected={selectedIds.includes(v.id)}
            onClick={onVendorClick} delay={i * 40}/>;
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DETAIL PANEL
   ═══════════════════════════════════════════════════════════════════════ */

function DetailPanel({ vendor, onClose }) {
  if (!vendor) return null;
  const rd = Object.entries(vendor.metrics).map(([k, v]) => ({ metric: METRIC_LABELS[k], value: v }));
  return (
    <>
      <div onClick={onClose} className="ai" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 45, backdropFilter: "blur(4px)" }}/>
      <div className="asr ns" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: Math.min(400, window.innerWidth * 0.9),
        background: "linear-gradient(180deg,#12102A 0%,#0B091A 100%)", borderLeft: "1px solid var(--bdr)",
        zIndex: 50, overflowY: "auto", padding: 22 }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 32 }}>{vendor.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{vendor.name}</div>
              <div style={{ color: "var(--dim)", fontSize: 12 }}>{vendor.org}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={18} color="var(--dim)"/>
          </button>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10.5, padding: "3px 10px", borderRadius: 100, background: "var(--adim)", color: "var(--a2)", fontWeight: 500 }}>{vendor.pricing}</span>
          <span style={{ fontSize: 10.5, padding: "3px 10px", borderRadius: 100, background: "rgba(16,185,129,.12)", color: "#6EE7B7", fontWeight: 500 }}>{vendor.bestFit}</span>
        </div>

        <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,.08),rgba(99,102,241,.04))",
          border: "1px solid rgba(139,92,246,.2)", borderRadius: 12, padding: 14, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <MessageSquareQuote size={13} color="#A78BFA"/>
            <span style={{ fontWeight: 600, fontSize: 11, color: "#A78BFA", textTransform: "uppercase", letterSpacing: .8 }}>Sales Director's Take</span>
          </div>
          <p style={{ fontSize: 12.5, lineHeight: 1.6, fontStyle: "italic", color: "var(--txt)" }}>"{vendor.insight}"</p>
        </div>

        {[{ items: vendor.strengths, label: "Strengths", color: "#6EE7B7", icon: "✦" },
          { items: vendor.limitations, label: "Limitations", color: "#F59E0B", icon: "⚠" }].map(sec => (
          <div key={sec.label} style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6, color: sec.color }}>{sec.icon} {sec.label}</div>
            {sec.items.map((s, i) => (
              <div key={i} style={{ fontSize: 12, color: "var(--txt)", lineHeight: 1.5, paddingLeft: 14, position: "relative", marginBottom: 3 }}>
                <span style={{ position: "absolute", left: 0, color: "var(--dim)" }}>›</span> {s}
              </div>
            ))}
          </div>
        ))}

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Use Cases</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {vendor.useCases.map(uid => { const u = USE_CASES.find(x => x.id === uid);
              return u ? <span key={uid} style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 5, background: "var(--card)", border: "1px solid var(--bdr)" }}>{u.emoji} {u.label}</span> : null;
            })}
          </div>
        </div>

        <div style={{ background: "var(--card)", borderRadius: 12, padding: "6px 0" }}>
          <ResponsiveContainer width="100%" height={190}>
            <RadarChart data={rd}>
              <PolarGrid stroke="rgba(139,92,246,.18)"/>
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#7C7498", fontSize: 10 }}/>
              <Radar dataKey="value" stroke="var(--a)" fill="var(--a)" fillOpacity={.2} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPARISON VIEW
   ═══════════════════════════════════════════════════════════════════════ */

function ComparisonView({ vendors, onBack }) {
  const radarData = Object.keys(METRIC_LABELS).map(k => {
    const e = { metric: METRIC_LABELS[k] };
    vendors.forEach(v => { e[v.id] = v.metrics[k]; });
    return e;
  });

  return (
    <div className="au" style={{ padding: "0 0 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <button className="ghost" onClick={onBack}><RotateCcw size={13}/> Back</button>
        <span style={{ fontWeight: 700, fontSize: 17 }}>Vendor Comparison</span>
        <span style={{ fontSize: 11, color: "var(--dim)" }}>— {vendors.length} selected</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(vendors.length, 4)}, 1fr)`, gap: 10, marginBottom: 20 }}>
        {vendors.map((v, i) => (
          <div key={v.id} className="asi" style={{ animationDelay: `${i * 80}ms`,
            background: "var(--card)", borderRadius: 12, padding: 14, borderLeft: `3px solid ${RADAR_COLORS[i]}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{v.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{v.name}</div>
                <div style={{ fontSize: 10, color: "var(--dim)" }}>{v.org}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 100, background: "var(--adim)", color: "var(--a2)" }}>{v.pricing}</span>
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 100, background: "rgba(16,185,129,.1)", color: "#6EE7B7" }}>{v.bestFit}</span>
            </div>
            <p style={{ fontSize: 11, color: "var(--dim)", lineHeight: 1.5, fontStyle: "italic" }}>"{v.insight}"</p>
          </div>
        ))}
      </div>

      <div className="asi" style={{ animationDelay: "200ms", background: "var(--card)", borderRadius: 14, padding: 20, border: "1px solid var(--bdr)", marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Capability Radar</div>
        <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 14 }}>6-axis multi-dimensional comparison</div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(139,92,246,.13)"/>
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#7C7498", fontSize: 11, fontFamily: "Outfit" }}/>
            {vendors.map((v, i) => (
              <Radar key={v.id} dataKey={v.id} name={v.name} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]}
                fillOpacity={.1} strokeWidth={2} dot={{ r: 3, fill: RADAR_COLORS[i] }}/>
            ))}
          </RadarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 6 }}>
          {vendors.map((v, i) => (
            <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: RADAR_COLORS[i] }}/>
              <span style={{ fontSize: 11, color: "var(--dim)" }}>{v.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="asi" style={{ animationDelay: "300ms", background: "var(--card)", borderRadius: 14, padding: 20, border: "1px solid var(--bdr)" }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Metric Breakdown</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead><tr style={{ borderBottom: "1px solid var(--bdr)" }}>
              <th style={{ textAlign: "left", padding: "7px 10px", color: "var(--dim)", fontWeight: 500, fontSize: 11 }}>Metric</th>
              {vendors.map((v, i) => <th key={v.id} style={{ textAlign: "center", padding: "7px 10px", color: RADAR_COLORS[i], fontWeight: 600, fontSize: 11 }}>{v.name}</th>)}
            </tr></thead>
            <tbody>
              {Object.entries(METRIC_LABELS).map(([k, lbl]) => (
                <tr key={k} style={{ borderBottom: "1px solid rgba(139,92,246,.06)" }}>
                  <td style={{ padding: "9px 10px", fontWeight: 500 }}>{lbl}</td>
                  {vendors.map((v, i) => { const val = v.metrics[k]; const mx = Math.max(...vendors.map(x => x.metrics[k]));
                    return <td key={v.id} style={{ textAlign: "center", padding: "9px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                        <div className="mb"><div className="mbf" style={{ width: `${val * 10}%`, background: val === mx ? RADAR_COLORS[i] : `${RADAR_COLORS[i]}77` }}/></div>
                        <span style={{ fontWeight: val === mx ? 700 : 400, color: val === mx ? RADAR_COLORS[i] : "var(--dim)", fontSize: 12 }}>{val}</span>
                      </div>
                    </td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STACK BUILDER
   ═══════════════════════════════════════════════════════════════════════ */

function StackBuilder() {
  const [picks, setPicks] = useState({ foundation: null, platform: null, vertical: null, tooling: null });
  const [showResult, setShowResult] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  const pickCount = Object.values(picks).filter(Boolean).length;

  const handlePick = (layerId, vendorId) => {
    setPicks(p => ({ ...p, [layerId]: p[layerId] === vendorId ? null : vendorId }));
    setShowResult(false);
    setActivePreset(null);
  };

  const applyPreset = (preset) => { setPicks(preset.picks); setActivePreset(preset.name); setShowResult(false); };
  const handleReset = () => { setPicks({ foundation: null, platform: null, vertical: null, tooling: null }); setShowResult(false); setActivePreset(null); };

  const selectedVendors = LAYERS.map(l => ({ layer: l, vendor: VENDORS.find(v => v.id === picks[l.id]) })).filter(x => x.vendor);

  const avgMetrics = useMemo(() => {
    if (selectedVendors.length === 0) return null;
    return Object.keys(METRIC_LABELS).map(k => ({
      metric: METRIC_LABELS[k],
      value: Math.round(selectedVendors.reduce((s, x) => s + x.vendor.metrics[k], 0) / selectedVendors.length * 10) / 10,
    }));
  }, [picks]);

  const stackGrade = useMemo(() => {
    if (!avgMetrics) return null;
    const avg = avgMetrics.reduce((s, m) => s + m.value, 0) / avgMetrics.length;
    if (avg >= 8.5) return { letter: "A+", color: "#10B981" };
    if (avg >= 7.5) return { letter: "A",  color: "#6EE7B7" };
    if (avg >= 6.5) return { letter: "B+", color: "#F59E0B" };
    if (avg >= 5.5) return { letter: "B",  color: "#FB923C" };
    return { letter: "C", color: "#F43F5E" };
  }, [avgMetrics]);

  return (
    <div className="au">
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.5 }}>
          Build your recommended AI stack by selecting one vendor from each layer. Use presets for common patterns or create your own.
        </div>
      </div>

      <div style={{ marginBottom: 20, paddingTop: 8 }}>
        <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: .8 }}>Quick Presets</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {STACK_PRESETS.map(p => (
            <button key={p.name} className={`pill ${activePreset === p.name ? "on" : ""}`} onClick={() => applyPreset(p)}>
              <Star size={12}/> {p.name}
              <span style={{ fontSize: 10, opacity: .7 }}>— {p.desc}</span>
            </button>
          ))}
          {pickCount > 0 && (
            <button className="pill" onClick={handleReset} style={{ color: "var(--dim)" }}>
              <RotateCcw size={12}/> Reset
            </button>
          )}
        </div>
      </div>

      {LAYERS.map((layer, idx) => {
        const Icon = IconMap[layer.icon] || Layers;
        const layerVendors = VENDORS.filter(v => v.layer === layer.id);
        return (
          <div key={layer.id}>
            <div className="au" style={{ animationDelay: `${idx * 80}ms` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: layer.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: "#fff", boxShadow: `0 0 12px ${layer.color}44`, flexShrink: 0 }}>
                  {layer.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: layer.color }}>{layer.label}</div>
                  <div style={{ fontSize: 10, color: "var(--dim)" }}>Select one vendor</div>
                </div>
                {picks[layer.id] && (
                  <div className="asi" style={{ display: "flex", alignItems: "center", gap: 4,
                    background: "rgba(16,185,129,.1)", padding: "3px 8px", borderRadius: 6 }}>
                    <Check size={11} color="#6EE7B7"/>
                    <span style={{ fontSize: 10, color: "#6EE7B7", fontWeight: 600 }}>
                      {VENDORS.find(v => v.id === picks[layer.id])?.name}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 7 }}>
                {layerVendors.map((v) => (
                  <div key={v.id} className={`sn ${picks[layer.id] === v.id ? "pick" : ""}`}
                    onClick={() => handlePick(layer.id, v.id)}>
                    {picks[layer.id] === v.id && (
                      <div className="chk" style={{ width: 18, height: 18 }}>
                        <Check size={10} color="white" strokeWidth={3}/>
                      </div>
                    )}
                    <span style={{ fontSize: 18 }}>{v.emoji}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 12, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.name}</div>
                      <div style={{ fontSize: 10, color: "var(--dim)", lineHeight: 1.2 }}>{v.pricing}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {idx < LAYERS.length - 1 && (
              <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                <div className="pls"><ChevronDown size={14} color="var(--a)" style={{ opacity: .4 }}/></div>
              </div>
            )}
          </div>
        );
      })}

      {pickCount >= 2 && !showResult && (
        <div className="au" style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <button className="cbtn" onClick={() => setShowResult(true)}
            style={{ padding: "12px 32px", fontSize: 14, borderRadius: 12, gap: 8 }}>
            <Boxes size={16}/> Build My Stack ({pickCount}/4) <ArrowRight size={15}/>
          </button>
        </div>
      )}

      {showResult && (
        <div className="asi" style={{ marginTop: 24 }}>
          <div className="stk">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Shield size={20} color="var(--a2)"/>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17 }}>My Recommended Stack</div>
                    <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 1 }}>{selectedVendors.length} layers configured</div>
                  </div>
                </div>
                {stackGrade && (
                  <div style={{ background: `${stackGrade.color}18`, border: `1px solid ${stackGrade.color}44`,
                    borderRadius: 10, padding: "4px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontWeight: 800, fontSize: 18, color: stackGrade.color }}>{stackGrade.letter}</span>
                    <span style={{ fontSize: 10, color: "var(--dim)" }}>Score</span>
                  </div>
                )}
              </div>
              <button className="ghost" onClick={handleReset}><RotateCcw size={11}/> Reset</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
              {selectedVendors.map(({ layer, vendor }, i) => (
                <div key={layer.id} className="au" style={{ animationDelay: `${i * 100}ms` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--card)", borderRadius: 10,
                    padding: "10px 14px", border: `1px solid ${layer.color}22` }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: layer.gradient,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                      {layer.step}
                    </div>
                    <span style={{ fontSize: 22 }}>{vendor.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: layer.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>{layer.label}</div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{vendor.name}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "var(--dim)" }}>{vendor.pricing}</div>
                      <div style={{ fontSize: 10, color: "#6EE7B7" }}>{vendor.bestFit}</div>
                    </div>
                  </div>
                  {i < selectedVendors.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}>
                      <ChevronDown size={12} color="var(--a)" style={{ opacity: .3 }}/>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: avgMetrics ? "1fr 1fr" : "1fr", gap: 14 }}>
              {avgMetrics && (
                <div style={{ background: "var(--card)", borderRadius: 12, padding: "8px 0" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, padding: "4px 14px", color: "var(--dim)" }}>Stack Profile</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={avgMetrics}>
                      <PolarGrid stroke="rgba(139,92,246,.15)"/>
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "#7C7498", fontSize: 9 }}/>
                      <Radar dataKey="value" stroke="var(--a)" fill="var(--a)" fillOpacity={.2} strokeWidth={2}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,.06),rgba(99,102,241,.03))",
                border: "1px solid rgba(139,92,246,.15)", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <MessageSquareQuote size={13} color="#A78BFA"/>
                  <span style={{ fontWeight: 600, fontSize: 11, color: "#A78BFA", textTransform: "uppercase", letterSpacing: .8 }}>Stack Analysis</span>
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {selectedVendors.map(({ layer, vendor }) => (
                    <div key={layer.id} style={{ fontSize: 11, lineHeight: 1.55, marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, color: layer.color }}>{layer.label}</span><br/>
                      <span style={{ color: "var(--dim)", fontStyle: "italic" }}>{vendor.insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════════ */

export default function App() {
  const [tab, setTab] = useState("explore");
  const [uc, setUc] = useState(null);
  const [selIds, setSelIds] = useState([]);
  const [detail, setDetail] = useState(null);
  const [view, setView] = useState("map");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleVendorClick = (v) => {
    setSelIds(p => p.includes(v.id) ? p.filter(x => x !== v.id) : p.length >= 4 ? p : [...p, v.id]);
    setDetail(v);
  };

  const handleCompare = () => { if (selIds.length >= 2) { setDetail(null); setView("compare"); } };
  const handleBack = () => setView("map");
  const handleClear = () => { setSelIds([]); setDetail(null); setView("map"); };
  const selectedVendors = VENDORS.filter(v => selIds.includes(v.id));
  const switchTab = (t) => { setTab(t); if (t === "explore") setView("map"); };

  return (
    <>
      <style>{CSS}</style>
      <div className="eco-root dots" style={{ minHeight: "100vh", position: "relative" }}>

        {/* HEADER */}
        <div style={{ padding: "24px 24px 0", maxWidth: 1120, margin: "0 auto" }}>
          <div className={mounted ? "au" : ""} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, var(--g1), var(--g2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(124,58,237,.4)", flexShrink: 0 }}>
              <Layers size={17} color="white"/>
            </div>
            <div>
              <h1 style={{ fontWeight: 900, fontSize: 20, letterSpacing: -.5, lineHeight: 1.2 }}>AI Vendor Ecosystem Navigator</h1>
              <p style={{ color: "var(--dim)", fontSize: 12 }}>{VENDORS.length} vendors · {LAYERS.length} layers · {USE_CASES.length} use cases — Interactive landscape for enterprise AI strategy</p>
            </div>
          </div>

          <div className={mounted ? "au" : ""} style={{ animationDelay: "80ms", display: "flex", gap: 4, padding: "14px 0 16px", marginLeft: 46 }}>
            <button className={`tab ${tab === "explore" ? "on" : ""}`} onClick={() => switchTab("explore")}>
              <Layers size={14}/> Explore Map
            </button>
            <button className={`tab ${tab === "stack" ? "on" : ""}`} onClick={() => switchTab("stack")}>
              <Boxes size={14}/> Stack Builder
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px 100px" }}>

          {tab === "explore" && (
            <div key="explore">
              <div className="au" style={{ animationDelay: "120ms", display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap" }}>
                {USE_CASES.map(u => (
                  <button key={u.id} className={`pill ${uc === u.id ? "on" : ""}`}
                    onClick={() => setUc(p => p === u.id ? null : u.id)}>
                    {u.emoji} {u.label}
                  </button>
                ))}
                {(uc || selIds.length > 0) && (
                  <button className="pill" onClick={() => { setUc(null); handleClear(); }} style={{ color: "var(--dim)" }}>
                    <RotateCcw size={11}/> Clear All
                  </button>
                )}
              </div>

              {view === "map" ? (
                <div key="map">
                  {LAYERS.map((l, i) => {
                    const lv = VENDORS.filter(v => v.layer === l.id);
                    return (
                      <div key={l.id}>
                        <LayerSection layer={l} vendors={lv} selectedUseCase={uc} selectedIds={selIds}
                          onVendorClick={handleVendorClick} index={i}/>
                        {i < LAYERS.length - 1 && <FlowArrow/>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <ComparisonView vendors={selectedVendors} onBack={handleBack}/>
              )}
            </div>
          )}

          {tab === "stack" && <StackBuilder key="stack"/>}
        </div>

        {/* BOTTOM BAR */}
        {tab === "explore" && view === "map" && selIds.length > 0 && (
          <div className="au" style={{ position: "fixed", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(to top, var(--bg), rgba(9,8,26,.95), transparent)",
            padding: "36px 24px 18px", display: "flex", justifyContent: "center", zIndex: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10,
              background: "var(--card)", borderRadius: 14, padding: "8px 14px",
              border: "1px solid var(--bdr)", backdropFilter: "blur(12px)" }}>
              <div style={{ display: "flex" }}>
                {selectedVendors.slice(0, 4).map((v, i) => (
                  <span key={v.id} style={{ fontSize: 16, marginLeft: i > 0 ? -3 : 0,
                    background: "var(--bg2)", borderRadius: "50%", padding: "1px 2px" }}>{v.emoji}</span>
                ))}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500 }}>{selIds.length} selected</span>
              {selIds.length >= 2 && (
                <button className="cbtn" onClick={handleCompare}>
                  <GitCompare size={13}/> Compare <ArrowRight size={13}/>
                </button>
              )}
              <button onClick={handleClear} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                <X size={14} color="var(--dim)"/>
              </button>
            </div>
          </div>
        )}

        {detail && <DetailPanel vendor={detail} onClose={() => setDetail(null)}/>}
      </div>
    </>
  );
}
