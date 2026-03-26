import { useState, useMemo, createContext, useContext } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { X, GitCompare, Layers, Sparkles, Zap, Building2, Wrench, ChevronDown, ArrowRight, Check, RotateCcw, MessageSquareQuote, Boxes, Shield, Star, Sun, Moon } from "lucide-react";

const LangCtx = createContext("en");
const useLang = () => useContext(LangCtx);

/* ── DATA ───────────────────────────────────────────────────────────────── */

const LAYERS = [
  { id: "foundation", label: "Foundation Models",      labelKo: "파운데이션 모델",    icon: "Sparkles", color: "#8B5CF6", gradient: "linear-gradient(135deg,#7C3AED,#6D28D9)", desc: "Core LLMs powering the AI ecosystem",           descKo: "AI 생태계를 구동하는 핵심 LLM", step: "1" },
  { id: "platform",   label: "AI Platforms",           labelKo: "AI 플랫폼",          icon: "Zap",      color: "#6366F1", gradient: "linear-gradient(135deg,#6366F1,#4F46E5)", desc: "Cloud infrastructure & model serving",          descKo: "클라우드 인프라 & 모델 서빙",   step: "2" },
  { id: "vertical",  label: "Enterprise AI Apps",      labelKo: "엔터프라이즈 AI 앱", icon: "Building2",color: "#A78BFA", gradient: "linear-gradient(135deg,#A78BFA,#8B5CF6)", desc: "Industry-specific AI solutions",                descKo: "산업별 특화 AI 솔루션",         step: "3" },
  { id: "tooling",   label: "Tooling & Infrastructure",labelKo: "툴링 & 인프라",      icon: "Wrench",   color: "#C4B5FD", gradient: "linear-gradient(135deg,#C4B5FD,#A78BFA)", desc: "Developer tools & data infrastructure",         descKo: "개발 도구 & 데이터 인프라",     step: "4" },
];

const USE_CASES = [
  { id: "customer-service", label: "Customer Service",      labelKo: "고객 서비스",       emoji: "🎧" },
  { id: "doc-intel",        label: "Document Intelligence", labelKo: "문서 인텔리전스",   emoji: "📄" },
  { id: "code-assist",      label: "Code Assistant",        labelKo: "코드 어시스턴트",   emoji: "💻" },
  { id: "sales-intel",      label: "Sales Intelligence",    labelKo: "세일즈 인텔리전스", emoji: "📊" },
  { id: "content-gen",      label: "Content Generation",    labelKo: "콘텐츠 생성",       emoji: "✍️" },
  { id: "data-analytics",   label: "Data & Analytics",      labelKo: "데이터 & 분석",     emoji: "🔬" },
];

const METRIC_LABELS    = { performance:"Performance",  integration:"Integration",  cost:"Cost Efficiency",   enterprise:"Enterprise Ready", scalability:"Scalability",  community:"Community" };
const METRIC_LABELS_KO = { performance:"성능",         integration:"연동성",       cost:"비용 효율",         enterprise:"엔터프라이즈 준비",scalability:"확장성",      community:"커뮤니티" };
const RADAR_COLORS = ["#8B5CF6","#F59E0B","#10B981","#F43F5E"];

