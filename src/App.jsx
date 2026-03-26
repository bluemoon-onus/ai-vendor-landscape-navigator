import { useState, useMemo, useEffect, useRef, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { X, GitCompare, Layers, Sparkles, Zap, Building2, Wrench, ChevronDown, ArrowRight, Check, RotateCcw, MessageSquareQuote, Boxes, Shield, Star, Sun, Moon, DollarSign } from "lucide-react";

const LangCtx = createContext("en");
const useLang = () => useContext(LangCtx);

/* ── BRAND LOGOS ─────────────────────────────────────────────────────── */
const LOGOS = {
  "gpt4o":               { abbr:"OpenAI", bg:"#10A37F", color:"#fff", border:"#0D8A6A", home:"https://openai.com" },
  "claude35":            { abbr:"Claude", bg:"#E37B4B", color:"#fff", border:"#C5612D", home:"https://www.anthropic.com" },
  "gemini":              { abbr:"Gemini", bg:"#4285F4", color:"#fff", border:"#2B6EDA", home:"https://gemini.google.com" },
  "llama":               { abbr:"Llama", bg:"#0064E0", color:"#fff", border:"#004DB3", home:"https://ai.meta.com/llama" },
  "mistral":             { abbr:"Mistral", bg:"#FF5C00", color:"#fff", border:"#D44D00", home:"https://mistral.ai" },
  "cohere":              { abbr:"Cohere", bg:"#39594D", color:"#9FE0CD", border:"#2A4438", home:"https://cohere.com" },
  "deepseek":            { abbr:"DeepSeek", bg:"#4D6BFE", color:"#fff", border:"#3352E0", home:"https://www.deepseek.com" },
  "azure-openai":        { abbr:"Azure", bg:"#0078D4", color:"#fff", border:"#005FA8", home:"https://azure.microsoft.com" },
  "bedrock":             { abbr:"AWS", bg:"#FF9900", color:"#111", border:"#D47F00", home:"https://aws.amazon.com/bedrock" },
  "vertex":              { abbr:"Vertex", bg:"#34A853", color:"#fff", border:"#287D40", home:"https://cloud.google.com/vertex-ai" },
  "huggingface":         { abbr:"HF", bg:"#FFD21E", color:"#1A1A1A", border:"#D4AE00", home:"https://huggingface.co" },
  "databricks":          { abbr:"Databricks", bg:"#FF3621", color:"#fff", border:"#CC2212", home:"https://www.databricks.com" },
  "nvidia-nim":          { abbr:"NVIDIA", bg:"#76B900", color:"#fff", border:"#5E9300", home:"https://www.nvidia.com" },
  "salesforce-einstein": { abbr:"Salesforce", bg:"#00A1E0", color:"#fff", border:"#0083B8", home:"https://www.salesforce.com" },
  "servicenow":          { abbr:"ServiceNow", bg:"#62D84E", color:"#0A2000", border:"#48B435", home:"https://www.servicenow.com" },
  "sap-joule":           { abbr:"SAP", bg:"#009FDB", color:"#fff", border:"#007DB0", home:"https://www.sap.com" },
  "github-copilot":      { abbr:"GitHub", bg:"#24292E", color:"#fff", border:"#1A1E22", home:"https://github.com" },
  "glean":               { abbr:"Glean", bg:"#FF6B2B", color:"#fff", border:"#D4521A", home:"https://www.glean.com" },
  "ms-copilot":          { abbr:"Microsoft", bg:"#0078D4", color:"#fff", border:"#005FA8", home:"https://www.microsoft.com" },
  "langchain":           { abbr:"LangChain", bg:"#1C3C3C", color:"#65C7BF", border:"#122828", home:"https://www.langchain.com" },
  "pinecone":            { abbr:"Pinecone", bg:"#000", color:"#1DB954", border:"#222", home:"https://www.pinecone.io" },
  "wandb":               { abbr:"W&B", bg:"#FFBE00", color:"#1A1A1A", border:"#D49E00", home:"https://wandb.ai" },
  "llamaindex":          { abbr:"LlamaIndex", bg:"#7C3AED", color:"#fff", border:"#5E24D0", home:"https://www.llamaindex.ai" },
  "weaviate":            { abbr:"Weaviate", bg:"#1D2030", color:"#FA0050", border:"#111520", home:"https://weaviate.io" },
  "mlflow":              { abbr:"MLflow", bg:"#0194E2", color:"#fff", border:"#0177B8", home:"https://mlflow.org" },
  "chroma":              { abbr:"Chroma", bg:"#F47B20", color:"#fff", border:"#C85E0A", home:"https://www.trychroma.com" },
};

function LogoBadge({ vendorId, size = 44 }) {
  const cfg = LOGOS[vendorId] || { abbr:"AI", bg:"#6366F1", color:"#fff", border:"#4F46E5", home:null };
  const [hasError, setHasError] = useState(false);
  const fs = size <= 40 ? 10 : size <= 50 ? 11 : 13;
  const imageSize = Math.round(size);
  const logoSrc = cfg.home && !hasError
    ? `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(cfg.home)}&sz=128`
    : null;
  useEffect(() => {
    setHasError(false);
  }, [vendorId]);
  return (
    <div style={{
      width:size, height:size, flexShrink:0,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontWeight:800, fontSize:fs, color:cfg.color,
      letterSpacing:-0.3, lineHeight:1.1, textAlign:"center",
      padding:0,
      fontFamily:"'Outfit',sans-serif",
    }}>
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={`${cfg.abbr} logo`}
          width={imageSize}
          height={imageSize}
          style={{ width:imageSize, height:imageSize, objectFit:"contain" }}
          onError={() => setHasError(true)}
        />
      ) : (
        <span style={{ color:"var(--txt)" }}>{cfg.abbr}</span>
      )}
    </div>
  );
}

/* ── DATA ─────────────────────────────────────────────────────────────── */
const LAYERS = [
  { id:"foundation",label:"Foundation Models",     labelKo:"파운데이션 모델",     icon:"Sparkles",color:"#8B5CF6",colorLight:"#6D28D9",gradient:"linear-gradient(135deg,#7C3AED,#6D28D9)",desc:"Core LLMs powering the AI ecosystem",           descKo:"AI 생태계를 구동하는 핵심 LLM",step:"1" },
  { id:"platform",  label:"AI Platforms",          labelKo:"AI 플랫폼",           icon:"Zap",     color:"#6366F1",colorLight:"#4338CA",gradient:"linear-gradient(135deg,#6366F1,#4F46E5)",desc:"Cloud infrastructure & model serving",         descKo:"클라우드 인프라 & 모델 서빙",  step:"2" },
  { id:"vertical",  label:"Enterprise AI Apps",    labelKo:"엔터프라이즈 AI 앱",  icon:"Building2",color:"#A78BFA",colorLight:"#7C3AED",gradient:"linear-gradient(135deg,#A78BFA,#8B5CF6)",desc:"Industry-specific AI solutions",               descKo:"산업별 특화 AI 솔루션",        step:"3" },
  { id:"tooling",   label:"Tooling & Infra",       labelKo:"툴링 & 인프라",       icon:"Wrench",  color:"#C4B5FD",colorLight:"#6D28D9",gradient:"linear-gradient(135deg,#C4B5FD,#A78BFA)",desc:"Developer tools & data infrastructure",        descKo:"개발 도구 & 데이터 인프라",    step:"4" },
];
const USE_CASES = [
  { id:"customer-service",label:"Customer Service",      labelKo:"고객 서비스",       emoji:"🎧" },
  { id:"doc-intel",       label:"Document Intelligence", labelKo:"문서 인텔리전스",   emoji:"📄" },
  { id:"code-assist",     label:"Code Assistant",        labelKo:"코드 어시스턴트",   emoji:"💻" },
  { id:"sales-intel",     label:"Sales Intelligence",    labelKo:"세일즈 인텔리전스", emoji:"📊" },
  { id:"content-gen",     label:"Content Generation",    labelKo:"콘텐츠 생성",       emoji:"✍️" },
  { id:"data-analytics",  label:"Data & Analytics",      labelKo:"데이터 & 분석",     emoji:"🔬" },
];
const ML  = { performance:"Performance",  integration:"Integration",  cost:"Cost Efficiency",   enterprise:"Enterprise Ready",scalability:"Scalability",  community:"Community" };
const MLK = { performance:"성능",         integration:"연동성",       cost:"비용 효율",         enterprise:"엔터프라이즈",    scalability:"확장성",      community:"커뮤니티" };
const RC  = ["#8B5CF6","#F59E0B","#10B981","#F43F5E","#60A5FA","#FB923C"];

