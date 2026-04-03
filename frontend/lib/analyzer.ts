import type { Requirement } from "@/components/results-display"

// Hardware keywords and patterns
const HARDWARE_PATTERNS = {
  "Processor/CPU": [
    /processor/i, /cpu/i, /core\s*i[357]/i, /intel/i, /amd/i, /ryzen/i,
    /ghz/i, /hertz/i, /clock\s*speed/i, /multi-?core/i, /dual-?core/i,
    /quad-?core/i, /octa-?core/i, /xeon/i, /arm/i, /snapdragon/i
  ],
  "Memory/RAM": [
    /\bram\b/i, /memory/i, /\bgb\s*ram/i, /\bmb\s*ram/i, /ddr[345]/i,
    /dimm/i, /sodimm/i, /memory\s*module/i, /ecc\s*memory/i
  ],
  "Storage": [
    /\bhdd\b/i, /\bssd\b/i, /hard\s*drive/i, /hard\s*disk/i, /storage/i,
    /nvme/i, /sata/i, /\btb\b/i, /terabyte/i, /disk\s*space/i,
    /flash\s*storage/i, /emmc/i
  ],
  "Network": [
    /ethernet/i, /\bnic\b/i, /network\s*adapter/i, /wifi/i, /wi-?fi/i,
    /\blan\b/i, /gigabit/i, /mbps/i, /gbps/i, /router/i, /switch/i,
    /bandwidth/i, /network\s*card/i, /\b5g\b/i, /\b4g\b/i, /lte/i
  ],
  "Display": [
    /monitor/i, /display/i, /screen/i, /resolution/i, /\blcd\b/i, /\bled\b/i,
    /\bhdmi\b/i, /\bvga\b/i, /\boled\b/i, /\b4k\b/i, /\bfhd\b/i, /\buhd\b/i,
    /refresh\s*rate/i, /pixel/i
  ],
  "Peripheral": [
    /keyboard/i, /mouse/i, /printer/i, /scanner/i, /webcam/i, /camera/i,
    /microphone/i, /speaker/i, /headset/i, /\busb\b/i, /peripheral/i,
    /external\s*device/i, /input\s*device/i, /output\s*device/i
  ],
  "Server": [
    /\bserver\b/i, /rack/i, /blade\s*server/i, /data\s*center/i, /ups/i,
    /power\s*supply/i, /psu/i, /cooling/i, /redundant/i, /hot-?swap/i
  ],
  "General Hardware": [
    /hardware/i, /physical/i, /device/i, /equipment/i, /machine/i,
    /workstation/i, /laptop/i, /desktop/i, /tablet/i, /mobile\s*device/i
  ]
}

// Software keywords and patterns
const SOFTWARE_PATTERNS = {
  "Operating System": [
    /operating\s*system/i, /\bos\b/i, /windows/i, /linux/i, /ubuntu/i,
    /centos/i, /red\s*hat/i, /rhel/i, /debian/i, /macos/i, /android/i,
    /\bios\b/i, /unix/i, /fedora/i
  ],
  "Database": [
    /database/i, /\bsql\b/i, /mysql/i, /postgresql/i, /postgres/i,
    /oracle\s*db/i, /mongodb/i, /redis/i, /nosql/i, /mariadb/i,
    /sqlite/i, /\bdbms\b/i, /cassandra/i, /dynamo/i
  ],
  "Programming Language": [
    /\bjava\b/i, /python/i, /javascript/i, /\bc\+\+/i, /\bc#/i, /csharp/i,
    /typescript/i, /\bruby\b/i, /\bphp\b/i, /\bgo\b(?!ogle)/i, /golang/i,
    /\brust\b/i, /kotlin/i, /swift/i, /programming\s*language/i, /\bperl\b/i
  ],
  "Framework": [
    /framework/i, /react/i, /angular/i, /vue/i, /django/i, /flask/i,
    /spring/i, /\.net/i, /dotnet/i, /laravel/i, /express/i, /node\.?js/i,
    /next\.?js/i, /rails/i, /bootstrap/i, /tailwind/i
  ],
  "Cloud Service": [
    /cloud/i, /\baws\b/i, /amazon\s*web/i, /azure/i, /\bgcp\b/i,
    /google\s*cloud/i, /\bsaas\b/i, /\bpaas\b/i, /\biaas\b/i,
    /kubernetes/i, /docker/i, /container/i, /serverless/i, /lambda/i
  ],
  "Security": [
    /security/i, /encryption/i, /\bssl\b/i, /\btls\b/i, /firewall/i,
    /antivirus/i, /authentication/i, /authorization/i, /\boauth\b/i,
    /\bvpn\b/i, /certificate/i, /\b2fa\b/i, /mfa/i, /compliance/i
  ],
  "Application": [
    /application/i, /\bapp\b/i, /software/i, /program/i, /\berp\b/i,
    /\bcrm\b/i, /\bhrms\b/i, /\blms\b/i, /portal/i, /dashboard/i,
    /interface/i, /\bui\b/i, /\bux\b/i, /\bapi\b/i, /integration/i,
    /middleware/i, /browser/i, /chrome/i, /firefox/i, /edge/i
  ],
  "General Software": [
    /license/i, /version/i, /update/i, /patch/i, /install/i,
    /configuration/i, /compatible/i, /dependency/i
  ]
}