const VENDORS = [
  { id:"gpt4o",    name:"GPT-4o",             org:"OpenAI",          emoji:"🟢", layer:"foundation", useCases:["customer-service","doc-intel","code-assist","sales-intel","content-gen","data-analytics"], pricing:"Pay-per-token",       bestFit:"Enterprise & Startup",         strengths:["Broadest ecosystem & plugin support","Strongest general reasoning","Multimodal (text, image, audio)"],                                         limitations:["Highest cost at scale","Data privacy concerns for regulated industries","Rate limits on peak usage"],                                       insight:"Market leader with broadest ecosystem. Best for enterprises already invested in Microsoft stack. Watch for cost escalation at scale.",          metrics:{performance:9,integration:8,cost:5,enterprise:8,scalability:9,community:10} },
  { id:"claude35", name:"Claude 3.5 Sonnet",  org:"Anthropic",       emoji:"🟣", layer:"foundation", useCases:["customer-service","doc-intel","code-assist","content-gen"],                               pricing:"Pay-per-token",       bestFit:"Enterprise (regulated)",       strengths:["200K context window — best for long documents","Constitutional AI safety framework","Superior instruction following"],                         limitations:["Smaller plugin ecosystem than GPT","No native image generation","Fewer fine-tuning options"],                                             insight:"Strongest in safety-critical & regulated industries. 200K context window is a game-changer for document-heavy workflows.",                      metrics:{performance:9,integration:7,cost:6,enterprise:9,scalability:8,community:7} },
  { id:"gemini",   name:"Gemini 1.5 Pro",     org:"Google",          emoji:"🔵", layer:"foundation", useCases:["doc-intel","data-analytics","content-gen","customer-service"],                           pricing:"Pay-per-token",       bestFit:"Data-heavy Enterprise",        strengths:["1M token context — largest in market","Native multimodal (text, image, video, audio)","Deep Google Workspace integration"],                   limitations:["Perception of lagging behind GPT-4o","Enterprise trust still building","Fewer third-party integrations"],                                 insight:"Unmatched for scenarios combining text, image, and video. Natural fit for companies on GCP with BigQuery data assets.",                          metrics:{performance:8,integration:7,cost:7,enterprise:7,scalability:9,community:7} },
  { id:"llama",    name:"Llama 3.1 405B",     org:"Meta",            emoji:"🦙", layer:"foundation", useCases:["customer-service","content-gen","code-assist"],                                          pricing:"Free (self-hosted)",  bestFit:"Tech-savvy Enterprise",        strengths:["Open source — full control & customization","No vendor lock-in","Fine-tunable for specific domains"],                                         limitations:["Requires significant infra investment","No managed service from Meta","Smaller context than competitors"],                                 insight:"The 'sovereignty' play — ideal for enterprises that cannot send data to external APIs. Pair with AWS/Azure managed hosting.",                    metrics:{performance:8,integration:5,cost:9,enterprise:6,scalability:7,community:9} },
  { id:"mistral",  name:"Mistral Large",      org:"Mistral AI",      emoji:"🌊", layer:"foundation", useCases:["doc-intel","code-assist","content-gen"],                                                 pricing:"Pay-per-token",       bestFit:"EU Enterprise",                strengths:["European data sovereignty compliance","Excellent cost-performance ratio","Strong multilingual capability"],                                     limitations:["Smaller ecosystem","Limited enterprise track record","Fewer benchmarks available"],                                                        insight:"The European champion — critical for EU customers with GDPR sovereignty requirements. Punches above weight on cost-performance.",                metrics:{performance:7,integration:6,cost:8,enterprise:6,scalability:7,community:6} },
  { id:"cohere",   name:"Command R+",         org:"Cohere",          emoji:"🧬", layer:"foundation", useCases:["customer-service","doc-intel","sales-intel"],                                            pricing:"Pay-per-token",       bestFit:"Enterprise RAG",               strengths:["Built-in RAG with citations","Enterprise-grade data connectors","Excellent for search & retrieval"],                                          limitations:["Less capable at general reasoning","Smaller brand recognition","Limited multimodal support"],                                             insight:"The RAG specialist. If the primary use case is enterprise search or knowledge base Q&A, Cohere often outperforms GPT-4 at lower cost.",         metrics:{performance:7,integration:7,cost:7,enterprise:7,scalability:7,community:5} },
  { id:"azure-openai",         name:"Azure OpenAI",     org:"Microsoft",       emoji:"☁️", layer:"platform",    useCases:["customer-service","doc-intel","code-assist","sales-intel","content-gen","data-analytics"], pricing:"Pay-as-you-go + PTU", bestFit:"Microsoft-stack Enterprise",   strengths:["Enterprise compliance (SOC2, HIPAA)","Seamless Microsoft 365 integration","Private networking & data residency"],                           limitations:["Locked to OpenAI models","Complex pricing with PTU commitments","Slower model availability than OpenAI direct"],                          insight:"The enterprise safe choice. If the customer already runs on Azure AD, Teams, and Dynamics — this is the path of least resistance.",             metrics:{performance:9,integration:9,cost:5,enterprise:10,scalability:9,community:8} },
  { id:"bedrock",              name:"AWS Bedrock",      org:"Amazon",          emoji:"🏗️", layer:"platform",    useCases:["customer-service","doc-intel","content-gen","data-analytics"],               pricing:"Pay-per-token",       bestFit:"Multi-model Enterprise",       strengths:["Multi-model marketplace (Claude, Llama, Titan)","Deep AWS service integration","Guardrails & fine-tuning built-in"],                         limitations:["Steeper learning curve","Some models lag behind direct API","Complex IAM configuration"],                                                 insight:"The 'don't put all eggs in one basket' play. Access Claude, Llama, and Titan through one API.",                                                metrics:{performance:8,integration:8,cost:6,enterprise:9,scalability:10,community:7} },
  { id:"vertex",               name:"Vertex AI",        org:"Google Cloud",    emoji:"🔷", layer:"platform",    useCases:["data-analytics","doc-intel","content-gen","customer-service"],               pricing:"Pay-as-you-go",       bestFit:"Data-first Enterprise",        strengths:["Native BigQuery & data pipeline integration","MLOps + GenAI unified platform","Gemini + open model garden"],                                  limitations:["Smaller enterprise footprint than Azure","Less intuitive UI","Fewer ISV integrations"],                                                   insight:"Strongest when the customer's AI strategy is data-centric. If they have petabytes in BigQuery, Vertex makes the pipeline seamless.",            metrics:{performance:8,integration:7,cost:7,enterprise:8,scalability:9,community:7} },
  { id:"huggingface",          name:"Hugging Face",     org:"Hugging Face",    emoji:"🤗", layer:"platform",    useCases:["code-assist","content-gen","doc-intel"],                                     pricing:"Free + Pro tiers",    bestFit:"Developer & Research",         strengths:["Largest open model hub (500K+ models)","Inference Endpoints for production","Strong community & collaboration"],                              limitations:["Not enterprise-hardened","Limited compliance certifications","Support SLAs are basic"],                                                   insight:"The 'developer love' platform. Great for prototyping. Not where Fortune 500 runs production — but where they discover what to build.",          metrics:{performance:7,integration:6,cost:9,enterprise:4,scalability:6,community:10} },
  { id:"databricks",           name:"Databricks Mosaic",org:"Databricks",      emoji:"🧱", layer:"platform",    useCases:["data-analytics","doc-intel","sales-intel"],                                  pricing:"DBU-based",           bestFit:"Data Engineering teams",       strengths:["Unified data + AI lakehouse","Fine-tuning on proprietary data","Strong governance & lineage"],                                               limitations:["High total cost of ownership","Steep learning curve","Overkill for simple GenAI use cases"],                                              insight:"The choice when AI is inseparable from data strategy. Expensive but powerful for mature data engineering teams.",                               metrics:{performance:8,integration:7,cost:4,enterprise:8,scalability:8,community:6} },
  { id:"salesforce-einstein",  name:"Einstein GPT",     org:"Salesforce",      emoji:"💙", layer:"vertical",    useCases:["sales-intel","customer-service","content-gen"],                             pricing:"Per-user add-on",     bestFit:"Salesforce customers",         strengths:["Native CRM data integration","Trust Layer for data security","Copilot across Sales, Service, Marketing"],                                   limitations:["Only useful within Salesforce ecosystem","Premium pricing on top of licenses","Customization requires Salesforce expertise"],              insight:"No-brainer for existing Salesforce shops. The Trust Layer addresses data leakage concerns. AI that already knows your customer data without ETL.",metrics:{performance:7,integration:9,cost:4,enterprise:9,scalability:8,community:6} },
  { id:"servicenow",           name:"Now Assist",       org:"ServiceNow",      emoji:"🔧", layer:"vertical",    useCases:["customer-service","doc-intel"],                                             pricing:"Per-user add-on",     bestFit:"IT Service Management",        strengths:["ITSM workflow automation","Knowledge base integration","Incident summarization & resolution"],                                                limitations:["Narrow to ServiceNow workflows","Expensive per-seat pricing","Requires mature ITSM processes"],                                           insight:"Transforms IT help desks. 30-40% reduction in ticket handling time. Best pitched to CIOs frustrated with L1 support costs.",                   metrics:{performance:7,integration:8,cost:4,enterprise:9,scalability:7,community:5} },
  { id:"sap-joule",            name:"SAP Joule",        org:"SAP",             emoji:"🟦", layer:"vertical",    useCases:["data-analytics","doc-intel","sales-intel"],                                 pricing:"Included in S/4HANA", bestFit:"SAP ERP customers",            strengths:["Embedded across SAP modules","Business process context awareness","Enterprise data governance"],                                             limitations:["Only relevant for SAP customers","Early maturity stage","Limited third-party AI model support"],                                          insight:"Strategic for SAP's 400K+ enterprise customers. Still early but SAP's distribution moat is real. Watch for rapid improvement.",                metrics:{performance:6,integration:8,cost:6,enterprise:9,scalability:7,community:4} },
  { id:"github-copilot",       name:"GitHub Copilot",   org:"GitHub/Microsoft",emoji:"🐙", layer:"vertical",    useCases:["code-assist"],                                                              pricing:"$19-39/user/month",   bestFit:"Development teams",            strengths:["Best-in-class code completion","IDE-native experience","Enterprise admin & policy controls"],                                                 limitations:["Narrow to coding use case","IP/licensing concerns for generated code","Variable quality across languages"],                               insight:"The gateway drug to enterprise AI adoption. Developer teams adopt it bottom-up, then leadership asks 'what else can AI do?'",                   metrics:{performance:9,integration:9,cost:7,enterprise:7,scalability:8,community:9} },
  { id:"glean",                name:"Glean",            org:"Glean",           emoji:"🔍", layer:"vertical",    useCases:["doc-intel","customer-service","sales-intel"],                               pricing:"Per-user SaaS",       bestFit:"Knowledge-heavy Enterprise",   strengths:["Connects 100+ enterprise apps","Personalized search & answers","Strong data permissions model"],                                             limitations:["Requires broad data connector setup","Premium pricing","ROI harder to quantify initially"],                                              insight:"The 'enterprise Google' for internal knowledge. Killer use case: new employee onboarding and cross-team knowledge discovery.",                  metrics:{performance:8,integration:8,cost:5,enterprise:8,scalability:7,community:5} },
  { id:"langchain",            name:"LangChain",        org:"LangChain Inc.",  emoji:"🔗", layer:"tooling",     useCases:["customer-service","doc-intel","sales-intel","code-assist"],               pricing:"Open Source + Cloud", bestFit:"AI Development teams",         strengths:["Most popular LLM orchestration framework","Extensive chain & agent templates","LangSmith for observability"],                                 limitations:["Abstraction overhead for simple tasks","Fast-changing API surface","Can encourage over-engineering"],                                     insight:"De facto standard for LLM app development. If building custom AI apps, the dev team is probably already using this.",                          metrics:{performance:7,integration:8,cost:9,enterprise:6,scalability:7,community:10} },
  { id:"pinecone",             name:"Pinecone",         org:"Pinecone",        emoji:"🌲", layer:"tooling",     useCases:["doc-intel","customer-service","sales-intel"],                               pricing:"Usage-based",         bestFit:"RAG Applications",             strengths:["Purpose-built vector database","Serverless scaling","Simple API, fast time-to-value"],                                                       limitations:["Vendor lock-in for vector storage","Can get expensive at scale","Limited query vs. traditional DB"],                                     insight:"The 'easy button' for RAG. Gets to production fastest. Consider Weaviate for complex hybrid search needs.",                                    metrics:{performance:8,integration:8,cost:6,enterprise:7,scalability:8,community:7} },
  { id:"wandb",                name:"Weights & Biases", org:"W&B",             emoji:"📊", layer:"tooling",     useCases:["data-analytics","code-assist"],                                             pricing:"Free + Team/Enterprise",bestFit:"ML/AI Research teams",         strengths:["Best experiment tracking UI","Model evaluation & comparison","Prompt engineering tools"],                                                    limitations:["ML-team focused, not business-user friendly","Overlap with cloud-native MLOps","Learning curve for non-ML engineers"],                   insight:"The 'Figma for ML teams.' If the customer has a serious ML team, W&B is likely already on their radar.",                                       metrics:{performance:7,integration:6,cost:7,enterprise:6,scalability:7,community:8} },
  { id:"llamaindex",           name:"LlamaIndex",       org:"LlamaIndex",      emoji:"🦙", layer:"tooling",     useCases:["doc-intel","customer-service","data-analytics"],                           pricing:"Open Source + Cloud", bestFit:"Data-centric AI apps",         strengths:["Best data ingestion framework","Advanced RAG patterns","LlamaParse for document processing"],                                                limitations:["Overlaps with LangChain","Smaller ecosystem","Less general-purpose"],                                                                     insight:"Complementary to LangChain, not competitive. LlamaIndex excels at data ingestion; LangChain at orchestration. Smart teams use both.",          metrics:{performance:7,integration:7,cost:9,enterprise:5,scalability:7,community:8} },
  { id:"weaviate",             name:"Weaviate",         org:"Weaviate",        emoji:"🔮", layer:"tooling",     useCases:["doc-intel","customer-service","sales-intel"],                               pricing:"Open Source + Cloud", bestFit:"Hybrid Search Apps",           strengths:["Hybrid vector + keyword search","Multi-tenancy support","GraphQL API"],                                                                     limitations:["More complex than Pinecone","Requires more operational knowledge","Smaller community"],                                                   insight:"Choose over Pinecone when the customer needs hybrid search or multi-tenant architecture. Common in B2B SaaS companies.",                        metrics:{performance:8,integration:6,cost:8,enterprise:6,scalability:8,community:6} },
  { id:"mlflow",               name:"MLflow",           org:"Databricks",      emoji:"📈", layer:"tooling",     useCases:["data-analytics","code-assist"],                                             pricing:"Open Source",         bestFit:"MLOps teams",                  strengths:["Open source MLOps standard","Model registry & deployment","Deep Databricks integration"],                                                   limitations:["UI less polished than W&B","GenAI features still catching up","Better for traditional ML"],                                              insight:"The open-source MLOps backbone. For customers resistant to another SaaS vendor, MLflow is the self-hosted answer.",                             metrics:{performance:7,integration:7,cost:10,enterprise:6,scalability:7,community:8} },
];