const V = [
  /* FOUNDATION */
  { id:"gpt4o",    name:"GPT-4o",            org:"OpenAI",           layer:"foundation", priceFree:false, priceLabel:"$5/1M tok",     useCases:["customer-service","doc-intel","code-assist","sales-intel","content-gen","data-analytics"], pricing:"Pay-per-token",       bestFit:"Enterprise & Startup",       strengths:["Broadest ecosystem & plugins","Strongest general reasoning","Multimodal (text, image, audio)"],                                    limitations:["Highest cost at scale","Data privacy in regulated industries","Rate limits at peak"],                                    insight:"Market leader with broadest ecosystem. Best for Microsoft-stack enterprises. Watch cost escalation at scale.",        metrics:{performance:9,integration:8,cost:5,enterprise:8,scalability:9,community:10} },
  { id:"claude35", name:"Claude 3.5 Sonnet", org:"Anthropic",        layer:"foundation", priceFree:false, priceLabel:"$3/1M tok",     useCases:["customer-service","doc-intel","code-assist","content-gen"],                                  pricing:"Pay-per-token",       bestFit:"Enterprise (regulated)",     strengths:["200K context — best for long docs","Constitutional AI safety","Superior instruction following"],                    limitations:["Smaller plugin ecosystem","No native image gen","Fewer fine-tuning options"],                                    insight:"Strongest in safety-critical & regulated industries. 200K context is game-changer for document-heavy workflows.",      metrics:{performance:9,integration:7,cost:6,enterprise:9,scalability:8,community:7} },
  { id:"gemini",   name:"Gemini 1.5 Pro",    org:"Google DeepMind",  layer:"foundation", priceFree:true,  priceLabel:"$1.25/1M tok",  useCases:["doc-intel","data-analytics","content-gen","customer-service"],                               pricing:"Pay-per-token",       bestFit:"Data-heavy Enterprise",      strengths:["1M token context — largest","Native multimodal (text,image,video)","Deep Google Workspace integration"],              limitations:["Still building enterprise trust","Fewer third-party integrations","Perception lags GPT-4o"],                     insight:"Unmatched for text+image+video scenarios. Natural fit for GCP/BigQuery-heavy enterprises.",                           metrics:{performance:8,integration:7,cost:7,enterprise:7,scalability:9,community:7} },
  { id:"llama",    name:"Llama 3.1 405B",    org:"Meta AI",          layer:"foundation", priceFree:true,  priceLabel:"Self-hosted",   useCases:["customer-service","content-gen","code-assist"],                                              pricing:"Open Source",         bestFit:"Tech-savvy Enterprise",      strengths:["Open source — full control","No vendor lock-in","Fine-tunable for domains"],                                    limitations:["Requires infra investment","No managed service from Meta","Shorter context vs competitors"],                     insight:"Sovereignty play — for enterprises that cannot send data to external APIs. Pair with AWS/Azure managed hosting.",      metrics:{performance:8,integration:5,cost:9,enterprise:6,scalability:7,community:9} },
  { id:"mistral",  name:"Mistral Large 2",   org:"Mistral AI",       layer:"foundation", priceFree:false, priceLabel:"€2/1M tok",    useCases:["doc-intel","code-assist","content-gen"],                                                     pricing:"Pay-per-token",       bestFit:"EU Enterprise",              strengths:["EU data sovereignty compliance","Excellent cost-performance","Strong multilingual"],                                limitations:["Smaller ecosystem","Limited enterprise track record","Fewer benchmarks"],                                        insight:"The European champion — critical for EU customers with GDPR sovereignty requirements.",                                metrics:{performance:7,integration:6,cost:8,enterprise:6,scalability:7,community:6} },
  { id:"cohere",   name:"Command R+",        org:"Cohere",           layer:"foundation", priceFree:false, priceLabel:"$2.5/1M tok",   useCases:["customer-service","doc-intel","sales-intel"],                                                pricing:"Pay-per-token",       bestFit:"Enterprise RAG",             strengths:["Built-in RAG with citations","Enterprise data connectors","Best for search & retrieval"],                          limitations:["Weaker general reasoning","Smaller brand recognition","Limited multimodal"],                                     insight:"The RAG specialist. Enterprise search or knowledge-base Q&A: often outperforms GPT-4 at lower cost.",                metrics:{performance:7,integration:7,cost:7,enterprise:7,scalability:7,community:5} },
  { id:"deepseek", name:"DeepSeek R1",       org:"DeepSeek AI",      layer:"foundation", priceFree:true,  priceLabel:"$0.55/1M tok",  useCases:["code-assist","data-analytics","doc-intel"],                                                  pricing:"Open Source + API",   bestFit:"Cost-conscious Developer",   strengths:["State-of-art reasoning at fraction of cost","MIT open-source license","Exceptional coding & math"],                limitations:["China-based — data sovereignty concerns","Smaller ecosystem","Enterprise trust building"],                       insight:"Disruptive cost-performance ratio. Best OSS reasoning model. Data sovereignty concerns for regulated industries.",     metrics:{performance:9,integration:5,cost:10,enterprise:4,scalability:7,community:8} },
  /* PLATFORM */
  { id:"azure-openai",  name:"Azure OpenAI",   org:"Microsoft Azure",   layer:"platform", priceFree:false, priceLabel:"PAYG + PTU",    useCases:["customer-service","doc-intel","code-assist","sales-intel","content-gen","data-analytics"], pricing:"Pay-as-you-go + PTU", bestFit:"Microsoft-stack Enterprise", strengths:["Enterprise compliance (SOC2, HIPAA)","Seamless M365 integration","Private networking & data residency"],              limitations:["Locked to OpenAI models","Complex PTU pricing","Slower model availability than OpenAI direct"],                  insight:"The enterprise safe choice. Azure AD + Teams + Dynamics shops — this is the path of least resistance.",               metrics:{performance:9,integration:9,cost:5,enterprise:10,scalability:9,community:8} },
  { id:"bedrock",       name:"AWS Bedrock",     org:"Amazon Web Services",layer:"platform", priceFree:false, priceLabel:"On-demand",     useCases:["customer-service","doc-intel","content-gen","data-analytics"],                               pricing:"Pay-per-token",       bestFit:"Multi-model Enterprise",     strengths:["Multi-model marketplace (Claude, Llama, Titan)","Deep AWS integration","Guardrails & fine-tuning built-in"],       limitations:["Steep learning curve","Some models lag direct API","Complex IAM"],                                               insight:"Don't-put-all-eggs-in-one-basket play. One API for Claude, Llama, and Titan.",                                        metrics:{performance:8,integration:8,cost:6,enterprise:9,scalability:10,community:7} },
  { id:"vertex",        name:"Vertex AI",       org:"Google Cloud",      layer:"platform", priceFree:true,  priceLabel:"$1.25/1M tok",  useCases:["data-analytics","doc-intel","content-gen","customer-service"],                               pricing:"Pay-as-you-go",       bestFit:"Data-first Enterprise",      strengths:["Native BigQuery integration","MLOps + GenAI unified platform","Gemini + open model garden"],                       limitations:["Smaller enterprise footprint than Azure","Less intuitive UI","Fewer ISV integrations"],                          insight:"Strongest when AI strategy is data-centric. Petabytes in BigQuery → Vertex makes the pipeline seamless.",             metrics:{performance:8,integration:7,cost:7,enterprise:8,scalability:9,community:7} },
  { id:"huggingface",   name:"Hugging Face",    org:"Hugging Face",      layer:"platform", priceFree:true,  priceLabel:"$9/mo~",        useCases:["code-assist","content-gen","doc-intel"],                                                     pricing:"Free + Pro tiers",    bestFit:"Developer & Research",       strengths:["Largest open model hub (500K+ models)","Inference Endpoints for production","Strong community"],                  limitations:["Not enterprise-hardened","Limited compliance certs","Basic support SLAs"],                                       insight:"Developer love platform. Great for prototyping. Where Fortune 500 discovers what to build.",                          metrics:{performance:7,integration:6,cost:9,enterprise:4,scalability:6,community:10} },
  { id:"databricks",    name:"Databricks",      org:"Databricks",        layer:"platform", priceFree:false, priceLabel:"DBU-based",     useCases:["data-analytics","doc-intel","sales-intel"],                                                  pricing:"DBU-based",           bestFit:"Data Engineering teams",     strengths:["Unified data + AI lakehouse","Fine-tuning on proprietary data","Strong governance & lineage"],                     limitations:["High TCO","Steep learning curve","Overkill for simple GenAI"],                                                   insight:"When AI is inseparable from data strategy. Expensive but powerful for mature data engineering teams.",                 metrics:{performance:8,integration:7,cost:4,enterprise:8,scalability:8,community:6} },
  { id:"nvidia-nim",    name:"NVIDIA NIM",      org:"NVIDIA",            layer:"platform", priceFree:false, priceLabel:"Infra cost",    useCases:["data-analytics","code-assist","content-gen"],                                                pricing:"Infrastructure",      bestFit:"On-premise AI Enterprise",   strengths:["Optimized inference on NVIDIA GPUs","Run any model on your infra","Healthcare & regulated industry ready"],       limitations:["Requires NVIDIA GPU infra","Higher upfront investment","Limited managed services"],                               insight:"For enterprises where data must never leave the datacenter. GPU optimization delivers 5-10x throughput vs standard.",  metrics:{performance:10,integration:6,cost:4,enterprise:8,scalability:7,community:5} },
  /* VERTICAL */
  { id:"salesforce-einstein",name:"Einstein GPT",    org:"Salesforce",       layer:"vertical", priceFree:false,priceLabel:"$50/user/mo~",useCases:["sales-intel","customer-service","content-gen"],                                            pricing:"Per-user add-on",    bestFit:"Salesforce customers",       strengths:["Native CRM data integration","Trust Layer for data security","Copilot across Sales, Service, Marketing"],        limitations:["Only within Salesforce ecosystem","Premium on top of licenses","Requires Salesforce expertise"],                  insight:"No-brainer for existing Salesforce shops. Trust Layer addresses data leakage. AI that already knows your customer.",   metrics:{performance:7,integration:9,cost:4,enterprise:9,scalability:8,community:6} },
  { id:"servicenow",         name:"Now Assist",      org:"ServiceNow",       layer:"vertical", priceFree:false,priceLabel:"Enterprise",  useCases:["customer-service","doc-intel"],                                                              pricing:"Per-user add-on",    bestFit:"IT Service Management",      strengths:["ITSM workflow automation","Knowledge base integration","Incident summarization & resolution"],                    limitations:["Narrow to ServiceNow workflows","Expensive per-seat","Requires mature ITSM processes"],                           insight:"Transforms IT help desks. 30-40% reduction in ticket handling. Best for CIOs frustrated with L1 support costs.",      metrics:{performance:7,integration:8,cost:4,enterprise:9,scalability:7,community:5} },
  { id:"sap-joule",          name:"SAP Joule",       org:"SAP",              layer:"vertical", priceFree:false,priceLabel:"S/4HANA incl",useCases:["data-analytics","doc-intel","sales-intel"],                                                 pricing:"Included in S/4HANA",bestFit:"SAP ERP customers",          strengths:["Embedded across SAP modules","Business process context awareness","Enterprise data governance"],                   limitations:["Only for SAP customers","Early maturity stage","Limited third-party AI model support"],                           insight:"Strategic for SAP's 400K+ enterprise customers. Still early but SAP's distribution moat is real.",                    metrics:{performance:6,integration:8,cost:6,enterprise:9,scalability:7,community:4} },
  { id:"github-copilot",     name:"GitHub Copilot",  org:"GitHub / Microsoft",layer:"vertical",priceFree:false,priceLabel:"$10/user/mo",useCases:["code-assist"],                                                                               pricing:"$10-39/user/mo",     bestFit:"Development teams",          strengths:["Best-in-class code completion","IDE-native experience","Enterprise admin & policy controls"],                     limitations:["Narrow to coding","IP/licensing concerns","Variable quality across languages"],                                  insight:"The gateway drug to enterprise AI adoption. Dev teams adopt bottom-up, then leadership asks 'what else?'",             metrics:{performance:9,integration:9,cost:7,enterprise:7,scalability:8,community:9} },
  { id:"glean",              name:"Glean",           org:"Glean",            layer:"vertical", priceFree:false,priceLabel:"Enterprise",  useCases:["doc-intel","customer-service","sales-intel"],                                               pricing:"Per-user SaaS",      bestFit:"Knowledge-heavy Enterprise", strengths:["Connects 100+ enterprise apps","Personalized search & answers","Strong data permissions"],                        limitations:["Requires broad connector setup","Premium pricing","ROI harder to quantify initially"],                            insight:"Enterprise Google for internal knowledge. Killer use case: new employee onboarding and cross-team discovery.",        metrics:{performance:8,integration:8,cost:5,enterprise:8,scalability:7,community:5} },
  { id:"ms-copilot",         name:"M365 Copilot",    org:"Microsoft",        layer:"vertical", priceFree:false,priceLabel:"$30/user/mo", useCases:["content-gen","doc-intel","sales-intel","customer-service"],                                  pricing:"$30/user/mo",        bestFit:"Microsoft 365 Enterprise",   strengths:["Native Word, Excel, Teams integration","Org-wide context with Microsoft Graph","Easy IT governance"],              limitations:["M365 ecosystem only","$30 premium on top of existing licenses","Privacy concerns around Graph data"],             insight:"Easiest AI adoption path for M365 shops. If employees live in Teams and Outlook, this has immediate day-1 value.",     metrics:{performance:7,integration:10,cost:4,enterprise:9,scalability:9,community:7} },
  /* TOOLING */
  { id:"langchain",   name:"LangChain",       org:"LangChain Inc.",  layer:"tooling", priceFree:true,  priceLabel:"$39/mo~",      useCases:["customer-service","doc-intel","sales-intel","code-assist"],                                     pricing:"Open Source + Cloud", bestFit:"AI Development teams",      strengths:["Most popular LLM orchestration framework","Extensive chain & agent templates","LangSmith observability"],        limitations:["Abstraction overhead for simple tasks","Fast-changing API surface","Can encourage over-engineering"],            insight:"De facto standard for LLM app development. If building custom AI apps, the dev team is probably already using this.", metrics:{performance:7,integration:8,cost:9,enterprise:6,scalability:7,community:10} },
  { id:"pinecone",    name:"Pinecone",        org:"Pinecone",        layer:"tooling", priceFree:true,  priceLabel:"$70/mo~",      useCases:["doc-intel","customer-service","sales-intel"],                                                  pricing:"Usage-based",         bestFit:"RAG Applications",          strengths:["Purpose-built vector database","Serverless scaling","Simple API, fast time-to-value"],                             limitations:["Vendor lock-in for vector storage","Expensive at scale","Limited vs traditional DB"],                            insight:"Easy button for RAG. Gets to production fastest. Consider Weaviate for complex hybrid search needs.",                  metrics:{performance:8,integration:8,cost:6,enterprise:7,scalability:8,community:7} },
  { id:"wandb",       name:"Weights & Biases",org:"W&B",             layer:"tooling", priceFree:true,  priceLabel:"$50/user/mo~", useCases:["data-analytics","code-assist"],                                                                 pricing:"Free + Team/Enterprise",bestFit:"ML/AI Research teams",    strengths:["Best experiment tracking UI","Model evaluation & comparison","Prompt engineering tools"],                         limitations:["ML-team focused, not business-user friendly","Overlap with cloud-native MLOps","Learning curve for non-ML"],    insight:"Figma for ML teams. If the customer has a serious ML team, W&B is likely already on their radar.",                    metrics:{performance:7,integration:6,cost:7,enterprise:6,scalability:7,community:8} },
  { id:"llamaindex",  name:"LlamaIndex",      org:"LlamaIndex",      layer:"tooling", priceFree:true,  priceLabel:"Cloud plans",  useCases:["doc-intel","customer-service","data-analytics"],                                               pricing:"Open Source + Cloud", bestFit:"Data-centric AI apps",      strengths:["Best data ingestion framework","Advanced RAG patterns","LlamaParse for document processing"],                     limitations:["Overlaps with LangChain","Smaller ecosystem","Less general-purpose"],                                            insight:"Complementary to LangChain. LlamaIndex excels at data ingestion; LangChain at orchestration. Smart teams use both.", metrics:{performance:7,integration:7,cost:9,enterprise:5,scalability:7,community:8} },
  { id:"weaviate",    name:"Weaviate",        org:"Weaviate",        layer:"tooling", priceFree:true,  priceLabel:"$25/mo~",      useCases:["doc-intel","customer-service","sales-intel"],                                                  pricing:"Open Source + Cloud", bestFit:"Hybrid Search Apps",        strengths:["Hybrid vector + keyword search","Multi-tenancy support","GraphQL API"],                                            limitations:["More complex than Pinecone","More operational knowledge required","Smaller community"],                          insight:"Choose over Pinecone when hybrid search or multi-tenant architecture is needed. Common in B2B SaaS companies.",        metrics:{performance:8,integration:6,cost:8,enterprise:6,scalability:8,community:6} },
  { id:"mlflow",      name:"MLflow",          org:"Databricks",      layer:"tooling", priceFree:true,  priceLabel:"오픈소스",     useCases:["data-analytics","code-assist"],                                                                 pricing:"Open Source",         bestFit:"MLOps teams",               strengths:["Open source MLOps standard","Model registry & deployment","Deep Databricks integration"],                         limitations:["UI less polished than W&B","GenAI features catching up","Better for traditional ML"],                             insight:"Open-source MLOps backbone. For customers resistant to another SaaS vendor, MLflow is the self-hosted answer.",        metrics:{performance:7,integration:7,cost:10,enterprise:6,scalability:7,community:8} },
  { id:"chroma",      name:"Chroma",          org:"Chroma",          layer:"tooling", priceFree:true,  priceLabel:"Cloud beta",   useCases:["doc-intel","customer-service","code-assist"],                                                  pricing:"Open Source",         bestFit:"AI Startups & Prototyping", strengths:["Easiest vector DB to get started","Python-native, developer-friendly","Active community & rapid iteration"],       limitations:["Less production-hardened than Pinecone","Smaller enterprise footprint","Limited scalability at large scale"],    insight:"The Postman of vector databases — fastest path from zero to RAG prototype. Production teams often migrate to Pinecone.",metrics:{performance:6,integration:8,cost:10,enterprise:3,scalability:5,community:8} },
];