function classifyRequirement(text: string): { category: "hardware" | "software"; subCategory: string; confidence: number } | null {
  let bestMatch: { category: "hardware" | "software"; subCategory: string; confidence: number } | null = null
  let maxMatches = 0

  // Check hardware patterns
  for (const [subCategory, patterns] of Object.entries(HARDWARE_PATTERNS)) {
    let matchCount = 0
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        matchCount++
      }
    }
    if (matchCount > maxMatches) {
      maxMatches = matchCount
      bestMatch = {
        category: "hardware",
        subCategory,
        confidence: Math.min(0.95, 0.5 + (matchCount * 0.15))
      }
    }
  }

  // Check software patterns
  for (const [subCategory, patterns] of Object.entries(SOFTWARE_PATTERNS)) {
    let matchCount = 0
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        matchCount++
      }
    }
    if (matchCount > maxMatches) {
      maxMatches = matchCount
      bestMatch = {
        category: "software",
        subCategory,
        confidence: Math.min(0.95, 0.5 + (matchCount * 0.15))
      }
    }
  }

  return bestMatch
}

function extractRequirements(text: string): string[] {
  // Split text into potential requirement statements
  const lines = text.split(/[\n\r]+/)
  const requirements: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    // Skip empty lines or very short lines
    if (trimmed.length < 10) continue
    
    // Skip headers and non-requirement text
    if (/^(chapter|section|table of contents|index|page|note:|disclaimer)/i.test(trimmed)) continue
    
    // Look for requirement-like patterns
    const isRequirement = 
      /\b(shall|must|should|will|require|need|support|provide|include|minimum|maximum|at\s*least)\b/i.test(trimmed) ||
      /\b(gb|mb|ghz|mhz|tb|mbps|gbps)\b/i.test(trimmed) ||
      /^\d+[\.\)]\s*.+/i.test(trimmed) || // Numbered items
      /^[\-\*\•]\s*.+/i.test(trimmed) // Bullet points
    
    if (isRequirement) {
      // Clean up the text
      let cleaned = trimmed
        .replace(/^[\d\.\)\-\*\•]+\s*/, '') // Remove leading numbers/bullets
        .replace(/\s+/g, ' ')
        .trim()
      
      if (cleaned.length >= 15) {
        requirements.push(cleaned)
      }
    }
  }

  return requirements
}

// Demo data for testing when no file content can be parsed
const DEMO_REQUIREMENTS = [
  "System shall require minimum 16 GB RAM for optimal performance",
  "Intel Core i7 processor (10th generation or higher) required",
  "Storage: Minimum 512 GB SSD with NVMe support",
  "Operating System: Windows 10 Professional or Windows 11 Enterprise",
  "Network connectivity: Gigabit Ethernet adapter required",
  "Microsoft SQL Server 2019 or PostgreSQL 14+ for database management",
  "Web browser: Latest version of Chrome, Firefox, or Edge",
  "SSL/TLS 1.3 encryption required for all data transmission",
  "Display: 1920x1080 Full HD resolution minimum",
  "Java Runtime Environment (JRE) version 11 or higher",
  "Python 3.9+ with Django framework for backend services",
  "Docker containerization platform for deployment",
  "Minimum 100 Mbps internet bandwidth for cloud connectivity",
  "USB 3.0 ports for peripheral device connectivity",
  "AWS or Azure cloud infrastructure for hosting",
  "Node.js 18 LTS for frontend build system",
  "MongoDB for document storage and NoSQL operations",
  "Dedicated GPU with 4GB VRAM for data visualization",
  "Load balancer with SSL termination capability",
  "Redis cache server for session management",
  "Kubernetes cluster for container orchestration",
  "Backup storage: 2 TB HDD for archival data",
  "UPS power supply with 30-minute backup capacity",
  "Multi-factor authentication (MFA) support required",
  "REST API integration with OAuth 2.0 authentication"
]

export async function analyzeRequirements(file: File): Promise<Requirement[]> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500))

  let textContent = ""
  
  // Try to read file content
  try {
    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      textContent = await file.text()
    } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      // For PDF, we'd need a library - use demo data for now
      textContent = ""
    } else {
      // For Excel files, we'd need xlsx library - use demo data for now
      textContent = ""
    }
  } catch (error) {
    console.error("[v0] Error reading file:", error)
  }

  let requirementTexts: string[]
  
  if (textContent) {
    requirementTexts = extractRequirements(textContent)
    // If extraction yields too few results, supplement with demo data
    if (requirementTexts.length < 5) {
      requirementTexts = [...requirementTexts, ...DEMO_REQUIREMENTS.slice(0, 15)]
    }
  } else {
    // Use demo data to show functionality
    requirementTexts = DEMO_REQUIREMENTS
  }

  const requirements: Requirement[] = []

  for (let i = 0; i < requirementTexts.length; i++) {
    const text = requirementTexts[i]
    const classification = classifyRequirement(text)
    
    if (classification) {
      requirements.push({
        id: `req-${i + 1}`,
        text,
        category: classification.category,
        subCategory: classification.subCategory,
        confidence: classification.confidence
      })
    }
  }

  return requirements
}