const KO = {
  "gpt4o":               { pricing:"토큰당 과금",      bestFit:"엔터프라이즈 & 스타트업",     strengths:["최대 규모의 플러그인 생태계","강력한 범용 추론 능력","텍스트·이미지·오디오 멀티모달"],          limitations:["대용량 사용 시 비용 급증","규제 산업의 데이터 프라이버시 우려","피크 시간대 속도 제한"],    insight:"시장 점유율 1위. Microsoft 스택을 사용하는 기업에 최적. 대규모 사용 시 비용 급증 주의 — 약정 할인을 사전에 협상하세요." },
  "claude35":            { pricing:"토큰당 과금",      bestFit:"엔터프라이즈(규제 산업)",     strengths:["20만 토큰 컨텍스트 — 장문서 처리 최강","헌법적 AI 안전 프레임워크","탁월한 지시사항 이해력"], limitations:["GPT 대비 작은 플러그인 생태계","네이티브 이미지 생성 미지원","파인튜닝 옵션 제한"],        insight:"금융·의료·법률 등 규제 산업에서 가장 신뢰할 수 있는 모델. 20만 토큰 컨텍스트는 대용량 문서 처리의 게임 체인저." },
  "gemini":              { pricing:"토큰당 과금",      bestFit:"데이터 집약형 엔터프라이즈",  strengths:["100만 토큰 컨텍스트 — 업계 최대","텍스트·이미지·영상·오디오 멀티모달","Google Workspace 깊은 통합"], limitations:["GPT-4o 대비 인지도 열세","엔터프라이즈 신뢰도 구축 중","서드파티 연동 부족"],          insight:"Google의 멀티모달 전략. GCP와 BigQuery 자산을 보유한 기업에 자연스러운 선택." },
  "llama":               { pricing:"무료(자체 호스팅)",bestFit:"기술 역량 보유 엔터프라이즈", strengths:["오픈소스 — 완전한 통제 및 커스터마이징","벤더 락인 없음","도메인 특화 파인튜닝 가능"],          limitations:["상당한 인프라 투자 필요","Meta의 매니지드 서비스 없음","경쟁사 대비 짧은 컨텍스트"],       insight:"데이터를 외부 API로 보낼 수 없는 기업을 위한 '주권' 솔루션. AWS/Azure 매니지드 호스팅과 결합하면 운영 부담 감소." },
  "mistral":             { pricing:"토큰당 과금",      bestFit:"EU 엔터프라이즈",             strengths:["유럽 데이터 주권 규정 준수","탁월한 비용 대비 성능","강력한 다국어 처리"],                        limitations:["작은 생태계","엔터프라이즈 실적 부족","벤치마크 데이터 제한"],                             insight:"GDPR 주권 요건을 가진 EU 고객에게 필수. 비용 대비 성능에서 경쟁사를 압도." },
  "cohere":              { pricing:"토큰당 과금",      bestFit:"엔터프라이즈 RAG",            strengths:["인용 포함 내장 RAG","엔터프라이즈급 데이터 커넥터","검색·검색증강에 탁월"],                      limitations:["범용 추론 능력 한계","브랜드 인지도 낮음","멀티모달 지원 부족"],                            insight:"RAG 전문가. 엔터프라이즈 검색이나 지식베이스 Q&A가 주 유즈케이스라면 GPT-4보다 낮은 비용으로 우수한 성능." },
  "azure-openai":        { pricing:"종량제 + PTU",     bestFit:"Microsoft 스택 엔터프라이즈", strengths:["엔터프라이즈 컴플라이언스(SOC2, HIPAA)","Microsoft 365 완벽 연동","프라이빗 네트워킹 & 데이터 레지던시"], limitations:["OpenAI 모델 전용 제한","PTU 약정 복잡한 가격 구조","직접 API 대비 모델 업데이트 지연"], insight:"엔터프라이즈의 안전한 선택. Azure AD, Teams, Dynamics를 이미 사용한다면 가장 쉬운 경로." },
  "bedrock":             { pricing:"토큰당 과금",      bestFit:"멀티모델 엔터프라이즈",       strengths:["멀티모델 마켓플레이스(Claude, Llama, Titan)","깊은 AWS 서비스 연동","가드레일 & 파인튜닝 내장"], limitations:["가파른 학습 곡선","일부 모델 직접 API 대비 지연","복잡한 IAM 설정"],                    insight:"'모든 달걀을 한 바구니에 담지 않는' 전략. 하나의 API로 Claude, Llama, Titan 접근." },
  "vertex":              { pricing:"종량제",           bestFit:"데이터 중심 엔터프라이즈",    strengths:["BigQuery & 데이터 파이프라인 네이티브 연동","MLOps + GenAI 통합 플랫폼","Gemini + 오픈 모델 가든"], limitations:["Azure 대비 작은 엔터프라이즈 입지","직관성 낮은 UI","적은 ISV 연동"],                   insight:"AI 전략이 데이터 중심일 때 가장 강력. BigQuery에 대용량 데이터가 있다면 데이터-AI 파이프라인이 원활." },
  "huggingface":         { pricing:"무료 + 유료 플랜", bestFit:"개발자 & 연구팀",             strengths:["최대 오픈 모델 허브(50만+ 모델)","프로덕션용 추론 엔드포인트","강력한 커뮤니티"],               limitations:["엔터프라이즈 하드닝 미흡","컴플라이언스 인증 제한","기본적인 지원 SLA"],                     insight:"'개발자가 사랑하는' 플랫폼. 프로토타입과 연구에 탁월. Fortune 500이 무엇을 만들지 발견하는 곳." },
  "databricks":          { pricing:"DBU 기반",         bestFit:"데이터 엔지니어링팀",         strengths:["통합 데이터 + AI 레이크하우스","자체 데이터 파인튜닝","강력한 거버넌스 & 리니지"],              limitations:["높은 총소유비용(TCO)","가파른 학습 곡선","단순 GenAI 유즈케이스에 과도"],                  insight:"AI가 데이터 전략과 불가분일 때의 선택. 비용이 높지만 성숙한 데이터 엔지니어링팀에 강력." },
  "salesforce-einstein": { pricing:"사용자당 애드온",  bestFit:"Salesforce 고객사",           strengths:["네이티브 CRM 데이터 연동","데이터 보안 트러스트 레이어","영업·서비스·마케팅 전체 Copilot"],       limitations:["Salesforce 생태계 내에서만 유용","라이선스 위에 프리미엄 가격","Salesforce 전문 지식 필요"], insight:"기존 Salesforce 고객에게는 당연한 선택. 트러스트 레이어로 데이터 유출 우려 해소. ETL 없이 고객 데이터를 이미 아는 AI." },
  "servicenow":          { pricing:"사용자당 애드온",  bestFit:"IT 서비스 관리",              strengths:["ITSM 워크플로우 자동화","지식베이스 연동","인시던트 요약 & 해결"],                               limitations:["ServiceNow 워크플로우 한정","높은 좌석당 가격","성숙한 ITSM 프로세스 필요"],                insight:"IT 헬프데스크 혁신. 티켓 처리 시간 30-40% 감소. L1 지원 비용에 좌절한 CIO에게 최적." },
  "sap-joule":           { pricing:"S/4HANA Cloud 포함",bestFit:"SAP ERP 고객사",            strengths:["SAP 모듈 전체 내장","비즈니스 프로세스 컨텍스트 인식","엔터프라이즈 데이터 거버넌스"],            limitations:["SAP 고객에게만 적용","초기 성숙 단계","서드파티 AI 모델 지원 제한"],                        insight:"SAP 40만+ 엔터프라이즈 고객에 전략적. 아직 초기 단계지만 SAP의 유통 해자는 실재." },
  "github-copilot":      { pricing:"월 $19-39/사용자", bestFit:"개발팀",                      strengths:["최고 수준의 코드 자동완성","IDE 네이티브 경험","엔터프라이즈 관리 & 정책 제어"],                   limitations:["코딩 유즈케이스 한정","생성 코드의 IP/라이선스 우려","언어별 품질 편차"],                    insight:"엔터프라이즈 AI 도입의 게이트웨이. 개발자가 바텀업으로 도입하면 경영진이 'AI로 무엇을 더 할 수 있나' 질문 시작." },
  "glean":               { pricing:"사용자당 SaaS",    bestFit:"지식 집약형 엔터프라이즈",    strengths:["100+ 엔터프라이즈 앱 연결","개인화된 검색 & 답변","강력한 데이터 권한 모델"],                    limitations:["광범위한 데이터 커넥터 설정 필요","프리미엄 가격","초기 ROI 정량화 어려움"],                 insight:"내부 지식을 위한 '엔터프라이즈 구글'. 킬러 유즈케이스: 신규 직원 온보딩과 팀 간 지식 발견." },
  "langchain":           { pricing:"오픈소스 + 클라우드",bestFit:"AI 개발팀",                 strengths:["가장 인기 있는 LLM 오케스트레이션 프레임워크","광범위한 체인 & 에이전트 템플릿","LangSmith 옵저버빌리티"], limitations:["단순 작업의 추상화 오버헤드","빠르게 변하는 API 표면","과도한 엔지니어링 유도 가능"],  insight:"LLM 앱 개발의 사실상 표준. 커스텀 AI 앱을 만든다면 개발팀은 이미 사용 중." },
  "pinecone":            { pricing:"사용량 기반",       bestFit:"RAG 애플리케이션",            strengths:["목적 특화 벡터 데이터베이스","서버리스 스케일링","단순 API, 빠른 프로덕션 전환"],               limitations:["벡터 스토리지 벤더 락인","규모 확장 시 비용 증가","기존 DB 대비 제한적 쿼리"],             insight:"RAG를 위한 '이지 버튼'. 가장 빠른 프로덕션 전환. 복잡한 하이브리드 검색은 Weaviate 고려." },
  "wandb":               { pricing:"무료 + 팀/엔터프라이즈",bestFit:"ML/AI 연구팀",           strengths:["최고의 실험 추적 UI","모델 평가 & 비교","프롬프트 엔지니어링 도구"],                             limitations:["ML팀 중심, 비즈니스 사용자 비친화적","클라우드 네이티브 MLOps와 중복","ML 비전문가 학습 곡선"], insight:"'ML팀을 위한 Figma.' 진지한 ML팀이 있다면 이미 레이더에 있을 것." },
  "llamaindex":          { pricing:"오픈소스 + 클라우드",bestFit:"데이터 중심 AI 앱",         strengths:["최고의 데이터 수집 프레임워크","고급 RAG 패턴","LlamaParse 문서 처리"],                          limitations:["LangChain과 중복","작은 생태계","범용성 부족"],                                              insight:"LangChain의 보완재. LlamaIndex는 데이터 수집, LangChain은 오케스트레이션. 스마트한 팀은 둘 다 사용." },
  "weaviate":            { pricing:"오픈소스 + 클라우드",bestFit:"하이브리드 검색 앱",         strengths:["벡터 + 키워드 하이브리드 검색","멀티 테넌시 지원","GraphQL API"],                               limitations:["Pinecone보다 복잡","높은 운영 지식 요구","작은 커뮤니티"],                                   insight:"멀티 테넌트 아키텍처나 하이브리드 검색이 필요할 때 Pinecone 대신 선택. B2B SaaS 기업에 일반적." },
  "mlflow":              { pricing:"오픈소스",           bestFit:"MLOps팀",                    strengths:["오픈소스 MLOps 표준","모델 레지스트리 & 배포","Databricks 깊은 연동"],                           limitations:["W&B 대비 덜 세련된 UI","GenAI 기능 따라잡는 중","전통적 ML에 더 적합"],                    insight:"오픈소스 MLOps 백본. 또 다른 SaaS 벤더를 원하지 않는 고객에게 자체 호스팅 답변." },
};