const KO = {
  "gpt4o":               { pricing:"토큰당 과금",bestFit:"엔터프라이즈 & 스타트업",strengths:["최대 규모 플러그인 생태계","강력한 범용 추론 능력","텍스트·이미지·오디오 멀티모달"],limitations:["대용량 사용 시 비용 급증","규제 산업 데이터 프라이버시 우려","피크 시간대 속도 제한"],insight:"시장 점유율 1위. Microsoft 스택 기업에 최적. 대규모 사용 시 비용 급증 주의." },
  "claude35":            { pricing:"토큰당 과금",bestFit:"엔터프라이즈(규제 산업)",strengths:["20만 토큰 컨텍스트","헌법적 AI 안전 프레임워크","탁월한 지시사항 이해력"],limitations:["GPT 대비 작은 플러그인 생태계","네이티브 이미지 생성 미지원","파인튜닝 옵션 제한"],insight:"금융·의료·법률 규제 산업에서 가장 신뢰할 수 있는 모델." },
  "gemini":              { pricing:"토큰당 과금",bestFit:"데이터 집약형 엔터프라이즈",strengths:["100만 토큰 컨텍스트 — 업계 최대","텍스트·이미지·영상 멀티모달","Google Workspace 깊은 통합"],limitations:["엔터프라이즈 신뢰도 구축 중","서드파티 연동 부족","GPT-4o 대비 인지도 열세"],insight:"GCP와 BigQuery 자산을 보유한 기업에 자연스러운 선택." },
  "llama":               { pricing:"무료(자체 호스팅)",bestFit:"기술 역량 보유 엔터프라이즈",strengths:["오픈소스 — 완전한 통제 및 커스터마이징","벤더 락인 없음","도메인 특화 파인튜닝 가능"],limitations:["상당한 인프라 투자 필요","Meta 매니지드 서비스 없음","경쟁사 대비 짧은 컨텍스트"],insight:"데이터를 외부 API로 보낼 수 없는 기업을 위한 주권 솔루션." },
  "mistral":             { pricing:"토큰당 과금",bestFit:"EU 엔터프라이즈",strengths:["유럽 데이터 주권 규정 준수","탁월한 비용 대비 성능","강력한 다국어 처리"],limitations:["작은 생태계","엔터프라이즈 실적 부족","벤치마크 데이터 제한"],insight:"GDPR 주권 요건을 가진 EU 고객에게 필수." },
  "cohere":              { pricing:"토큰당 과금",bestFit:"엔터프라이즈 RAG",strengths:["인용 포함 내장 RAG","엔터프라이즈급 데이터 커넥터","검색·검색증강에 탁월"],limitations:["범용 추론 능력 한계","브랜드 인지도 낮음","멀티모달 지원 부족"],insight:"RAG 전문가. 엔터프라이즈 검색이나 지식베이스 Q&A에 GPT-4보다 낮은 비용으로 우수한 성능." },
  "deepseek":            { pricing:"오픈소스 + API",bestFit:"비용 최적화 개발팀",strengths:["혁신적 비용 대비 추론 성능","MIT 오픈소스 라이선스","탁월한 코딩 & 수학 능력"],limitations:["중국 기반 — 데이터 주권 우려","작은 생태계","엔터프라이즈 신뢰도 구축 중"],insight:"파괴적 비용-성능 비율. 규제 산업의 데이터 주권 우려는 주의 필요." },
  "azure-openai":        { pricing:"종량제 + PTU",bestFit:"Microsoft 스택 엔터프라이즈",strengths:["엔터프라이즈 컴플라이언스(SOC2, HIPAA)","Microsoft 365 완벽 연동","프라이빗 네트워킹 & 데이터 레지던시"],limitations:["OpenAI 모델 전용 제한","PTU 약정 복잡한 가격 구조","직접 API 대비 모델 업데이트 지연"],insight:"엔터프라이즈의 안전한 선택. Azure AD, Teams, Dynamics 사용 기업에 최적." },
  "bedrock":             { pricing:"토큰당 과금",bestFit:"멀티모델 엔터프라이즈",strengths:["멀티모델 마켓플레이스(Claude, Llama, Titan)","깊은 AWS 서비스 연동","가드레일 & 파인튜닝 내장"],limitations:["가파른 학습 곡선","일부 모델 직접 API 대비 지연","복잡한 IAM 설정"],insight:"'모든 달걀을 한 바구니에 담지 않는' 전략. 하나의 API로 멀티 모델 접근." },
  "vertex":              { pricing:"종량제",bestFit:"데이터 중심 엔터프라이즈",strengths:["BigQuery & 데이터 파이프라인 네이티브 연동","MLOps + GenAI 통합 플랫폼","Gemini + 오픈 모델 가든"],limitations:["Azure 대비 작은 엔터프라이즈 입지","직관성 낮은 UI","적은 ISV 연동"],insight:"AI 전략이 데이터 중심일 때 가장 강력. BigQuery 대용량 데이터 보유 기업에 원활." },
  "huggingface":         { pricing:"무료 + 유료 플랜",bestFit:"개발자 & 연구팀",strengths:["최대 오픈 모델 허브(50만+ 모델)","프로덕션용 추론 엔드포인트","강력한 커뮤니티"],limitations:["엔터프라이즈 하드닝 미흡","컴플라이언스 인증 제한","기본적인 지원 SLA"],insight:"'개발자가 사랑하는' 플랫폼. 프로토타입과 연구에 탁월." },
  "databricks":          { pricing:"DBU 기반",bestFit:"데이터 엔지니어링팀",strengths:["통합 데이터 + AI 레이크하우스","자체 데이터 파인튜닝","강력한 거버넌스 & 리니지"],limitations:["높은 총소유비용(TCO)","가파른 학습 곡선","단순 GenAI 유즈케이스에 과도"],insight:"AI가 데이터 전략과 불가분일 때의 선택." },
  "nvidia-nim":          { pricing:"인프라 비용",bestFit:"온프레미스 AI 엔터프라이즈",strengths:["NVIDIA GPU 최적화 추론","자체 인프라에서 모든 모델 구동","의료·규제 산업 적합"],limitations:["NVIDIA GPU 인프라 필수","높은 초기 투자","제한적 매니지드 서비스"],insight:"데이터가 데이터센터를 벗어나면 안 되는 기업을 위한 선택. GPU 최적화로 5-10배 처리량." },
  "salesforce-einstein": { pricing:"사용자당 애드온",bestFit:"Salesforce 고객사",strengths:["네이티브 CRM 데이터 연동","데이터 보안 트러스트 레이어","영업·서비스·마케팅 전체 Copilot"],limitations:["Salesforce 생태계 내에서만 유용","라이선스 위에 프리미엄 가격","Salesforce 전문 지식 필요"],insight:"기존 Salesforce 고객에게는 당연한 선택. ETL 없이 고객 데이터를 이미 아는 AI." },
  "servicenow":          { pricing:"사용자당 애드온",bestFit:"IT 서비스 관리",strengths:["ITSM 워크플로우 자동화","지식베이스 연동","인시던트 요약 & 해결"],limitations:["ServiceNow 워크플로우 한정","높은 좌석당 가격","성숙한 ITSM 프로세스 필요"],insight:"IT 헬프데스크 혁신. 티켓 처리 시간 30-40% 감소." },
  "sap-joule":           { pricing:"S/4HANA Cloud 포함",bestFit:"SAP ERP 고객사",strengths:["SAP 모듈 전체 내장","비즈니스 프로세스 컨텍스트 인식","엔터프라이즈 데이터 거버넌스"],limitations:["SAP 고객에게만 적용","초기 성숙 단계","서드파티 AI 모델 지원 제한"],insight:"SAP 40만+ 엔터프라이즈 고객에 전략적. 아직 초기 단계지만 SAP의 유통 해자는 실재." },
  "github-copilot":      { pricing:"월 $10/사용자~",bestFit:"개발팀",strengths:["최고 수준의 코드 자동완성","IDE 네이티브 경험","엔터프라이즈 관리 & 정책 제어"],limitations:["코딩 유즈케이스 한정","생성 코드의 IP/라이선스 우려","언어별 품질 편차"],insight:"엔터프라이즈 AI 도입의 게이트웨이. 개발자가 바텀업으로 도입하면 경영진이 질문 시작." },
  "glean":               { pricing:"사용자당 SaaS",bestFit:"지식 집약형 엔터프라이즈",strengths:["100+ 엔터프라이즈 앱 연결","개인화된 검색 & 답변","강력한 데이터 권한 모델"],limitations:["광범위한 데이터 커넥터 설정 필요","프리미엄 가격","초기 ROI 정량화 어려움"],insight:"내부 지식을 위한 '엔터프라이즈 구글'. 킬러 유즈케이스: 신규 직원 온보딩과 지식 발견." },
  "ms-copilot":          { pricing:"월 $30/사용자",bestFit:"Microsoft 365 엔터프라이즈",strengths:["Word·Excel·Teams 네이티브 통합","Microsoft Graph 조직 컨텍스트","간편한 IT 거버넌스"],limitations:["M365 생태계 전용","기존 라이선스 위 $30 추가","Graph 데이터 프라이버시 우려"],insight:"M365 기업의 가장 쉬운 AI 도입 경로. Teams와 Outlook에서 즉시 가치 발생." },
  "langchain":           { pricing:"오픈소스 + 클라우드",bestFit:"AI 개발팀",strengths:["가장 인기 있는 LLM 오케스트레이션 프레임워크","광범위한 체인 & 에이전트 템플릿","LangSmith 옵저버빌리티"],limitations:["단순 작업의 추상화 오버헤드","빠르게 변하는 API 표면","과도한 엔지니어링 유도 가능"],insight:"LLM 앱 개발의 사실상 표준." },
  "pinecone":            { pricing:"사용량 기반",bestFit:"RAG 애플리케이션",strengths:["목적 특화 벡터 데이터베이스","서버리스 스케일링","단순 API, 빠른 프로덕션 전환"],limitations:["벡터 스토리지 벤더 락인","규모 확장 시 비용 증가","기존 DB 대비 제한적 쿼리"],insight:"RAG를 위한 '이지 버튼'. 가장 빠른 프로덕션 전환." },
  "wandb":               { pricing:"무료 + 팀/엔터프라이즈",bestFit:"ML/AI 연구팀",strengths:["최고의 실험 추적 UI","모델 평가 & 비교","프롬프트 엔지니어링 도구"],limitations:["ML팀 중심, 비즈니스 사용자 비친화적","클라우드 네이티브 MLOps와 중복","ML 비전문가 학습 곡선"],insight:"'ML팀을 위한 Figma.' 진지한 ML팀이 있다면 이미 레이더에 있을 것." },
  "llamaindex":          { pricing:"오픈소스 + 클라우드",bestFit:"데이터 중심 AI 앱",strengths:["최고의 데이터 수집 프레임워크","고급 RAG 패턴","LlamaParse 문서 처리"],limitations:["LangChain과 중복","작은 생태계","범용성 부족"],insight:"LangChain의 보완재. LlamaIndex는 데이터 수집, LangChain은 오케스트레이션." },
  "weaviate":            { pricing:"오픈소스 + 클라우드",bestFit:"하이브리드 검색 앱",strengths:["벡터 + 키워드 하이브리드 검색","멀티 테넌시 지원","GraphQL API"],limitations:["Pinecone보다 복잡","높은 운영 지식 요구","작은 커뮤니티"],insight:"멀티 테넌트 아키텍처나 하이브리드 검색이 필요할 때 Pinecone 대신 선택." },
  "mlflow":              { pricing:"오픈소스",bestFit:"MLOps팀",strengths:["오픈소스 MLOps 표준","모델 레지스트리 & 배포","Databricks 깊은 연동"],limitations:["W&B 대비 덜 세련된 UI","GenAI 기능 따라잡는 중","전통적 ML에 더 적합"],insight:"오픈소스 MLOps 백본. 또 다른 SaaS 벤더를 원하지 않는 고객에게 자체 호스팅 답변." },
  "chroma":              { pricing:"오픈소스",bestFit:"AI 스타트업 & 프로토타입",strengths:["가장 빠른 벡터DB 시작","Python 네이티브, 개발자 친화적","활발한 커뮤니티"],limitations:["프로덕션 하드닝 부족","엔터프라이즈 입지 작음","대규모 확장성 제한"],insight:"벡터 데이터베이스의 Postman — 가장 빠른 RAG 프로토타입. 프로덕션은 Pinecone으로 마이그레이션." },
};

const STACK_PRESETS = [
  { name:"Enterprise Safe",  nameKo:"엔터프라이즈 안전형",desc:"Maximum compliance & integration",  descKo:"최대 컴플라이언스 & 통합",    picks:{foundation:"claude35",platform:"azure-openai",vertical:"ms-copilot",  tooling:"langchain"},   cost:"$30-80/user/mo" },
  { name:"Cost Optimized",   nameKo:"비용 최적화형",      desc:"Best value for growing companies",  descKo:"성장 기업을 위한 최적 가치",   picks:{foundation:"llama",   platform:"huggingface", vertical:"github-copilot",tooling:"llamaindex"}, cost:"$10-20/user/mo" },
  { name:"Data-First",       nameKo:"데이터 우선형",       desc:"Analytics & data pipeline focused", descKo:"분석 & 데이터 파이프라인 중심", picks:{foundation:"gemini",  platform:"vertex",      vertical:"glean",         tooling:"pinecone"},    cost:"$50-120/user/mo" },
];

const ANNUAL_COST_ESTIMATES = {
  "gpt4o": 6000,
  "claude35": 3600,
  "gemini": 1800,
  "llama": 12000,
  "mistral": 2400,
  "cohere": 3000,
  "deepseek": 900,
  "azure-openai": 24000,
  "bedrock": 18000,
  "vertex": 12000,
  "huggingface": 108,
  "databricks": 36000,
  "nvidia-nim": 48000,
  "salesforce-einstein": 6000,
  "servicenow": 18000,
  "sap-joule": 0,
  "github-copilot": 1200,
  "glean": 15000,
  "ms-copilot": 3600,
  "langchain": 468,
  "pinecone": 840,
  "wandb": 6000,
  "llamaindex": 2400,
  "weaviate": 300,
  "mlflow": 0,
  "chroma": 0,
};

const makeEmptyStack = () => ({ foundation:null, platform:null, vertical:null, tooling:null });

const DECISION_BUDGETS = [
  { id:"limited", label:"Limited (< $50K/yr)", labelKo:"제한적 (< 연 $50K)", desc:"Prioritize cost efficiency and fast wins", descKo:"비용 효율과 빠른 성과를 우선합니다." },
  { id:"moderate", label:"Moderate ($50K–$200K)", labelKo:"중간 규모 ($50K–$200K)", desc:"Balance capability, integration, and spend", descKo:"역량, 통합, 예산의 균형을 맞춥니다." },
  { id:"enterprise", label:"Enterprise ($200K+)", labelKo:"엔터프라이즈 ($200K+)", desc:"Optimize for governance, scale, and adoption", descKo:"거버넌스, 확장성, 전사 도입을 우선합니다." },
];

const DECISION_SOVEREIGNTY = [
  { id:"public", label:"Public Cloud OK", labelKo:"퍼블릭 클라우드 가능", desc:"Managed services and fastest deployment path", descKo:"매니지드 서비스와 빠른 구축 경로를 우선합니다." },
  { id:"private", label:"Private / On-premise Required", labelKo:"프라이빗 / 온프레미스 필수", desc:"Favor self-hosted and private control patterns", descKo:"자체 호스팅과 프라이빗 제어를 우선합니다." },
];

const DECISION_METRIC_WEIGHTS = {
  limited:    { performance:0.9, integration:0.7, cost:2.2, enterprise:0.6, scalability:0.8, community:0.7 },
  moderate:   { performance:1.0, integration:1.0, cost:1.2, enterprise:1.0, scalability:0.9, community:0.7 },
  enterprise: { performance:1.2, integration:1.4, cost:0.6, enterprise:1.5, scalability:1.3, community:0.6 },
};

const DECISION_USE_CASE_WEIGHTS = {
  "customer-service": { integration:0.5, enterprise:0.4, scalability:0.4 },
  "doc-intel":        { performance:0.5, integration:0.3, cost:0.2 },
  "code-assist":      { performance:0.6, community:0.4, cost:0.3 },
  "sales-intel":      { integration:0.6, enterprise:0.5, performance:0.4 },
  "content-gen":      { performance:0.6, integration:0.3, scalability:0.2 },
  "data-analytics":   { performance:0.5, scalability:0.6, integration:0.5 },
};

const DECISION_BUDGET_BONUS = {
  limited: {
    foundation:{ llama:6, deepseek:6, mistral:4, gemini:3, cohere:3, gpt4o:-4, claude35:-1 },
    platform:{ huggingface:6, vertex:3, bedrock:1, "azure-openai":-2, databricks:-5, "nvidia-nim":-4 },
    vertical:{ "github-copilot":6, "sap-joule":2, glean:2, "ms-copilot":-2, "salesforce-einstein":-3, servicenow:-4 },
    tooling:{ mlflow:5, chroma:4, llamaindex:4, langchain:3, weaviate:2, pinecone:1 },
  },
  moderate: {
    foundation:{ claude35:2, gemini:2, cohere:2, mistral:1, gpt4o:1 },
    platform:{ bedrock:3, vertex:3, "azure-openai":2, huggingface:2 },
    vertical:{ glean:3, "github-copilot":3, "ms-copilot":2, "salesforce-einstein":2 },
    tooling:{ langchain:3, pinecone:3, llamaindex:3, weaviate:2, wandb:1 },
  },
  enterprise: {
    foundation:{ claude35:4, gpt4o:4, gemini:3, cohere:2 },
    platform:{ "azure-openai":6, bedrock:5, vertex:4, databricks:3, "nvidia-nim":2 },
    vertical:{ "ms-copilot":5, "salesforce-einstein":5, servicenow:5, glean:4, "sap-joule":4 },
    tooling:{ langchain:4, pinecone:3, wandb:2, mlflow:2, weaviate:2 },
  },
};

const DECISION_SOVEREIGNTY_BONUS = {
  public: {
    foundation:{ gpt4o:4, claude35:4, gemini:4, cohere:3 },
    platform:{ "azure-openai":4, bedrock:4, vertex:4, huggingface:1 },
    vertical:{ "ms-copilot":4, "salesforce-einstein":4, servicenow:3, glean:3 },
    tooling:{ pinecone:3, langchain:2, wandb:1, llamaindex:1 },
  },
  private: {
    foundation:{ llama:7, mistral:5, claude35:2, cohere:2, deepseek:-4, gpt4o:-5, gemini:-4 },
    platform:{ "nvidia-nim":8, bedrock:4, "azure-openai":3, databricks:3, huggingface:2, vertex:-1 },
    vertical:{ "sap-joule":4, servicenow:2, "ms-copilot":2, "salesforce-einstein":1, glean:1 },
    tooling:{ mlflow:7, weaviate:5, langchain:4, llamaindex:4, chroma:3, pinecone:-2, wandb:1 },
  },
};