const STACK_PRESETS = [
  { name:"Enterprise Safe", nameKo:"엔터프라이즈 안전형", desc:"Maximum compliance & integration", descKo:"최대 컴플라이언스 & 통합", picks:{foundation:"claude35",platform:"azure-openai",vertical:"salesforce-einstein",tooling:"langchain"} },
  { name:"Cost Optimized",  nameKo:"비용 최적화형",       desc:"Best value for growing companies",  descKo:"성장 기업을 위한 최적 가치",  picks:{foundation:"llama",    platform:"huggingface",  vertical:"github-copilot",     tooling:"llamaindex"} },
  { name:"Data-First",      nameKo:"데이터 우선형",       desc:"Analytics & data pipeline focused", descKo:"분석 & 데이터 파이프라인 중심",picks:{foundation:"gemini",   platform:"vertex",       vertical:"glean",              tooling:"pinecone"} },
];

/* ── HELPERS ─────────────────────────────────────────────────────────── */

function vf(vendor, field, lang) {
  if (lang === "ko" && KO[vendor.id]) return KO[vendor.id][field] ?? vendor[field];
  return vendor[field];
}

/* ── CSS ─────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}

/* ── DARK (default) ── */
:root{
  --bg:#09081A;--bg2:#0E0D20;--card:rgba(18,16,38,0.9);--cardh:rgba(26,23,52,0.98);
  --a:#8B5CF6;--a2:#A78BFA;--a3:#C4B5FD;--adim:rgba(139,92,246,0.14);--aglow:rgba(139,92,246,0.35);
  --txt:#ECE8F7;--dim:#9086AA;--bdr:rgba(139,92,246,0.2);--g1:#7C3AED;--g2:#6366F1;
  --shadow:rgba(0,0,0,0.4);--overlay:rgba(0,0,0,0.55);
}
/* ── LIGHT ── */
[data-theme="light"]{
  --bg:#F3F1FF;--bg2:#E9E6FA;--card:rgba(255,255,255,0.92);--cardh:rgba(248,246,255,0.99);
  --a:#7C3AED;--a2:#6D28D9;--a3:#5B21B6;--adim:rgba(124,58,237,0.1);--aglow:rgba(124,58,237,0.25);
  --txt:#1A1535;--dim:#5E5280;--bdr:rgba(124,58,237,0.2);--g1:#7C3AED;--g2:#6366F1;
  --shadow:rgba(100,80,180,0.15);--overlay:rgba(60,40,120,0.4);
}

body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--txt);font-size:15px;line-height:1.5}

.eco-root{
  min-height:100vh;background:var(--bg);
  background-image:
    radial-gradient(ellipse 80% 50% at 10% 90%,rgba(124,58,237,.09) 0%,transparent 60%),
    radial-gradient(ellipse 60% 40% at 90% 10%,rgba(99,102,241,.07) 0%,transparent 60%);
}
[data-theme="light"] .eco-root{
  background-image:
    radial-gradient(ellipse 80% 50% at 10% 90%,rgba(124,58,237,.06) 0%,transparent 60%),
    radial-gradient(ellipse 60% 40% at 90% 10%,rgba(99,102,241,.05) 0%,transparent 60%);
}
.dots{background-image:radial-gradient(rgba(139,92,246,.07) 1px,transparent 1px);background-size:24px 24px}
[data-theme="light"] .dots{background-image:radial-gradient(rgba(124,58,237,.08) 1px,transparent 1px)}

/* ── VENDOR NODE ── */
.vn{
  transition:all .3s cubic-bezier(.4,0,.2,1);cursor:pointer;
  border:1px solid var(--bdr);backdrop-filter:blur(10px);background:var(--card);
  position:relative;border-radius:14px;padding:12px 16px;
  display:flex;align-items:center;gap:12px;
  box-shadow:0 2px 8px var(--shadow);
}
.vn:hover{transform:translateY(-3px) scale(1.02);border-color:var(--a2);box-shadow:0 8px 28px var(--aglow)}
.vn.dim{opacity:.15;transform:scale(.92);filter:grayscale(.8);pointer-events:none}
.vn.glow{border-color:var(--a);box-shadow:0 0 20px var(--aglow),0 4px 16px var(--shadow)}
.vn.sel{border-color:var(--a2);background:var(--adim);box-shadow:0 0 24px var(--aglow)}

/* ── STACK NODE ── */
.sn{
  transition:all .3s cubic-bezier(.4,0,.2,1);cursor:pointer;
  border:2px dashed var(--bdr);background:var(--card);
  position:relative;border-radius:12px;padding:12px 16px;
  display:flex;align-items:center;gap:12px;
}
.sn:hover{border-color:var(--a2);background:var(--cardh);transform:translateY(-2px)}
.sn.pick{border-style:solid;border-color:var(--a);background:var(--adim);box-shadow:0 0 18px var(--aglow)}