const DECISION_USE_CASE_BONUS = {
  "customer-service": {
    foundation:{ claude35:5, gpt4o:4, cohere:4, llama:2 },
    platform:{ "azure-openai":4, bedrock:4, vertex:2 },
    vertical:{ servicenow:5, "salesforce-einstein":4, "ms-copilot":3, glean:3 },
    tooling:{ pinecone:4, langchain:3, llamaindex:2, weaviate:2, chroma:1 },
  },
  "doc-intel": {
    foundation:{ claude35:5, gemini:4, cohere:4, gpt4o:2, mistral:2 },
    platform:{ bedrock:4, vertex:4, "azure-openai":2, databricks:2 },
    vertical:{ glean:5, servicenow:4, "sap-joule":3, "ms-copilot":2 },
    tooling:{ llamaindex:5, pinecone:4, weaviate:4, chroma:2, langchain:2 },
  },
  "code-assist": {
    foundation:{ deepseek:5, claude35:4, gpt4o:4, llama:3, mistral:2 },
    platform:{ huggingface:4, "nvidia-nim":4, bedrock:2, "azure-openai":2 },
    vertical:{ "github-copilot":8 },
    tooling:{ langchain:4, wandb:4, mlflow:2, chroma:2 },
  },
  "sales-intel": {
    foundation:{ gpt4o:5, cohere:4, claude35:3, gemini:2 },
    platform:{ "azure-openai":5, databricks:4, bedrock:2, vertex:2 },
    vertical:{ "salesforce-einstein":8, "ms-copilot":4, glean:4, "sap-joule":2 },
    tooling:{ pinecone:4, langchain:4, weaviate:2, llamaindex:2 },
  },
  "content-gen": {
    foundation:{ gpt4o:5, gemini:4, claude35:4, mistral:2, llama:2 },
    platform:{ "azure-openai":5, vertex:4, bedrock:2, huggingface:2 },
    vertical:{ "ms-copilot":5, "salesforce-einstein":4 },
    tooling:{ langchain:5, chroma:2 },
  },
  "data-analytics": {
    foundation:{ gemini:5, deepseek:4, gpt4o:2, mistral:2 },
    platform:{ vertex:5, databricks:5, "nvidia-nim":2, bedrock:2 },
    vertical:{ "sap-joule":5, glean:3, "ms-copilot":2 },
    tooling:{ mlflow:5, wandb:4, llamaindex:2, pinecone:2 },
  },
};

const DECISION_PLATFORM_COMPAT = {
  gpt4o:{ "azure-openai":7, bedrock:1 },
  claude35:{ bedrock:6 },
  gemini:{ vertex:8 },
  llama:{ "nvidia-nim":7, huggingface:4, bedrock:3 },
  mistral:{ huggingface:5, "nvidia-nim":4, bedrock:2 },
  cohere:{ bedrock:4, "azure-openai":1 },
  deepseek:{ "nvidia-nim":5, huggingface:5 },
};

const DECISION_VERTICAL_COMPAT = {
  "azure-openai": { "ms-copilot":4, "salesforce-einstein":2 },
  bedrock: { servicenow:2, glean:2, "salesforce-einstein":1 },
  vertex: { glean:2, "sap-joule":1 },
  "nvidia-nim": { "sap-joule":1, servicenow:1 },
  databricks: { "sap-joule":2, glean:2 },
  huggingface: { "github-copilot":1, glean:1 },
};

const DECISION_TOOLING_COMPAT = {
  "azure-openai": { langchain:2, pinecone:1 },
  bedrock: { langchain:2, pinecone:2, llamaindex:1 },
  vertex: { llamaindex:2, mlflow:1 },
  "nvidia-nim": { mlflow:3, langchain:1, weaviate:1 },
  databricks: { mlflow:4, wandb:1 },
  huggingface: { chroma:2, langchain:1, mlflow:1 },
};

function vf(v, f, lang) { if (lang==="ko" && KO[v.id]) return KO[v.id][f] ?? v[f]; return v[f]; }

function getStackPriceText(vendor, lang) {
  const freeLabel = lang==="ko" ? "무료" : "Free";
  if (!vendor.priceFree) return vendor.priceLabel || "";
  if (!vendor.priceLabel || ["Self-hosted","Open Source","오픈소스"].includes(vendor.priceLabel)) return vendor.priceLabel || freeLabel;
  return `${freeLabel} · ${vendor.priceLabel}`;
}

function getVendorAnnualEstimate(vendorId) {
  return ANNUAL_COST_ESTIMATES[vendorId] ?? 0;
}

function formatAnnualEstimate(amount, lang) {
  if (!amount) return lang==="ko" ? "포함 / 무료" : "Included / free";
  const formatted = new Intl.NumberFormat("en-US", {
    style:"currency",
    currency:"USD",
    notation: amount >= 1000 ? "compact" : "standard",
    maximumFractionDigits: amount >= 1000 ? 1 : 0,
  }).format(amount);
  return lang==="ko" ? `약 ${formatted}/년` : `~${formatted}/yr`;
}

const UI_SCALE = 1.5;
const ux = value => Number((value * UI_SCALE).toFixed(1));
const CARD_SCALE = 0.85;
const cx = value => Number((ux(value) * CARD_SCALE).toFixed(1));

function getVendorTooltipPosition(rect) {
  const gap = 14;
  const width = 354;
  const estimatedHeight = 228;
  const viewportPad = 12;
  const fitsRight = rect.right + gap + width <= window.innerWidth - viewportPad;

  if (fitsRight) {
    const top = Math.max(
      viewportPad,
      Math.min(rect.top + rect.height / 2 - estimatedHeight / 2, window.innerHeight - estimatedHeight - viewportPad)
    );
    return { left:rect.right + gap, top, width };
  }

  const left = Math.max(
    viewportPad,
    Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - viewportPad)
  );
  const topAbove = rect.top - estimatedHeight - gap;
  const top = topAbove >= viewportPad
    ? topAbove
    : Math.min(rect.bottom + gap, window.innerHeight - estimatedHeight - viewportPad);

  return { left, top, width };
}

function decisionBonus(table, layerId, vendorId) {
  return table?.[layerId]?.[vendorId] ?? 0;
}

function rankDecisionLayer(layerId, answers, context = {}) {
  const layerVendors = V.filter(v => v.layer===layerId);
  const matching = layerVendors.filter(v => v.useCases.includes(answers.useCase));
  const candidates = matching.length ? matching : layerVendors;
  const budgetWeights = DECISION_METRIC_WEIGHTS[answers.budget] || DECISION_METRIC_WEIGHTS.moderate;
  const useCaseWeights = DECISION_USE_CASE_WEIGHTS[answers.useCase] || {};

  return candidates
    .map(vendor => {
      const metricScore = Object.entries(vendor.metrics).reduce((sum, [metric, value]) => {
        const weight = (budgetWeights[metric] ?? 1) + (useCaseWeights[metric] ?? 0);
        return sum + (value * weight);
      }, 0);

      let score = metricScore;
      score += decisionBonus(DECISION_BUDGET_BONUS[answers.budget], layerId, vendor.id);
      score += decisionBonus(DECISION_SOVEREIGNTY_BONUS[answers.sovereignty], layerId, vendor.id);
      score += decisionBonus(DECISION_USE_CASE_BONUS[answers.useCase], layerId, vendor.id);

      if (layerId==="platform" && context.foundationId) score += DECISION_PLATFORM_COMPAT[context.foundationId]?.[vendor.id] ?? 0;
      if (layerId==="vertical" && context.platformId) score += DECISION_VERTICAL_COMPAT[context.platformId]?.[vendor.id] ?? 0;
      if (layerId==="tooling" && context.platformId) score += DECISION_TOOLING_COMPAT[context.platformId]?.[vendor.id] ?? 0;

      return { vendor, score };
    })
    .sort((a, b) =>
      b.score - a.score ||
      b.vendor.metrics.enterprise - a.vendor.metrics.enterprise ||
      b.vendor.metrics.integration - a.vendor.metrics.integration
    );
}

function buildDecisionRecommendation(answers) {
  if (!answers.budget || !answers.sovereignty || !answers.useCase) return null;

  const foundation = rankDecisionLayer("foundation", answers)[0]?.vendor || null;
  const platform = rankDecisionLayer("platform", answers, { foundationId:foundation?.id })[0]?.vendor || null;
  const vertical = rankDecisionLayer("vertical", answers, { foundationId:foundation?.id, platformId:platform?.id })[0]?.vendor || null;
  const tooling = rankDecisionLayer("tooling", answers, { foundationId:foundation?.id, platformId:platform?.id, verticalId:vertical?.id })[0]?.vendor || null;

  const stackByLayer = { foundation, platform, vertical, tooling };
  return {
    picks: Object.fromEntries(Object.entries(stackByLayer).map(([layerId, vendor]) => [layerId, vendor?.id ?? null])),
    stack: LAYERS.map(layer => ({ layer, vendor:stackByLayer[layer.id] })).filter(item => item.vendor),
  };
}

/* ── CSS ──────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#0A0A0F;--bg2:#0F1118;--card:#13131A;--cardh:#171722;
  --a:#8B5CF6;--a2:#A78BFA;--a3:#06B6D4;--cy:#06B6D4;--a-rgb:139,92,246;--cy-rgb:6,182,212;
  --adim:rgba(139,92,246,0.12);--aglow:rgba(139,92,246,0.18);--cydim:rgba(6,182,212,0.12);
  --accentText:#A78BFA;
  --txt:#F1F0FF;--dim:#6B7280;--bdr:#1E1E2E;--g1:#8B5CF6;--g2:#06B6D4;
  --ok:#10B981;--okbg:rgba(16,185,129,0.12);--warn:#F59E0B;--warnbg:rgba(245,158,11,0.12);--err:#EF4444;--errbg:rgba(239,68,68,0.12);
  --shadow:rgba(0,0,0,0.42);--overlay:rgba(10,10,15,0.72);
}
[data-theme="light"]{
  --bg:#F8FAFC;--bg2:#F1F5F9;--card:#FFFFFF;--cardh:#FFFFFF;
  --a:#8B5CF6;--a2:#0F172A;--a3:#06B6D4;--cy:#06B6D4;--a-rgb:139,92,246;--cy-rgb:6,182,212;
  --adim:rgba(139,92,246,0.08);--aglow:rgba(139,92,246,0.12);--cydim:rgba(6,182,212,0.1);
  --accentText:#0F172A;
  --txt:#0F172A;--dim:#334155;--bdr:#E2E8F0;--g1:#8B5CF6;--g2:#06B6D4;
  --ok:#10B981;--okbg:rgba(16,185,129,0.1);--warn:#F59E0B;--warnbg:rgba(245,158,11,0.1);--err:#EF4444;--errbg:rgba(239,68,68,0.1);
  --shadow:rgba(15,23,42,0.1);--overlay:rgba(15,23,42,0.28);
}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--txt);font-size:21px;line-height:1.5}
.root{min-height:100vh;background:var(--bg);color:var(--txt);
  background-image:radial-gradient(ellipse 82% 50% at 12% 92%,rgba(var(--a-rgb),.12) 0%,transparent 60%),
    radial-gradient(ellipse 60% 42% at 88% 8%,rgba(var(--cy-rgb),.08) 0%,transparent 58%);
  color-scheme:dark;
}
[data-theme="light"].root{color-scheme:light}
[data-theme="light"].root{background-image:radial-gradient(ellipse 82% 50% at 12% 92%,rgba(var(--a-rgb),.08) 0%,transparent 60%),radial-gradient(ellipse 60% 42% at 88% 8%,rgba(var(--cy-rgb),.06) 0%,transparent 58%)}
.dots{background-image:radial-gradient(rgba(var(--a-rgb),.075) 1px,transparent 1px);background-size:22px 22px}
[data-theme="light"].dots{background-image:radial-gradient(rgba(var(--a-rgb),.08) 1px,transparent 1px)}

/* vendor node */
.vn{transition:all .25s cubic-bezier(.4,0,.2,1);cursor:pointer;border:1px solid var(--bdr);
  backdrop-filter:blur(12px);background:var(--card);position:relative;border-radius:12px;
  padding:12px 14px 12px 18px;display:flex;align-items:center;gap:12px;overflow:hidden;
  box-shadow:0 10px 24px var(--shadow);}
.vn::before{content:"";position:absolute;left:0;top:10px;bottom:10px;width:4px;border-radius:0 4px 4px 0;
  background:var(--layer-accent,var(--a));opacity:0;transform:scaleY(.7);transition:all .25s cubic-bezier(.4,0,.2,1)}
.vn:hover{transform:translateY(-2px);border-color:var(--a);background:var(--cardh);box-shadow:0 14px 32px var(--shadow)}
.vn:hover::before,.vn.glow::before,.vn.sel::before{opacity:.95;transform:scaleY(1)}
.vn.dim{opacity:.12;transform:scale(.9);filter:grayscale(.9);pointer-events:none}
.vn.glow{border-color:var(--a);box-shadow:0 0 0 1px var(--adim),0 14px 30px var(--shadow)}
.vn.sel{border-color:var(--a);background:linear-gradient(135deg,var(--cardh),var(--adim));box-shadow:0 0 0 1px var(--adim),0 14px 30px var(--shadow)}

/* stack node */
.sn{transition:all .25s cubic-bezier(.4,0,.2,1);cursor:pointer;
  border:1px dashed var(--bdr);background:var(--card);
  position:relative;border-radius:12px;padding:10px 12px;
  display:flex;align-items:center;gap:8px;box-shadow:0 10px 24px var(--shadow);}
.sn:hover{border-color:var(--a);background:var(--cardh);transform:translateY(-2px)}
.sn.pick{border-style:solid;border-color:var(--a);background:linear-gradient(135deg,var(--cardh),var(--adim));box-shadow:0 0 0 1px var(--adim),0 14px 28px var(--shadow)}

/* pills */
.pill{transition:all .2s ease;cursor:pointer;border:1px solid var(--bdr);
  font-family:'Outfit',sans-serif;background:var(--card);color:var(--txt);
  border-radius:999px;padding:12px 18px;font-size:20px;font-weight:500;
  display:inline-flex;align-items:center;gap:5px;white-space:nowrap;}