/* ── PILLS & TABS ── */
.pill{
  transition:all .22s ease;cursor:pointer;border:1px solid var(--bdr);
  font-family:'Outfit',sans-serif;background:var(--card);color:var(--txt);
  border-radius:100px;padding:7px 16px;font-size:13.5px;font-weight:500;
  display:inline-flex;align-items:center;gap:6px;white-space:nowrap;
}
.pill:hover{border-color:var(--a2);background:var(--cardh)}
.pill.on{background:var(--a);border-color:var(--a);color:#fff;box-shadow:0 0 14px var(--aglow)}

.tab{
  transition:all .22s ease;cursor:pointer;border:none;
  font-family:'Outfit',sans-serif;background:none;color:var(--dim);
  padding:9px 20px;font-size:14px;font-weight:600;border-radius:10px;
  display:flex;align-items:center;gap:7px;
}
.tab:hover{color:var(--txt);background:var(--adim)}
.tab.on{color:#fff;background:var(--a);box-shadow:0 0 16px var(--aglow)}

/* ── BUTTONS ── */
.cbtn{
  background:linear-gradient(135deg,var(--g1),var(--g2));
  transition:all .28s ease;font-family:'Outfit',sans-serif;border:none;
  border-radius:10px;padding:10px 22px;color:#fff;cursor:pointer;
  font-weight:600;font-size:14px;display:flex;align-items:center;gap:7px;
}
.cbtn:hover{box-shadow:0 0 28px var(--aglow);transform:translateY(-1px)}

.ghost{
  background:none;border:1px solid var(--bdr);border-radius:8px;
  padding:7px 14px;cursor:pointer;color:var(--dim);font-size:13px;
  font-family:'Outfit',sans-serif;display:flex;align-items:center;gap:5px;
  transition:all .2s;
}
.ghost:hover{border-color:var(--a2);color:var(--txt)}

/* ── MISC ── */
.chk{position:absolute;top:-8px;right:-8px;width:22px;height:22px;border-radius:50%;background:var(--a);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px var(--aglow)}
.mb{height:7px;border-radius:4px;background:var(--adim);overflow:hidden;width:48px}
.mbf{height:100%;border-radius:4px;transition:width .8s cubic-bezier(.4,0,.2,1)}
.stk{background:linear-gradient(135deg,rgba(124,58,237,.08),rgba(99,102,241,.04));border:1px solid rgba(139,92,246,.25);border-radius:16px;padding:24px;transition:all .3s}
.stk:hover{border-color:rgba(139,92,246,.4);box-shadow:0 4px 24px var(--aglow)}
.ns::-webkit-scrollbar{display:none}.ns{-ms-overflow-style:none;scrollbar-width:none}

/* ── ANIMATIONS ── */
@keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes si{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{opacity:.2}50%{opacity:.65}}
.au{animation:fu .45s cubic-bezier(.4,0,.2,1) both}
.ai{animation:fi .35s ease both}
.asi{animation:si .38s cubic-bezier(.4,0,.2,1) both}
.pls{animation:pulse 2s ease-in-out infinite}
`;

/* ── ICON MAP ────────────────────────────────────────────────────────── */
const IconMap = { Sparkles, Zap, Building2, Wrench };

/* ── VENDOR NODE ─────────────────────────────────────────────────────── */
function VendorNode({ vendor, isHighlighted, isDimmed, isSelected, onClick, delay = 0 }) {
  const cls = ["vn", isDimmed&&"dim", isHighlighted&&!isDimmed&&"glow", isSelected&&"sel"].filter(Boolean).join(" ");
  return (
    <div className={cls} onClick={() => onClick(vendor)} style={{ animationDelay:`${delay}ms` }}>
      {isSelected && <div className="chk"><Check size={12} color="white" strokeWidth={3}/></div>}
      <span style={{ fontSize:26 }}>{vendor.emoji}</span>
      <div style={{ minWidth:0, flex:1 }}>
        <div style={{ fontWeight:700, fontSize:14, lineHeight:1.25, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{vendor.name}</div>
        <div style={{ fontSize:12, color:"var(--dim)", lineHeight:1.3 }}>{vendor.org}</div>
      </div>
    </div>
  );
}

/* ── FLOW ARROW ──────────────────────────────────────────────────────── */
function FlowArrow() {
  return (
    <div style={{ display:"flex", justifyContent:"center", padding:"4px 0" }}>
      <div className="pls" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}>
        <div style={{ width:2, height:12, background:"linear-gradient(to bottom,var(--a),transparent)", borderRadius:1 }}/>
        <ChevronDown size={15} color="var(--a)" style={{ opacity:.5 }}/>
      </div>
    </div>
  );
}

/* ── LAYER SECTION ───────────────────────────────────────────────────── */
function LayerSection({ layer, vendors, selectedUseCase, selectedIds, onVendorClick, index }) {
  const lang = useLang();
  const Icon = IconMap[layer.icon] || Layers;
  const label = lang === "ko" ? layer.labelKo : layer.label;
  const desc  = lang === "ko" ? layer.descKo  : layer.desc;
  return (
    <div className="au" style={{
      animationDelay:`${index*100}ms`, padding:"18px 22px", borderRadius:16,
      background:`linear-gradient(135deg,rgba(${16+index*8},${14+index*5},${30+index*12},0.55),rgba(18,16,38,0.3))`,
      border:`1px solid ${layer.color}1E`,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:`${layer.color}1E`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon size={18} color={layer.color}/>
        </div>
        <div>
          <div style={{ fontWeight:800, fontSize:15, color:layer.color }}>{label}</div>
          <div style={{ fontSize:12, color:"var(--dim)" }}>{desc}</div>
        </div>
        <div style={{ marginLeft:"auto", fontSize:11, color:"var(--dim)", background:"var(--adim)", padding:"3px 10px", borderRadius:7, fontWeight:600 }}>
          {vendors.length} {lang==="ko"?"벤더":"vendors"}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:9 }}>
        {vendors.map((v,i) => {
          const rel = !selectedUseCase || v.useCases.includes(selectedUseCase);
          return <VendorNode key={v.id} vendor={v}
            isHighlighted={selectedUseCase && rel} isDimmed={selectedUseCase && !rel}
            isSelected={selectedIds.includes(v.id)} onClick={onVendorClick} delay={i*35}/>;
        })}
      </div>
    </div>
  );
}

/* ── DETAIL MODAL (centered) ─────────────────────────────────────────── */
function DetailModal({ vendor, onClose }) {
  const lang = useLang();
  if (!vendor) return null;
  const ml = lang === "ko" ? METRIC_LABELS_KO : METRIC_LABELS;
  const rd = Object.entries(vendor.metrics).map(([k,v]) => ({ metric: ml[k], value: v }));
  const strengths   = vf(vendor,"strengths",lang);
  const limitations = vf(vendor,"limitations",lang);
  const insight     = vf(vendor,"insight",lang);
  const pricing     = vf(vendor,"pricing",lang);
  const bestFit     = vf(vendor,"bestFit",lang);

  return (
    <>
      <div onClick={onClose} className="ai" style={{ position:"fixed",inset:0,background:"var(--overlay)",zIndex:45,backdropFilter:"blur(6px)" }}/>
      <div className="asi ns" style={{
        position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:"min(780px,92vw)", maxHeight:"88vh", overflowY:"auto",
        background:"var(--bg2)", border:"1px solid var(--bdr)",
        borderRadius:20, zIndex:50, padding:32,
        boxShadow:"0 24px 80px rgba(0,0,0,0.4)",
      }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:48 }}>{vendor.emoji}</span>
            <div>
              <div style={{ fontWeight:800, fontSize:24, lineHeight:1.2 }}>{vendor.name}</div>
              <div style={{ color:"var(--dim)", fontSize:14, marginTop:2 }}>{vendor.org}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",padding:6 }}>
            <X size={22} color="var(--dim)"/>
          </button>
        </div>

        {/* Tags */}
        <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
          <span style={{ fontSize:12, padding:"5px 14px", borderRadius:100, background:"var(--adim)", color:"var(--a2)", fontWeight:600 }}>{pricing}</span>
          <span style={{ fontSize:12, padding:"5px 14px", borderRadius:100, background:"rgba(16,185,129,.12)", color:"#6EE7B7", fontWeight:600 }}>{bestFit}</span>
        </div>

        {/* Two-column layout */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 }}>
          {/* Strengths */}
          <div style={{ background:"var(--card)", borderRadius:14, padding:18 }}>
            <div style={{ fontWeight:700, fontSize:13, color:"#6EE7B7", marginBottom:10 }}>✦ {lang==="ko"?"강점":"Strengths"}</div>
            {strengths.map((s,i) => (
              <div key={i} style={{ fontSize:13.5, lineHeight:1.6, paddingLeft:16, position:"relative", marginBottom:6 }}>
                <span style={{ position:"absolute",left:0,color:"var(--dim)" }}>›</span>{s}
              </div>
            ))}
          </div>
          {/* Limitations */}
          <div style={{ background:"var(--card)", borderRadius:14, padding:18 }}>
            <div style={{ fontWeight:700, fontSize:13, color:"#F59E0B", marginBottom:10 }}>⚠ {lang==="ko"?"한계":"Limitations"}</div>
            {limitations.map((s,i) => (
              <div key={i} style={{ fontSize:13.5, lineHeight:1.6, paddingLeft:16, position:"relative", marginBottom:6 }}>
                <span style={{ position:"absolute",left:0,color:"var(--dim)" }}>›</span>{s}
              </div>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div style={{ background:"linear-gradient(135deg,rgba(139,92,246,.1),rgba(99,102,241,.05))", border:"1px solid rgba(139,92,246,.22)", borderRadius:14, padding:20, marginBottom:22 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
            <MessageSquareQuote size={15} color="var(--a2)"/>
            <span style={{ fontWeight:700, fontSize:12, color:"var(--a2)", textTransform:"uppercase", letterSpacing:1 }}>
              {lang==="ko"?"세일즈 디렉터의 인사이트":"Sales Director's Take"}
            </span>
          </div>
          <p style={{ fontSize:14.5, lineHeight:1.7, fontStyle:"italic" }}>"{insight}"</p>
        </div>

        {/* Use cases + Radar */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:10 }}>{lang==="ko"?"유즈케이스":"Use Cases"}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {vendor.useCases.map(uid => { const u = USE_CASES.find(x => x.id === uid);
                if (!u) return null;
                const ulabel = lang==="ko" ? u.labelKo : u.label;
                return <span key={uid} style={{ fontSize:12.5, padding:"4px 10px", borderRadius:7, background:"var(--card)", border:"1px solid var(--bdr)" }}>{u.emoji} {ulabel}</span>;
              })}
            </div>
          </div>
          <div style={{ background:"var(--card)", borderRadius:14, padding:"8px 0" }}>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={rd}>
                <PolarGrid stroke="rgba(139,92,246,.18)"/>
                <PolarAngleAxis dataKey="metric" tick={{ fill:"var(--dim)", fontSize:11 }}/>
                <Radar dataKey="value" stroke="var(--a)" fill="var(--a)" fillOpacity={.2} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── COMPARISON VIEW ─────────────────────────────────────────────────── */
function ComparisonView({ vendors, onBack }) {
  const lang = useLang();
  const ml = lang === "ko" ? METRIC_LABELS_KO : METRIC_LABELS;
  const radarData = Object.keys(ml).map(k => {
    const e = { metric: ml[k] };
    vendors.forEach(v => { e[v.id] = v.metrics[k]; });
    return e;
  });
  return (
    <div className="au" style={{ padding:"0 0 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <button className="ghost" onClick={onBack}><RotateCcw size={14}/> {lang==="ko"?"뒤로":"Back"}</button>
        <span style={{ fontWeight:800, fontSize:20 }}>{lang==="ko"?"벤더 비교":"Vendor Comparison"}</span>
        <span style={{ fontSize:13, color:"var(--dim)" }}>— {vendors.length} {lang==="ko"?"선택됨":"selected"}</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(vendors.length,4)},1fr)`, gap:12, marginBottom:24 }}>
        {vendors.map((v,i) => (
          <div key={v.id} className="asi" style={{ animationDelay:`${i*80}ms`, background:"var(--card)", borderRadius:14, padding:18, borderLeft:`4px solid ${RADAR_COLORS[i]}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ fontSize:28 }}>{v.emoji}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:15 }}>{v.name}</div>
                <div style={{ fontSize:11, color:"var(--dim)" }}>{v.org}</div>
              </div>
            </div>
            <p style={{ fontSize:12.5, color:"var(--dim)", lineHeight:1.6, fontStyle:"italic" }}>"{vf(v,"insight",lang)}"</p>
          </div>
        ))}
      </div>
      <div className="asi" style={{ animationDelay:"200ms", background:"var(--card)", borderRadius:16, padding:24, border:"1px solid var(--bdr)", marginBottom:24 }}>
        <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>{lang==="ko"?"역량 레이더":"Capability Radar"}</div>
        <div style={{ fontSize:12.5, color:"var(--dim)", marginBottom:16 }}>{lang==="ko"?"6축 다차원 비교":"6-axis multi-dimensional comparison"}</div>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(139,92,246,.13)"/>
            <PolarAngleAxis dataKey="metric" tick={{ fill:"var(--dim)", fontSize:12, fontFamily:"Outfit" }}/>
            {vendors.map((v,i) => <Radar key={v.id} dataKey={v.id} name={v.name} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={.1} strokeWidth={2} dot={{ r:3, fill:RADAR_COLORS[i] }}/>)}
          </RadarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:8 }}>
          {vendors.map((v,i) => (
            <div key={v.id} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:RADAR_COLORS[i] }}/>
              <span style={{ fontSize:12.5, color:"var(--dim)" }}>{v.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="asi" style={{ animationDelay:"300ms", background:"var(--card)", borderRadius:16, padding:24, border:"1px solid var(--bdr)" }}>
        <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>{lang==="ko"?"메트릭 세부":"Metric Breakdown"}</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13.5 }}>
            <thead><tr style={{ borderBottom:"1px solid var(--bdr)" }}>
              <th style={{ textAlign:"left", padding:"8px 12px", color:"var(--dim)", fontWeight:500, fontSize:12 }}>{lang==="ko"?"메트릭":"Metric"}</th>
              {vendors.map((v,i) => <th key={v.id} style={{ textAlign:"center", padding:"8px 12px", color:RADAR_COLORS[i], fontWeight:700, fontSize:12 }}>{v.name}</th>)}
            </tr></thead>
            <tbody>
              {Object.entries(ml).map(([k,lbl]) => (
                <tr key={k} style={{ borderBottom:"1px solid rgba(139,92,246,.07)" }}>
                  <td style={{ padding:"10px 12px", fontWeight:600 }}>{lbl}</td>
                  {vendors.map((v,i) => { const val=v.metrics[k]; const mx=Math.max(...vendors.map(x=>x.metrics[k]));
                    return <td key={v.id} style={{ textAlign:"center", padding:"10px 12px" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                        <div className="mb"><div className="mbf" style={{ width:`${val*10}%`, background:val===mx?RADAR_COLORS[i]:`${RADAR_COLORS[i]}66` }}/></div>
                        <span style={{ fontWeight:val===mx?700:400, color:val===mx?RADAR_COLORS[i]:"var(--dim)", fontSize:13 }}>{val}</span>
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

/* ── STACK BUILDER ───────────────────────────────────────────────────── */
function StackBuilder() {
  const lang = useLang();
  const [picks, setPicks] = useState({ foundation:null, platform:null, vertical:null, tooling:null });
  const [showResult, setShowResult] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const pickCount = Object.values(picks).filter(Boolean).length;
  const handlePick = (lid, vid) => { setPicks(p => ({ ...p, [lid]:p[lid]===vid?null:vid })); setShowResult(false); setActivePreset(null); };
  const applyPreset = p => { setPicks(p.picks); setActivePreset(p.name); setShowResult(false); };
  const handleReset = () => { setPicks({ foundation:null,platform:null,vertical:null,tooling:null }); setShowResult(false); setActivePreset(null); };
  const selectedVendors = LAYERS.map(l => ({ layer:l, vendor:VENDORS.find(v => v.id===picks[l.id]) })).filter(x => x.vendor);
  const avgMetrics = useMemo(() => {
    if (!selectedVendors.length) return null;
    const ml = lang==="ko"?METRIC_LABELS_KO:METRIC_LABELS;
    return Object.keys(ml).map(k => ({ metric:ml[k], value:Math.round(selectedVendors.reduce((s,x)=>s+x.vendor.metrics[k],0)/selectedVendors.length*10)/10 }));
  }, [picks, lang]);
  const stackGrade = useMemo(() => {
    if (!avgMetrics) return null;
    const avg = avgMetrics.reduce((s,m)=>s+m.value,0)/avgMetrics.length;
    if (avg>=8.5) return { letter:"A+",color:"#10B981" };
    if (avg>=7.5) return { letter:"A", color:"#6EE7B7" };
    if (avg>=6.5) return { letter:"B+",color:"#F59E0B" };
    if (avg>=5.5) return { letter:"B", color:"#FB923C" };
    return { letter:"C",color:"#F43F5E" };
  }, [avgMetrics]);

  return (
    <div className="au">
      <div style={{ fontSize:14, color:"var(--dim)", marginBottom:16 }}>
        {lang==="ko"?"각 레이어에서 벤더를 하나씩 선택해 추천 AI 스택을 구성하세요.":"Build your recommended AI stack by selecting one vendor from each layer."}
      </div>
      <div style={{ marginBottom:22 }}>
        <div style={{ fontSize:11.5, color:"var(--dim)", marginBottom:10, fontWeight:700, textTransform:"uppercase", letterSpacing:.8 }}>{lang==="ko"?"빠른 프리셋":"Quick Presets"}</div>
        <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
          {STACK_PRESETS.map(p => (
            <button key={p.name} className={`pill ${activePreset===p.name?"on":""}`} onClick={() => applyPreset(p)}>
              <Star size={13}/> {lang==="ko"?p.nameKo:p.name}
              <span style={{ fontSize:11, opacity:.7 }}>— {lang==="ko"?p.descKo:p.desc}</span>
            </button>
          ))}
          {pickCount>0 && <button className="pill" onClick={handleReset} style={{ color:"var(--dim)" }}><RotateCcw size={12}/> {lang==="ko"?"초기화":"Reset"}</button>}
        </div>
      </div>
      {LAYERS.map((layer,idx) => {
        const Icon = IconMap[layer.icon]||Layers;
        const lv = VENDORS.filter(v=>v.layer===layer.id);
        const lbl = lang==="ko"?layer.labelKo:layer.label;
        return (
          <div key={layer.id}>
            <div className="au" style={{ animationDelay:`${idx*80}ms` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:layer.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#fff", boxShadow:`0 0 14px ${layer.color}44`, flexShrink:0 }}>{layer.step}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:14, color:layer.color }}>{lbl}</div>
                  <div style={{ fontSize:11.5, color:"var(--dim)" }}>{lang==="ko"?"벤더 하나 선택":"Select one vendor"}</div>
                </div>
                {picks[layer.id] && (
                  <div className="asi" style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(16,185,129,.12)", padding:"4px 10px", borderRadius:7 }}>
                    <Check size={12} color="#6EE7B7"/>
                    <span style={{ fontSize:11.5, color:"#6EE7B7", fontWeight:700 }}>{VENDORS.find(v=>v.id===picks[layer.id])?.name}</span>
                  </div>
                )}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:9 }}>
                {lv.map(v => (
                  <div key={v.id} className={`sn ${picks[layer.id]===v.id?"pick":""}`} onClick={() => handlePick(layer.id,v.id)}>
                    {picks[layer.id]===v.id && <div className="chk" style={{ width:20,height:20 }}><Check size={11} color="white" strokeWidth={3}/></div>}
                    <span style={{ fontSize:22 }}>{v.emoji}</span>
                    <div style={{ minWidth:0, flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:13, lineHeight:1.2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{v.name}</div>
                      <div style={{ fontSize:11, color:"var(--dim)", lineHeight:1.3 }}>{vf(v,"pricing",lang)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {idx<LAYERS.length-1 && <div style={{ display:"flex", justifyContent:"center", padding:"5px 0" }}><div className="pls"><ChevronDown size={15} color="var(--a)" style={{ opacity:.4 }}/></div></div>}
          </div>
        );
      })}
      {pickCount>=2 && !showResult && (
        <div className="au" style={{ display:"flex", justifyContent:"center", marginTop:28 }}>
          <button className="cbtn" onClick={() => setShowResult(true)} style={{ padding:"13px 36px", fontSize:15, borderRadius:13, gap:9 }}>
            <Boxes size={17}/> {lang==="ko"?`스택 빌드 (${pickCount}/4)`:`Build My Stack (${pickCount}/4)`} <ArrowRight size={16}/>
          </button>
        </div>
      )}
      {showResult && (
        <div className="asi" style={{ marginTop:28 }}>
          <div className="stk">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <Shield size={22} color="var(--a2)"/>
                <div>
                  <div style={{ fontWeight:800, fontSize:19 }}>{lang==="ko"?"나의 추천 스택":"My Recommended Stack"}</div>
                  <div style={{ fontSize:12, color:"var(--dim)", marginTop:2 }}>{selectedVendors.length} {lang==="ko"?"레이어 구성됨":"layers configured"}</div>
                </div>
                {stackGrade && (
                  <div style={{ background:`${stackGrade.color}18`, border:`1px solid ${stackGrade.color}44`, borderRadius:11, padding:"5px 14px", display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontWeight:800, fontSize:20, color:stackGrade.color }}>{stackGrade.letter}</span>
                    <span style={{ fontSize:11, color:"var(--dim)" }}>{lang==="ko"?"점수":"Score"}</span>
                  </div>
                )}
              </div>
              <button className="ghost" onClick={handleReset}><RotateCcw size={12}/> {lang==="ko"?"초기화":"Reset"}</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:24 }}>
              {selectedVendors.map(({ layer,vendor },i) => (
                <div key={layer.id} className="au" style={{ animationDelay:`${i*100}ms` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, background:"var(--card)", borderRadius:12, padding:"12px 18px", border:`1px solid ${layer.color}22` }}>
                    <div style={{ width:30,height:30,borderRadius:7,background:layer.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",flexShrink:0 }}>{layer.step}</div>
                    <span style={{ fontSize:26 }}>{vendor.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, color:layer.color, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>{lang==="ko"?layer.labelKo:layer.label}</div>
                      <div style={{ fontWeight:700, fontSize:16 }}>{vendor.name}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:11.5, color:"var(--dim)" }}>{vf(vendor,"pricing",lang)}</div>
                      <div style={{ fontSize:11.5, color:"#6EE7B7" }}>{vf(vendor,"bestFit",lang)}</div>
                    </div>
                  </div>
                  {i<selectedVendors.length-1 && <div style={{ display:"flex", justifyContent:"center", padding:"2px 0" }}><ChevronDown size={13} color="var(--a)" style={{ opacity:.3 }}/></div>}
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:avgMetrics?"1fr 1fr":"1fr", gap:16 }}>
              {avgMetrics && (
                <div style={{ background:"var(--card)", borderRadius:14, padding:"10px 0" }}>
                  <div style={{ fontSize:13, fontWeight:700, padding:"4px 16px", color:"var(--dim)" }}>{lang==="ko"?"스택 프로필":"Stack Profile"}</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={avgMetrics}>
                      <PolarGrid stroke="rgba(139,92,246,.15)"/>
                      <PolarAngleAxis dataKey="metric" tick={{ fill:"var(--dim)", fontSize:10 }}/>
                      <Radar dataKey="value" stroke="var(--a)" fill="var(--a)" fillOpacity={.2} strokeWidth={2}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div style={{ background:"linear-gradient(135deg,rgba(139,92,246,.07),rgba(99,102,241,.03))", border:"1px solid rgba(139,92,246,.15)", borderRadius:12, padding:18, display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
                  <MessageSquareQuote size={14} color="var(--a2)"/>
                  <span style={{ fontWeight:700, fontSize:11.5, color:"var(--a2)", textTransform:"uppercase", letterSpacing:.8 }}>{lang==="ko"?"스택 분석":"Stack Analysis"}</span>
                </div>
                {selectedVendors.map(({ layer,vendor }) => (
                  <div key={layer.id} style={{ fontSize:12.5, lineHeight:1.6, marginBottom:10 }}>
                    <span style={{ fontWeight:800, color:layer.color }}>{lang==="ko"?layer.labelKo:layer.label}</span><br/>
                    <span style={{ color:"var(--dim)", fontStyle:"italic" }}>{vf(vendor,"insight",lang)}</span>
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

/* ── MAIN APP ────────────────────────────────────────────────────────── */
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [lang,  setLang]  = useState("en");
  const [tab,   setTab]   = useState("explore");
  const [uc,    setUc]    = useState(null);
  const [selIds,setSelIds]= useState([]);
  const [detail,setDetail]= useState(null);
  const [view,  setView]  = useState("map");

  const handleVendorClick = v => {
    setSelIds(p => p.includes(v.id) ? p.filter(x=>x!==v.id) : p.length>=4 ? p : [...p,v.id]);
    setDetail(v);
  };
  const handleCompare = () => { if (selIds.length>=2) { setDetail(null); setView("compare"); } };
  const handleBack    = () => setView("map");
  const handleClear   = () => { setSelIds([]); setDetail(null); setView("map"); };
  const selectedVendors = VENDORS.filter(v => selIds.includes(v.id));
  const switchTab = t => { setTab(t); if (t==="explore") setView("map"); };

  const L = {
    explore:   lang==="ko"?"맵 탐색":"Explore Map",
    stack:     lang==="ko"?"스택 빌더":"Stack Builder",
    clearAll:  lang==="ko"?"전체 초기화":"Clear All",
    selected:  lang==="ko"?"선택됨":"selected",
    compare:   lang==="ko"?"비교":"Compare",
    subtitle:  lang==="ko"?`${VENDORS.length}개 벤더 · ${LAYERS.length}개 레이어 · ${USE_CASES.length}개 유즈케이스 — 엔터프라이즈 AI 전략을 위한 인터랙티브 랜드스케이프`:`${VENDORS.length} vendors · ${LAYERS.length} layers · ${USE_CASES.length} use cases — Interactive landscape for enterprise AI strategy`,
  };

  return (
    <LangCtx.Provider value={lang}>
      <style>{CSS}</style>
      <div data-theme={theme} className="eco-root dots" style={{ minHeight:"100vh" }}>

        {/* ── HEADER ── */}
        <div style={{ padding:"28px 40px 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Logo + title */}
            <div style={{ width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,var(--g1),var(--g2))",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px var(--aglow)",flexShrink:0 }}>
              <Layers size={20} color="white"/>
            </div>
            <div>
              <h1 style={{ fontWeight:900, fontSize:22, letterSpacing:-.5, lineHeight:1.2 }}>
                {lang==="ko"?"AI 벤더 에코시스템 네비게이터":"AI Vendor Ecosystem Navigator"}
              </h1>
              <p style={{ color:"var(--dim)", fontSize:13 }}>{L.subtitle}</p>
            </div>
            {/* Right controls */}
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
              <button className="pill" onClick={() => setLang(l => l==="en"?"ko":"en")} style={{ fontWeight:700, fontSize:13 }}>
                {lang==="en" ? "🇰🇷 한국어" : "🇺🇸 English"}
              </button>
              <button className="pill" onClick={() => setTheme(t => t==="dark"?"light":"dark")} style={{ padding:"7px 12px" }}>
                {theme==="dark" ? <Sun size={15}/> : <Moon size={15}/>}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:4, padding:"16px 0 18px", marginLeft:54 }}>
            <button className={`tab ${tab==="explore"?"on":""}`} onClick={() => switchTab("explore")}><Layers size={15}/> {L.explore}</button>
            <button className={`tab ${tab==="stack"?"on":""}`}   onClick={() => switchTab("stack")}><Boxes size={15}/> {L.stack}</button>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding:"0 40px 100px" }}>

          {tab==="explore" && (
            <div key="explore">
              {/* Use case pills */}
              <div className="au" style={{ animationDelay:"80ms", display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                {USE_CASES.map(u => (
                  <button key={u.id} className={`pill ${uc===u.id?"on":""}`} onClick={() => setUc(p => p===u.id?null:u.id)}>
                    {u.emoji} {lang==="ko"?u.labelKo:u.label}
                  </button>
                ))}
                {(uc||selIds.length>0) && (
                  <button className="pill" onClick={() => { setUc(null); handleClear(); }} style={{ color:"var(--dim)" }}>
                    <RotateCcw size={12}/> {L.clearAll}
                  </button>
                )}
              </div>

              {view==="map" ? (
                <div key="map">
                  {LAYERS.map((l,i) => {
                    const lv = VENDORS.filter(v => v.layer===l.id);
                    return (
                      <div key={l.id}>
                        <LayerSection layer={l} vendors={lv} selectedUseCase={uc} selectedIds={selIds} onVendorClick={handleVendorClick} index={i}/>
                        {i<LAYERS.length-1 && <FlowArrow/>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <ComparisonView vendors={selectedVendors} onBack={handleBack}/>
              )}
            </div>
          )}

          {tab==="stack" && <StackBuilder key="stack"/>}
        </div>

        {/* ── BOTTOM BAR ── */}
        {tab==="explore" && view==="map" && selIds.length>0 && (
          <div className="au" style={{ position:"fixed",bottom:0,left:0,right:0,
            background:"linear-gradient(to top,var(--bg),rgba(9,8,26,.95),transparent)",
            padding:"40px 40px 20px",display:"flex",justifyContent:"center",zIndex:40 }}>
            <div style={{ display:"flex",alignItems:"center",gap:12,background:"var(--card)",borderRadius:16,padding:"10px 18px",border:"1px solid var(--bdr)",backdropFilter:"blur(14px)",boxShadow:"0 4px 24px var(--shadow)" }}>
              <div style={{ display:"flex" }}>
                {selectedVendors.slice(0,4).map((v,i) => (
                  <span key={v.id} style={{ fontSize:18,marginLeft:i>0?-4:0,background:"var(--bg2)",borderRadius:"50%",padding:"1px 2px" }}>{v.emoji}</span>
                ))}
              </div>
              <span style={{ fontSize:13.5, fontWeight:600 }}>{selIds.length} {L.selected}</span>
              {selIds.length>=2 && (
                <button className="cbtn" onClick={handleCompare}>
                  <GitCompare size={14}/> {L.compare} <ArrowRight size={14}/>
                </button>
              )}
              <button onClick={handleClear} style={{ background:"none",border:"none",cursor:"pointer",padding:3 }}>
                <X size={16} color="var(--dim)"/>
              </button>
            </div>
          </div>
        )}

        {/* ── DETAIL MODAL ── */}
        {detail && <DetailModal vendor={detail} onClose={() => setDetail(null)}/>}
      </div>
    </LangCtx.Provider>
  );
}