.pill:hover{border-color:var(--a);background:var(--cardh)}
.pill.on{background:linear-gradient(135deg,var(--g1),var(--g2));border-color:transparent;color:#fff;box-shadow:0 10px 22px var(--shadow)}

/* tabs */
.tab{transition:all .2s ease;cursor:pointer;border:none;font-family:'Outfit',sans-serif;
  background:var(--card);color:var(--dim);padding:13px 22px;font-size:21px;font-weight:600;
  border-radius:10px;display:flex;align-items:center;gap:6px;border:1px solid var(--bdr);}
.tab:hover{color:var(--txt);border-color:var(--a);background:var(--cardh)}
.tab.on{color:#fff;background:linear-gradient(135deg,var(--g1),var(--g2));border-color:transparent;box-shadow:0 12px 24px var(--shadow)}

/* buttons */
.cbtn{background:linear-gradient(135deg,var(--g1),var(--g2));transition:all .25s ease;
  font-family:'Outfit',sans-serif;border:none;border-radius:12px;padding:14px 24px;
  color:#fff;cursor:pointer;font-weight:700;font-size:21px;display:flex;align-items:center;gap:8px;}
.cbtn:hover{box-shadow:0 16px 28px var(--shadow);transform:translateY(-1px)}
.ghost{background:transparent;border:1px solid var(--bdr);border-radius:10px;padding:7px 13px;
  cursor:pointer;color:var(--dim);font-size:20px;font-family:'Outfit',sans-serif;
  display:flex;align-items:center;gap:5px;transition:all .2s;}
.ghost:hover{border-color:var(--a);color:var(--txt);background:var(--cardh)}

/* misc */
.chk{position:absolute;top:-7px;right:-7px;width:20px;height:20px;border-radius:50%;
  background:linear-gradient(135deg,var(--g1),var(--g2));display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px var(--shadow)}
.mb{height:6px;border-radius:3px;background:var(--adim);overflow:hidden;width:44px}
.mbf{height:100%;border-radius:3px;transition:width .7s cubic-bezier(.4,0,.2,1)}
.ns::-webkit-scrollbar{display:none}.ns{-ms-overflow-style:none;scrollbar-width:none}
.vendor-grid-5{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
@media (max-width:1680px){.vendor-grid-5{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (max-width:1320px){.vendor-grid-5{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:960px){.vendor-grid-5{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){.vendor-grid-5{grid-template-columns:1fr}}

@keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes si{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{opacity:.15}50%{opacity:.55}}
.au{animation:fu .4s cubic-bezier(.4,0,.2,1) both}
.ai{animation:fi .3s ease both}
.asi{animation:si .35s cubic-bezier(.4,0,.2,1) both}
.pls{animation:pulse 2.2s ease-in-out infinite}
`;

const IconMap = { Sparkles, Zap, Building2, Wrench };

/* ── VENDOR NODE ──────────────────────────────────────────────────────── */
function VendorNode({ vendor, isHighlighted, isDimmed, isSelected, onClick, delay=0, lang }) {
  const cls = ["vn", isDimmed&&"dim", isHighlighted&&!isDimmed&&"glow", isSelected&&"sel"].filter(Boolean).join(" ");
  const layerMeta = LAYERS.find(layer => layer.id===vendor.layer);
  const nodeRef = useRef(null);
  const timerRef = useRef(null);
  const [tooltipStyle, setTooltipStyle] = useState(null);
  const strengths = vf(vendor, "strengths", lang).slice(0, 2);
  const insight = vf(vendor, "insight", lang);
  const isTooltipVisible = !!tooltipStyle;

  const clearHoverTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const updateTooltipPosition = () => {
    if (!nodeRef.current) {
      setTooltipStyle(null);
      return;
    }
    setTooltipStyle(getVendorTooltipPosition(nodeRef.current.getBoundingClientRect()));
  };

  const hideTooltip = () => {
    clearHoverTimer();
    setTooltipStyle(null);
  };

  const handleMouseEnter = () => {
    if (isDimmed) return;
    clearHoverTimer();
    timerRef.current = window.setTimeout(updateTooltipPosition, 400);
  };

  useEffect(() => () => clearHoverTimer(), []);

  useEffect(() => {
    if (!isTooltipVisible) return undefined;
    const handleViewportChange = () => updateTooltipPosition();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isTooltipVisible]);

  return (
    <>
      <div
        ref={nodeRef}
        className={cls}
        onClick={() => { hideTooltip(); onClick(vendor); }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={hideTooltip}
        style={{ "--layer-accent":layerMeta?.color ?? "var(--a)", animationDelay:`${delay}ms`, minHeight:cx(68), padding:`${cx(12)}px ${cx(14)}px ${cx(12)}px ${cx(18)}px`, gap:cx(12) }}
      >
        {isSelected && <div className="chk"><Check size={11} color="white" strokeWidth={3}/></div>}
        <LogoBadge vendorId={vendor.id} size={cx(40)}/>
        <div style={{ minWidth:0, flex:1 }}>
          <div style={{ fontWeight:700, fontSize:cx(16), color:"var(--txt)", lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{vendor.name}</div>
          <div style={{ fontSize:cx(12), color:"var(--dim)", lineHeight:1.3 }}>{vendor.org}</div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          {vendor.priceFree && <div style={{ fontSize:cx(12), color:"var(--ok)", fontWeight:700, lineHeight:1.2 }}>{lang==="ko"?"무료":"Free"}</div>}
          {vendor.priceLabel && <div style={{ fontSize:cx(12), color:"var(--dim)", lineHeight:1.2 }}>{vendor.priceLabel}</div>}
        </div>
      </div>

      {isTooltipVisible && typeof document !== "undefined" && createPortal(
        <div
          className="ai"
          style={{
            position:"fixed",
            left:tooltipStyle.left,
            top:tooltipStyle.top,
            width:tooltipStyle.width,
            zIndex:40,
            pointerEvents:"none",
            borderRadius:14,
            border:"1px solid var(--bdr)",
            background:"linear-gradient(135deg,var(--bg2),var(--card))",
            boxShadow:"0 18px 44px var(--shadow)",
            backdropFilter:"blur(14px)",
            padding:ux(14),
          }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:ux(9), marginBottom:ux(10) }}>
            <LogoBadge vendorId={vendor.id} size={ux(28)}/>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:ux(13.5), fontWeight:800, color:"var(--txt)", lineHeight:1.2 }}>{vendor.name}</div>
              <div style={{ fontSize:ux(11), color:"var(--dim)", lineHeight:1.2 }}>{vendor.org}</div>
            </div>
          </div>

          <div style={{ fontSize:ux(10.5), color:"var(--accentText)", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginBottom:ux(5) }}>
            {lang==="ko"?"인사이트":"Insight"}
          </div>
          <p style={{
            fontSize:ux(12.5),
            color:"var(--txt)",
            lineHeight:1.45,
            marginBottom:ux(10),
            overflow:"hidden",
            display:"-webkit-box",
            WebkitLineClamp:2,
            WebkitBoxOrient:"vertical",
          }}>
            "{insight}"
          </p>

          <div style={{ fontSize:ux(10.5), color:"var(--accentText)", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginBottom:ux(6) }}>
            {lang==="ko"?"핵심 강점":"Top Strengths"}
          </div>
          <div style={{ display:"grid", gap:ux(5), marginBottom:ux(10) }}>
            {strengths.map((strength, index) => (
              <div key={`${vendor.id}-tip-${index}`} style={{ display:"flex", gap:ux(6), alignItems:"flex-start" }}>
                <span style={{ color:"var(--ok)", fontWeight:800, lineHeight:1.4 }}>•</span>
                <span style={{
                  fontSize:ux(12),
                  color:"var(--dim)",
                  lineHeight:1.5,
                  overflow:"hidden",
                  display:"-webkit-box",
                  WebkitLineClamp:1,
                  WebkitBoxOrient:"vertical",
                }}>
                  {strength}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:ux(10), borderTop:"1px solid var(--bdr)", paddingTop:ux(10) }}>
            <div style={{ fontSize:ux(11), color:"var(--dim)", fontWeight:600 }}>{lang==="ko"?"가격":"Price"}</div>
            <div style={{ fontSize:ux(11.5), color:vendor.priceFree ? "var(--ok)" : "var(--accentText)", fontWeight:700, textAlign:"right" }}>
              {getStackPriceText(vendor, lang)}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/* ── FLOW ARROW ───────────────────────────────────────────────────────── */
function FlowArrow() {
  return (
    <div style={{ display:"flex", justifyContent:"center", padding:"0" }}>
      <div className="pls" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
        <div style={{ width:2, height:8, background:"linear-gradient(to bottom,var(--a3),transparent)", borderRadius:1 }}/>
        <ChevronDown size={14} color="var(--a3)" style={{ opacity:.5 }}/>
      </div>
    </div>
  );
}

/* ── LAYER SECTION ────────────────────────────────────────────────────── */
function LayerSection({ layer, vendors, selectedUseCase, selectedIds, onVendorClick, index, lang, theme }) {
  const Icon = IconMap[layer.icon] || Layers;
  const label = lang==="ko" ? layer.labelKo : layer.label;
  const desc  = lang==="ko" ? layer.descKo  : layer.desc;
  const iconColor = theme==="light" ? (layer.colorLight || layer.color) : layer.color;
  return (
    <div className="au" style={{
      animationDelay:`${index*80}ms`, padding:"14px 18px", borderRadius:16,
      background:"linear-gradient(135deg,var(--card),var(--bg2))",
      border:"1px solid var(--bdr)", boxShadow:"0 18px 36px var(--shadow)",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:11 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:"var(--adim)", border:"1px solid var(--bdr)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon size={16} color={iconColor}/>
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:ux(18), color:"var(--txt)", lineHeight:1.15 }}>{label}</div>
          <div style={{ fontSize:ux(12), color:"var(--dim)" }}>{desc}</div>
        </div>
        <div style={{ marginLeft:"auto", fontSize:ux(12), color:"var(--dim)", background:"var(--bg2)", border:"1px solid var(--bdr)", padding:`${ux(4)}px ${ux(10)}px`, borderRadius:999, fontWeight:500 }}>
          {vendors.length} {lang==="ko"?"벤더":"vendors"}
        </div>
      </div>
      <div className="vendor-grid-5">
        {vendors.map((v,i) => {
          const rel = !selectedUseCase || v.useCases.includes(selectedUseCase);
          return <VendorNode key={v.id} vendor={v}
            isHighlighted={selectedUseCase && rel} isDimmed={selectedUseCase && !rel}
            isSelected={selectedIds.includes(v.id)} onClick={onVendorClick} delay={i*30} lang={lang}/>;
        })}
      </div>
    </div>
  );
}

/* ── COMPARE BAR (inline, top) ────────────────────────────────────────── */
function CompareBar({ selIds, vendors, onCompare, onClear, onRemove, lang }) {
  if (!selIds.length) return null;
  const selected = vendors.filter(v => selIds.includes(v.id));
  return (
    <div className="au" style={{ marginBottom:14, padding:"10px 14px", background:"var(--card)", borderRadius:13, border:"1px solid var(--bdr)", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
      <span style={{ fontSize:ux(12), fontWeight:700, color:"var(--dim)", whiteSpace:"nowrap" }}>
        {lang==="ko"?`${selIds.length}/6 선택됨`:`${selIds.length}/6 selected`}
      </span>
      <div style={{ display:"flex", gap:7, flex:1, flexWrap:"wrap" }}>
        {selected.map(v => (
          <div key={v.id} style={{ display:"flex", alignItems:"center", gap:5, background:"var(--adim)", borderRadius:8, padding:"4px 9px", border:"1px solid var(--bdr)" }}>
            <LogoBadge vendorId={v.id} size={ux(20)}/>
            <span style={{ fontSize:ux(12.5), fontWeight:600 }}>{v.name}</span>
            <button onClick={() => onRemove(v.id)} style={{ background:"none",border:"none",cursor:"pointer",padding:1,display:"flex",alignItems:"center" }}>
              <X size={12} color="var(--dim)"/>
            </button>
          </div>
        ))}
      </div>
      {selIds.length>=2 && (
        <button className="cbtn" onClick={onCompare} style={{ fontSize:ux(13), padding:`${ux(7)}px ${ux(16)}px` }}>
          <GitCompare size={13}/> {lang==="ko"?"비교":"Compare"} <ArrowRight size={13}/>
        </button>
      )}
      <button onClick={onClear} style={{ background:"none",border:"none",cursor:"pointer",padding:4 }}>
        <X size={15} color="var(--dim)"/>
      </button>
    </div>
  );
}

/* ── COMPARISON VIEW ──────────────────────────────────────────────────── */
function ComparisonView({ vendors, onBack, lang }) {
  const ml = lang==="ko" ? MLK : ML;
  const radarData = Object.keys(ml).map(k => { const e={metric:ml[k]}; vendors.forEach(v=>{e[v.id]=v.metrics[k]}); return e; });
  return (
    <div className="au" style={{ paddingBottom:40 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
        <button className="ghost" onClick={onBack}><RotateCcw size={13}/> {lang==="ko"?"뒤로":"Back"}</button>
        <span style={{ fontWeight:700, fontSize:ux(18) }}>{lang==="ko"?"벤더 비교":"Vendor Comparison"}</span>
        <span style={{ fontSize:ux(12.5), color:"var(--dim)" }}>— {vendors.length} {lang==="ko"?"선택됨":"selected"}</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(vendors.length,6)},1fr)`, gap:10, marginBottom:18 }}>
        {vendors.map((v,i) => (
          <div key={v.id} className="asi" style={{ animationDelay:`${i*70}ms`, background:"var(--card)", borderRadius:12, padding:16, borderLeft:`4px solid ${RC[i]}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
              <LogoBadge vendorId={v.id} size={38}/>
              <div><div style={{ fontWeight:700, fontSize:ux(14) }}>{v.name}</div><div style={{ fontSize:ux(11), color:"var(--dim)" }}>{v.org}</div></div>
            </div>
            <p style={{ fontSize:ux(12), color:"var(--dim)", lineHeight:1.6, fontStyle:"italic" }}>"{vf(v,"insight",lang)}"</p>
          </div>
        ))}
      </div>
      <div className="asi" style={{ animationDelay:"180ms", background:"var(--card)", borderRadius:14, padding:20, border:"1px solid var(--bdr)", marginBottom:18 }}>
        <div style={{ fontWeight:700, fontSize:ux(18), marginBottom:3 }}>{lang==="ko"?"역량 레이더":"Capability Radar"}</div>
        <div style={{ fontSize:ux(12), color:"var(--dim)", marginBottom:ux(14) }}>{lang==="ko"?"6축 다차원 비교":"6-axis multi-dimensional comparison"}</div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(139,92,246,.13)" gridType="polygon"/>
            <PolarAngleAxis dataKey="metric" tick={{ fill:"var(--dim)", fontSize:ux(12), fontFamily:"Outfit" }}/>
            {vendors.map((v,i) => <Radar key={v.id} dataKey={v.id} name={v.name} stroke={RC[i]} fill={RC[i]} fillOpacity={.08} strokeWidth={2} dot={{r:3,fill:RC[i]}}/>)}
          </RadarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", justifyContent:"center", gap:18, marginTop:6 }}>
          {vendors.map((v,i) => <div key={v.id} style={{ display:"flex", alignItems:"center", gap:ux(5) }}><div style={{ width:ux(9),height:ux(9),borderRadius:"50%",background:RC[i] }}/><span style={{ fontSize:ux(12), color:"var(--dim)" }}>{v.name}</span></div>)}
        </div>
      </div>
      <div className="asi" style={{ animationDelay:"260ms", background:"var(--card)", borderRadius:14, padding:20, border:"1px solid var(--bdr)" }}>
        <div style={{ fontWeight:700, fontSize:ux(18), marginBottom:ux(14) }}>{lang==="ko"?"메트릭 세부":"Metric Breakdown"}</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:ux(13) }}>
            <thead><tr style={{ borderBottom:"1px solid var(--bdr)" }}>
              <th style={{ textAlign:"left", padding:`${ux(8)}px ${ux(12)}px`, color:"var(--dim)", fontWeight:500, fontSize:ux(12) }}>{lang==="ko"?"메트릭":"Metric"}</th>
              {vendors.map((v,i) => <th key={v.id} style={{ textAlign:"center", padding:`${ux(8)}px ${ux(12)}px`, color:RC[i], fontWeight:700, fontSize:ux(12) }}>{v.name}</th>)}
            </tr></thead>
            <tbody>
              {Object.entries(ml).map(([k,lbl]) => (
                <tr key={k} style={{ borderBottom:"1px solid var(--bdr)" }}>
                  <td style={{ padding:`${ux(9)}px ${ux(12)}px`, fontWeight:600 }}>{lbl}</td>
                  {vendors.map((v,i) => { const val=v.metrics[k]; const mx=Math.max(...vendors.map(x=>x.metrics[k]));
                    return <td key={v.id} style={{ textAlign:"center", padding:`${ux(9)}px ${ux(12)}px` }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:ux(7) }}>
                        <div className="mb"><div className="mbf" style={{ width:`${val*10}%`, background:val===mx?RC[i]:`${RC[i]}55` }}/></div>
                        <span style={{ fontWeight:val===mx?700:400, color:val===mx?RC[i]:"var(--dim)", fontSize:ux(13) }}>{val}</span>
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

/* ── STACK BUILDER ────────────────────────────────────────────────────── */
function DecisionFlow({ onBuildStack }) {
  const lang = useLang();
  const [answers, setAnswers] = useState({ budget:null, sovereignty:null, useCase:null });
  const [openStep, setOpenStep] = useState(1);
  const maxOpenStep = answers.useCase ? 4 : answers.sovereignty ? 3 : answers.budget ? 2 : 1;

  useEffect(() => {
    if (openStep > maxOpenStep) setOpenStep(maxOpenStep);
  }, [maxOpenStep, openStep]);

  const selectedBudget = DECISION_BUDGETS.find(option => option.id===answers.budget) || null;
  const selectedSovereignty = DECISION_SOVEREIGNTY.find(option => option.id===answers.sovereignty) || null;
  const selectedUseCase = USE_CASES.find(option => option.id===answers.useCase) || null;
  const recommendation = useMemo(() => buildDecisionRecommendation(answers), [answers]);

  const stepLabels = [
    { id:1, label:lang==="ko"?"1. 예산":"1. Budget" },
    { id:2, label:lang==="ko"?"2. 데이터 주권":"2. Data sovereignty" },
    { id:3, label:lang==="ko"?"3. 주요 유즈케이스":"3. Primary use case" },
    { id:4, label:lang==="ko"?"4. 추천 결과":"4. Recommendation" },
  ];

  const resetFlow = () => {
    setAnswers({ budget:null, sovereignty:null, useCase:null });
    setOpenStep(1);
  };

  const handleBudget = id => {
    const hasUseCase = !!answers.useCase;
    setAnswers(prev => ({ ...prev, budget:id }));
    setOpenStep(hasUseCase ? 4 : 2);
  };

  const handleSovereignty = id => {
    const hasUseCase = !!answers.useCase;
    setAnswers(prev => ({ ...prev, sovereignty:id }));
    setOpenStep(hasUseCase ? 4 : 3);
  };

  const handleUseCase = id => {
    setAnswers(prev => ({ ...prev, useCase:id }));
    setOpenStep(4);
  };

  const summaryChips = [
    selectedBudget && { key:"budget", step:1, label:lang==="ko"?selectedBudget.labelKo:selectedBudget.label },
    selectedSovereignty && { key:"sovereignty", step:2, label:lang==="ko"?selectedSovereignty.labelKo:selectedSovereignty.label },
    selectedUseCase && { key:"useCase", step:3, label:`${selectedUseCase.emoji} ${lang==="ko"?selectedUseCase.labelKo:selectedUseCase.label}` },
  ].filter(Boolean);

  return (
    <div className="au">
      <div style={{ fontSize:ux(13.5), color:"var(--dim)", marginBottom:ux(14) }}>
        {lang==="ko"
          ?"세 가지 질문에 답하면 현재 고객 상황에 맞는 추천 AI 스택을 제안합니다."
          :"Answer three questions and get a recommended AI stack for the customer in front of you."}
      </div>

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
        {(answers.budget || answers.sovereignty || answers.useCase) && (
          <button className="ghost" onClick={resetFlow}><RotateCcw size={12}/> {lang==="ko"?"초기화":"Reset"}</button>
        )}
        {stepLabels.map(step => {
          const isAvailable = step.id <= maxOpenStep;
          return (
            <button
              key={step.id}
              className={`tab ${openStep===step.id ? "on" : ""}`}
              onClick={() => isAvailable && setOpenStep(step.id)}
              disabled={!isAvailable}
              style={{ opacity:isAvailable ? 1 : 0.45, cursor:isAvailable ? "pointer" : "not-allowed" }}
            >
              {step.label}
            </button>
          );
        })}
      </div>

      {summaryChips.length > 0 && (
        <div className="au" style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
          {summaryChips.map(chip => (
            <button key={chip.key} className="pill" onClick={() => setOpenStep(chip.step)}>
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {openStep===1 && (
        <div className="asi" style={{ background:"var(--card)", border:"1px solid var(--bdr)", borderRadius:18, padding:22 }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:ux(18), marginBottom:ux(5) }}>{lang==="ko"?"1단계. 예산 규모":"Step 1. Budget"}</div>
            <div style={{ color:"var(--dim)", fontSize:ux(13) }}>{lang==="ko"?"고객이 허용할 수 있는 연간 예산 범위를 선택하세요.":"Choose the annual budget range the customer is comfortable with."}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:10 }}>
            {DECISION_BUDGETS.map(option => {
              const selected = answers.budget===option.id;
              return (
                <button
                  key={option.id}
                  className={`pill ${selected ? "on" : ""}`}
                  onClick={() => handleBudget(option.id)}
                  style={{ minHeight:ux(128), borderRadius:18, padding:`${ux(18)}px ${ux(18)}px ${ux(16)}px`, display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"space-between", textAlign:"left", whiteSpace:"normal" }}
                >
                  <div style={{ fontWeight:800, fontSize:ux(15), lineHeight:1.35 }}>{lang==="ko" ? option.labelKo : option.label}</div>
                  <div style={{ fontSize:ux(12.5), color:selected ? "inherit" : "var(--dim)", lineHeight:1.55 }}>{lang==="ko" ? option.descKo : option.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {openStep===2 && (
        <div className="asi" style={{ background:"var(--card)", border:"1px solid var(--bdr)", borderRadius:18, padding:22 }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:ux(18), marginBottom:ux(5) }}>{lang==="ko"?"2단계. 데이터 주권":"Step 2. Data Sovereignty"}</div>
            <div style={{ color:"var(--dim)", fontSize:ux(13) }}>{lang==="ko"?"데이터를 퍼블릭 클라우드로 보낼 수 있는지, 프라이빗 통제가 필요한지 선택하세요.":"Choose whether public cloud is acceptable or private deployment is required."}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:10 }}>
            {DECISION_SOVEREIGNTY.map(option => {
              const selected = answers.sovereignty===option.id;
              return (
                <button
                  key={option.id}
                  className={`pill ${selected ? "on" : ""}`}
                  onClick={() => handleSovereignty(option.id)}
                  style={{ minHeight:ux(128), borderRadius:18, padding:`${ux(18)}px ${ux(18)}px ${ux(16)}px`, display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"space-between", textAlign:"left", whiteSpace:"normal" }}
                >
                  <div style={{ fontWeight:800, fontSize:ux(15), lineHeight:1.35 }}>{lang==="ko" ? option.labelKo : option.label}</div>
                  <div style={{ fontSize:ux(12.5), color:selected ? "inherit" : "var(--dim)", lineHeight:1.55 }}>{lang==="ko" ? option.descKo : option.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {openStep===3 && (
        <div className="asi" style={{ background:"var(--card)", border:"1px solid var(--bdr)", borderRadius:18, padding:22 }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:ux(18), marginBottom:ux(5) }}>{lang==="ko"?"3단계. 주요 유즈케이스":"Step 3. Primary Use Case"}</div>
            <div style={{ color:"var(--dim)", fontSize:ux(13) }}>{lang==="ko"?"가장 먼저 성과를 내야 하는 업무 시나리오를 선택하세요.":"Pick the business scenario that matters most for this customer."}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:10 }}>
            {USE_CASES.map(useCase => {
              const selected = answers.useCase===useCase.id;
              return (
                <button
                  key={useCase.id}
                  className={`pill ${selected ? "on" : ""}`}
                  onClick={() => handleUseCase(useCase.id)}
                  style={{ minHeight:ux(132), borderRadius:18, padding:ux(18), display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"space-between", textAlign:"left", whiteSpace:"normal" }}
                >
                  <div style={{ fontSize:ux(28), lineHeight:1 }}>{useCase.emoji}</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:ux(15), lineHeight:1.35, marginBottom:ux(4) }}>{lang==="ko" ? useCase.labelKo : useCase.label}</div>
                    <div style={{ fontSize:ux(12.5), color:selected ? "inherit" : "var(--dim)" }}>{lang==="ko"?"추천 스택을 이 시나리오 기준으로 맞춥니다.":"Tune the stack recommendation around this scenario."}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {openStep===4 && recommendation && (
        <div className="asi" style={{ background:"var(--card)", border:"1px solid var(--bdr)", borderRadius:18, padding:22 }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, marginBottom:18, flexWrap:"wrap" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <Shield size={18} color="var(--a2)"/>
                <span style={{ fontWeight:700, fontSize:ux(18) }}>{lang==="ko"?"추천 스택":"Recommended Stack"}</span>
              </div>
              <div style={{ color:"var(--dim)", fontSize:ux(13) }}>
                {lang==="ko"
                  ?"현재 선택한 예산, 데이터 주권, 유즈케이스를 기준으로 각 레이어별 최적 후보를 골랐습니다."
                  :"Based on your budget, sovereignty, and use case, here is the best-fit vendor in each layer."}
              </div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {summaryChips.map(chip => <span key={chip.key} className="pill">{chip.label}</span>)}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:12, marginBottom:18 }}>
            {recommendation.stack.map(({ layer, vendor }, index) => (
              <div key={layer.id} className="au" style={{ animationDelay:`${index*70}ms`, background:"var(--bg2)", border:"1px solid var(--bdr)", borderRadius:16, padding:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <div className="tab on" style={{ padding:"6px 10px", cursor:"default" }}>{lang==="ko" ? layer.labelKo : layer.label}</div>
                  <div style={{ marginLeft:"auto", fontSize:ux(12), color:"var(--dim)" }}>{getStackPriceText(vendor, lang)}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <LogoBadge vendorId={vendor.id} size={42}/>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontWeight:800, fontSize:ux(16), lineHeight:1.25 }}>{vendor.name}</div>
                    <div style={{ fontSize:ux(12), color:"var(--dim)" }}>{vendor.org}</div>
                  </div>
                </div>
                <div style={{ fontSize:ux(11), color:"var(--accentText)", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginBottom:ux(6) }}>
                  {lang==="ko"?"선정 이유":"Why it was chosen"}
                </div>
                <p style={{ fontSize:ux(13.5), lineHeight:1.65, color:"var(--dim)", fontStyle:"italic" }}>"{vf(vendor, "insight", lang)}"</p>
              </div>
            ))}
          </div>

          <div style={{ borderTop:"1px solid var(--bdr)", paddingTop:20, display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <button className="cbtn" onClick={() => onBuildStack(recommendation.picks)} style={{
              padding:`${ux(16)}px ${ux(44)}px`, fontSize:ux(17), borderRadius:16, gap:ux(10),
              border:"2px solid rgba(255,255,255,.45)",
              boxShadow:"0 8px 32px rgba(139,92,246,.4), 0 0 0 4px rgba(139,92,246,.25), 0 0 60px rgba(139,92,246,.15)",
              animation:"pulse 2.2s ease-in-out infinite",
            }}>
              <Boxes size={18}/> {lang==="ko"?"이 스택으로 빌드":"Build This Stack"} <ArrowRight size={16}/>
            </button>
            <button className="ghost" onClick={resetFlow} style={{ fontSize:ux(12) }}><RotateCcw size={12}/> {lang==="ko"?"초기화":"Reset"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── STACK BUILDER ────────────────────────────────────────────────────── */
function StackBuilder({ lang, theme, picks, setPicks, autoRevealKey }) {
  const [showResult, setShowResult] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const isLight = theme==="light";
  const pickCount = Object.values(picks).filter(Boolean).length;
  const handlePick = (lid, vid) => { setPicks(p => ({...p,[lid]:p[lid]===vid?null:vid})); setShowResult(false); setActivePreset(null); };
  const applyPreset = p => { setPicks({ ...p.picks }); setActivePreset(p.name); setShowResult(false); };
  const handleReset = () => { setPicks(makeEmptyStack()); setShowResult(false); setActivePreset(null); };
  const selectedVendors = LAYERS.map(l => ({ layer:l, vendor:V.find(v => v.id===picks[l.id]) })).filter(x => x.vendor);

  useEffect(() => {
    if (!autoRevealKey) return;
    setActivePreset(null);
    setShowResult(true);
  }, [autoRevealKey]);

  const avgMetrics = useMemo(() => {
    if (!selectedVendors.length) return null;
    const ml2 = lang==="ko"?MLK:ML;
    return Object.keys(ml2).map(k => ({ metric:ml2[k], value:+(selectedVendors.reduce((s,x)=>s+x.vendor.metrics[k],0)/selectedVendors.length).toFixed(1) }));
  }, [picks, lang]);

  const stackGrade = useMemo(() => {
    if (!avgMetrics) return null;
    const avg = avgMetrics.reduce((s,m)=>s+m.value,0)/avgMetrics.length;
    if (avg>=8.5) return {letter:"A+",color:"var(--ok)",bg:"var(--okbg)"}; if (avg>=7.5) return {letter:"A",color:"var(--ok)",bg:"var(--okbg)"};
    if (avg>=6.5) return {letter:"B+",color:"var(--warn)",bg:"var(--warnbg)"}; if (avg>=5.5) return {letter:"B",color:"var(--warn)",bg:"var(--warnbg)"};
    return {letter:"C",color:"var(--err)",bg:"var(--errbg)"};
  }, [avgMetrics]);

  // Top 3 strengths vs ecosystem average
  const stackHighlights = useMemo(() => {
    if (!avgMetrics) return [];
    const ml2 = lang==="ko"?MLK:ML;
    const ecoAvg = Object.keys(ml2).map(k => {
      const avg = V.reduce((s,v) => s+v.metrics[k], 0) / V.length;
      return { key:k, label:ml2[k], ecoAvg:+avg.toFixed(1) };
    });
    return avgMetrics
      .map((m,i) => ({ ...m, diff:+(m.value - ecoAvg[i].ecoAvg).toFixed(1), key:ecoAvg[i].key }))
      .sort((a,b) => b.diff - a.diff)
      .slice(0,3)
      .filter(x => x.diff > 0);
  }, [avgMetrics, lang]);

  // Cost summary
  const costSummary = useMemo(() => {
    const freeItems = selectedVendors.filter(x => x.vendor.priceFree);
    const paidItems = selectedVendors.filter(x => !x.vendor.priceFree);
    const annualTotal = selectedVendors.reduce((sum, { vendor }) => sum + getVendorAnnualEstimate(vendor.id), 0);
    return { freeCount:freeItems.length, paidCount:paidItems.length, items:selectedVendors, annualTotal };
  }, [selectedVendors]);

  return (
    <div className="au">
      <div style={{ fontSize:ux(13.5), color:"var(--dim)", marginBottom:ux(14) }}>
        {lang==="ko"?"각 레이어에서 벤더를 하나씩 선택해 추천 AI 스택을 구성하세요.":"Build your recommended AI stack by selecting one vendor from each layer."}
      </div>

      {/* Presets */}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:ux(11), color:"var(--dim)", marginBottom:ux(8), fontWeight:700, textTransform:"uppercase", letterSpacing:.8 }}>{lang==="ko"?"빠른 프리셋":"Quick Presets"}</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {pickCount>0 && <button className="pill" onClick={handleReset} style={{ color:"var(--dim)" }}><RotateCcw size={11}/> {lang==="ko"?"초기화":"Reset"}</button>}
          {STACK_PRESETS.map(p => (
            <button key={p.name} className={`pill ${activePreset===p.name?"on":""}`} onClick={() => applyPreset(p)}>
              <Star size={12}/> {lang==="ko"?p.nameKo:p.name}
              <span style={{ fontSize:ux(11), opacity:.65 }}>— {lang==="ko"?p.descKo:p.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Total cost bar */}
      {pickCount > 0 && (
        <div className="asi" style={{ marginBottom:18, padding:`${ux(14)}px ${ux(20)}px`, borderRadius:13, background:"linear-gradient(135deg,rgba(139,92,246,.12),rgba(99,102,241,.06))", border:"1px solid rgba(139,92,246,.22)" }}>
          <div style={{ fontSize:ux(11), color:"var(--accentText)", fontWeight:700, textTransform:"uppercase", letterSpacing:.9, marginBottom:ux(10) }}>
            <DollarSign size={ux(11)} style={{ display:"inline", verticalAlign:"middle" }}/> {lang==="ko"?"예상 월 비용 구성":"Estimated Monthly Cost Breakdown"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, alignItems:"start" }}>
            {/* Left: vendor cost cards */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {costSummary.items.map(({layer,vendor}) => (
                <div key={layer.id} style={{ display:"flex", alignItems:"center", gap:ux(10), background:"var(--card)", border:"1px solid var(--bdr)", borderRadius:12, padding:`${ux(12)}px ${ux(14)}px`, minHeight:ux(68), boxShadow:"0 10px 24px var(--shadow)" }}>
                  <LogoBadge vendorId={vendor.id} size={ux(32)}/>
                  <div>
                    <div style={{ fontSize:ux(11.5), fontWeight:600, lineHeight:1.2 }}>{vendor.name}</div>
                    <div style={{ fontSize:ux(11), color: vendor.priceFree ? "var(--ok)" : "var(--accentText)", fontWeight:700, lineHeight:1.25 }}>
                      {getStackPriceText(vendor, lang)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Center: stack combination summary */}
            <div style={{ background:"var(--card)", border:"1px solid var(--bdr)", borderRadius:16, padding:`${ux(16)}px ${ux(18)}px`, boxShadow:"0 10px 24px var(--shadow)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:ux(12) }}>
                <MessageSquareQuote size={ux(14)} color="var(--a2)"/>
                <span style={{ fontWeight:700, fontSize:ux(12.5), color:"var(--accentText)", textTransform:"uppercase", letterSpacing:.8 }}>
                  {lang==="ko"?"스택 조합 요약":"Stack Summary"}
                </span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:ux(8) }}>
                <p style={{ fontSize:ux(12.5), color:"var(--txt)", lineHeight:1.6 }}>
                  {lang==="ko"
                    ? `${selectedVendors.map(x => x.vendor.name).join(" + ")} 조합으로 ${selectedVendors.length}개 레이어를 구성합니다.`
                    : `${selectedVendors.map(x => x.vendor.name).join(" + ")} covering ${selectedVendors.length} layers.`}
                </p>
                {selectedVendors.map(({layer, vendor}) => (
                  <div key={layer.id} style={{ display:"flex", alignItems:"center", gap:ux(6) }}>
                    <div style={{ width:ux(6), height:ux(6), borderRadius:"50%", background:layer.gradient, flexShrink:0 }}/>
                    <span style={{ fontSize:ux(11), color:"var(--dim)", lineHeight:1.3 }}>
                      <strong style={{ color:"var(--txt)", fontWeight:700 }}>{lang==="ko"?layer.labelKo:layer.label}</strong> — {vendor.name} ({vendor.priceFree ? (lang==="ko"?"무료":"Free") : vendor.priceLabel})
                    </span>
                  </div>
                ))}
                <div style={{ borderTop:"1px solid var(--bdr)", paddingTop:ux(8), marginTop:ux(4) }}>
                  <p style={{ fontSize:ux(11.5), color:"var(--dim)", lineHeight:1.55, fontStyle:"italic" }}>
                    {lang==="ko"
                      ? `무료 컴포넌트 ${costSummary.freeCount}개 포함. ${costSummary.paidCount > 0 ? `유료 ${costSummary.paidCount}개 구성으로 ` : ""}비용 효율적인 스택입니다.`
                      : `Includes ${costSummary.freeCount} free component${costSummary.freeCount!==1?"s":""}. ${costSummary.paidCount > 0 ? `${costSummary.paidCount} paid tier${costSummary.paidCount!==1?"s":""} for a ` : "A "}cost-efficient stack.`}
                  </p>
                </div>
              </div>
            </div>
            {/* Right: annual total + free count */}
            <div style={{ display:"flex", flexDirection:"column", gap:ux(10) }}>
              <div style={{ padding:`${ux(16)}px ${ux(18)}px`, borderRadius:18, border:"1px solid var(--ok)", background:"linear-gradient(135deg,var(--okbg),rgba(6,182,212,0.08))" }}>
                <div style={{ fontSize:ux(11), color:"var(--dim)", fontWeight:700, marginBottom:ux(6) }}>
                  {lang==="ko"?"예상 연간 총비용":"Estimated Annual Total"}
                </div>
                <div style={{ fontSize:ux(24), fontWeight:900, color:"var(--ok)", lineHeight:1.1 }}>
                  {formatAnnualEstimate(costSummary.annualTotal, lang)}
                </div>
              </div>
              <div style={{ textAlign:"right", padding:`0 ${ux(4)}px` }}>
                <div style={{ fontSize:ux(11), color:"var(--dim)" }}>{lang==="ko"?"무료 컴포넌트":"Free components"}</div>
                <div style={{ fontSize:ux(24), fontWeight:900, color:"var(--ok)", lineHeight:1.1 }}>{costSummary.freeCount}</div>
                <div style={{ fontSize:ux(11), color:"var(--dim)" }}>/ {pickCount} {lang==="ko"?"레이어":"layers"}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layer pickers */}
      {LAYERS.map((layer,idx) => {
        const Icon = IconMap[layer.icon]||Layers;
        const lv = V.filter(v => v.layer===layer.id);
        const lbl = lang==="ko"?layer.labelKo:layer.label;
        return (
          <div key={layer.id}>
            <div className="au" style={{ animationDelay:`${idx*70}ms` }}>
              <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
                <div style={{ width:ux(30),height:ux(30),borderRadius:8,background:layer.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:ux(13),fontWeight:800,color:"#fff",boxShadow:`0 0 12px ${layer.color}44`,flexShrink:0 }}>{layer.step}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:ux(14), color:isLight ? "var(--txt)" : layer.color }}>{lbl}</div>
                  <div style={{ fontSize:ux(11), color:"var(--dim)" }}>{lang==="ko"?"벤더 하나 선택":"Select one vendor"}</div>
                </div>
                {picks[layer.id] && (
                  <div className="asi" style={{ display:"flex", alignItems:"center", gap:ux(5), background:"var(--okbg)", padding:`${ux(4)}px ${ux(9)}px`, borderRadius:6 }}>
                    <Check size={ux(11)} color="var(--ok)"/><span style={{ fontSize:ux(11.5), color:"var(--ok)", fontWeight:700 }}>{V.find(v=>v.id===picks[layer.id])?.name}</span>
                  </div>
                )}
              </div>
              <div className="vendor-grid-5">
                {lv.map(v => (
                  <div key={v.id} className={`sn ${picks[layer.id]===v.id?"pick":""}`} onClick={() => handlePick(layer.id,v.id)}>
                    {picks[layer.id]===v.id && <div className="chk" style={{ width:18,height:18 }}><Check size={10} color="white" strokeWidth={3}/></div>}
                    <LogoBadge vendorId={v.id} size={cx(36)}/>
                    <div style={{ minWidth:0, flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:cx(13), color:"var(--txt)", lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v.name}</div>
                      <div style={{ fontSize:cx(11), color:"var(--dim)" }}>
                        {v.priceFree ? <span style={{ color:"var(--ok)" }}>{lang==="ko"?"무료":"Free"}</span> : ""}
                        {v.priceFree && v.priceLabel ? " · " : ""}
                        {v.priceLabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {idx < LAYERS.length-1 && <div style={{ display:"flex", justifyContent:"center", padding:"4px 0" }}><div className="pls"><ChevronDown size={13} color="var(--a)" style={{ opacity:.35 }}/></div></div>}
          </div>
        );
      })}

      {pickCount>=2 && !showResult && (
        <div className="au" style={{ display:"flex", justifyContent:"center", marginTop:22 }}>
          <button className="cbtn" onClick={() => setShowResult(true)} style={{ padding:`${ux(12)}px ${ux(32)}px`, fontSize:ux(14.5), borderRadius:12, gap:ux(8) }}>
            <Boxes size={16}/> {lang==="ko"?`스택 빌드 (${pickCount}/4)`:`Build My Stack (${pickCount}/4)`} <ArrowRight size={15}/>
          </button>
        </div>
      )}

      {/* RESULT */}
      {showResult && (
        <div className="asi" style={{ marginTop:22 }}>
          <div style={{ background:"linear-gradient(135deg,rgba(124,58,237,.08),rgba(99,102,241,.03))", border:"1px solid rgba(139,92,246,.2)", borderRadius:16, padding:22 }}>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <Shield size={20} color="var(--a2)"/>
                <div>
                  <div style={{ fontWeight:700, fontSize:ux(18) }}>{lang==="ko"?"나의 추천 스택":"My Recommended Stack"}</div>
                  <div style={{ fontSize:ux(12), color:"var(--dim)" }}>{selectedVendors.length} {lang==="ko"?"레이어 구성됨":"layers configured"}</div>
                </div>
                {stackGrade && (
                  <div style={{ background:stackGrade.bg, border:`1px solid ${stackGrade.color}`, borderRadius:12, padding:`${ux(6)}px ${ux(12)}px`, display:"flex", alignItems:"center", gap:ux(10) }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <span style={{ fontWeight:900, fontSize:ux(22), color:stackGrade.color }}>{stackGrade.letter}</span>
                      <span style={{ fontSize:ux(11), color:"var(--dim)" }}>{lang==="ko"?"점수":"Score"}</span>
                    </div>
                    <div style={{ width:1, alignSelf:"stretch", background:`${stackGrade.color}33` }}/>
                    <div style={{ display:"flex", flexDirection:"column", gap:ux(2) }}>
                      <span style={{ fontSize:ux(10.5), color:"var(--dim)", fontWeight:600 }}>
                        {lang==="ko"?"예상 연간 총비용":"Est. annual total"}
                      </span>
                      <span style={{ fontSize:ux(12.5), color:stackGrade.color, fontWeight:800 }}>
                        {formatAnnualEstimate(costSummary.annualTotal, lang)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <button className="ghost" onClick={handleReset}><RotateCcw size={11}/> {lang==="ko"?"초기화":"Reset"}</button>
            </div>

            {/* TOP: Stack list (left) + Radar (right) */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              {/* Left: stack list */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {selectedVendors.map(({layer,vendor},i) => (
                  <div key={layer.id} className="au" style={{ animationDelay:`${i*80}ms` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, background:"var(--card)", borderRadius:11, padding:"10px 14px", border:`1px solid ${layer.color}22` }}>
                      <div style={{ width:ux(26),height:ux(26),borderRadius:6,background:layer.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:ux(12),fontWeight:800,color:"#fff",flexShrink:0 }}>{layer.step}</div>
                      <LogoBadge vendorId={vendor.id} size={ux(34)}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:ux(10.5), color:isLight ? "var(--txt)" : layer.color, fontWeight:700, textTransform:"uppercase", letterSpacing:.4 }}>{lang==="ko"?layer.labelKo:layer.label}</div>
                        <div style={{ fontWeight:700, fontSize:ux(14), color:"var(--txt)", lineHeight:1.2 }}>{vendor.name}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        {vendor.priceFree && <div style={{ fontSize:ux(11), color:"var(--ok)", fontWeight:700 }}>{lang==="ko"?"무료":"Free"}</div>}
                        <div style={{ fontSize:ux(11), color:"var(--dim)" }}>{vendor.priceLabel}</div>
                      </div>
                    </div>
                    {i<selectedVendors.length-1 && <div style={{ display:"flex", justifyContent:"center", padding:"1px 0" }}><ChevronDown size={12} color="var(--a)" style={{ opacity:.25 }}/></div>}
                  </div>
                ))}
              </div>
              {/* Right: hexagonal radar + highlights */}
              {avgMetrics && (
                <div style={{ background:"var(--card)", borderRadius:13, padding:`${ux(10)}px ${ux(8)}px`, display:"flex", flexDirection:"column" }}>
                  <div style={{ fontSize:ux(12.5), fontWeight:700, padding:`0 ${ux(8)}px ${ux(2)}px`, color:"var(--dim)" }}>{lang==="ko"?"스택 프로필":"Stack Profile"}</div>
                  <div style={{ flex:1, minHeight:0 }}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                      <RadarChart data={avgMetrics} cx="50%" cy="50%" outerRadius="78%">
                        <PolarGrid stroke="rgba(139,92,246,.18)" gridType="polygon"/>
                        <PolarAngleAxis dataKey="metric" tick={{ fill:"var(--dim)", fontSize:ux(11) }}/>
                        <Radar dataKey="value" stroke="var(--a)" fill="var(--a)" fillOpacity={.22} strokeWidth={2} dot={{ r:3, fill:"var(--a)" }}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  {stackHighlights.length > 0 && (
                    <div style={{ padding:`${ux(8)}px ${ux(10)}px 0`, borderTop:"1px solid var(--bdr)", marginTop:ux(4) }}>
                      <div style={{ fontSize:ux(10), color:"var(--accentText)", fontWeight:700, textTransform:"uppercase", letterSpacing:.8, marginBottom:ux(6) }}>
                        {lang==="ko"?"다른 조합 대비 강점":"Strengths vs Avg"}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:ux(5) }}>
                        {stackHighlights.map(h => (
                          <div key={h.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:ux(8) }}>
                            <span style={{ fontSize:ux(11.5), color:"var(--txt)", fontWeight:600 }}>{h.metric}</span>
                            <div style={{ display:"flex", alignItems:"center", gap:ux(5) }}>
                              <span style={{ fontSize:ux(12), fontWeight:800, color:"var(--ok)" }}>{h.value}</span>
                              <span style={{ fontSize:ux(10), fontWeight:700, color:"var(--ok)", background:"var(--okbg)", padding:`${ux(2)}px ${ux(6)}px`, borderRadius:6 }}>+{h.diff}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BOTTOM: Stack Analysis full width */}
            <div style={{ borderTop:"1px solid var(--bdr)", paddingTop:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
                <MessageSquareQuote size={14} color="var(--a2)"/>
                <span style={{ fontWeight:700, fontSize:ux(12), color:"var(--accentText)", textTransform:"uppercase", letterSpacing:.9 }}>{lang==="ko"?"스택 분석":"Stack Analysis"}</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
                {selectedVendors.map(({layer,vendor}) => (
                  <div key={layer.id} style={{ background:"var(--card)", borderRadius:11, padding:14, border:`1px solid ${layer.color}22` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                      <LogoBadge vendorId={vendor.id} size={ux(28)}/>
                      <div>
                        <div style={{ fontSize:ux(10), color:isLight ? "var(--txt)" : layer.color, fontWeight:700, textTransform:"uppercase", letterSpacing:.4 }}>{lang==="ko"?layer.labelKo:layer.label}</div>
                        <div style={{ fontWeight:700, fontSize:ux(13), color:"var(--txt)" }}>{vendor.name}</div>
                      </div>
                    </div>
                    <p style={{ fontSize:ux(12.5), lineHeight:1.65, color:"var(--dim)", fontStyle:"italic" }}>"{vf(vendor,"insight",lang)}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ECOSYSTEM ASSESSMENT ─────────────────────────────────────────────── */
function EcosystemAssessment({ lang, theme }) {
  const totalVendors = V.length;
  const totalLayers = LAYERS.length;
  const freeCount = V.filter(v => v.priceFree).length;
  const paidCount = totalVendors - freeCount;
  const avgMetrics = Object.keys(ML).map(k => {
    const avg = V.reduce((s, v) => s + v.metrics[k], 0) / totalVendors;
    return { key: k, label: lang === "ko" ? MLK[k] : ML[k], value: +avg.toFixed(1) };
  });
  const topPerf = [...V].sort((a, b) => b.metrics.performance - a.metrics.performance).slice(0, 3);
  const topCost = [...V].sort((a, b) => b.metrics.cost - a.metrics.cost).slice(0, 3);
  const topEnterprise = [...V].sort((a, b) => b.metrics.enterprise - a.metrics.enterprise).slice(0, 3);

  const sections = [
    {
      icon: "📊",
      title: lang === "ko" ? "생태계 개요" : "Ecosystem Overview",
      content: lang === "ko"
        ? `${totalLayers}개 레이어에 걸쳐 ${totalVendors}개 벤더를 추적하고 있으며, 무료 ${freeCount}개 / 유료 ${paidCount}개로 구성됩니다. Foundation 모델에서 Tooling까지 엔터프라이즈 AI 스택의 전체 범위를 커버합니다.`
        : `Tracking ${totalVendors} vendors across ${totalLayers} layers — ${freeCount} free-tier, ${paidCount} paid. Covers the full range from Foundation Models to Tooling & Infra for enterprise AI stacks.`,
    },
    {
      icon: "🏆",
      title: lang === "ko" ? "성능 리더" : "Performance Leaders",
      content: lang === "ko"
        ? `최고 성능: ${topPerf.map(v => `${v.name} (${v.metrics.performance}/10)`).join(", ")}. 이 벤더들은 벤치마크와 실제 워크로드에서 일관되게 높은 점수를 기록합니다.`
        : `Top performers: ${topPerf.map(v => `${v.name} (${v.metrics.performance}/10)`).join(", ")}. These vendors consistently score highest on benchmarks and real-world workloads.`,
    },
    {
      icon: "💰",
      title: lang === "ko" ? "비용 효율 최적" : "Best Cost Efficiency",
      content: lang === "ko"
        ? `비용 효율 상위: ${topCost.map(v => `${v.name} (${v.metrics.cost}/10)`).join(", ")}. 오픈소스와 프리티어 옵션이 초기 도입 비용을 크게 절감해줍니다.`
        : `Most cost-efficient: ${topCost.map(v => `${v.name} (${v.metrics.cost}/10)`).join(", ")}. Open-source and free-tier options significantly reduce initial adoption costs.`,
    },
    {
      icon: "🏢",
      title: lang === "ko" ? "엔터프라이즈 적합도" : "Enterprise Readiness",
      content: lang === "ko"
        ? `엔터프라이즈 준비도 상위: ${topEnterprise.map(v => `${v.name} (${v.metrics.enterprise}/10)`).join(", ")}. 보안, 규정 준수, SLA 측면에서 기업 환경에 가장 적합합니다.`
        : `Enterprise-ready leaders: ${topEnterprise.map(v => `${v.name} (${v.metrics.enterprise}/10)`).join(", ")}. Best suited for corporate environments requiring security, compliance, and SLAs.`,
    },
    {
      icon: "🔑",
      title: lang === "ko" ? "핵심 인사이트" : "Key Insights",
      content: lang === "ko"
        ? "GPT-4o와 Claude가 범용 성능을 주도하고, Llama/Mistral이 데이터 주권 시나리오를 커버합니다. Azure와 AWS Bedrock이 플랫폼 계층을 양분하며, LangChain/Pinecone이 툴링 생태계의 핵심축입니다."
        : "GPT-4o and Claude lead general-purpose performance while Llama/Mistral cover data sovereignty scenarios. Azure and AWS Bedrock dominate the platform layer, with LangChain/Pinecone anchoring the tooling ecosystem.",
    },
  ];

  return (
    <div className="asi" style={{
      marginBottom: 18,
      background: "linear-gradient(135deg,var(--card),var(--bg2))",
      border: "1px solid var(--bdr)",
      borderRadius: 18,
      padding: "22px 24px",
      boxShadow: "0 18px 36px var(--shadow)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,var(--g1),var(--g2))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 8px 20px var(--shadow)" }}>
          <Star size={18} color="white"/>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: ux(20), color: "var(--txt)", lineHeight: 1.15 }}>
            {lang === "ko" ? "AI 벤더 생태계 평가 요약" : "AI Vendor Ecosystem Assessment"}
          </div>
          <div style={{ fontSize: ux(12.5), color: "var(--dim)" }}>
            {lang === "ko" ? `${totalVendors}개 벤더 · ${USE_CASES.length}개 유즈케이스 기준 종합 분석` : `Comprehensive analysis across ${totalVendors} vendors · ${USE_CASES.length} use cases`}
          </div>
        </div>
      </div>

      {/* Metric averages bar */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {avgMetrics.map(m => (
          <div key={m.key} style={{
            flex: "1 1 140px", minWidth: 130,
            background: "var(--card)", border: "1px solid var(--bdr)", borderRadius: 12,
            padding: `${ux(10)}px ${ux(14)}px`,
            display: "flex", alignItems: "center", gap: ux(10),
          }}>
            <div style={{ fontSize: ux(20), fontWeight: 900, color: m.value >= 7.5 ? "var(--ok)" : m.value >= 6 ? "var(--warn)" : "var(--err)", lineHeight: 1 }}>
              {m.value}
            </div>
            <div>
              <div style={{ fontSize: ux(11), fontWeight: 700, color: "var(--txt)", lineHeight: 1.2 }}>{m.label}</div>
              <div style={{ fontSize: ux(10), color: "var(--dim)", lineHeight: 1.2 }}>{lang === "ko" ? "평균" : "avg"} /10</div>
            </div>
          </div>
        ))}
      </div>

      {/* Insight cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
        {sections.map((s, i) => (
          <div key={i} style={{
            background: "var(--card)", border: "1px solid var(--bdr)", borderRadius: 13,
            padding: `${ux(14)}px ${ux(16)}px`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ux(8) }}>
              <span style={{ fontSize: ux(18) }}>{s.icon}</span>
              <span style={{ fontWeight: 700, fontSize: ux(13.5), color: "var(--txt)" }}>{s.title}</span>
            </div>
            <p style={{ fontSize: ux(12.5), color: "var(--dim)", lineHeight: 1.65 }}>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── APP ──────────────────────────────────────────────────────────────── */
export default function App() {
  const [theme, setTheme] = useState("light");
  const [lang,  setLang]  = useState("en");
  const [tab,   setTab]   = useState("explore");
  const [uc,    setUc]    = useState(null);
  const [selIds,setSelIds]= useState([]);
  const [view,  setView]  = useState("map");
  const [stackPicks, setStackPicks] = useState(makeEmptyStack);
  const [stackAutoRevealKey, setStackAutoRevealKey] = useState(0);

  const handleVendorClick = v => {
    if (!selIds.includes(v.id) && selIds.length < 6) setSelIds(p => [...p, v.id]);
    else if (selIds.includes(v.id)) setSelIds(p => p.filter(x => x!==v.id));
  };
  const handleRemove = id => { setSelIds(p => p.filter(x => x!==id)); };
  const handleCompare = () => { if (selIds.length>=2) { setView("compare"); } };
  const handleBack = () => setView("map");
  const handleClear = () => { setSelIds([]); setView("map"); };
  const handleBuildStack = picks => {
    setStackPicks({ ...picks });
    setStackAutoRevealKey(key => key + 1);
    setTab("stack");
  };
  const selectedVendors = V.filter(v => selIds.includes(v.id));

  const L = {
    explore: lang==="ko"?"맵 탐색":"Explore Map",
    decision: lang==="ko"?"의사결정 플로우":"Decision Flow",
    stack:   lang==="ko"?"스택 빌더":"Stack Builder",
    clearAll:lang==="ko"?"초기화":"Reset",
    subtitle:lang==="ko"
      ?`${V.length}개 벤더 · ${LAYERS.length}개 레이어 · ${USE_CASES.length}개 유즈케이스 — 엔터프라이즈 AI 전략을 위한 인터랙티브 랜드스케이프`
      :`${V.length} vendors · ${LAYERS.length} layers · ${USE_CASES.length} use cases — Interactive landscape for enterprise AI strategy`,
  };

  return (
    <LangCtx.Provider value={lang}>
      <style>{CSS}</style>
      <div data-theme={theme} className="root dots" style={{ minHeight:"100vh" }}>

        {/* HEADER */}
        <div style={{ padding:"24px 40px 16px", borderBottom:"1px solid var(--bdr)", marginBottom:18 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:6 }}>
            <div style={{ width:46,height:46,borderRadius:13,background:"linear-gradient(135deg,var(--g1),var(--g2))",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 18px 34px var(--shadow)",border:"1px solid var(--bdr)",flexShrink:0,marginTop:3 }}>
              <Layers size={22} color="white"/>
            </div>
            <div style={{ flex:1 }}>
              <h1 style={{ fontWeight:800, fontSize:ux(28), color:"var(--txt)", letterSpacing:-.7, lineHeight:1.1 }}>
                {lang==="ko"?"AI 벤더 에코시스템 네비게이터":"AI Vendor Ecosystem Navigator"}
              </h1>
              {/* Prominent subtitle */}
              <div style={{ marginTop:ux(6), padding:`${ux(8)}px ${ux(14)}px`, borderRadius:12, display:"inline-flex", alignItems:"center", gap:ux(8), background:"linear-gradient(90deg,var(--adim),var(--cydim))", border:"1px solid var(--bdr)" }}>
                <span style={theme==="light"
                  ? { fontWeight:500, fontSize:ux(14), color:"var(--txt)", WebkitTextFillColor:"var(--txt)" }
                  : { fontWeight:500, fontSize:ux(14), background:"linear-gradient(90deg,var(--a2),var(--a3))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }
                }>{L.subtitle}</span>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
              <button className="pill" onClick={() => setTheme(t=>t==="dark"?"light":"dark")} style={{ fontWeight:700 }}>
                {theme==="dark" ? <Sun size={14}/> : <Moon size={14}/>}
                {lang==="ko"
                  ? (theme==="dark" ? "라이트 모드" : "다크 모드")
                  : (theme==="dark" ? "Light Mode" : "Dark Mode")}
              </button>
              <button className="pill" onClick={() => setLang(l=>l==="en"?"ko":"en")} style={{ fontWeight:700 }}>
                {lang==="en"?"🇰🇷 한국어":"🇺🇸 English"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:6, padding:"14px 0 0", marginLeft:60 }}>
            <button className={`tab ${tab==="explore"?"on":""}`} onClick={() => { setTab("explore"); setView("map"); }}><Layers size={14}/> {L.explore}</button>
            <button className={`tab ${tab==="decision"?"on":""}`} onClick={() => { setTab("decision"); }}><Shield size={14}/> {L.decision}</button>
            <button className={`tab ${tab==="stack"?"on":""}`} onClick={() => { setStackAutoRevealKey(0); setTab("stack"); }}><Boxes size={14}/> {L.stack}</button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding:"0 40px 80px" }}>
          {tab==="explore" && (
            <div key="explore">
              {/* Use case pills — Clear All leftmost */}
              <div className="au" style={{ display:"flex", gap:7, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
                {(uc || selIds.length>0) && (
                  <button className="pill" onClick={() => { setUc(null); handleClear(); }} style={{ color:"var(--dim)", borderStyle:"dashed" }}>
                    <RotateCcw size={11}/> {L.clearAll}
                  </button>
                )}
                {USE_CASES.map(u => (
                  <button key={u.id} className={`pill ${uc===u.id?"on":""}`} onClick={() => setUc(p=>p===u.id?null:u.id)}>
                    {u.emoji} {lang==="ko"?u.labelKo:u.label}
                  </button>
                ))}
              </div>

              {/* Compare bar above layers */}
              {view==="map" && (
                <CompareBar selIds={selIds} vendors={V} onCompare={handleCompare} onClear={handleClear} onRemove={handleRemove} lang={lang}/>
              )}

              {view==="map" ? (
                <div key="map">
                  <EcosystemAssessment lang={lang} theme={theme}/>
                  {LAYERS.map((l,i) => {
                    const lv = V.filter(v => v.layer===l.id);
                    return (
                      <div key={l.id} style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        <LayerSection layer={l} vendors={lv} selectedUseCase={uc} selectedIds={selIds} onVendorClick={handleVendorClick} index={i} lang={lang} theme={theme}/>
                        {i < LAYERS.length-1 && <FlowArrow/>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <ComparisonView vendors={selectedVendors} onBack={handleBack} lang={lang}/>
              )}
            </div>
          )}

          {tab==="decision" && <DecisionFlow key="decision" onBuildStack={handleBuildStack}/>}

          {tab==="stack" && <StackBuilder key="stack" lang={lang} theme={theme} picks={stackPicks} setPicks={setStackPicks} autoRevealKey={stackAutoRevealKey}/>}
        </div>
      </div>
    </LangCtx.Provider>
  );
}
